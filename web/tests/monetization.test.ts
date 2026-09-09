import { test } from "node:test";
import assert from "node:assert/strict";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { adsAllowed, isAdRoute, readMonetizationConfig, validatedRentalUrl } from "../src/config/monetization";
import RentalReferral from "../src/components/ads/RentalReferral";
import { PrivacyChoices } from "../src/components/ads/MonetizationProvider";
import { AdContext } from "../src/components/ads/AdContext";
import { initializeAdSlot } from "../src/services/advertising";

test("partner links preserve attribution and reject missing, placeholder or hostile destinations", () => {
  const link = "https://www.discovercars.com/albania?a_aid=test-account&a_bid=abc&chan=calculator";
  assert.equal(validatedRentalUrl(link), link);
  for (const raw of [undefined, "", "https://discovercars.com/albania", "https://discovercars.com/?a_aid=YOUR_ID", "http://discovercars.com/?a_aid=x", "javascript:alert(1)", "https://discovercars.com.evil.test/?a_aid=x", "https://user:pass@discovercars.com/?a_aid=x", "https://discovercars.com:444/?a_aid=x"]) assert.equal(validatedRentalUrl(raw), null);
  const config = readMonetizationConfig({ VITE_RENTAL_URL: link });
  for (const placement of ["calculator", "guide", "roadTrip", "albania"] as const) {
    assert.equal(config.rentalLinks[placement], link);
  }
  const override = "https://www.discovercars.com/albania?a_aid=test-account&chan=guide";
  assert.equal(readMonetizationConfig({ VITE_RENTAL_URL: link, VITE_RENTAL_URL_GUIDE: override }).rentalLinks.guide, override);
  const html = renderToStaticMarkup(createElement(RentalReferral, { lang: "en", placement: "guide", config }));
  assert.match(html, /rel="sponsored noopener"/);
  assert.match(html, /may earn a commission/);
  assert.match(html, /a_aid=test-account&amp;a_bid=abc&amp;chan=calculator/);
  assert.equal(renderToStaticMarkup(createElement(RentalReferral, { lang: "en", placement: "guide", config: readMonetizationConfig({}) })), "");
});
test("ad configuration requires production host, supported language, explicit activation and published CMP", () => {
  const env = { VITE_DEPLOY_ENV: "production", VITE_ADS_ENABLED: "true", VITE_ADS_CMP_PUBLISHED: "true",
    VITE_AD_SLOT_HOME: "7962709867", VITE_AD_SLOT_CONTENT: "8471539422", VITE_AD_SLOT_ARTICLE_END: "4298797029" };
  const config = readMonetizationConfig(env);
  assert.deepEqual(config.slots, { home: "7962709867", content: "8471539422", articleEnd: "4298797029" });
  assert.equal(adsAllowed(config, "karburantisot.com", "en"), true);
  for (const host of ["localhost", "127.0.0.1", "preview.pages.dev", "karburantisot.com.evil.test"]) assert.equal(adsAllowed(config, host, "en"), false);
  assert.equal(adsAllowed(config, "karburantisot.com", "sq"), false);
  for (const key of ["VITE_ADS_ENABLED", "VITE_ADS_CMP_PUBLISHED", "VITE_DEPLOY_ENV"]) assert.equal(adsAllowed(readMonetizationConfig({ ...env, [key]: "" }), "karburantisot.com", "en"), false);
  assert.equal(adsAllowed(readMonetizationConfig({ VITE_DEPLOY_ENV: "production", VITE_ADS_CMP_PUBLISHED: "true" }), "karburantisot.com", "en"), false);
  assert.equal(readMonetizationConfig({ VITE_AD_SLOT_HOME: "bad", VITE_CF_ANALYTICS_TOKEN: "bad" }).slots.home, "");
  for (const path of ["/privacy", "/terms", "/fuel-quiz", "/daily-challenge", "/stations", "/missing"]) assert.equal(isAdRoute(path), false);
});
test("privacy choices stay hidden while advertising is disabled", () => {
  const value = { lang: "en" as const, enabled: false, pathname: "/" };
  const html = renderToStaticMarkup(createElement(AdContext.Provider, { value }, createElement(PrivacyChoices)));
  assert.equal(html, "");
  assert.doesNotMatch(html, /Advertising settings are unavailable/);
});
test("an ad slot is requested once, including after partial SDK failure", () => {
  let pushes = 0;
  const previous = Object.getOwnPropertyDescriptor(globalThis, "window");
  Object.defineProperty(globalThis, "window", { configurable: true, value: { adsbygoogle: { push: () => { pushes++; } } } });
  try {
    const element = { isConnected: true, clientWidth: 320, dataset: {} } as HTMLElement;
    assert.equal(initializeAdSlot(element), true);
    assert.equal(initializeAdSlot(element), false);
    assert.equal(pushes, 1);
    assert.equal(initializeAdSlot({ isConnected: false, clientWidth: 320, dataset: {} } as HTMLElement), false);
    assert.equal(initializeAdSlot({ isConnected: true, clientWidth: 0, dataset: {} } as HTMLElement), false);
    window.adsbygoogle = { push: () => { pushes++; throw new Error("SDK failure"); } };
    const failed = { isConnected: true, clientWidth: 320, dataset: {} } as HTMLElement;
    assert.equal(initializeAdSlot(failed), false);
    assert.equal(initializeAdSlot(failed), false);
    assert.equal(pushes, 2);
  } finally {
    if (previous) Object.defineProperty(globalThis, "window", previous);
    else Reflect.deleteProperty(globalThis, "window");
  }
});
