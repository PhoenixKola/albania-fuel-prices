import fs from "node:fs";
import { execFileSync } from "node:child_process";
import { pathToFileURL } from "node:url";

const relevantPaths = ["web", "data", ".github/workflows/deploy-web.yml"];
const git = (...args) => execFileSync("git", args, { encoding: "utf8" }).trim();
const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const marker = (html, name) => html.match(new RegExp(`<meta\\s+name="${name}"\\s+content="([^"]*)"`, "i"))?.[1] ?? null;

export function parseLiveMarkers(html) {
  return { asOf: marker(html, "data-as-of"), buildDate: marker(html, "build-date"), buildSha: marker(html, "build-sha") };
}

function dateDay(value, label, now) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) throw new Error(`Missing or invalid ${label} marker`);
  const parsed = new Date(`${value}T00:00:00Z`);
  if (!Number.isFinite(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== value || parsed.getTime() > now.getTime()) throw new Error(`Impossible ${label} date: ${value}`);
  return parsed.getTime();
}

export function assessLive({ live, repoAsOf, relevantChanges = false, legacyCovered = false, now = new Date() }) {
  const sourceDay = dateDay(live.asOf, "data-as-of", now);
  const buildDay = dateDay(live.buildDate, "build-date", now);
  dateDay(repoAsOf, "repository source", now);
  if (buildDay < sourceDay) throw new Error("Build date predates the published fuel data");
  if (live.asOf < repoAsOf) throw new Error(`Deployment lag: live publication ${live.asOf}, accepted repository publication ${repoAsOf}`);
  if (live.asOf > repoAsOf) return { status: "RACE", ageDays: Math.floor((Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()) - sourceDay) / 86_400_000) };
  if (!live.buildSha && !legacyCovered) throw new Error("Live build lacks build-sha and predates a deployment-relevant change");
  if (live.buildSha && !/^[0-9a-f]{40}$/.test(live.buildSha)) throw new Error("Invalid build-sha marker");
  if (relevantChanges) throw new Error(`Deployment lag: web/data/build changes after live build ${live.buildSha}`);
  return { status: "HEALTHY", ageDays: Math.floor((Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()) - sourceDay) / 86_400_000), legacy: !live.buildSha };
}

async function fetchLive() {
  const response = await fetch(`https://karburantisot.com/?verification=${Date.now()}`, {
    headers: { "Cache-Control": "no-cache", Pragma: "no-cache" }, signal: AbortSignal.timeout(10_000),
  });
  if (!response.ok) throw new Error(`Homepage HTTP ${response.status}`);
  return parseLiveMarkers(await response.text());
}

function buildCoverage(live) {
  if (!live.buildSha) {
    const latestRelevantDate = git("log", "-1", "--format=%cs", "HEAD", "--", ...relevantPaths);
    return { legacyCovered: !!latestRelevantDate && live.buildDate >= latestRelevantDate, relevantChanges: false };
  }
  try {
    git("cat-file", "-e", `${live.buildSha}^{commit}`);
    git("merge-base", "--is-ancestor", live.buildSha, "HEAD");
  } catch {
    git("fetch", "origin", "main");
    try {
      git("cat-file", "-e", `${live.buildSha}^{commit}`);
      git("merge-base", "--is-ancestor", "HEAD", live.buildSha);
      git("merge-base", "--is-ancestor", live.buildSha, "origin/main");
      return { race: true, legacyCovered: false, relevantChanges: false };
    } catch { throw new Error(`Live build ${live.buildSha} is not part of current main history`); }
  }
  return { legacyCovered: false, relevantChanges: !!git("diff", "--name-only", `${live.buildSha}..HEAD`, "--", ...relevantPaths) };
}

export async function main() {
  const latest = JSON.parse(fs.readFileSync("data/latest.json", "utf8"));
  const repoAsOf = latest.as_of;
  let lastError;
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const live = await fetchLive();
      const preliminary = assessLive({ live, repoAsOf, legacyCovered: true });
      if (preliminary.status === "RACE") {
        git("fetch", "origin", "main");
        const remote = JSON.parse(git("show", "origin/main:data/latest.json"));
        if (remote.as_of !== live.asOf) throw new Error(`Live publication ${live.asOf} is newer than checkout ${repoAsOf}, but not confirmed on remote main`);
        console.log(`::warning::A newer accepted publication ${live.asOf} deployed during verification; rerun against current main.`);
        return;
      }
      const coverage = buildCoverage(live);
      if (coverage.race) {
        console.log(`::warning::A newer web build ${live.buildSha} deployed during verification; rerun against current main.`);
        return;
      }
      const result = assessLive({ live, repoAsOf, ...coverage });
      const lines = [`Live publication: ${live.asOf} (${result.ageDays} days old)`, `Accepted repository publication: ${repoAsOf}`, `Live build date: ${live.buildDate}`, `Live build commit: ${live.buildSha ?? "legacy marker absent"}`, "Deployment integrity: healthy"];
      if (result.legacy) lines.push("Legacy build marker: publication matches and build date covers latest web/data change; commit-level verification begins after next deploy.");
      if (result.ageDays > 3) {
        const warning = `Source publication is ${result.ageDays} days old; website and repository agree. Review upstream publication separately.`;
        console.log(`::warning::${warning}`);
        lines.push(warning);
      }
      console.log(lines.join("\n"));
      if (process.env.GITHUB_STEP_SUMMARY) fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, `## Live site verification\n${lines.map((line) => `- ${line}`).join("\n")}\n`);
      return;
    } catch (error) {
      lastError = error;
      if (attempt < 3) await pause(4_000);
    }
  }
  throw lastError;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => { console.error(`::error::${error instanceof Error ? error.message : String(error)}`); process.exitCode = 1; });
}
