import { useState } from "react";
import { R } from "../utils/helpers";
import { C } from "../utils/theme";
import { Pill, Inp, Sec, Drug } from "../components/UI";

/**
 * Generic weight-based infusion calculator (µg/kg/min preparations).
 * Computes dose/min, dose/hr and ml/hr from an editable rate + concentration.
 */
function InfCalc({ w, defRate, min, max, step, conc, concStep = 1, doseUnit = "µg" }) {
  const [rate, setRate] = useState(defRate);
  const [cc, setCc] = useState(conc);
  const r = typeof rate === "number" ? rate : 0;
  const c = typeof cc === "number" ? cc : 0;
  const perMin = r * w;
  const perHr = r * w * 60;
  const mlHr = c > 0 ? perHr / c : 0;
  return (
    <>
      <div style={{ display: "flex", gap: 5 }}>
        <Inp label="Rate" value={rate} onChange={setRate} min={min} max={max} step={step} unit={`${doseUnit}/kg/min`} />
        <Inp label="Concentration" value={cc} onChange={setCc} min={0} step={concStep} unit={`${doseUnit}/ml`} />
      </div>
      <div style={{ display: "flex", gap: 5, marginTop: 6, flexWrap: "wrap" }}>
        <Pill v={R(perMin)} u={`${doseUnit}/min`} c={C.vio} />
        <Pill v={R(perHr)} u={`${doseUnit}/hr`} c={C.acc} />
        <Pill v={R(mlHr)} u="ml/hr" c={C.grn} />
      </div>
    </>
  );
}

/**
 * Vasopressin infusion calculator (units-based, dosed in mU/kg/min).
 * Concentration entered in units/ml; outputs mU/min, units/hr and ml/hr.
 */
function VasoCalc({ w }) {
  const [rate, setRate] = useState(0.5); // mU/kg/min
  const [cc, setCc] = useState(0.2); // units/ml
  const r = typeof rate === "number" ? rate : 0;
  const c = typeof cc === "number" ? cc : 0;
  const mUmin = r * w; // mU/min
  const uHr = (r * w * 60) / 1000; // units/hr
  const mlHr = c > 0 ? uHr / c : 0;
  return (
    <>
      <div style={{ display: "flex", gap: 5 }}>
        <Inp label="Rate" value={rate} onChange={setRate} min={0.1} max={2} step={0.05} unit="mU/kg/min" />
        <Inp label="Concentration" value={cc} onChange={setCc} min={0} step={0.05} unit="U/ml" />
      </div>
      <div style={{ display: "flex", gap: 5, marginTop: 6, flexWrap: "wrap" }}>
        <Pill v={R(mUmin)} u="mU/min" c={C.vio} />
        <Pill v={R(uHr, 3)} u="U/hr" c={C.acc} />
        <Pill v={R(mlHr)} u="ml/hr" c={C.grn} />
      </div>
    </>
  );
}

export default function InoTab({ w, age }) {
  const ok = w >= 1 && w <= 45;
  const av = age !== null;
  const preterm = av && age.totalYears < 1 / 12; // < ~1 month

  if (!ok)
    return (
      <div style={{ padding: 40, textAlign: "center", color: C.t3 }}>Enter weight (1–45 kg)</div>
    );

  return (
    <div>
      <Sec title="Inotropes & Vasopressors" icon="❤️">
        <Drug
          name="Dopamine"
          conc="default 1600µg/ml"
          rows={[
            { label: "Usual 2–20 µg/kg/min", text: "start 5", tc: C.acc },
            { label: "Titrate by 2–5 µg/kg/min", text: "—", tc: C.t3 },
          ]}
          note={preterm ? "Preterm: doses >10 µg/kg/min may impair cerebral autoregulation" : "Preterm caution: >10 µg/kg/min may impair cerebral autoregulation"}
        >
          <InfCalc w={w} defRate={5} min={1} max={20} step={0.5} conc={1600} concStep={50} />
        </Drug>

        <Drug
          name="Dobutamine"
          conc="default 2000µg/ml"
          rows={[
            { label: "5–20 µg/kg/min", text: "start 5", tc: C.acc },
            { label: "Low CO with adequate BP" },
          ]}
          note="Less effective than dopamine for raising MAP in preterms"
        >
          <InfCalc w={w} defRate={5} min={1} max={20} step={0.5} conc={2000} concStep={50} />
        </Drug>

        <Drug
          name="Epinephrine (Adrenaline)"
          conc="default 16µg/ml"
          rows={[
            { label: "Inotropy 0.01–0.1 µg/kg/min", text: "low", tc: C.grn },
            { label: "Vasopression >0.1 µg/kg/min", text: "high", tc: C.orn },
          ]}
          note="High risk of tachycardia & lactic acidosis (often type B)"
        >
          <InfCalc w={w} defRate={0.05} min={0.01} max={1} step={0.01} conc={16} concStep={4} />
        </Drug>

        <Drug
          name="Norepinephrine (Noradrenaline)"
          conc="default 16µg/ml"
          rows={[
            { label: "0.05–1 µg/kg/min", text: "start 0.05", tc: C.acc },
            { label: "Refractory shock with low SVR" },
          ]}
          note="Used in dopamine-resistant shock in preterms"
        >
          <InfCalc w={w} defRate={0.05} min={0.05} max={1} step={0.05} conc={16} concStep={4} />
        </Drug>

        <Drug
          name="Milrinone"
          conc="default 100µg/ml"
          rows={[
            { label: "0.25–0.75 µg/kg/min", text: "inodilator", tc: C.vio },
            { label: "Preterm: 0.75 → 0.15–0.2 µg/kg/min" },
            { label: "Term: 1.25 → 0.25–0.75 µg/kg/min" },
          ]}
          note={
            <>
              Preterm: avoid bolus — use a slow loading infusion or maintenance only to prevent profound hypotension
              <br />
              Renal: reduce dose by 50% if CrCl &lt;30 ml/min/1.73m²
            </>
          }
        >
          <InfCalc w={w} defRate={0.5} min={0.1} max={1} step={0.01} conc={100} concStep={10} />
        </Drug>

        <Drug
          name="Vasopressin"
          conc="default 0.2U/ml"
          rows={[
            { label: "0.0001–0.002 U/kg/min", text: "0.1–2 mU/kg/min", tc: C.vio },
            { label: "Catecholamine-resistant shock / refractory PHTN" },
          ]}
          note="Monitor for hyponatraemia & decreased mesenteric perfusion"
        >
          <VasoCalc w={w} />
        </Drug>
      </Sec>

      <div style={{ marginTop: 10, fontSize: 9, color: C.t3, lineHeight: 1.5, padding: "0 2px" }}>
        Concentrations are editable defaults — adjust to your local preparation. All rates are
        weight-based; verify against unit protocols before administration.
      </div>
    </div>
  );
}
