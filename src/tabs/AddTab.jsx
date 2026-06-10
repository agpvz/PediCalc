import { R } from "../utils/helpers";
import { C } from "../utils/theme";
import { Sec, Drug } from "../components/UI";

export default function AddTab({ w, age }) {
  const ok = w >= 1 && w <= 45,
    av = age !== null,
    ay = age?.totalYears ?? 0;

  if (!ok)
    return (
      <div style={{ padding: 40, textAlign: "center", color: C.t3 }}>Enter weight (1–45 kg)</div>
    );

  return (
    <div>
      <Sec title="Antibiotics" icon="🦠">
        <Drug name="Amikacin" conc="250mg/ml" rows={[...(av && ay < 2 / 12 && w < 5 ? [{ label: "Premature 15–20mg/kg", mg: `${R(15 * w)}–${R(20 * w)}`, ml: `${R((15 * w) / 250)}–${R((20 * w) / 250)}` }] : []), { label: "Term–18yr: 15mg/kg q24h", mg: R(15 * w), ml: R((15 * w) / 250) }]} />
        <Drug name="Amoxicillin (+Clav)" conc="100mg/ml" rows={[{ label: "Infections 25mg/kg (+2.5)", mg: `${R(25 * w)} (+${R(2.5 * w)})`, ml: R((25 * w) / 100) }, { label: "Endocarditis ppx 50mg/kg", mg: R(50 * w), ml: R((50 * w) / 100) }]} />
        <Drug name="Ceftazidime" conc="100mg/ml" rows={[{ label: "CF 66.6mg/kg q8h", mg: R(66.6 * w), ml: R((66.6 * w) / 100) }]} note="Max 12g/day" />
        <Drug name="Clindamycin" conc="150mg/ml" rows={[{ label: "10mg/kg (max 600) q8h", mg: R(10 * w), ml: R((10 * w) / 150) }]} />
        <Drug name="Metronidazole" conc="5mg/ml" rows={av && ay < 1 / 12 ? [{ label: "<1mo: 15mg/kg", mg: R(15 * w), ml: R((15 * w) / 5) }] : [{ label: "≥1mo: 30mg/kg", mg: R(30 * w), ml: R((30 * w) / 5) }]} />
        <Drug name="Tobramycin" conc="40mg/ml" rows={[...(av && ay < 1 / 12 ? [{ label: "Neo 4mg/kg", mg: R(4 * w), ml: R((4 * w) / 40) }] : []), ...(av && ay >= 1 / 12 ? [{ label: "≥1mo 5–7mg/kg q24h", mg: `${R(5 * w)}–${R(7 * w)}`, ml: `${R((5 * w) / 40)}–${R((7 * w) / 40)}` }, { label: "CF 10mg/kg q24h", mg: R(10 * w), ml: R((10 * w) / 40) }] : [])]} />
        <Drug name="Vancomycin" conc="50mg/ml" rows={[...(av && ay < 1 / 12 ? [{ label: "Premature 8–12mg/kg", mg: `${R(8 * w)}–${R(12 * w)}`, ml: `${R((8 * w) / 50)}–${R((12 * w) / 50)}` }] : []), ...(av && ay >= 1 / 12 ? [{ label: "≥1mo 15mg/kg q6h", mg: R(15 * w), ml: R((15 * w) / 50) }] : [])]} />
      </Sec>

      <Sec title="Other" icon="💊">
        <Drug name="Dantrolene" conc="≈0.33mg/ml" rows={[{ label: "MH 2.5mg/kg ×3", mg: R(2.5 * w), ml: R((2.5 * w) / (20 / 60)) }]} note="20mg in 60ml sterile H₂O" />
        <Drug name="Sufentanil" conc="5µg/ml" rows={[{ label: "Bolus 0.1–0.2–0.5µg/kg", mg: `${R(0.1 * w)}–${R(0.2 * w)}–${R(0.5 * w)}`, ml: `${R((0.1 * w) / 5)}–${R((0.2 * w) / 5)}–${R((0.5 * w) / 5)}`, unit: "µg" }, { label: w < 20 ? "Infusion <20kg (1µg/ml)" : "Infusion >20kg (1µg/ml)", mg: w < 20 ? 10 : 20, unit: "ml/hr" }]} note="Infusion: dilute 10ml of 5µg/ml to 50ml = 1µg/ml. Stop 20min before end" />
        <Drug name="Caffeine citrate" rows={[{ label: "Apnoea ppx 20mg/kg PO", mg: R(20 * w), unit: "mg" }, { label: "Maint 5–10mg/kg OD ×48h post-op", mg: `${R(5 * w)}–${R(10 * w)}`, unit: "mg" }]} note="Premature <60wk post-conceptional age" />
      </Sec>
    </div>
  );
}
