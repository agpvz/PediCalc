import { useState } from "react";
import { R, cap } from "../utils/helpers";
import { C } from "../utils/theme";
import { Pill, Inp, Sec, Drug } from "../components/UI";

export default function StdTab({ w, age }) {
  const ok = w >= 1 && w <= 45,
    av = age !== null;
  const [norR, setNorR] = useState(0.01),
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

  const ay = age?.totalYears ?? 0;
  const norConc = 1; // 1mg/ml

  return (
    <div>
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
    </div>
  );
}
