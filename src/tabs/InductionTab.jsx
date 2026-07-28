import { R, cap } from "../utils/helpers";
import { C } from "../utils/theme";
import { Sec, Drug } from "../components/UI";

export default function InductionTab({ w, age }) {
  const ok = w >= 1 && w <= 45,
    av = age !== null;

  if (!ok)
    return (
      <div style={{ padding: 40, textAlign: "center", color: C.t3 }}>Enter weight (1–45 kg)</div>
    );

  const ay = age?.totalYears ?? 0;

  return (
    <div>
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
    </div>
  );
}
