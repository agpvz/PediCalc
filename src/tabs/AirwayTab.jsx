import { R, R5 } from "../utils/helpers";
import { C } from "../utils/theme";
import { Badge, Sec } from "../components/UI";

export default function AirwayTab({ w, age, ht }) {
  const ok = w >= 1 && w <= 45,
    av = age !== null,
    hv = ht >= 20 && ht <= 150;

  if (!ok)
    return (
      <div style={{ padding: 48, textAlign: "center" }}>
        <div style={{ fontSize: 44, marginBottom: 8, opacity: 0.8 }}>🫁</div>
        <div style={{ color: C.t2, fontSize: 14, fontWeight: 600 }}>Enter weight (1–45 kg)</div>
        <div style={{ color: C.t3, fontSize: 11, marginTop: 6, lineHeight: 1.5 }}>
          Weight + Age + Height needed for complete calculations
        </div>
      </div>
    );

  const ay = age?.totalYears ?? 0;

  let ettU = null, ettC2 = null;
  if (av) {
    if (ay < 1 && w <= 3) { ettU = 3; ettC2 = 2.5; }
    else if (ay < 1) { ettU = 3.5; ettC2 = 3; }
    else if (ay < 2) { ettU = 4; ettC2 = 3.5; }
    else { ettU = R5(4 + ay / 4); ettC2 = R5(3.5 + ay / 4); }
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

  // CVC insertion depth — Peres' formula (height/10) for right-sided IJ/subclavian.
  // Recommended catheter length = smallest standard size that accommodates the depth.
  const cvcDepth = ht / 10;
  const cvcSizes = [5, 8, 13, 15];
  const cvcLen = cvcSizes.find((l) => l >= cvcDepth) ?? cvcSizes[cvcSizes.length - 1];

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
          {hv && <Badge l="Catheter" v={`${cvcLen}cm`} c={C.grn} />}
          {hv && <Badge l="Insert depth" v={`${R(cvcDepth, 1)}cm`} c={C.orn} />}
        </div>
        {hv && (
          <div style={{ marginTop: 6, fontSize: 9, color: C.t3, lineHeight: 1.5, padding: "0 2px" }}>
            Insert depth = height ÷ 10 (Peres', right-sided IJ/subclavian). Catheter = smallest standard
            length (5/8/13/15 cm) that accommodates the depth. Add ~1 cm for left-sided lines; confirm tip
            position radiologically.
          </div>
        )}
      </Sec>
    </div>
  );
}
