import { useState } from "react";
import { R, R5 } from "../utils/helpers";
import { C, sans } from "../utils/theme";
import { Badge, Sec } from "../components/UI";

export default function AirwayTab({ w, age, ht }) {
  const ok = w >= 1 && w <= 45,
    av = age !== null,
    hv = ht >= 20 && ht <= 150;
  const [cvcSite, setCvcSite] = useState("central");

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

  // CVC sizing — weight-based French gauge (single recommended value per chart band).
  const cvcFr = w < 5 ? 4 : w < 10 ? 5 : w <= 20 ? 5.5 : 7;
  // IJ/subclavian: insertion depth = Peres' formula (height/10), right-sided.
  // Recommended catheter length = smallest standard size that accommodates the depth.
  const cvcDepth = ht / 10;
  const cvcSizes = [5, 8, 13, 15];
  const cvcLen = cvcSizes.find((l) => l >= cvcDepth) ?? cvcSizes[cvcSizes.length - 1];
  // Femoral: weight-based catheter length (longer than central), per chart band.
  const femLen = w < 3 ? "8–12" : w < 5 ? "12" : w < 10 ? "12–15" : w <= 20 ? "15–20" : "20–30";

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

      <Sec title="CVC" icon="🔗" warn={cvcSite === "central" && !hv ? "Need height" : undefined}>
        {/* Insertion site */}
        <div style={{ display: "flex", gap: 3, marginBottom: 6 }}>
          {[["central", "IJ / Subclavian"], ["femoral", "Femoral"]].map(([s, l]) => (
            <button
              key={s}
              onClick={() => setCvcSite(s)}
              style={{
                flex: 1,
                padding: "5px 8px",
                borderRadius: 7,
                border: `1px solid ${cvcSite === s ? C.acc + "60" : C.bdr}`,
                background: cvcSite === s ? C.accS : "transparent",
                color: cvcSite === s ? C.acc : C.t3,
                fontSize: 10,
                fontWeight: 700,
                cursor: "pointer",
                fontFamily: sans,
                transition: "all 0.15s",
                WebkitTapHighlightColor: "transparent",
              }}
            >
              {l}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
          <Badge l="Gauge" v={`${cvcFr}Fr`} c={C.acc} />
          {cvcSite === "central" ? (
            <>
              {hv && <Badge l="Catheter" v={`${cvcLen}cm`} c={C.grn} />}
              {hv && <Badge l="Insert depth" v={`${R(cvcDepth, 1)}cm`} c={C.orn} />}
            </>
          ) : (
            <Badge l="Catheter length" v={`${femLen}cm`} c={C.grn} />
          )}
        </div>
        <div style={{ marginTop: 6, fontSize: 9, color: C.t3, lineHeight: 1.5, padding: "0 2px" }}>
          {cvcSite === "central"
            ? "IJ/SC insert depth = height ÷ 10 (Peres', right-sided). Catheter = smallest standard length (5/8/13/15 cm) that accommodates the depth; add ~1 cm for left-sided lines. "
            : "Femoral catheter length is weight-based and longer than central; aim for tip in the IVC below the diaphragm. "}
          Fr gauge is weight-based — confirm tip position radiologically.
        </div>
      </Sec>
    </div>
  );
}
