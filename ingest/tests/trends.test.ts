import { test } from "node:test";
import assert from "node:assert/strict";
import { buildTrends } from "../trends";
test("calendar window and independently dated Kosovo observations",()=>{
 const row={country:"Albania",gasoline95_eur:2,diesel_eur:2.3,lpg_eur:null};
 const history={region:"Europe" as const,unit:"EUR_per_liter" as const,series:[{as_of:"2026-09-01",source:"archive",countries:[row]},{as_of:"2026-11-09",source:"primary",countries:[row]}],market_observations:[{as_of:"2026-11-14",source:"fuelo.net",countries:[{...row,country:"Kosovo",source_as_of:"2026-11-14"}]}]};
 const trend=buildTrends(history);
 assert.deepEqual(trend.dates,["2026-11-09","2026-11-14"]);
 assert.deepEqual(trend.countries.Kosovo.diesel,[null,2.3]);
 assert.deepEqual(trend.countries.Albania.diesel,[2.3,null]);
 assert.equal(history.series.length,2);
});
