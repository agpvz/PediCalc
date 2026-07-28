import { HR, RR, vL, mL } from "../utils/vitals";
import { C } from "../utils/theme";
import { Badge, Sec } from "./UI";

export default function VitalSigns({ w, age, sex, open = true }) {
  const aY = age?.years ?? 0,
    aM = age?.months ?? 0;

  return (
    <Sec title="Vital Signs" icon="📊" defaultOpen={open}>
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
    </Sec>
  );
}
