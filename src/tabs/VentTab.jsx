import { R } from "../utils/helpers";
import { C, mono } from "../utils/theme";
import { Pill, Tag, Sec } from "../components/UI";

/**
 * Age-banded starting parameters for intraoperative conventional ventilation.
 * Rates/times reflect physiological norms used as initial settings
 * (Spaeth et al., Pediatric Anesthesia 2022; PEMVECC 2017).
 */
const BANDS = [
  { l: "Neonate 0–1 mo", max: 1 / 12, rr: "30–40", ti: "0.3–0.5", ie: "1:1.5–1:2" },
  { l: "Infant 1–12 mo", max: 1, rr: "25–35", ti: "0.5–0.7", ie: "1:1.5–1:2" },
  { l: "1–3 yr", max: 3, rr: "20–30", ti: "0.6–0.8", ie: "1:2" },
  { l: "3–6 yr", max: 6, rr: "20–25", ti: "0.7–0.9", ie: "1:2" },
  { l: "6–12 yr", max: 12, rr: "15–20", ti: "0.8–1.0", ie: "1:2" },
  { l: ">12 yr", max: 99, rr: "12–16", ti: "0.9–1.2", ie: "1:2" },
];

const Card = ({ title, color, children }) => (
  <div style={{ background: C.s1, borderRadius: 8, border: `1px solid ${C.bdr}`, padding: "8px 10px", marginBottom: 3 }}>
    <div style={{ fontSize: 10, fontWeight: 700, color, textTransform: "uppercase", letterSpacing: ".04em", marginBottom: 6 }}>
      {title}
    </div>
    {children}
  </div>
);

const Row = ({ label, sub, children }) => (
  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 6, padding: "4px 0", flexWrap: "wrap" }}>
    <div style={{ flex: 1, minWidth: 120 }}>
      <span style={{ fontSize: 12, color: C.t2 }}>{label}</span>
      {sub && <div style={{ fontSize: 10, color: C.t4 }}>{sub}</div>}
    </div>
    <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>{children}</div>
  </div>
);

export default function VentTab({ w, age }) {
  const ok = w >= 1 && w <= 45,
    av = age !== null;

  if (!ok)
    return (
      <div style={{ padding: 40, textAlign: "center", color: C.t3 }}>Enter weight (1–45 kg)</div>
    );

  const ty = age?.totalYears ?? null;
  const band = av ? BANDS.find((b) => ty < b.max) ?? BANDS[BANDS.length - 1] : null;
  const neo = av && ty < 1 / 12;

  return (
    <div>
      <Sec title="Ventilation — Initial Settings" icon="🌬️">
        <Card title={`⚙ Tidal Volume (${w} kg)`} color={C.acc}>
          <Row label="Target 6 ml/kg IBW" sub="Lung-protective range 5–8 ml/kg IBW">
            <Pill v={R(5 * w, 0)} u="ml" c={C.t3} />
            <Pill v={R(6 * w, 0)} u="ml" c={C.acc} />
            <Pill v={R(8 * w, 0)} u="ml" c={C.t3} />
          </Row>
          {neo && (
            <div style={{ fontSize: 11, color: C.orn, fontWeight: 500, marginTop: 2 }}>
              Neonate: use lower end (Vt 4–6 ml/kg ≈ {R(4 * w, 0)}–{R(6 * w, 0)} ml); volume-targeted
              ventilation preferred over pressure-limited
            </div>
          )}
          <div style={{ fontSize: 10, color: C.t4, marginTop: 4 }}>
            Use ideal body weight in obese children · titrate to EtCO₂ / blood gas
          </div>
        </Card>

        <Card title="🫁 Respiratory Rate & Timing" color={C.grn}>
          {av ? (
            <>
              <Row label={`Rate — ${band.l}`}>
                <Pill v={band.rr} u="/min" c={C.grn} />
              </Row>
              <Row label="Inspiratory time (Ti)">
                <Pill v={band.ti} u="s" c={C.acc} />
              </Row>
              <Row label="I:E ratio">
                <Pill v={band.ie} c={C.vio} />
              </Row>
            </>
          ) : (
            <div style={{ fontSize: 12, color: C.orn }}>Enter age for age-banded rate, Ti and I:E</div>
          )}
          <div style={{ marginTop: 6, overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 10, fontFamily: mono }}>
              <thead>
                <tr style={{ color: C.t3, textAlign: "left" }}>
                  <th style={{ padding: "3px 6px 3px 0", fontWeight: 700 }}>Age</th>
                  <th style={{ padding: "3px 6px", fontWeight: 700 }}>RR/min</th>
                  <th style={{ padding: "3px 6px", fontWeight: 700 }}>Ti (s)</th>
                  <th style={{ padding: "3px 0 3px 6px", fontWeight: 700 }}>I:E</th>
                </tr>
              </thead>
              <tbody>
                {BANDS.map((b) => {
                  const cur = band && b.l === band.l;
                  return (
                    <tr
                      key={b.l}
                      style={{
                        color: cur ? C.grn : C.t2,
                        fontWeight: cur ? 700 : 400,
                        background: cur ? C.grnS : "transparent",
                        borderTop: `1px solid ${C.bdr}55`,
                      }}
                    >
                      <td style={{ padding: "3px 6px 3px 0", whiteSpace: "nowrap" }}>{cur ? "▸ " : ""}{b.l}</td>
                      <td style={{ padding: "3px 6px" }}>{b.rr}</td>
                      <td style={{ padding: "3px 6px" }}>{b.ti}</td>
                      <td style={{ padding: "3px 0 3px 6px" }}>{b.ie}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>

        <Card title="📈 PEEP" color={C.vio}>
          <Row label="Start" sub="Healthy lungs — counteracts anaesthesia-induced FRC loss">
            <Pill v="5" u="cmH₂O" c={C.vio} />
          </Row>
          <Row label="Usual range" sub="Higher with recruitment/derecruitment; titrate to oxygenation">
            <Pill v="3–8" u="cmH₂O" c={C.t3} />
          </Row>
        </Card>

        <Card title="🔵 VCV (volume control)" color={C.acc}>
          <Row label="Set Vt 6 ml/kg" sub="Range 5–8 ml/kg IBW">
            <Pill v={`${R(6 * w, 0)}`} u="ml" c={C.acc} />
          </Row>
          <Row label="Monitor plateau pressure" sub="Keep Pplat ≤ 28 cmH₂O">
            <Pill v="≤28" u="cmH₂O" c={C.orn} />
          </Row>
          <Row label="Driving pressure (Pplat − PEEP)" sub="Keep ΔP ≤ 15 cmH₂O">
            <Pill v="≤15" u="cmH₂O" c={C.orn} />
          </Row>
        </Card>

        <Card title="🟣 PCV (pressure control)" color={C.pink}>
          <Row label="Start Pinsp above PEEP" sub={`Titrate to Vt ${R(6 * w, 0)}–${R(8 * w, 0)} ml (6–8 ml/kg)`}>
            <Pill v="10–15" u="cmH₂O" c={C.pink} />
          </Row>
          <Row label="Resulting PIP — healthy lungs" sub="Typically 12–20 cmH₂O total">
            <Pill v="≤20" u="cmH₂O" c={C.grn} />
          </Row>
          <Row label="Upper limit" sub="Escalate ventilation strategy rather than pressure">
            <Pill v="≤28" u="cmH₂O" c={C.orn} />
          </Row>
        </Card>

        <div style={{ fontSize: 10, color: C.t3, lineHeight: 1.6, padding: "6px 2px 0" }}>
          Starting points for healthy lungs under anaesthesia — individualise to EtCO₂, SpO₂, blood gas and
          compliance. Evidence: PEMVECC consensus (Kneyber et al., Intensive Care Med 2017 — Vt 5–8 ml/kg IBW,
          PEEP for all); PALICC-2 (2023 — Pplat ≤ 28, ΔP ≤ 15 cmH₂O); European RDS Consensus (2022/2025 —
          volume-targeted ventilation preferred in neonates); Spaeth et al., Pediatric Anesthesia 2022
          (intraoperative Vt 6–8 ml/kg IBW + PEEP).
        </div>
      </Sec>
    </div>
  );
}
