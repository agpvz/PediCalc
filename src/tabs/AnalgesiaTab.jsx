import { R, cap } from "../utils/helpers";
import { C } from "../utils/theme";
import { Sec, Drug } from "../components/UI";

export default function AnalgesiaTab({ w, age }) {
  const ok = w >= 1 && w <= 45,
    av = age !== null;

  if (!ok)
    return (
      <div style={{ padding: 40, textAlign: "center", color: C.t3 }}>Enter weight (1–45 kg)</div>
    );

  const aY = age?.years ?? 0,
    aM = age?.months ?? 0;

  return (
    <div>
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
    </div>
  );
}
