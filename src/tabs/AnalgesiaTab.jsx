import { useState } from "react";
import { R, cap } from "../utils/helpers";
import { C, sans } from "../utils/theme";
import { Sec, Drug, Warn, Tag } from "../components/UI";

/**
 * Analgesia — ward (in-hospital) and home (discharge script) prescriptions.
 * Structure follows the WHO two-step ladder and the ESPA Pain Management
 * Ladder (Vittinghoff et al., Pediatric Anesthesia 2018; Part II 2024):
 * regular simple analgesia for moderate pain, add a strong opioid for severe.
 * Doses align with the app's RCWMCH/BNFc reference set.
 */
export default function AnalgesiaTab({ w, age }) {
  const ok = w >= 1 && w <= 45,
    av = age !== null;
  const [mode, setMode] = useState("ward");

  if (!ok)
    return (
      <div style={{ padding: 40, textAlign: "center", color: C.t3 }}>Enter weight (1–45 kg)</div>
    );

  const ay = age?.totalYears ?? 0,
    aY = age?.years ?? 0,
    aM = age?.months ?? 0;
  const under3mo = av && aY === 0 && aM < 3;
  const under6mo = av && ay < 0.5;
  const under2y = av && ay < 2;
  const under12y = av && ay < 12;

  // Syrup concentrations for home scripts (SA standard preparations)
  const paraSyr = 120 / 5; // 24 mg/ml
  const ibuSyr = 100 / 5; // 20 mg/ml

  const paraMg = cap(15, w, 1000);
  const ibuMg = cap(10, w, 400);
  const dicloMg = cap(1, w, 50);

  return (
    <div>
      {/* Ward / Home toggle */}
      <div style={{ display: "flex", gap: 3, marginTop: 10 }}>
        {[["ward", "🏥 Ward Prescription"], ["home", "🏠 Home Script"]].map(([m, l]) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            style={{
              flex: 1,
              padding: "10px 8px",
              borderRadius: 8,
              border: `1px solid ${mode === m ? C.acc + "60" : C.bdr}`,
              background: mode === m ? C.accS : "transparent",
              color: mode === m ? C.acc : C.t3,
              fontSize: 12,
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

      {mode === "ward" ? (
        <>
          <Sec title="Moderate Pain — Step 1 · Simple Analgesia" icon="1️⃣">
            <Warn>
              Give regularly, not PRN — paracetamol + NSAID unless contraindicated (opioid-sparing).
              NSAID cautions: &lt;3 mo, dehydration/hypovolaemia, renal impairment, active bleeding,
              NSAID-sensitive asthma.
            </Warn>
            <Drug
              name="Paracetamol"
              rows={[
                { route: "PO", label: "Load 20mg/kg, then 15mg/kg q6h (max 1g/dose, 60mg/kg/d)", mg: R(paraMg), ml: R(paraMg / paraSyr, 1) },
                { route: "IV", label: `${w < 10 ? "7.5" : "15"}mg/kg q6h (10mg/ml)${w < 10 ? " — <10 kg dose" : ""}`, mg: R((w < 10 ? 7.5 : 15) * w), ml: R((w < 10 ? 7.5 : 15) * w / 10) },
                { route: "PR", label: "Load 30–40mg/kg, then 20mg/kg q6h", mg: `${R(30 * w)}–${R(40 * w)}` },
              ]}
              note="PO ml = syrup 120mg/5ml"
            />
            <Drug
              name="Ibuprofen"
              rows={under3mo
                ? [{ label: "<3mo CONTRAINDICATED", text: "CI", tc: C.red }]
                : [{ route: "PO", label: "10mg/kg q8h with food (max 400mg, 30mg/kg/d)", mg: R(ibuMg), ml: R(ibuMg / ibuSyr, 1) }]}
              note={under3mo ? "Not <3 months / <5 kg" : "≥3mo & >5kg · syrup 100mg/5ml"}
            />
            <Drug
              name="Diclofenac"
              rows={under6mo
                ? [{ label: "<6mo CONTRAINDICATED", text: "CI", tc: C.red }]
                : [
                    { route: "PO", label: "1mg/kg q8h (max 50mg, 3mg/kg/d)", mg: R(dicloMg) },
                    { route: "PR", label: "1mg/kg q8h — supp 12.5/25/50mg", mg: R(dicloMg) },
                  ]}
              note={under6mo ? "Not <6 months" : "Tabs 25/50mg · avoid IM (painful, sterile abscess risk)"}
            />
            <Drug
              name="Ketorolac"
              conc="10mg/ml"
              rows={under3mo
                ? [{ label: "<3mo CONTRAINDICATED", text: "CI", tc: C.red }]
                : [{ route: "IV", label: "0.5mg/kg q6–8h (max 30mg, 48–72h only)", mg: R(cap(0.5, w, 30)), ml: R(cap(0.5, w, 30) / 10) }]}
              note={under3mo ? "Contraindicated <3 months" : undefined}
            />
            <Drug
              name="Metamizole"
              conc="500mg/ml"
              rows={av && (aY > 0 || aM >= 3) && w >= 5
                ? [{ route: "IV", label: "≥3mo ≥5kg: 15mg/kg q6h", mg: R(15 * w), ml: R((15 * w) / 500) }]
                : [{ route: "IV", label: "<3mo/<5kg: 12.5mg/kg q6h", mg: R(12.5 * w), ml: R((12.5 * w) / 500) }]}
            />
            <Drug
              name="Celecoxib (COX-2)"
              rows={under2y
                ? [{ label: "<2yr — no evidence, not recommended", text: "CI", tc: C.red }]
                : [
                    { route: "PO", label: w > 25 ? ">25kg: 100mg q12h (licensed, JIA)" : "10–25kg: 50mg q12h (licensed, JIA)", text: w > 25 ? "100mg" : "50mg", tc: C.acc },
                    { route: "PO", label: "Peri-op (off-label RCT): 6mg/kg load, then 3mg/kg q12h", mg: `${R(6 * w)} → ${R(3 * w)}` },
                  ]}
              note="COX-2 consensus: ≥2yr only; use where platelet/GI concern limits standard NSAIDs (e.g. bleeding risk) — no advantage otherwise"
            />
          </Sec>

          <Sec title="Severe Pain — Step 2 · Add Strong Opioid" icon="2️⃣">
            <Warn>
              Continue Step 1 alongside. Titrate to pain score; monitor sedation, RR and SpO₂. Major
              surgery: morphine PCA/NCA per unit protocol.
            </Warn>
            <Drug
              name="Morphine"
              conc="1mg/ml"
              rows={[
                { route: "IV", label: "0.05–0.1mg/kg slow, titrate q10–15min", mg: `${R(0.05 * w)}–${R(0.1 * w)}`, ml: `${R(0.05 * w)}–${R(0.1 * w)}` },
                { route: "PO", label: "IR 0.2–0.3mg/kg q4h", mg: `${R(0.2 * w)}–${R(0.3 * w)}` },
                { route: "IM", label: "0.1–0.2mg/kg q4h — only if no IV access", mg: `${R(0.1 * w)}–${R(0.2 * w)}` },
              ]}
              note="Prefer IV/PO — IM is painful with erratic absorption"
            />
            <Drug
              name="Oxycodone"
              rows={[{ route: "PO", label: "IR 0.1–0.2mg/kg q4–6h (max 10mg/dose)", mg: `${R(cap(0.1, w, 10))}–${R(cap(0.2, w, 10))}` }]}
            />
            <Drug
              name="Tramadol"
              conc="50mg/ml"
              rows={[
                { route: "IV", label: "1–2mg/kg q6h (max 8mg/kg/d, 400mg/d)", mg: `${R(w)}–${R(2 * w)}`, ml: `${R(w / 50)}–${R((2 * w) / 50)}` },
                { route: "PO", label: "1–2mg/kg q6h", mg: `${R(w)}–${R(2 * w)}` },
                ...(under12y ? [{ label: "FDA: avoid <12yr (CYP2D6 ultra-metaboliser risk)", text: "⚠", tc: C.orn }] : []),
              ]}
              note={under12y ? "ESPA permits in-hospital use with monitoring; FDA advises against <12yr" : undefined}
            />
          </Sec>

          <Sec title="Adjuncts" icon="➕">
            <Drug
              name="Clonidine"
              conc="150µg/ml"
              rows={[
                { route: "PO", label: "Premed 3–4µg/kg (90min pre-op)", mg: `${R(3 * w)}–${R(4 * w)}`, ml: `${R((3 * w) / 150)}–${R((4 * w) / 150)}`, unit: "µg" },
                { route: "IV", label: "IV / caudal 1–2µg/kg", mg: `${R(w)}–${R(2 * w)}`, ml: `${R(w / 150)}–${R((2 * w) / 150)}`, unit: "µg" },
              ]}
            />
            <Drug name="Gabapentin" rows={[{ route: "PO", label: "3–10mg/kg q8h", mg: `${R(3 * w)}–${R(10 * w)}` }]} />
            <Drug name="Dexamethasone" conc="5mg/ml" rows={[{ route: "IV", label: "0.15mg/kg (analgesic + anti-emetic)", mg: R(0.15 * w), ml: R((0.15 * w) / 5) }]} />
          </Sec>

          <Sec title="Anti-emetics" icon="🤢">
            <Drug name="Ondansetron" conc="2mg/ml" rows={[{ route: "IV", label: "0.15mg/kg q8h (max 4mg)", mg: R(cap(0.15, w, 4)), ml: R(cap(0.15, w, 4) / 2) }]} />
          </Sec>
        </>
      ) : (
        <>
          <div style={{ marginTop: 10 }}>
            <Warn>
              Never at home: codeine — contraindicated &lt;12yr and any age post-tonsillectomy (FDA
              boxed warning) · tramadol &lt;12yr (FDA) · no routine home opioids in young children.
            </Warn>
          </div>
          <Sec title="Regular — Moderate Pain (3–5 days)" icon="📅">
            <Warn>
              Prescribe regularly (by the clock) for the first 48–72h, then wean to PRN. Written doses
              in ml for the carer.
            </Warn>
            <Drug
              name="Paracetamol syrup"
              conc="120mg/5ml"
              rows={[{ route: "PO", label: "15mg/kg q6h (max 4 doses/d)", mg: R(paraMg), ml: R(paraMg / paraSyr, 1) }]}
              note="Warn carers: max 4 doses in 24h — check other products for hidden paracetamol"
            />
            <Drug
              name="Ibuprofen syrup"
              conc="100mg/5ml"
              rows={under3mo
                ? [{ label: "<3mo CONTRAINDICATED", text: "CI", tc: C.red }]
                : [{ route: "PO", label: "10mg/kg q8h with food", mg: R(ibuMg), ml: R(ibuMg / ibuSyr, 1) }]}
              note={under3mo ? "Not <3 months / <5 kg" : "Offset with paracetamol (alternate ~3-hourly) for steady cover"}
            />
            <Drug
              name="Diclofenac"
              rows={under6mo
                ? [{ label: "<6mo CONTRAINDICATED", text: "CI", tc: C.red }]
                : [
                    { route: "PO", label: "1mg/kg q8h (max 50mg) — tabs 25/50mg", mg: R(dicloMg) },
                    { route: "PR", label: "1mg/kg q8h — supp 12.5/25/50mg", mg: R(dicloMg) },
                  ]}
              note={under6mo ? "Not <6 months" : "Alternative to ibuprofen — do not combine two NSAIDs"}
            />
          </Sec>
          <Sec title="Breakthrough — Step-up" icon="⚡">
            {under12y ? (
              <Warn>
                &lt;12yr: no safe routine home opioid — persisting severe pain needs review, not a
                stronger script. Optimise regular paracetamol + NSAID timing first.
              </Warn>
            ) : (
              <Drug
                name="Tramadol (≥12yr)"
                rows={[{ route: "PO", label: "1–2mg/kg q6h PRN (max 100mg/dose)", mg: `${R(cap(1, w, 100))}–${R(cap(2, w, 100))}` }]}
                note="Short supply only (2–3 days) · warn re drowsiness"
              />
            )}
            <div style={{ background: C.s1, borderRadius: 8, border: `1px solid ${C.bdr}`, padding: "8px 10px", marginTop: 3 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                <Tag c={C.red}>Return / review if</Tag>
                <span style={{ fontSize: 12, color: C.t2, lineHeight: 1.5 }}>
                  severe pain despite regular doses · pain worsening after day 3 · vomiting, fever, wound
                  concerns · child not drinking
                </span>
              </div>
            </div>
          </Sec>
        </>
      )}

      <div style={{ fontSize: 10, color: C.t3, lineHeight: 1.6, padding: "8px 2px 0" }}>
        Ladder & framing: WHO two-step (2012); ESPA Pain Management Ladder (Vittinghoff et al., Pediatric
        Anesthesia 2018; Part II 2024). Age limits: FDA safety communications (codeine/tramadol),
        FDA celecoxib labelling (≥2yr, JIA). Doses align with RCWMCH/BNFc reference set.
      </div>
    </div>
  );
}
