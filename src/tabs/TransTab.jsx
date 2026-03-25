import { useState } from "react";
import { R } from "../utils/helpers";
import { C } from "../utils/theme";
import { Pill, Badge, Inp, Sec, Warn, Drug } from "../components/UI";

export default function TransTab({ w, age }) {
  const ok = w >= 1 && w <= 45,
    av = age !== null,
    ay = age?.totalYears ?? 0;
  const [sHb, setSHb] = useState(11),
    [tHb, setTHb] = useState(7),
    [tF, setTF] = useState(1.5),
    [mF, setMF] = useState(1.0);

  if (!ok)
    return (
      <div style={{ padding: 40, textAlign: "center", color: C.t3 }}>Enter weight (1–45 kg)</div>
    );

  let ebv = null;
  if (av) {
    if (ay < 3 / 12) ebv = ((80 + 90) / 2) * w;
    else if (ay < 1) ebv = ((70 + 80) / 2) * w;
    else ebv = 70 * w;
  }
  const abl = ebv && sHb > 0 ? R(((sHb - tHb) / sHb) * ebv, 0) : null;
  const fibK = R(((tF - mF) / 0.017) * w);

  return (
    <div>
      <Sec title="Blood Volume" icon="🩸" warn={!av ? "Need age" : undefined}>
        {av ? (
          <div style={{ background: C.s1, borderRadius: 8, border: `1px solid ${C.bdr}`, padding: 10 }}>
            {ay < 3 / 12 && (
              <>
                <div style={{ fontSize: 11, color: C.t2 }}>
                  Premature: <Pill v={`${R(90 * w, 0)}–${R(100 * w, 0)}`} u="ml" />
                </div>
                <div style={{ fontSize: 11, color: C.t2, marginTop: 3 }}>
                  Term neo: <Pill v={`${R(80 * w, 0)}–${R(90 * w, 0)}`} u="ml" />
                </div>
              </>
            )}
            {ay >= 3 / 12 && ay < 1 && (
              <div style={{ fontSize: 11, color: C.t2 }}>
                Infant: <Pill v={`${R(70 * w, 0)}–${R(80 * w, 0)}`} u="ml" />
              </div>
            )}
            {ay >= 1 && (
              <div style={{ fontSize: 11, color: C.t2 }}>
                Child: <Pill v={R(70 * w, 0)} u="ml" />
              </div>
            )}
          </div>
        ) : (
          <Warn>Enter age for blood volume</Warn>
        )}
      </Sec>

      <Sec title="Acceptable Blood Loss" icon="📉">
        <div style={{ background: C.s1, borderRadius: 8, border: `1px solid ${C.bdr}`, padding: 10 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 5, marginBottom: 6 }}>
            <Inp label="Start Hb" value={sHb} onChange={setSHb} min={1} max={25} step={0.1} unit="g/dl" />
            <Inp label="Trigger Hb" value={tHb} onChange={setTHb} min={1} max={25} step={0.1} unit="g/dl" />
          </div>
          <Badge l="ABL" v={abl ? `${abl} ml` : "—"} c={C.red} />
        </div>
      </Sec>

      <Sec title="Transfusion Products" icon="🏥">
        <Drug name="RBC" rows={[{ label: "10–15ml/kg", mg: `${R(10 * w)}–${R(15 * w)}`, unit: "ml" }, { label: "3.3ml/kg = +1g/dl Hb", mg: R(3.3 * w), unit: "ml" }, { label: "Rate 5ml/kg/hr", mg: R(5 * w), unit: "ml/hr" }]} />
        <Drug name="Plasma" rows={[{ label: "12–15ml/kg", mg: `${R(12 * w)}–${R(15 * w)}`, unit: "ml" }, { label: "Rate 10–20ml/kg/hr", mg: `${R(10 * w)}–${R(20 * w)}`, unit: "ml/hr" }]} />
        <Drug name="Platelets" rows={[{ label: "10–20ml/kg", mg: `${R(10 * w)}–${R(20 * w)}`, unit: "ml" }, { label: "Rate 10–20ml/kg/hr", mg: `${R(10 * w)}–${R(20 * w)}`, unit: "ml/hr" }]} />
        <Drug name="Fibrinogen (RiaStap® 20mg/ml)" rows={[{ label: "Unknown fib: 70mg/kg", mg: R(70 * w), ml: R((70 * w) / 20) }]}>
          <div style={{ fontSize: 10, color: C.t3, marginBottom: 3 }}>Known fibrinogen</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 5 }}>
            <Inp label="Target g/l" value={tF} onChange={setTF} min={0.5} max={4} step={0.1} />
            <Inp label="Measured g/l" value={mF} onChange={setMF} min={0} max={4} step={0.1} />
          </div>
          <div style={{ display: "flex", gap: 5, marginTop: 5 }}>
            <Pill v={fibK > 0 ? fibK : 0} u="mg" c={C.acc} />
            <Pill v={fibK > 0 ? R(fibK / 20) : 0} u="ml" c={C.grn} />
          </div>
          <div style={{ fontSize: 9, color: C.t3, marginTop: 3 }}>Max 100mg/min (5ml/min)</div>
        </Drug>
      </Sec>

      <div style={{ background: C.ornS, borderRadius: 8, padding: 10, border: "1px solid rgba(245,158,11,0.15)", marginTop: 10 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: C.orn, marginBottom: 3 }}>⚠ Special Requirements (&lt;4mo)</div>
        <div style={{ fontSize: 10, color: C.t2, lineHeight: 1.5 }}>
          • Group O (RBC) or AB (plasma)<br />
          • Leukocyte-depleted, CMV-safe<br />
          • Irradiation: &lt;32wk, &lt;1500g, exchange, post-IUT ×6mo, immunodeficiency
        </div>
      </div>
    </div>
  );
}
