import { R } from "../utils/helpers";
import { C } from "../utils/theme";
import { Sec, Drug } from "../components/UI";

export default function RegionalTab({ w, age }) {
  const ok = w >= 1 && w <= 45,
    av = age !== null;

  if (!ok)
    return (
      <div style={{ padding: 40, textAlign: "center", color: C.t3 }}>Enter weight (1–45 kg)</div>
    );

  const ay = age?.totalYears ?? 0;

  return (
    <div>
      <Sec title="Local Anaesthetics" icon="💉">
        <Drug name="Lidocaine" conc="10mg/ml" rows={[{ label: "Without adr: max 5mg/kg", mg: `max ${R(5 * w)}`, ml: `max ${R((5 * w) / 10)}` }, { label: "With adr: max 7mg/kg", mg: `max ${R(7 * w)}`, ml: `max ${R((7 * w) / 10)}` }]} />
        <Drug name="Levobupivacaine" conc="2.5mg/ml" rows={[{ label: "Infiltration: max 2mg/kg", mg: `max ${R(2 * w)}`, ml: `max ${R((2 * w) / 2.5)}` }]} />
        <Drug name="Ropivacaine" conc="5mg/ml" rows={[{ label: "Infiltration: max 2mg/kg", mg: `max ${R(2 * w)}`, ml: `max ${R((2 * w) / 5)}` }]} />
      </Sec>

      <Sec title="Regional & Neuraxial" icon="🧬">
        <Drug name="Caudal (0.25% bupivacaine)" rows={[{ label: "Sacro-lumbar 0.5ml/kg", mg: R(0.5 * w), unit: "ml" }, { label: "Upper abdominal 1ml/kg", mg: R(w), unit: "ml" }, { label: "Mid-thoracic 1.2ml/kg", mg: R(1.2 * w), unit: "ml" }]} note="± clonidine 1µg/kg · mid-thoracic level not always reliable" />
        <Drug name="Wound infusion catheter" rows={av && ay < 4 / 12 ? [{ label: "<4mo: 0.1% bupiv 0.1–0.2ml/kg/hr", mg: `${R(0.1 * w)}–${R(0.2 * w)}`, unit: "ml/hr" }] : [{ label: ">4mo: 0.2% bupiv 0.1–0.2ml/kg/hr", mg: `${R(0.1 * w)}–${R(0.2 * w)}`, unit: "ml/hr" }]} />
        <Drug name="Epidural" rows={[{ label: "Space depth ≈ 1mm/kg", text: `${R(w, 1)}mm`, tc: C.acc }, { label: "Bolus 0.25% bupiv: thoracic 0.5 / lumbar 0.75 ml/kg", mg: `${R(0.5 * w)} / ${R(0.75 * w)}`, unit: "ml" }, av && ay >= 0.5 && w >= 5 ? { label: "Infusion 0.1% bupiv 0.1–0.4ml/kg/hr", mg: `${R(0.1 * w)}–${R(0.4 * w)}`, unit: "ml/hr" } : { label: "Infusion 0.1% bupiv 0.1–0.2ml/kg/hr (<6mo/<5kg)", mg: `${R(0.1 * w)}–${R(0.2 * w)}`, unit: "ml/hr" }]} note="Length in space 3–4cm · check toxic dose" />
        <Drug name="Clysis (field block)" rows={[{ label: "Max 20ml/kg of dilute mix", mg: R(20 * w), unit: "ml" }]} note="10ml 0.5% bupiv + 1ml adrenaline 1:1000; take 4.5ml into 200ml N/S" />
      </Sec>
    </div>
  );
}
