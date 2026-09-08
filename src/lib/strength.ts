// Helpers for logging actual weight/reps per set, detecting PRs, and
// running the rest timer — layered on top of the prescribed workout
// template (which only stores "4 × 12" style targets).

export type LoggedSet = { weight: number; reps: number; isPR?: boolean };

export type PrRecord = { weight: number; reps: number; e1rm: number; date: string };

export type PrMap = Record<string, PrRecord>;

// Epley formula: estimates the 1-rep max implied by a weight×reps set, so
// a heavier low-rep set and a lighter high-rep set can be compared fairly.
export function epley1RM(weight: number, reps: number): number {
  if (!(weight > 0) || !(reps > 0)) return 0;
  return weight * (1 + reps / 30);
}

// A set is only loggable as weight×reps when the prescribed target is a
// plain "N × M" rep scheme — timed holds ("3 × 40s") and cardio/HIIT
// durations ("30 phút", "30s hết sức") don't have a weight to log.
export function isWeightLoggable(setsLabel: string): boolean {
  return /^\d+\s*×\s*\d+$/.test(setsLabel.trim());
}

export function parsePrescribedSetCount(setsLabel: string): number {
  const m = setsLabel.trim().match(/^(\d+)\s*×/);
  return m ? parseInt(m[1], 10) : 3;
}

// Rest strings like "75s" / "90s" carry a plain second count; "Vừa",
// "xen giữa mỗi vòng", "Dốc 8–10%" etc. don't map to a countdown.
export function parseRestSeconds(restLabel: string): number | null {
  const m = restLabel.match(/(\d+)\s*s\b/);
  return m ? parseInt(m[1], 10) : null;
}

// Scans every logged set across all workout days and keeps the best
// (highest estimated 1RM) per exercise name — the single source of truth
// for both the server-rendered dashboard and the on-demand PR API route.
export function computePrMap(
  rows: { date: string; exercises: { name: string; loggedSets?: LoggedSet[] }[] | null }[]
): PrMap {
  const prMap: PrMap = {};
  for (const row of rows) {
    for (const ex of row.exercises ?? []) {
      for (const set of ex.loggedSets ?? []) {
        const e1rm = epley1RM(set.weight, set.reps);
        if (e1rm <= 0) continue;
        const current = prMap[ex.name];
        if (!current || e1rm > current.e1rm) {
          prMap[ex.name] = { weight: set.weight, reps: set.reps, e1rm, date: row.date };
        }
      }
    }
  }
  return prMap;
}
