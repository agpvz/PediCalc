import { useState } from "react";
import { R, clamp, cap } from "../utils/helpers";
import { C } from "../utils/theme";
import { Pill, Inp, Sec, Drug } from "../components/UI";

export default function EmergencyTab({ w, age }) {
  const ok = w >= 1 && w <= 45,
    av = age !== null;
  const [adrR, setAdrR] = useState(0.1),
    [be, setBe] = useState(-10);

  if (!ok)
    return (
      <div style={{ padding: 40, textAlign: "center", color: C.t3 }}>Enter weight (1–45 kg)</div>
    );

  const ay = age?.totalYears ?? 0;
  const adrC = w <= 10 ? 1000 : w <= 20 ? 2000 : w <= 30 ? 3000 : w <= 40 ? 4000 : 5000;
  const adrLbl = w <= 10 ? "1mg/50ml" : w <= 20 ? "2mg/50ml" : w <= 30 ? "3mg/50ml" : w <= 40 ? "4mg/50ml" : "5mg/50ml";

  return (
    <div>
      <Sec title="Emergency" icon="🚨">
        <Drug name="Adenosine" conc="3mg/ml" rows={[{ label: "1st: 0.1mg/kg (max 6)", mg: R(cap(0.1, w, 6)), ml: R(cap(0.1, w, 6) / 3) }, { label: "2nd: 0.2mg/kg (max 12)", mg: R(cap(0.2, w, 12)), ml: R(cap(0.2, w, 12) / 3) }, { label: "3rd: 0.3mg/kg (max 12)", mg: R(cap(0.3, w, 12)), ml: R(cap(0.3, w, 12) / 3) }]} />
        <Drug name="Adrenaline ASYSTOLE" conc="0.1mg/ml" rows={[{ label: "10µg/kg (max 1mg)", mg: R(cap(10, w, 1000)), ml: R(cap(10, w, 1000) / 100), unit: "µg" }]} />
        <Drug name="Adrenaline ANAPHYLAXIS IV" rows={[{ label: "Gr1 Mucocutaneous", text: "No adrenaline", tc: C.t3 }, { label: "Gr2 (10µg/ml) 2µg/kg", mg: R(2 * w), ml: R((2 * w) / 10), unit: "µg" }, { label: "Gr3 (10µg/ml) 4–10µg/kg", mg: `${R(4 * w)}–${R(10 * w)}`, ml: `${R((4 * w) / 10)}–${R((10 * w) / 10)}`, unit: "µg" }, { label: "Gr4 (100µg/ml) 10µg/kg", mg: R(10 * w), ml: R((10 * w) / 100), unit: "µg" }]}>
          <div style={{ fontSize: 10, color: C.t3, marginBottom: 3 }}>Continuous infusion ({adrLbl})</div>
          <Inp label="Rate" value={adrR} onChange={setAdrR} min={0.01} max={2} step={0.01} unit="µg/kg/min" />
          <div style={{ display: "flex", gap: 5, marginTop: 5 }}>
            <Pill v={R(adrR * w * 60)} u="µg/hr" c={C.acc} />
            <Pill v={R((adrR * w * 60) / (adrC / 50))} u="ml/hr" c={C.grn} />
          </div>
        </Drug>
        <Drug name="Adrenaline IM" conc="1mg/ml" rows={[{ label: "10µg/kg", mg: R(10 * w), ml: R((10 * w) / 1000, 3), unit: "µg" }, ...(av && ay < 6 ? [{ label: "Auto-inj 0–5yr", text: "150µg", tc: C.orn }] : []), ...(av && ay >= 6 && ay <= 12 ? [{ label: "Auto-inj 6–12yr", text: "300µg", tc: C.orn }] : []), ...(av && ay > 12 ? [{ label: "Auto-inj >12yr", text: "500µg", tc: C.orn }] : [])]} />
        <Drug name="Adrenaline Aerosol STRIDOR" conc="1mg/ml" rows={[{ label: "0.5mg/kg (max 5)", mg: R(cap(0.5, w, 5)), ml: R(cap(0.5, w, 5)) }]} />
        <Drug name="Amiodarone" conc="50mg/ml" rows={[{ label: "5mg/kg (max 300) 1hr", mg: R(cap(5, w, 300)), ml: R(cap(5, w, 300) / 50) }]} />
        <Drug name="Atropine" conc="0.2mg/ml" rows={[{ label: "0.01–0.02mg/kg (min 0.1 max 3)", mg: `${R(clamp(0.01 * w, 0.1, 3))}–${R(clamp(0.02 * w, 0.1, 3))}`, ml: `${R(clamp(0.01 * w, 0.1, 3) / 0.2)}–${R(clamp(0.02 * w, 0.1, 3) / 0.2)}` }]} />
        <Drug name="Ca gluconate 10%" conc="100mg/ml" rows={[{ label: "0.3–0.5ml/kg slow IV (max 20ml)", mg: `${R(Math.min(30 * w, 2000))}–${R(Math.min(50 * w, 2000))}`, ml: `${R(Math.min(0.3 * w, 20))}–${R(Math.min(0.5 * w, 20))}` }]} note="1st-line for hyperkalaemia membrane stabilisation" />
        <Drug name="CaCl₂ 10%" conc="100mg/ml" rows={[{ label: "0.1–0.2ml/kg slow IV (max 10ml)", mg: `${R(Math.min(10 * w, 1000))}–${R(Math.min(20 * w, 1000))}`, ml: `${R(Math.min(0.1 * w, 10))}–${R(Math.min(0.2 * w, 10))}` }]} />
        <Drug name="Lignocaine (arrhythmia)" conc="20mg/ml (2%)" rows={[{ label: "1mg/kg IV", mg: R(w), ml: R(w / 20) }]} />
        <Drug name="NaHCO₃ 8.4%" conc="1mEq/ml" rows={[{ label: "Empiric 1mEq/kg", mg: R(w), ml: R(w), unit: "mEq" }, { label: w < 5 ? "BE-guided: |BE|×kg÷4" : "BE-guided: |BE|×kg÷6", text: "Calc →", tc: C.acc }]}>
          <Inp label="Base excess" value={be} onChange={setBe} min={-30} max={0} step={0.5} unit="mmol/L" />
          <div style={{ display: "flex", gap: 5, marginTop: 5 }}>
            <Pill v={R((Math.abs(be) * w) / (w < 5 ? 4 : 6))} u="ml" c={C.grn} />
            <Pill v={R((Math.abs(be) * w) / (w < 5 ? 4 : 6))} u="mEq" c={C.acc} />
          </div>
          <div style={{ fontSize: 9, color: C.t3, marginTop: 3 }}>&lt;5kg: ÷4 · ≥5kg: ÷6 · adult ÷10 (8.4% = 1mEq/ml)</div>
        </Drug>
        <Drug name="Dantrolene (MH crisis)" conc="≈0.33mg/ml" rows={[{ label: "2.5mg/kg rapid IV, repeat ×3 PRN", mg: R(2.5 * w), ml: R((2.5 * w) / (20 / 60)) }]} note="Malignant hyperthermia · 20mg in 60ml sterile H₂O" />
      </Sec>
    </div>
  );
}
