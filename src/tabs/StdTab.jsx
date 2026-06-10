import { useState } from "react";
import { R, clamp, cap } from "../utils/helpers";
import { HR, RR, vL, mL } from "../utils/vitals";
import { C } from "../utils/theme";
import { Pill, Tag, Badge, Inp, Sec, Warn, Drug } from "../components/UI";

export default function StdTab({ w, age, sex }) {
  const ok = w >= 1 && w <= 45,
    av = age !== null;
  const [adrR, setAdrR] = useState(0.1),
    [norR, setNorR] = useState(0.01),
    [dexR, setDexR] = useState(0.5),
    [be, setBe] = useState(-10);

  if (!ok)
    return (
      <div style={{ padding: 48, textAlign: "center" }}>
        <div style={{ fontSize: 44, marginBottom: 8, opacity: 0.8 }}>⚖️</div>
        <div style={{ color: C.t2, fontSize: 14, fontWeight: 600 }}>Enter weight (1–45 kg)</div>
        <div style={{ color: C.t3, fontSize: 11, marginTop: 6, lineHeight: 1.5 }}>
          Weight + Age needed for complete calculations
        </div>
      </div>
    );

  const ay = age?.totalYears ?? 0,
    aY = age?.years ?? 0,
    aM = age?.months ?? 0;
  const adrC = w <= 10 ? 1000 : w <= 20 ? 2000 : w <= 30 ? 3000 : w <= 40 ? 4000 : 5000;
  const adrLbl = w <= 10 ? "1mg/50ml" : w <= 20 ? "2mg/50ml" : w <= 30 ? "3mg/50ml" : w <= 40 ? "4mg/50ml" : "5mg/50ml";
  const norConc = 1; // 1mg/ml
  const mf = w <= 10 ? w * 4 : w <= 20 ? 40 + 2 * (w - 10) : 60 + (w - 20);

  return (
    <div>
      <Sec title="Fasting (1–4–6 rule)" icon="🍽">
        <div style={{ background: C.s1, borderRadius: 8, border: `1px solid ${C.bdr}`, padding: 10 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "3px 0" }}>
            <span style={{ fontSize: 11, color: C.t2 }}>Clear fluids</span>
            <Tag c={C.grn}>&gt; 1 hr</Tag>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "3px 0", borderTop: `1px solid ${C.bdr}55` }}>
            <span style={{ fontSize: 11, color: C.t2 }}>Breast milk</span>
            <Tag c={C.acc}>&gt; 4 hr</Tag>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "3px 0", borderTop: `1px solid ${C.bdr}55` }}>
            <span style={{ fontSize: 11, color: C.t2 }}>Solids / formula</span>
            <Tag c={C.orn}>&gt; 6 hr</Tag>
          </div>
        </div>
      </Sec>

      <Sec title="Fluids" icon="💧">
        {/* Setup */}
        <div style={{ background: C.s1, borderRadius: 8, border: `1px solid ${C.bdr}`, padding: "8px 10px", marginBottom: 3 }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: C.t3, textTransform: "uppercase", letterSpacing: ".04em", marginBottom: 4 }}>Setup</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4 }}>
            <div>
              <span style={{ fontSize: 9, color: C.t4, fontWeight: 600 }}>Fluid type</span>
              <div style={{ fontSize: 12, fontWeight: 700, color: C.t1 }}>{av ? (ay < 1 ? "Kidialyte" : "Plasmalyte") : "Need age"}</div>
            </div>
            <div>
              <span style={{ fontSize: 9, color: C.t4, fontWeight: 600 }}>Administration</span>
              <div style={{ fontSize: 12, fontWeight: 700, color: C.t1 }}>{w < 10 ? "Syringe driver / Metriset" : "Dialoflow"}</div>
            </div>
          </div>
        </div>
        {/* Maintenance Infusion */}
        <div style={{ background: C.s1, borderRadius: 8, border: `1px solid ${C.bdr}`, padding: "8px 10px", marginBottom: 3 }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: C.acc, textTransform: "uppercase", letterSpacing: ".04em", marginBottom: 6 }}>⏱ Maintenance Infusion Rate</div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "4px 0", borderBottom: `1px solid ${C.bdr}22` }}>
            <span style={{ fontSize: 11, color: C.t2 }}>First hour: 10 ml/kg/hr</span>
            <Pill v={R(10 * w)} u="ml/hr" c={C.acc} />
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "4px 0" }}>
            <div>
              <span style={{ fontSize: 11, color: C.t2 }}>From 2nd hour: 4/2/1 rule</span>
              <div style={{ fontSize: 9, color: C.t4 }}>
                {w <= 10
                  ? `${R(w)} × 4 = ${R(w * 4)}`
                  : w <= 20
                    ? `(10×4) + (${R(w - 10)}×2) = ${R(40 + 2 * (w - 10))}`
                    : `(10×4) + (10×2) + (${R(w - 20)}×1) = ${R(60 + (w - 20))}`}
              </div>
            </div>
            <Pill v={R(mf)} u="ml/hr" c={C.acc} />
          </div>
        </div>
        {/* Resuscitation Boluses */}
        <div style={{ background: C.s1, borderRadius: 8, border: `1px solid ${C.bdr}`, padding: "8px 10px" }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: C.orn, textTransform: "uppercase", letterSpacing: ".04em", marginBottom: 6 }}>⚡ Resuscitation Bolus (titrate to max 20 ml/kg)</div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "4px 0", borderBottom: `1px solid ${C.bdr}22` }}>
            <div>
              <span style={{ fontSize: 11, color: C.t2 }}>Plasmalyte 5 ml/kg</span>
              <div style={{ fontSize: 9, color: C.t4 }}>Titrate to 20 ml/kg max, reassess after each</div>
            </div>
            <div style={{ display: "flex", gap: 3 }}>
              <Pill v={R(5 * w)} u="ml" c={C.orn} />
              <span style={{ fontSize: 10, color: C.t3 }}>to</span>
              <Pill v={R(20 * w)} u="ml" c={C.orn} />
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "4px 0" }}>
            <div>
              <span style={{ fontSize: 11, color: C.t2 }}>Albumin 4% 5 ml/kg</span>
              <div style={{ fontSize: 9, color: C.t4 }}>Dilute 10 ml of 20% to 50 ml N/Saline</div>
            </div>
            <Pill v={R(5 * w)} u="ml" c={C.orn} />
          </div>
          <div style={{ fontSize: 9, color: C.t3, fontWeight: 600, marginTop: 4 }}>Aim urine output 0.5–1 ml/kg/hr · reassess haemodynamics between boluses</div>
        </div>
      </Sec>

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
      </Sec>

      <Sec title="Induction & Maintenance" icon="💊">
        <Drug name="Propofol 1%" conc="10mg/ml" rows={[{ label: "1–2–3mg/kg", mg: `${R(w)}–${R(2 * w)}–${R(3 * w)}`, ml: `${R(w / 10)}–${R((2 * w) / 10)}–${R((3 * w) / 10)}` }]} />
        <Drug name="Etomidate" conc="2mg/ml" rows={[{ label: "0.2–0.3mg/kg", mg: `${R(0.2 * w)}–${R(0.3 * w)}`, ml: `${R((0.2 * w) / 2)}–${R((0.3 * w) / 2)}` }]} />
        <Drug name="Ketamine" conc="50mg/ml" rows={[{ label: "1–2mg/kg IV", mg: `${R(w)}–${R(2 * w)}`, ml: `${R(w / 50)}–${R((2 * w) / 50)}` }, { label: "5–10mg/kg IM", mg: `${R(5 * w)}–${R(10 * w)}`, ml: `${R((5 * w) / 50)}–${R((10 * w) / 50)}` }]} />
        <Drug name="Fentanyl" conc="50µg/ml" rows={[{ label: "1–2–5µg/kg", mg: `${R(w)}–${R(2 * w)}–${R(5 * w)}`, ml: `${R(w / 50)}–${R((2 * w) / 50)}–${R((5 * w) / 50)}`, unit: "µg" }]} />
        <Drug name="Midazolam" conc="1mg/ml" rows={[{ label: "Premed 0.2–0.3mg/kg PO (max 7.5)", mg: `${R(cap(0.2, w, 7.5))}–${R(cap(0.3, w, 7.5))}`, ml: `${R(cap(0.2, w, 7.5))}–${R(cap(0.3, w, 7.5))}` }, { label: "Sedation 0.05–0.2mg/kg IV (max 10)", mg: `${R(cap(0.05, w, 10))}–${R(cap(0.2, w, 10))}`, ml: `${R(cap(0.05, w, 10))}–${R(cap(0.2, w, 10))}` }, ...(av && ay >= 1 / 12 ? [{ label: "Seizure ≥1mo: 0.1–0.2mg/kg", mg: `${R(0.1 * w)}–${R(0.2 * w)}`, ml: `${R(0.1 * w)}–${R(0.2 * w)}` }] : [])]} />
      </Sec>

      <Sec title="Relaxants & Reversal" icon="💪">
        <Drug name="Rocuronium" conc="10mg/ml" rows={[{ label: "0.3–0.6–1mg/kg", mg: `${R(0.3 * w)}–${R(0.6 * w)}–${R(w)}`, ml: `${R((0.3 * w) / 10)}–${R((0.6 * w) / 10)}–${R(w / 10)}` }]} />
        <Drug name="Cisatracurium" conc="2mg/ml" rows={[{ label: "0.15mg/kg", mg: R(0.15 * w), ml: R((0.15 * w) / 2) }]} />
        <Drug name="Sugammadex" conc="100mg/ml" rows={[{ label: "2–16mg/kg", mg: `${R(2 * w)}–${R(16 * w)}`, ml: `${R((2 * w) / 100)}–${R((16 * w) / 100)}` }]} />
        <Drug name="Neostigmine" conc="0.5mg/ml" rows={[{ label: "0.05mg/kg (20–30–50µg/kg)", mg: `${R(0.02 * w)}–${R(0.03 * w)}–${R(0.05 * w)}`, ml: `${R((0.02 * w) / 0.5)}–${R((0.03 * w) / 0.5)}–${R((0.05 * w) / 0.5)}` }]} />
        <Drug name="Glycopyrrolate" conc="0.2mg/ml" rows={[{ label: "0.01mg/kg (with neostigmine)", mg: R(0.01 * w), ml: R((0.01 * w) / 0.2) }]} />
        <Drug name="Red Cross Reversal Mix" rows={[{ label: "Neostigmine 2.5mg + Glycopyrrolate 0.4mg → 5 ml N/S", text: "recipe", tc: C.t3 }, { label: "Give 0.1 ml/kg (= 1 ml per 10 kg)", mg: R(w / 10, 1), unit: "ml" }]} note="Pre-mixed reversal" />
      </Sec>

      <Sec title="Analgesics & Anti-emetics" icon="🩹">
        <Drug name="Paracetamol" conc="10mg/ml" rows={[{ label: "Loading 20mg/kg", mg: R(20 * w), ml: R((20 * w) / 10) }, { label: "15mg/kg PO q6h", mg: R(15 * w), ml: R((15 * w) / 10) }]} />
        <Drug name="Ketorolac" conc="10mg/ml" rows={av && aY === 0 && aM < 3 ? [{ label: "<3mo CONTRAINDICATED", text: "CI", tc: C.red }] : [{ label: "≥3mo: 0.5mg/kg (max 30)", mg: R(cap(0.5, w, 30)), ml: R(cap(0.5, w, 30) / 10) }]} note={av && aY === 0 && aM < 3 ? "Contraindicated <3 months" : undefined} />
        <Drug name="Metamizole" conc="500mg/ml" rows={av && (aY > 0 || aM >= 3) && w >= 5 ? [{ label: "≥3mo ≥5kg: 15mg/kg ×4/d", mg: R(15 * w), ml: R((15 * w) / 500) }] : [{ label: "<3mo/<5kg: 12.5mg/kg ×4/d", mg: R(12.5 * w), ml: R((12.5 * w) / 500) }]} />
        <Drug name="Tramadol" conc="50mg/ml" rows={[{ label: "1–2mg/kg (max 8/kg/d)", mg: `${R(w)}–${R(2 * w)}`, ml: `${R(w / 50)}–${R((2 * w) / 50)}` }]} />
        <Drug name="Morphine" conc="1mg/ml" rows={[{ label: "0.05–0.1mg/kg", mg: `${R(0.05 * w)}–${R(0.1 * w)}`, ml: `${R(0.05 * w)}–${R(0.1 * w)}` }]} />
        <Drug name="Ondansetron" conc="2mg/ml" rows={[{ label: "0.15mg/kg (max 4)", mg: R(cap(0.15, w, 4)), ml: R(cap(0.15, w, 4) / 2) }]} />
        <Drug name="Dexamethasone" conc="5mg/ml" rows={[{ label: "0.15mg/kg", mg: R(0.15 * w), ml: R((0.15 * w) / 5) }]} />
        <Drug name="Gabapentin" rows={[{ label: "3–10mg/kg PO q8h", mg: `${R(3 * w)}–${R(10 * w)}`, unit: "mg" }]} />
      </Sec>

      <Sec title="Vasopressors & Infusions" icon="📈">
        <Drug name="Ephedrine" conc="50mg/10ml" rows={[{ label: "0.05–0.1mg/kg", mg: `${R(0.05 * w)}–${R(0.1 * w)}`, ml: `${R((0.05 * w) / 5)}–${R((0.1 * w) / 5)}` }]} />
        <Drug name="Phenylephrine" conc="50mcg/ml" rows={[{ label: "2–3µg/kg", mg: `${R(2 * w)}–${R(3 * w)}`, ml: `${R((2 * w) / 50)}–${R((3 * w) / 50)}`, unit: "µg" }]} />
        <Drug name="Noradrenaline" conc="1mg/40ml" rows={[{ label: "0.01–1µg/kg/min (infusion)", text: "Calc →", tc: C.acc }]} defaultOpen>
          <Inp label="Rate" value={norR} onChange={setNorR} min={0.01} max={1} step={0.01} unit="µg/kg/min" />
          <div style={{ display: "flex", gap: 5, marginTop: 5 }}>
            <Pill v={R(norR * w * 60)} u="µg/hr" c={C.acc} />
            <Pill v={R((norR * w * 60) / (norConc * 1000 / 40))} u="ml/hr" c={C.grn} />
          </div>
        </Drug>
        <Drug name="Dexmedetomidine" rows={[{ label: "IN 2–4µg/kg (100µg/ml)", mg: `${R(2 * w)}–${R(4 * w)}`, ml: `${R((2 * w) / 100)}–${R((4 * w) / 100)}`, unit: "µg" }, { label: "IV bolus 1µg/kg (1µg/ml)", mg: R(w), ml: R(w), unit: "µg" }]}>
          <div style={{ fontSize: 10, color: C.t3, marginBottom: 3 }}>IV infusion (1µg/ml) — range 0.2–1.5 µg/kg/hr</div>
          <Inp label="Rate" value={dexR} onChange={setDexR} min={0.2} max={1.5} step={0.1} unit="µg/kg/hr" />
          <div style={{ display: "flex", gap: 5, marginTop: 5 }}>
            <Pill v={R(dexR * w)} u="µg/hr" c={C.acc} />
            <Pill v={R(dexR * w)} u="ml/hr" c={C.grn} />
          </div>
        </Drug>
      </Sec>

      <Sec title="Local Anaesthetics" icon="💉">
        <Drug name="Lidocaine" conc="10mg/ml" rows={[{ label: "Without adr: max 5mg/kg", mg: `max ${R(5 * w)}`, ml: `max ${R((5 * w) / 10)}` }, { label: "With adr: max 7mg/kg", mg: `max ${R(7 * w)}`, ml: `max ${R((7 * w) / 10)}` }]} />
        <Drug name="Levobupivacaine" conc="2.5mg/ml" rows={[{ label: "Infiltration: max 2mg/kg", mg: `max ${R(2 * w)}`, ml: `max ${R((2 * w) / 2.5)}` }]} />
        <Drug name="Ropivacaine" conc="5mg/ml" rows={[{ label: "Infiltration: max 2mg/kg", mg: `max ${R(2 * w)}`, ml: `max ${R((2 * w) / 5)}` }]} />
      </Sec>

      <Sec title="Regional & Neuraxial" icon="🧬" defaultOpen={false}>
        <Drug name="Caudal (0.25% bupivacaine)" rows={[{ label: "Sacro-lumbar 0.5ml/kg", mg: R(0.5 * w), unit: "ml" }, { label: "Upper abdominal 1ml/kg", mg: R(w), unit: "ml" }, { label: "Mid-thoracic 1.2ml/kg", mg: R(1.2 * w), unit: "ml" }]} note="± clonidine 1µg/kg · mid-thoracic level not always reliable" />
        <Drug name="Wound infusion catheter" rows={av && ay < 4 / 12 ? [{ label: "<4mo: 0.1% bupiv 0.1–0.2ml/kg/hr", mg: `${R(0.1 * w)}–${R(0.2 * w)}`, unit: "ml/hr" }] : [{ label: ">4mo: 0.2% bupiv 0.1–0.2ml/kg/hr", mg: `${R(0.1 * w)}–${R(0.2 * w)}`, unit: "ml/hr" }]} />
        <Drug name="Epidural" rows={[{ label: "Space depth ≈ 1mm/kg", text: `${R(w, 1)}mm`, tc: C.acc }, { label: "Bolus 0.25% bupiv: thoracic 0.5 / lumbar 0.75 ml/kg", mg: `${R(0.5 * w)} / ${R(0.75 * w)}`, unit: "ml" }, av && ay >= 0.5 && w >= 5 ? { label: "Infusion 0.1% bupiv 0.1–0.4ml/kg/hr", mg: `${R(0.1 * w)}–${R(0.4 * w)}`, unit: "ml/hr" } : { label: "Infusion 0.1% bupiv 0.1–0.2ml/kg/hr (<6mo/<5kg)", mg: `${R(0.1 * w)}–${R(0.2 * w)}`, unit: "ml/hr" }]} note="Length in space 3–4cm · check toxic dose" />
        <Drug name="Clysis (field block)" rows={[{ label: "Max 20ml/kg of dilute mix", mg: R(20 * w), unit: "ml" }]} note="10ml 0.5% bupiv + 1ml adrenaline 1:1000; take 4.5ml into 200ml N/S" />
      </Sec>

      <Sec title="Other Medications" icon="🧪">
        <Drug name="Clonidine" conc="150µg/ml" rows={[{ label: "Premed 3–4µg/kg PO (90min pre)", mg: `${R(3 * w)}–${R(4 * w)}`, ml: `${R((3 * w) / 150)}–${R((4 * w) / 150)}`, unit: "µg" }, { label: "IV / caudal 1–2µg/kg", mg: `${R(w)}–${R(2 * w)}`, ml: `${R(w / 150)}–${R((2 * w) / 150)}`, unit: "µg" }]} />
        <Drug name="Diazepam" conc="5mg/ml" rows={[{ label: "Seizures 0.1–1mg/kg (max 20)", mg: `${R(cap(0.1, w, 20))}–${R(cap(1, w, 20))}`, ml: `${R(cap(0.1, w, 20) / 5)}–${R(cap(1, w, 20) / 5)}` }]} />
        <Drug name="Glucose 10%" rows={[{ label: "0.2g/kg", mg: R(0.2 * w), ml: R((0.2 * w) / 0.1), unit: "g" }]} />
        <Drug name="Hydrocortisone" rows={[{ label: "Anaph 2–4mg/kg max 200 [50mg/ml]", mg: `${R(cap(2, w, 200))}–${R(cap(4, w, 200))}`, ml: `${R(cap(2, w, 200) / 50)}–${R(cap(4, w, 200) / 50)}` }, { label: "Same [125mg/ml]", mg: `${R(cap(2, w, 200))}–${R(cap(4, w, 200))}`, ml: `${R(cap(2, w, 200) / 125)}–${R(cap(4, w, 200) / 125)}` }]} />
        <Drug name="Methylprednisolone" conc="40mg/ml" rows={[{ label: "Anaph 1–2mg/kg", mg: `${R(w)}–${R(2 * w)}`, ml: `${R(w / 40)}–${R((2 * w) / 40)}` }]} />
        <Drug name="KCl" conc="dilute" rows={[{ label: "0.3mmol/kg/hr (max 4–6hr)", mg: R(0.3 * w), unit: "mmol/hr" }]} />
        <Drug name="MgSO₄" conc="0.3g/ml" rows={[{ label: "40mg/kg slow IV", mg: R(40 * w), ml: R((40 * w) / 300) }]} />
        <Drug name="Mannitol 20%" rows={[{ label: "0.25–0.5g/kg/20min", mg: `${R(0.25 * w)}–${R(0.5 * w)}`, ml: `${R((0.25 * w) / 0.2)}–${R((0.5 * w) / 0.2)}`, unit: "g" }]} />
        <Drug name="Naloxone" conc="0.4mg/ml" rows={[{ label: "Post-op sedation 2µg/kg", mg: R(2 * w), ml: R((2 * w) / 400, 3), unit: "µg" }]} note="Repeat q2min PRN" />
        <Drug name="Cefazolin" conc="100mg/ml" rows={[{ label: "50mg/kg (max 2g) q8h", mg: R(cap(50, w, 2000)), ml: R(cap(50, w, 2000) / 100) }]} />
        <Drug name="Salbutamol + Ipratropium" conc="aerosol" rows={av && ay < 5 ? [{ label: "<5yr", text: "2.5mg salb + 0.25mg iprat", tc: C.acc }] : av ? [{ label: "≥5yr", text: "5mg salb + 0.5mg iprat", tc: C.acc }] : [{ label: "Need age", text: "—", tc: C.t3 }]} />
        <Drug name="Tranexamic Acid" conc="100mg/ml" rows={[{ label: "5–10mg/kg over 20min", mg: `${R(5 * w)}–${R(10 * w)}`, ml: `${R((5 * w) / 100)}–${R((10 * w) / 100)}` }, { label: "then 10mg/kg/hr infusion", mg: R(10 * w), ml: R((10 * w) / 100) }]} />
        <Drug name="Valproate" conc="100mg/ml" rows={[{ label: "Seizures 7–10mg/kg", mg: `${R(7 * w)}–${R(10 * w)}`, ml: `${R((7 * w) / 100)}–${R((10 * w) / 100)}` }, { label: "Status 20mg/kg/4min", mg: R(20 * w), ml: R((20 * w) / 100) }]} />
      </Sec>

      <Sec title="Vital Signs" icon="📊" warn={!av ? "Need age" : undefined}>
        {av ? (
          <div style={{ background: C.s1, borderRadius: 8, border: `1px solid ${C.bdr}`, padding: 10 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: C.t2, marginBottom: 3 }}>Heart Rate (/min)</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 3, marginBottom: 8 }}>
              {["p1", "p10", "p50", "p90", "p99"].map((p) => (
                <Badge key={p} l={p} v={vL(HR[p], aY, aM)} c={p === "p50" ? C.acc : C.t3} />
              ))}
            </div>
            <div style={{ fontSize: 10, fontWeight: 700, color: C.t2, marginBottom: 3 }}>Resp Rate (/min)</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 3, marginBottom: sex ? 8 : 0 }}>
              {["p1", "p10", "p50", "p90", "p99"].map((p) => (
                <Badge key={p} l={p} v={vL(RR[p], aY, aM)} c={p === "p50" ? C.grn : C.t3} />
              ))}
            </div>
            {sex && (
              <>
                <div style={{ fontSize: 10, fontWeight: 700, color: C.t2, marginBottom: 3 }}>
                  MAP mmHg — {sex === "1" ? "♂" : "♀"}
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
                  {[["p2_5", "p2.5"], ["p16", "p16"], ["p50", "p50"], ["p84", "p84"], ["p97_5", "p97.5"]].map(
                    ([k, l2]) => (
                      <Badge key={k} l={l2} v={mL(w, parseInt(sex), k)} c={k === "p50" ? C.orn : C.t3} />
                    ),
                  )}
                </div>
              </>
            )}
            <div style={{ fontSize: 9, color: C.t3, marginTop: 8, lineHeight: 1.5 }}>
              Premature MAP target ≈ gestational age (weeks). Systolic BP: neo–6mo 80–90 · 2–4yr 85–100 · 5–11yr 90–110 · &gt;12yr 100–120 mmHg.
            </div>
          </div>
        ) : (
          <Warn>Enter age for vital sign percentiles</Warn>
        )}
      </Sec>
    </div>
  );
}
