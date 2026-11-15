import { test } from "node:test";
import assert from "node:assert/strict";
import { getWeeklyDeltaEur } from "../src/models/trends";
import { loadHistory } from "../scripts/historyStats";
import latest from "../../data/latest.json";
test("weekly change uses calendar dates and rejects insufficient coverage", () => {
 const data = {unit:"EUR_per_liter" as const,generated_at_utc:"",dates:["2026-11-02","2026-11-06","2026-11-09"],countries:{Albania:{diesel:[2.3,2.4,2.5],gasoline95:[],lpg:[]}}};
 assert.ok(Math.abs(getWeeklyDeltaEur(data,"Albania","diesel")! - .2) < 1e-9);
 assert.equal(getWeeklyDeltaEur({...data,dates:["2026-11-05","2026-11-06","2026-11-09"]},"Albania","diesel"),null);
});
test("analysis current values agree with accepted headline, Kosovo uses independent observation", () => {
 const history=loadHistory();
 for (const name of ["Albania","Kosovo"]) {
 const row=latest.countries.find(r=>r.country===name)!;
 assert.equal(history.byCountry.get(name)?.fuels.diesel?.current,row.diesel_eur);
 if(name==="Kosovo") assert.equal(history.byCountry.get(name)?.fuels.diesel?.points.at(-1)?.date,row.last_observed_at);
 }
});
