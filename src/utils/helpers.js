/**
 * Core utility functions for PediCalc
 */

/** Round a numeric value to `d` decimal places; returns "—" for non-numbers */
export const R = (v, d = 2) =>
  typeof v !== "number" || isNaN(v) ? "—" : parseFloat(v.toFixed(d));

/** Clamp value between lo and hi */
export const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

/** Per-kg dose capped at a maximum */
export const cap = (perKg, w, max) => Math.min(perKg * w, max);

/**
 * Calculate age from a date-of-birth string.
 * Returns { years, months, days, totalYears } or null.
 */
export function calcAge(dob) {
  if (!dob) return null;
  const today = new Date(),
    birth = new Date(dob);
  if (isNaN(birth.getTime()) || birth > today) return null;
  let y = today.getFullYear() - birth.getFullYear();
  let m = today.getMonth() - birth.getMonth();
  let d = today.getDate() - birth.getDate();
  if (d < 0) {
    m--;
    d += new Date(today.getFullYear(), today.getMonth(), 0).getDate();
  }
  if (m < 0) {
    y--;
    m += 12;
  }
  return { years: y, months: m, days: d, totalYears: y + m / 12 + d / 365.25 };
}

/** Human-readable age string */
export function ageStr(a) {
  if (!a) return "—";
  if (a.years > 0) return `${a.years}y ${a.months}m ${a.days}d`;
  if (a.months > 0) return `${a.months}m ${a.days}d`;
  return `${a.days}d`;
}

/** Age category label */
export function ageCat(a) {
  if (!a) return "";
  const y = a.totalYears;
  if (y < 0.25) return "Neonate";
  if (y < 1) return "Infant";
  if (y < 3) return "Toddler";
  if (y < 6) return "Preschool";
  if (y < 12) return "Child";
  return "Adolescent";
}
