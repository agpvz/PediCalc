import { useState } from "react";
import { R } from "../utils/helpers";
import { C, mono } from "../utils/theme";
import { Pill, Badge, Inp, Sec, Warn, Drug } from "../components/UI";

export default function TIVATab({ w, age }) {
  const ok = w >= 1 && w <= 45,
    av = age !== null,
    ay = age?.totalYears ?? 0;
  const [stT, setStT] = useState("12:00"),
    [mcT, setMcT] = useState("12:00");
  const [rC, setRC] = useState(2),
    [rV, setRV] = useState(40),
    [rR, setRR2] = useState(0.1);

  if (!ok)
    return (
      <div style={{ padding: 40, textAlign: "center", color: C.t3 }}>Enter weight (1–45 kg)</div>
    );

  const eleveldOk = av && ay >= 0.5 && w >= 0.68;
  const eleveldAge = Math.max(ay, 0.5);
  const ce50 = eleveldOk ? R(3.08 * Math.pow(35 / eleveldAge, 0.146), 1) : null;
  const ce50Lo = ce50 ? R(ce50 * 0.85, 1) : null;
  const ce50Hi = ce50 ? R(ce50 * 1.4, 1) : null;

  const katOk = av && ay >= 3 && ay <= 16 && w >= 15 && w <= 61;
  const paedOk = av && ay >= 1 && ay <= 16 && w >= 5 && w <= 61;
  const mintOk = av && ay >= 12 && w >= 30;

  const sR = { "<3mo": [25, 20, 15, 10, 5, 2.5], "3-6mo": [20, 15, 10, 5, 5, 2.5], "6-12mo": [15, 10, 5, 5, 5, 2.5], "1-3yr": [12, 9, 6, 6, 6, 6] };
  const sP = ["0–10", "10–20", "20–30", "30–40", "40–100", ">100"];
  const sW = { "<3mo": "25.7±3.7 (18–31)", "3-6mo": "26.3±3.7 (19–31)", "6-12mo": "19.4±3.6 (15–25)", "1-3yr": "11.2±2.1 (7–13)" };
  let sK = null;
  if (av && ay < 3) {
    sK = ay < 3 / 12 ? "<3mo" : ay < 6 / 12 ? "3-6mo" : ay < 1 ? "6-12mo" : "1-3yr";
  }

  const mcR2 = [15, 13, 11, 10, 9],
    mcP = ["0–15", "15–30", "30–60", "60–120", "120–240"];
  const rMl = rC > 0 && rV > 0 ? R((rR * w * 60) / ((rC * 1000) / rV)) : 0;

  return (
    <div>
      <Sec title="TCI Model Eligibility" icon="🎯">
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
          {[
            ["Eleveld", eleveldOk, "≥6mo 0.68–160kg"],
            ["Kataria", katOk, "3–16yr 15–61kg"],
            ["Paedfusor", paedOk, "1–16yr 5–61kg"],
            ["Minto (Remi)", mintOk, "≥12yr ≥30kg"],
          ].map(([n, o, r]) => (
            <div
              key={n}
              style={{
                padding: "5px 10px",
                borderRadius: 7,
                background: o ? C.grnS : C.redS,
                color: o ? C.grn : C.red,
                fontSize: 11,
                fontWeight: 700,
              }}
            >
              {o ? "✓" : "✗"} {n}{" "}
              <span style={{ fontSize: 9, opacity: 0.7 }}>{r}</span>
            </div>
          ))}
        </div>
      </Sec>

      <Sec title="Eleveld Model — Age-adjusted Ce50" icon="🧠">
        {eleveldOk ? (
          <div style={{ background: C.s1, borderRadius: 8, border: `1px solid ${C.bdr}`, padding: 12 }}>
            <div style={{ fontSize: 11, color: C.t2, marginBottom: 8 }}>
              Universal PK-PD model (Eleveld 2018). Ce50 corresponds to BIS 47 (50% maximal effect).
              Validated in children, adults, elderly, and obese patients. Clinical target: 85–140% of
              Ce50 for BIS 40–60 (Vellinga 2021).
            </div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>
              <Badge l="Ce50 (BIS 47)" v={`${ce50}`} c={C.acc} />
              <Badge l="Light ~85%" v={`${ce50Lo}`} c={C.grn} />
              <Badge l="Deep ~140%" v={`${ce50Hi}`} c={C.orn} />
            </div>
            <div style={{ fontSize: 10, color: C.t3, lineHeight: 1.5 }}>
              Ce50 = 3.08 × (35/age)^0.146 µg/ml — higher in young children, lower with age.
              {av && ay < 1 && " ⚠ PMA-based maturation applies for infants — consider using with caution under 1 year."}
            </div>
            <div style={{ marginTop: 8, fontSize: 11, fontWeight: 700, color: C.t2 }}>
              Propofol dosing guidance (product label)
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "auto 1fr 1fr", gap: "2px 8px", fontSize: 11, marginTop: 4 }}>
              <span style={{ fontWeight: 700, color: C.t3 }}>Phase</span>
              <span style={{ fontWeight: 700, color: C.t3 }}>Rate</span>
              <span style={{ fontWeight: 700, color: C.t3 }}>For {w}kg</span>
              <span style={{ color: C.t2 }}>Induction</span>
              <span style={{ color: C.acc, fontFamily: mono }}>2.5–3.5 mg/kg</span>
              <span style={{ color: C.grn, fontFamily: mono, fontWeight: 700 }}>{R(2.5 * w)}–{R(3.5 * w)} mg</span>
              <span style={{ color: C.t2 }}>Maint 0–30′</span>
              <span style={{ color: C.acc, fontFamily: mono }}>12–18 mg/kg/hr</span>
              <span style={{ color: C.grn, fontFamily: mono, fontWeight: 700 }}>{R((12 * w) / 10)}–{R((18 * w) / 10)} ml/hr</span>
              <span style={{ color: C.t2 }}>Maint &gt;30′</span>
              <span style={{ color: C.acc, fontFamily: mono }}>7.5–9 mg/kg/hr</span>
              <span style={{ color: C.grn, fontFamily: mono, fontWeight: 700 }}>{R((7.5 * w) / 10)}–{R((9 * w) / 10)} ml/hr</span>
            </div>
            <div style={{ marginTop: 6, fontSize: 9, color: C.t4 }}>
              Ref: Eleveld DJ et al. Br J Anaesth 2018;120:942-959. Vellinga R et al. Br J Anaesth 2021;126:386-94.
            </div>
          </div>
        ) : (
          <Warn>Age ≥6 months and weight ≥0.68 kg required for Eleveld model</Warn>
        )}
      </Sec>

      {sK && (
        <Sec title={`Steur Manual (<3yr) — ${sK}`} icon="⏱">
          <div style={{ background: C.s1, borderRadius: 8, border: `1px solid ${C.bdr}`, padding: 10 }}>
            <Inp label="Start" value={stT} onChange={setStT} type="time" />
            <div style={{ marginTop: 4, fontSize: 11, color: C.t2 }}>
              Bolus 3–5mg/kg: <Pill v={`${R(3 * w)}–${R(5 * w)}`} u="mg" /> ={" "}
              <Pill v={`${R((3 * w) / 10)}–${R((5 * w) / 10)}`} u="ml" c={C.grn} />
            </div>
            <div style={{ marginTop: 6, display: "grid", gridTemplateColumns: "auto 1fr 1fr", gap: "1px 6px", fontSize: 11 }}>
              <span style={{ fontWeight: 700, color: C.t3 }}>min</span>
              <span style={{ fontWeight: 700, color: C.t3 }}>mg/kg/hr</span>
              <span style={{ fontWeight: 700, color: C.t3 }}>ml/hr</span>
              {sP.map((p, i) => [
                <span key={`a${i}`} style={{ color: C.t2 }}>{p}</span>,
                <span key={`b${i}`} style={{ color: C.acc, fontFamily: mono, fontWeight: 700 }}>{sR[sK][i]}</span>,
                <span key={`c${i}`} style={{ color: C.grn, fontFamily: mono, fontWeight: 700 }}>{R((sR[sK][i] * w) / 10)}</span>,
              ])}
            </div>
            <div style={{ marginTop: 4, fontSize: 10, color: C.t3 }}>Wake-up: {sW[sK]} min</div>
          </div>
        </Sec>
      )}

      {av && ay >= 3 && ay <= 11 && (
        <Sec title="McFarlan Manual (3–11yr)" icon="⏱">
          <div style={{ background: C.s1, borderRadius: 8, border: `1px solid ${C.bdr}`, padding: 10 }}>
            <Inp label="Start" value={mcT} onChange={setMcT} type="time" />
            <div style={{ marginTop: 4, fontSize: 11, color: C.t2 }}>
              Bolus 2.5mg/kg: <Pill v={R(2.5 * w)} u="mg" /> ={" "}
              <Pill v={R((2.5 * w) / 10)} u="ml" c={C.grn} />
            </div>
            <div style={{ marginTop: 6, display: "grid", gridTemplateColumns: "auto 1fr 1fr", gap: "1px 6px", fontSize: 11 }}>
              <span style={{ fontWeight: 700, color: C.t3 }}>min</span>
              <span style={{ fontWeight: 700, color: C.t3 }}>mg/kg/hr</span>
              <span style={{ fontWeight: 700, color: C.t3 }}>ml/hr</span>
              {mcP.map((p, i) => [
                <span key={`a${i}`} style={{ color: C.t2 }}>{p}</span>,
                <span key={`b${i}`} style={{ color: C.acc, fontFamily: mono, fontWeight: 700 }}>{mcR2[i]}</span>,
                <span key={`c${i}`} style={{ color: C.grn, fontFamily: mono, fontWeight: 700 }}>{R((mcR2[i] * w) / 10)}</span>,
              ])}
            </div>
            <div style={{ marginTop: 4, fontSize: 10, color: C.t3 }}>
              CS t½: 7min(30′), 11min(1h), 20min(4h) — targets ~3.0µg/ml
            </div>
          </div>
        </Sec>
      )}

      <Sec title="Remifentanil Manual Infusion" icon="💉">
        <div style={{ background: C.s1, borderRadius: 8, border: `1px solid ${C.bdr}`, padding: 10 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 4 }}>
            <Inp label="mg" value={rC} onChange={setRC} min={0.1} max={10} step={0.1} />
            <Inp label="in ml" value={rV} onChange={setRV} min={10} max={100} step={5} />
            <Inp label="Rate" value={rR} onChange={setRR2} min={0.01} max={2} step={0.01} unit="µg/kg/min" />
          </div>
          <div style={{ display: "flex", gap: 5, marginTop: 6 }}>
            <Pill v={rMl} u="ml/hr" c={C.grn} />
          </div>
        </div>
      </Sec>

      <Sec title="Ketamine TIVA (RCWMCH)" icon="🔬" defaultOpen={false}>
        <div style={{ background: C.s1, borderRadius: 8, border: `1px solid ${C.bdr}`, padding: 10 }}>
          <div style={{ fontSize: 11, color: C.t2, marginBottom: 6 }}>
            200mg in 50ml N/Saline = 4mg/ml (consider 8mg/ml for bigger kids / longer cases)
          </div>
          <div style={{ fontSize: 11, color: C.t2, marginBottom: 8 }}>
            Induction 1–2mg/kg: <Pill v={`${R(w)}–${R(2 * w)}`} u="mg" /> ={" "}
            <Pill v={`${R(w / 4)}–${R((2 * w) / 4)}`} u="ml" c={C.grn} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "auto 1fr 1fr", gap: "2px 8px", fontSize: 11 }}>
            <span style={{ fontWeight: 700, color: C.t3 }}>Phase</span>
            <span style={{ fontWeight: 700, color: C.t3 }}>mg/kg/hr</span>
            <span style={{ fontWeight: 700, color: C.t3 }}>ml/hr (4mg/ml)</span>
            <span style={{ color: C.t2 }}>0–20 min</span>
            <span style={{ color: C.acc, fontFamily: mono }}>12</span>
            <span style={{ color: C.grn, fontFamily: mono, fontWeight: 700 }}>{R((12 * w) / 4)}</span>
            <span style={{ color: C.t2 }}>20–40 min</span>
            <span style={{ color: C.acc, fontFamily: mono }}>8</span>
            <span style={{ color: C.grn, fontFamily: mono, fontWeight: 700 }}>{R((8 * w) / 4)}</span>
            <span style={{ color: C.t2 }}>&gt;40 min</span>
            <span style={{ color: C.acc, fontFamily: mono }}>4</span>
            <span style={{ color: C.grn, fontFamily: mono, fontWeight: 700 }}>{R((4 * w) / 4)}</span>
          </div>
        </div>
      </Sec>

      <Sec title="TIVA Dosing Guide" icon="📋">
        <div style={{ background: C.s1, borderRadius: 8, border: `1px solid ${C.bdr}`, padding: 8, overflowX: "auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr 1fr 1fr", gap: "1px 4px", fontSize: 10, minWidth: 300 }}>
            <span style={{ fontWeight: 700, color: C.t3 }}>Context</span>
            <span style={{ fontWeight: 700, color: C.t3 }}>Prop TCI</span>
            <span style={{ fontWeight: 700, color: C.t3 }}>Remi TCI</span>
            <span style={{ fontWeight: 700, color: C.t3 }}>Remi man</span>
            {[
              ["Minor spont", "2.5–4", "1–2", "0.05–0.2"],
              ["Minor PPV", "2.5–4", "2–4", "0.2–0.3"],
              ["Major PPV", "3–5", "3–6", "0.3–0.5"],
              ["Skin closure", "2", "1.5–2.5", "0.1–0.2"],
            ].map(([a, b, c2, d], i) => [
              <span key={`a${i}`} style={{ color: C.t1, fontWeight: 600 }}>{a}</span>,
              <span key={`b${i}`} style={{ color: C.acc }}>{b}</span>,
              <span key={`c${i}`} style={{ color: C.vio }}>{c2}</span>,
              <span key={`d${i}`} style={{ color: C.orn }}>{d}</span>,
            ])}
          </div>
        </div>
      </Sec>
    </div>
  );
}
