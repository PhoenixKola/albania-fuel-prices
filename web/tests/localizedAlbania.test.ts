import { test } from "node:test";
import assert from "node:assert/strict";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import latest from "../../data/latest.json";
import type { LatestEurope } from "../src/models/fuel";
import { albaniaSqModel, albaniaAlternates, pairedAlbaniaPath, SQ_ALBANIA_PATH, EN_ALBANIA_PATH, sqAlbaniaSchema, sqDate } from "../src/config/localizedAlbania";
import AlbaniaSqPage from "../src/pages/AlbaniaSqPage";

const now = new Date("2026-11-15T12:00:00Z");
const data: LatestEurope = { ...latest as LatestEurope, as_of: "2026-11-09", countries: (latest as LatestEurope).countries.map(row => row.country === "Albania" ? { ...row, source_as_of: undefined, provenance: undefined } : row.country === "Kosovo" ? { ...row, provenance: "historical-fallback" as const, source_as_of: undefined, last_observed_at: "2026-10-20" } : row) };

test("Albanian answer and 50L arithmetic use the accepted dated snapshot", () => {
  const model = albaniaSqModel(data, null, now);
  const accepted = data.countries.find(row => row.country === "Albania")!;
  assert.equal(model.fuels[0].eur, accepted.diesel_eur);
  assert.equal(model.fuels[0].tank, accepted.diesel_eur! * 50);
  assert.equal(model.date, data.as_of);
  assert.equal(model.stale, true);
  assert.equal(sqDate("2026-11-09"), "9 nëntor 2026");
  assert.equal(model.price(2.309), "2,309 €");
  assert.match(model.answer, /referencë kombëtare/);
  const html = renderToStaticMarkup(createElement(AlbaniaSqPage, { data }));
  assert.equal([...html.matchAll(/<h1>/g)].length, 1);
  for (const text of ["Çmimet e karburanteve në Shqipëri", "Naftë (diesel)", "Benzinë 95", "Gaz për automjete", "Jo.", "nuk vërtetojnë çmimin e sotëm"]) assert.ok(html.includes(text));
  for (const path of [EN_ALBANIA_PATH, "/methodology", "/stations", "/trip-cost-calculator", "/fuel-detour-calculator", "/fuel-prices/kosovo", "/fuel-prices/greece"]) assert.ok(html.includes(`href="${path}"`));
});

test("unverified observations are never upgraded into publication dates; missing data stays explicit", () => {
  const unverified = { ...data, countries: data.countries.map(row => row.country === "Albania" ? { ...row, provenance: "historical-fallback" as const, source_as_of: undefined, last_observed_at: "2026-10-20" } : row) };
  const model = albaniaSqModel(unverified, null, now);
  assert.equal(model.verified, false);
  assert.equal(model.date, "2026-10-20");
  assert.match(model.dateLabel, /Vëzhguar/);
  assert.equal(sqAlbaniaSchema(unverified).dateModified, undefined);
  assert.equal(albaniaSqModel(null, null, now).fuels[0].eur, null);
  assert.match(albaniaSqModel(null, null, now).answer, /Nuk kemi/);
});

test("lek estimates require a plausible rate and recent valid rate date", () => {
  for (const fx of [{ rate: 100, date: "" }, { rate: 100, date: "2026-11-16" }, { rate: 100, date: "2026-10-01" }, { rate: 0, date: "2026-11-15" }]) assert.equal(albaniaSqModel(data, fx, now).fx, null);
  const model = albaniaSqModel(data, { rate: 100, date: "2026-11-14" }, now);
  assert.equal(model.fuels[0].all, model.fuels[0].eur! * 100);
  assert.equal(albaniaSqModel(data, null, now).fuels[0].all, null);
});

test("only the genuine paired URLs advertise reciprocal languages", () => {
  assert.equal(pairedAlbaniaPath(SQ_ALBANIA_PATH), EN_ALBANIA_PATH);
  assert.equal(pairedAlbaniaPath(EN_ALBANIA_PATH), SQ_ALBANIA_PATH);
  assert.deepEqual(albaniaAlternates(SQ_ALBANIA_PATH), albaniaAlternates(EN_ALBANIA_PATH));
  assert.deepEqual(albaniaAlternates("/fuel-prices/kosovo"), []);
  assert.deepEqual(albaniaAlternates("/"), []);
});

test("border comparisons name the fuel and reject Kosovo's collection-only date", () => {
  const model = albaniaSqModel(data, null, now);
  assert.match(model.comparisons.find(c => c.country === "Greece")!.text, /Nafta:.*Benzina 95:/);
  assert.match(model.comparisons.find(c => c.country === "Kosovo")!.text, /Krahasimi numerik nuk shfaqet/);
  const differentDate = { ...data, countries: data.countries.map(row => row.country === "Greece" ? { ...row, source_as_of: "2026-11-08" } : row) };
  assert.match(albaniaSqModel(differentDate, null, now).comparisons[0].text, /Datat ndryshojnë/);
});
