import { test } from "node:test";
import assert from "node:assert/strict";
import latest from "../../data/latest.json";
import { evaluatePriceAlerts, type PriceAlertRule } from "../src/notifications/evaluateAlerts";
test("Kosovo alerts use its independent verified date and retain age/dedupe safety",()=>{
 const now=new Date("2026-11-15T12:00:00Z");
 const rule: PriceAlertRule={id:"k",country:"Kosovo",fuelType:"diesel",direction:"below",targetEur:2,createdAtUtc:now.toISOString()};
 const data={...latest,countries:latest.countries.map(r=>r.country==="Kosovo"?{...r,source_as_of:"2026-11-14",provenance:undefined}:r)} as Parameters<typeof evaluatePriceAlerts>[0];
 const hit=evaluatePriceAlerts(data,[rule],now);assert.equal(hit.triggered.length,1);
 assert.equal(evaluatePriceAlerts(data,hit.next,now).triggered.length,0);
 assert.equal(evaluatePriceAlerts({...data,countries:data.countries.map(r=>r.country==="Kosovo"?{...r,source_as_of:"2026-11-01"}:r)},[rule],now).triggered.length,0);
 assert.equal(evaluatePriceAlerts(latest as Parameters<typeof evaluatePriceAlerts>[0],[rule],now).triggered.length,0);
});
