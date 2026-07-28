/**
 * APLS weight estimation from age, for when a child cannot be weighed.
 * <1yr: (0.5 × months) + 4 · 1–5yr: (2 × yr) + 8 · ≥6yr: (3 × yr) + 7.
 * Returns kg rounded to 0.5, clamped to the app's 1–45 kg range, or null.
 */
export function estWeight(age) {
  if (!age) return null;
  const ty = age.totalYears;
  let est;
  if (ty < 1) est = 0.5 * ty * 12 + 4;
  else if (ty < 6) est = 2 * ty + 8;
  else est = 3 * ty + 7;
  return Math.min(45, Math.max(1, Math.round(est * 2) / 2));
}

/** True when an entered weight is implausible for the entered age (10×-error guard). */
export function weightImplausible(w, age) {
  const est = estWeight(age);
  if (!est || !(w > 0)) return false;
  return w < est * 0.5 || w > est * 2;
}
