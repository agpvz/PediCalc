import { useState } from "react";
import { R, clamp, cap } from "../utils/helpers";
import { HR, RR, vL, mL } from "../utils/vitals";
import { C, mono, sans } from "../utils/theme";
import { Pill, Tag, Badge, Inp, Sec, Warn, Drug } from "../components/UI";

export default function StdTab({ w, age, sex, ht }) {
  const ok = w >= 1 && w <= 45,
    av = age !== null,
    hv = ht >= 20 && ht <= 150;
  const [adrR, setAdrR] = useState(0.1),
    [norR, setNorR] = useState(0.01),
    [dexR, setDexR] = useState(0.5);

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

  let ettU = null, ettC2 = null;
  if (av) {
    if (ay < 1 && w <= 3) { ettU = 3; ettC2 = 2.5; }
    else if (ay < 1) { ettU = 3.5; ettC2 = 3; }
    else if (ay < 2) { ettU = 4; ettC2 = 3.5; }
    else { ettU = R(4 + ay / 4, 1); ettC2 = R(3.5 + ay / 4, 1); }
  }

  let ettO = null;
  if (av) {
    if (ay < 1) { ettO = w <= 1 ? 6 : w <= 2 ? 7 : w <= 3 ? 8.5 : w <= 3.5 ? 9 : 10; }
    else if (ay < 2) ettO = 11;
    else ettO = R(12 + ay / 2, 1);
  }

  let ettN = null;
  if (av) {
    if (ay < 1) { ettN = w <= 1 ? 7.5 : w <= 2 ? 9 : w <= 3 ? 10.5 : w <= 3.5 ? 11 : 12; }
    else if (ay < 2) ettN = 14;
    else ettN = R(15 + ay / 2, 1);
  }

  const lma = w <= 5 ? 1 : w <= 10 ? 1.5 : w <= 20 ? 2 : w <= 30 ? 2.5 : w <= 50 ? 3 : null;
  const mf = w <= 10 ? w * 4 : w <= 20 ? 40 + 2 * (w - 10) : 60 + (w - 20);

  return (
    <div>
      <Sec title="Airway & Equipment" icon="🫁" warn={!av ? "Need age" : undefined}>
        <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: 6 }}>
          <Badge l="ETT∅ uncuff" v={ettU} c={C.acc} />
          <Badge l="ETT∅ cuff" v={ettC2} c={C.grn} />
          <Badge l="Depth oral" v={ettO} c={C.orn} />
          <Badge l="Depth nasal" v={ettN} c={C.vio} />
          <Badge l="LMA" v={lma} c={C.pink} />
        </div>
        <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
          <Badge l="Defib" v={`${R(4 * w, 0)}J`} c={C.red} />
          <Badge l="Cardiov 1st" v={`${R(0.5 * w, 0)}–${R(w, 0)}J`} c={C.red} />
          <Badge l="Paddles" v={w <= 10 ? "Peds" : "Adult"} c={C.t2} />
        </div>
      </Sec>

      <Sec title="CVC" icon="🔗" warn={!av || !hv ? "Need age+height" : undefined}>
        <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
          {av && <Badge l="Gauge" v={ay < 0.25 ? "4Fr" : "5Fr"} c={C.acc} />}
          {hv && <Badge l="Catheter" v={ht <= 50 ? "5cm" : "8cm"} c={C.grn} />}
          {hv && <Badge l="Insert" v={`${R(ht / 10, 1)}cm`} c={C.orn} />}
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
          <div style={{ fontSize: 9, fontWeight: 700, color: C.orn, textTransform: "uppercase", letterSpacing: ".04em", marginBottom: 6 }}>⚡ Resuscitation Bolus (repeat max 3×)</div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "4px 0", borderBottom: `1px solid ${C.bdr}22` }}>
            <div>
              <span style={{ fontSize: 11, color: C.t2 }}>Plasmalyte 10(–20) ml/kg</span>
              <div style={{ fontSize: 9, color: C.t4 }}>Per bolus, reassess after each</div>
            </div>
            <div style={{ display: "flex", gap: 3 }}>
              <Pill v={R(10 * w)} u="ml" c={C.orn} />
              <span style={{ fontSize: 10, color: C.t3 }}>to</span>
              <Pill v={R(20 * w)} u="ml" c={C.orn} />
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "4px 0" }}>
            <div>
              <span style={{ fontSize: 11, color: C.t2 }}>Human Albumin 5% 10(–20) ml/kg</span>
              <div style={{ fontSize: 9, color: C.t4 }}>Per bolus, reassess after each</div>
            </div>
            <div style={{ display: "flex", gap: 3 }}>
              <Pill v={R(10 * w)} u="ml" c={C.orn} />
              <span style={{ fontSize: 10, color: C.t3 }}>to</span>
              <Pill v={R(20 * w)} u="ml" c={C.orn} />
            </div>
          </div>
          <div style={{ fontSize: 9, color: C.red, fontWeight: 600, marginTop: 4 }}>Maximum 3 boluses — reassess haemodynamic status between each bolus</div>
        </div>
      </Sec>

      <Sec title="Emergency" icon="🚨">
        <Drug name="Adenosine" conc="3mg/ml" rows={[{ label: "1st: 0.1mg/kg (max 6)", mg: R(cap(0.1, w, 6)), ml: R(cap(0.1, w, 6) / 3) }, { label: "2nd: 0.2mg/kg (max 12)", mg: R(cap(0.2, w, 12)), ml: R(cap(0.2, w, 12) / 3) }]} />
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
        <Drug name="CaCl₂" conc="100mg/ml" rows={[{ label: "10mg/kg (max 1g) slow IV", mg: R(cap(10, w, 1000)), ml: R(cap(10, w, 1000) / 100) }]} />
        <Drug name="NaHCO₃ 8.4%" conc="1mEq/ml" rows={[{ label: "1mEq/kg", mg: R(w), ml: R(w), unit: "mEq" }]} />
      </Sec>

      <Sec title="Induction & Maintenance" icon="💊">
        <Drug name="Propofol 1%" conc="10mg/ml" rows={[{ label: "1–2–3mg/kg", mg: `${R(w)}–${R(2 * w)}–${R(3 * w)}`, ml: `${R(w / 10)}–${R((2 * w) / 10)}–${R((3 * w) / 10)}` }]} />
        <Drug name="Etomidate" conc="2mg/ml" rows={[{ label: "0.2–0.3mg/kg", mg: `${R(0.2 * w)}–${R(0.3 * w)}`, ml: `${R((0.2 * w) / 2)}–${R((0.3 * w) / 2)}` }]} />
        <Drug name="Ketamine" conc="50mg/ml" rows={[{ label: "1–2mg/kg IV", mg: `${R(w)}–${R(2 * w)}`, ml: `${R(w / 50)}–${R((2 * w) / 50)}` }, { label: "5–10mg/kg IM", mg: `${R(5 * w)}–${R(10 * w)}`, ml: `${R((5 * w) / 50)}–${R((10 * w) / 50)}` }]} />
        <Drug name="Fentanyl" conc="50µg/ml" rows={[{ label: "1–2–5µg/kg", mg: `${R(w)}–${R(2 * w)}–${R(5 * w)}`, ml: `${R(w / 50)}–${R((2 * w) / 50)}–${R((5 * w) / 50)}`, unit: "µg" }]} />
        <Drug name="Midazolam" conc="1mg/ml" rows={[{ label: "Premed 0.5mg/kg PO", mg: R(0.5 * w), ml: R(0.5 * w) }, { label: "Sedation 0.05–0.2mg/kg IV (max 10)", mg: `${R(cap(0.05, w, 10))}–${R(cap(0.2, w, 10))}`, ml: `${R(cap(0.05, w, 10))}–${R(cap(0.2, w, 10))}` }, ...(av && ay >= 1 / 12 ? [{ label: "Seizure ≥1mo: 0.1–0.2mg/kg", mg: `${R(0.1 * w)}–${R(0.2 * w)}`, ml: `${R(0.1 * w)}–${R(0.2 * w)}` }] : [])]} />
      </Sec>

      <Sec title="Relaxants & Reversal" icon="💪">
        <Drug name="Rocuronium" conc="10mg/ml" rows={[{ label: "0.3–0.6–1mg/kg", mg: `${R(0.3 * w)}–${R(0.6 * w)}–${R(w)}`, ml: `${R((0.3 * w) / 10)}–${R((0.6 * w) / 10)}–${R(w / 10)}` }]} />
        <Drug name="Cisatracurium" conc="2mg/ml" rows={[{ label: "0.15mg/kg", mg: R(0.15 * w), ml: R((0.15 * w) / 2) }]} />
        <Drug name="Sugammadex" conc="100mg/ml" rows={[{ label: "2–16mg/kg", mg: `${R(2 * w)}–${R(16 * w)}`, ml: `${R((2 * w) / 100)}–${R((16 * w) / 100)}` }]} />
        <Drug name="Neostigmine" conc="0.5mg/ml" rows={[{ label: "20–30–50µg/kg", mg: `${R(0.02 * w)}–${R(0.03 * w)}–${R(0.05 * w)}`, ml: `${R((0.02 * w) / 0.5)}–${R((0.03 * w) / 0.5)}–${R((0.05 * w) / 0.5)}` }]} />
      </Sec>

      <Sec title="Analgesics & Anti-emetics" icon="🩹">
        <Drug name="Paracetamol" conc="10mg/ml" rows={w <= 10 ? [{ label: "≤10kg: 7.5mg/kg ×4/d", mg: R(7.5 * w), ml: R((7.5 * w) / 10) }] : [{ label: ">10kg: 15mg/kg ×4/d", mg: R(15 * w), ml: R((15 * w) / 10) }]} />
        <Drug name="Ketorolac" conc="10mg/ml" rows={av && aY === 0 && aM < 3 ? [{ label: "<3mo CONTRAINDICATED", text: "CI", tc: C.red }] : [{ label: "≥3mo: 0.5mg/kg (max 30)", mg: R(cap(0.5, w, 30)), ml: R(cap(0.5, w, 30) / 10) }]} note={av && aY === 0 && aM < 3 ? "Contraindicated <3 months" : undefined} />
        <Drug name="Metamizole" conc="500mg/ml" rows={av && (aY > 0 || aM >= 3) && w >= 5 ? [{ label: "≥3mo ≥5kg: 15mg/kg ×4/d", mg: R(15 * w), ml: R((15 * w) / 500) }] : [{ label: "<3mo/<5kg: 12.5mg/kg ×4/d", mg: R(12.5 * w), ml: R((12.5 * w) / 500) }]} />
        <Drug name="Tramadol" conc="50mg/ml" rows={[{ label: "1–2mg/kg (max 8/kg/d)", mg: `${R(w)}–${R(2 * w)}`, ml: `${R(w / 50)}–${R((2 * w) / 50)}` }]} />
        <Drug name="Morphine" conc="1mg/ml" rows={[{ label: "0.05–0.1mg/kg", mg: `${R(0.05 * w)}–${R(0.1 * w)}`, ml: `${R(0.05 * w)}–${R(0.1 * w)}` }]} />
        <Drug name="Ondansetron" conc="2mg/ml" rows={[{ label: "0.1mg/kg (max 4)", mg: R(cap(0.1, w, 4)), ml: R(cap(0.1, w, 4) / 2) }]} />
        <Drug name="Dexamethasone" conc="5mg/ml" rows={[{ label: "0.15mg/kg", mg: R(0.15 * w), ml: R((0.15 * w) / 5) }]} />
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
        <Drug name="Dexmedetomidine" rows={[{ label: "IN 2–4µg/kg (100µg/ml)", mg: `${R(2 * w)}–${R(4 * w)}`, ml: `${R((2 * w) / 100)}–${R((4 * w) / 100)}`, unit: "µg" }, { label: "IV bolus 0.5–2µg/kg (1µg/ml)", mg: `${R(0.5 * w)}–${R(2 * w)}`, ml: `${R(0.5 * w)}–${R(2 * w)}`, unit: "µg" }]}>
          <div style={{ fontSize: 10, color: C.t3, marginBottom: 3 }}>IV infusion (40µg/40ml)</div>
          <Inp label="Rate" value={dexR} onChange={setDexR} min={0.1} max={1.2} step={0.1} unit="µg/kg/hr" />
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

      <Sec title="Other Medications" icon="🧪">
        <Drug name="Clonidine" conc="150µg/ml" rows={[{ label: "1–2µg/kg", mg: `${R(w)}–${R(2 * w)}`, ml: `${R(w / 150)}–${R((2 * w) / 150)}`, unit: "µg" }]} />
        <Drug name="Diazepam" conc="5mg/ml" rows={[{ label: "Seizures 0.1–1mg/kg (max 20)", mg: `${R(cap(0.1, w, 20))}–${R(cap(1, w, 20))}`, ml: `${R(cap(0.1, w, 20) / 5)}–${R(cap(1, w, 20) / 5)}` }]} />
        <Drug name="Glucose 10%" rows={[{ label: "0.2g/kg", mg: R(0.2 * w), ml: R((0.2 * w) / 0.1), unit: "g" }]} />
        <Drug name="Hydrocortisone" rows={[{ label: "Anaph 2–4mg/kg max 200 [50mg/ml]", mg: `${R(cap(2, w, 200))}–${R(cap(4, w, 200))}`, ml: `${R(cap(2, w, 200) / 50)}–${R(cap(4, w, 200) / 50)}` }, { label: "Same [125mg/ml]", mg: `${R(cap(2, w, 200))}–${R(cap(4, w, 200))}`, ml: `${R(cap(2, w, 200) / 125)}–${R(cap(4, w, 200) / 125)}` }]} />
        <Drug name="Methylprednisolone" conc="40mg/ml" rows={[{ label: "Anaph 1–2mg/kg", mg: `${R(w)}–${R(2 * w)}`, ml: `${R(w / 40)}–${R((2 * w) / 40)}` }]} />
        <Drug name="KCl" conc="dilute" rows={[{ label: "0.3mmol/kg/hr (max 4–6hr)", mg: R(0.3 * w), unit: "mmol/hr" }]} />
        <Drug name="MgSO₄" conc="0.3g/ml" rows={[{ label: "40mg/kg slow IV", mg: R(40 * w), ml: R((40 * w) / 300) }]} />
        <Drug name="Mannitol 20%" rows={[{ label: "0.25–0.5g/kg/20min", mg: `${R(0.25 * w)}–${R(0.5 * w)}`, ml: `${R((0.25 * w) / 0.2)}–${R((0.5 * w) / 0.2)}`, unit: "g" }]} />
        <Drug name="Naloxone" conc="0.4mg/ml" rows={[{ label: "10µg/kg q2min (max 0.4mg)", mg: R(10 * w), ml: R((10 * w) / 400), unit: "µg" }]} note="Max total 0.4mg" />
        <Drug name="Cefazolin" conc="100mg/ml" rows={[{ label: "50mg/kg (max 2g) q8h", mg: R(cap(50, w, 2000)), ml: R(cap(50, w, 2000) / 100) }]} />
        <Drug name="Salbutamol + Ipratropium" conc="aerosol" rows={av && ay < 5 ? [{ label: "<5yr", text: "2.5mg salb + 0.25mg iprat", tc: C.acc }] : av ? [{ label: "≥5yr", text: "5mg salb + 0.5mg iprat", tc: C.acc }] : [{ label: "Need age", text: "—", tc: C.t3 }]} />
        <Drug name="Tranexamic Acid" conc="100mg/ml" rows={[{ label: "Cardiac 5–10mg/kg", mg: `${R(5 * w)}–${R(10 * w)}`, ml: `${R((5 * w) / 100)}–${R((10 * w) / 100)}` }]} />
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
          </div>
        ) : (
          <Warn>Enter age for vital sign percentiles</Warn>
        )}
      </Sec>
    </div>
  );
}
