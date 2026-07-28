import { R } from "../utils/helpers";
import { C } from "../utils/theme";
import { Pill, Tag, Sec } from "../components/UI";

export default function FluidsTab({ w, age }) {
  const ok = w >= 1 && w <= 45,
    av = age !== null;

  if (!ok)
    return (
      <div style={{ padding: 40, textAlign: "center", color: C.t3 }}>Enter weight (1–45 kg)</div>
    );

  const ay = age?.totalYears ?? 0;
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
    </div>
  );
}
