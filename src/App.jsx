import { useState, useMemo, useEffect } from "react";
import { calcAge, ageStr, ageCat } from "./utils/helpers";
import { estWeight, weightImplausible } from "./utils/estimate";
import { DRUG_INDEX } from "./utils/drugIndex";
import { C, sans } from "./utils/theme";
import { Inp, Sel, Tag } from "./components/UI";
import VitalSigns from "./components/VitalSigns";
import StdTab from "./tabs/StdTab";
import InductionTab from "./tabs/InductionTab";
import AnalgesiaTab from "./tabs/AnalgesiaTab";
import FluidsTab from "./tabs/FluidsTab";
import EmergencyTab from "./tabs/EmergencyTab";
import RegionalTab from "./tabs/RegionalTab";
import AirwayTab from "./tabs/AirwayTab";
import AddTab from "./tabs/AddTab";
import InoTab from "./tabs/InoTab";
import TransTab from "./tabs/TransTab";
import TIVATab from "./tabs/TIVATab";

const LS_KEY = "pedicalc.patient.v1";
function loadStored() {
  try {
    return JSON.parse(localStorage.getItem(LS_KEY)) || {};
  } catch {
    return {};
  }
}
const stored = loadStored();

const Err = ({ children }) => (
  <div style={{ fontSize: 11, color: C.red, fontWeight: 600, marginTop: 4, lineHeight: 1.4 }}>
    ⚠ {children}
  </div>
);

export default function App() {
  const [tab, setTab] = useState("standard");
  const [weight, setWeight] = useState(stored.weight ?? "");
  const [height, setHeight] = useState(stored.height ?? "");
  const [dob, setDob] = useState(stored.dob ?? "");
  const [sex, setSex] = useState(stored.sex ?? "");
  const [am, setAm] = useState(stored.am ?? "dob");
  const [mY, setMY] = useState(stored.mY ?? "");
  const [mM, setMM] = useState(stored.mM ?? "");
  const [mD, setMD] = useState(stored.mD ?? "");
  const [collapsed, setCollapsed] = useState(false);
  const [q, setQ] = useState("");

  const aD = useMemo(() => calcAge(dob), [dob]);
  const aMan = useMemo(() => {
    const y = typeof mY === "number" ? mY : 0,
      m = typeof mM === "number" ? mM : 0,
      d = typeof mD === "number" ? mD : 0;
    if (y === 0 && m === 0 && d === 0 && mY === "" && mM === "" && mD === "") return null;
    const t = y + m / 12 + d / 365.25;
    if (t > 18) return null;
    return { years: y, months: m, days: d, totalYears: t };
  }, [mY, mM, mD]);

  const age = am === "dob" ? (aD && aD.totalYears <= 18 ? aD : null) : aMan;
  const w = typeof weight === "number" ? weight : 0;
  const ht = typeof height === "number" ? height : 0;
  const wOk = w >= 1 && w <= 45,
    aOk = age !== null;
  const estW = estWeight(age);
  const wFlag = wOk && aOk && weightImplausible(w, age);

  // Persist patient inputs so an accidental refresh doesn't lose the case
  useEffect(() => {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify({ weight, height, dob, sex, am, mY, mM, mD }));
    } catch {
      /* storage unavailable — non-fatal */
    }
  }, [weight, height, dob, sex, am, mY, mM, mD]);

  const newPatient = () => {
    setWeight("");
    setHeight("");
    setDob("");
    setSex("");
    setAm("dob");
    setMY("");
    setMM("");
    setMD("");
    setCollapsed(false);
    setQ("");
    try {
      localStorage.removeItem(LS_KEY);
    } catch {
      /* ignore */
    }
  };

  const tabs = [
    { id: "standard", l: "Standard", i: "💊" },
    { id: "induction", l: "Induction", i: "😴" },
    { id: "analgesia", l: "Analgesia", i: "🩹" },
    { id: "emergency", l: "Emergency", i: "🚨" },
    { id: "fluids", l: "Fluids", i: "💧" },
    { id: "regional", l: "Regional", i: "💉" },
    { id: "airway", l: "Airway & Lines", i: "🫁" },
    { id: "inotropy", l: "Inotropes", i: "❤️" },
    { id: "transfusion", l: "Transfusion", i: "🩸" },
    { id: "tiva", l: "TIVA", i: "🎯" },
    { id: "addendum", l: "Abx & Misc", i: "🦠" },
  ];
  const tabLbl = Object.fromEntries(tabs.map((t) => [t.id, t.l]));

  const results = q.trim()
    ? DRUG_INDEX.filter((d) => d.n.toLowerCase().includes(q.trim().toLowerCase()))
    : [];

  // Inline validation messages — never fail silently
  const wMsg =
    weight !== "" && !wOk
      ? w > 45
        ? "PediCalc covers 1–45 kg — use adult dosing above 45 kg"
        : "Weight must be 1–45 kg"
      : null;
  const hMsg = height !== "" && !(ht >= 20 && ht <= 150) ? "Height must be 20–150 cm" : null;
  const aMsg =
    am === "dob"
      ? dob && !aD
        ? "Check date of birth — it must be in the past"
        : aD && aD.totalYears > 18
          ? "Age over 18 yr — paediatric calculations not applicable"
          : null
      : (mY !== "" || mM !== "" || mD !== "") && !aMan
        ? "Age over 18 yr — paediatric calculations not applicable"
        : null;

  return (
    <div
      style={{
        minHeight: "100%",
        background: C.bg,
        color: C.t1,
        fontFamily: sans,
        maxWidth: 640,
        margin: "0 auto",
        width: "100%",
        WebkitFontSmoothing: "antialiased",
      }}
    >
      <link
        href="https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700;9..40,800&family=JetBrains+Mono:wght@400;500;700&display=swap"
        rel="stylesheet"
      />
      <style>{`html,body{margin:0;padding:0;overflow-x:hidden;overscroll-behavior:none;background:${C.bg};-webkit-overflow-scrolling:touch;position:fixed;width:100%;height:100%}#root{width:100%;height:100%;overflow-y:auto;overflow-x:hidden;-webkit-overflow-scrolling:touch}*{box-sizing:border-box;-webkit-tap-highlight-color:transparent}input[type=number]::-webkit-inner-spin-button,input[type=number]::-webkit-outer-spin-button{opacity:1}::selection{background:${C.acc}40;color:#fff}::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:${C.bdr};border-radius:4px}`}</style>

      {collapsed && wOk && aOk ? (
        /* Compact patient context bar — stays pinned so every dose on screen is tied to the patient */
        <div
          style={{
            position: "sticky",
            top: 0,
            zIndex: 100,
            background: `${C.s1}f5`,
            borderBottom: `1px solid ${C.bdr}`,
            padding: "10px 14px",
            display: "flex",
            alignItems: "center",
            gap: 8,
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
          }}
        >
          <button
            onClick={() => setCollapsed(false)}
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              gap: 8,
              background: "transparent",
              border: "none",
              cursor: "pointer",
              padding: 0,
              textAlign: "left",
              fontFamily: sans,
              minHeight: 34,
            }}
          >
            <span style={{ fontSize: 15 }}>🏥</span>
            <span style={{ fontSize: 14, fontWeight: 800, color: C.t1, lineHeight: 1.3 }}>
              {w} kg · {ageStr(age)} · {ageCat(age)}
              {sex === "1" ? " · ♂" : sex === "2" ? " · ♀" : ""}
              {wFlag && <span style={{ color: C.orn }}> · ⚠</span>}
            </span>
          </button>
          <button
            onClick={() => setCollapsed(false)}
            style={{
              padding: "8px 12px",
              borderRadius: 8,
              border: `1px solid ${C.bdr}`,
              background: C.s2,
              color: C.acc,
              fontSize: 12,
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: sans,
            }}
          >
            ✎ Edit
          </button>
          <button
            onClick={newPatient}
            style={{
              padding: "8px 12px",
              borderRadius: 8,
              border: `1px solid ${C.bdr}`,
              background: C.s2,
              color: C.t2,
              fontSize: 12,
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: sans,
            }}
          >
            ＋ New
          </button>
        </div>
      ) : (
        /* Full patient input zone — visually distinct "what I tell it" area */
        <div
          style={{
            background: C.s1,
            borderBottom: `1px solid ${C.bdr}`,
            padding: "16px 14px 12px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 10,
                background: "linear-gradient(135deg,#58a6ff 0%,#bc8cff 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 17,
                flexShrink: 0,
                boxShadow: "0 2px 12px rgba(88,166,255,0.25)",
              }}
            >
              🏥
            </div>
            <div style={{ flex: 1 }}>
              <h1 style={{ margin: 0, fontSize: 16, fontWeight: 800, letterSpacing: "-0.02em", color: C.t1, lineHeight: 1.2 }}>
                <span style={{ color: C.acc }}>Pedi</span>
                <span style={{ color: C.t1 }}>Calc</span>
              </h1>
              <p style={{ margin: 0, fontSize: 10, color: C.t3, fontWeight: 500 }}>
                Paediatric Anaesthesia & Resuscitation Calculator
              </p>
            </div>
            {(weight !== "" || dob !== "" || mY !== "" || mM !== "" || mD !== "") && (
              <button
                onClick={newPatient}
                style={{
                  padding: "8px 12px",
                  borderRadius: 8,
                  border: `1px solid ${C.bdr}`,
                  background: C.s2,
                  color: C.t2,
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: "pointer",
                  fontFamily: sans,
                }}
              >
                ＋ New
              </button>
            )}
          </div>

          <div
            style={{
              fontSize: 10,
              fontWeight: 800,
              color: C.acc,
              textTransform: "uppercase",
              letterSpacing: ".08em",
              marginBottom: 6,
            }}
          >
            Patient
          </div>

          {/* Inputs */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6, marginBottom: 8 }}>
            <Inp label="Weight" value={weight} onChange={setWeight} placeholder="1–45" unit="kg" min={1} max={45} step={0.1} />
            <Inp label="Height" value={height} onChange={setHeight} placeholder="20–150" unit="cm" min={20} max={150} step={0.5} />
            <Sel label="Sex" value={sex} onChange={setSex} options={[{ v: "", l: "—" }, { v: "1", l: "♂ Male" }, { v: "2", l: "♀ Female" }]} />
          </div>
          {wMsg && <Err>{wMsg}</Err>}
          {hMsg && <Err>{hMsg}</Err>}

          {/* Age mode */}
          <div style={{ display: "flex", gap: 3, marginBottom: 6, marginTop: 8 }}>
            {[["dob", "📅 Date of Birth"], ["manual", "✏️ Enter Age"]].map(([m, l2]) => (
              <button
                key={m}
                onClick={() => setAm(m)}
                style={{
                  flex: 1,
                  padding: "9px 8px",
                  borderRadius: 7,
                  border: `1px solid ${am === m ? C.acc + "60" : C.bdr}`,
                  background: am === m ? C.accS : "transparent",
                  color: am === m ? C.acc : C.t3,
                  fontSize: 11,
                  fontWeight: 700,
                  cursor: "pointer",
                  fontFamily: sans,
                  transition: "all 0.15s",
                  WebkitTapHighlightColor: "transparent",
                }}
              >
                {l2}
              </button>
            ))}
          </div>
          {am === "dob" ? (
            <Inp label="Date of Birth" value={dob} onChange={setDob} type="date" />
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 4 }}>
              <Inp label="Years" value={mY} onChange={setMY} placeholder="0–12" unit="yr" min={0} max={12} step={1} />
              <Inp label="Months" value={mM} onChange={setMM} placeholder="0–11" unit="mo" min={0} max={11} step={1} />
              <Inp label="Days" value={mD} onChange={setMD} placeholder="0–30" unit="d" min={0} max={30} step={1} />
            </div>
          )}
          {aMsg && <Err>{aMsg}</Err>}

          {/* Weight estimation for the unknown-weight child */}
          {aOk && !wOk && estW && (
            <button
              onClick={() => setWeight(estW)}
              style={{
                width: "100%",
                marginTop: 8,
                padding: "10px 12px",
                borderRadius: 8,
                border: `1px dashed ${C.orn}80`,
                background: C.ornS,
                color: C.orn,
                fontSize: 12,
                fontWeight: 700,
                cursor: "pointer",
                fontFamily: sans,
                textAlign: "left",
                lineHeight: 1.4,
              }}
            >
              ≈ Weight unknown? Use APLS estimate: {estW} kg
              <div style={{ fontSize: 10, fontWeight: 500, opacity: 0.85 }}>
                Estimate from age — replace with measured weight as soon as known
              </div>
            </button>
          )}

          {/* Status pills */}
          <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginTop: 8 }}>
            <Tag c={wOk ? C.grn : C.red}>{wOk ? `${w} kg ✓` : "Weight ✗"}</Tag>
            <Tag c={aOk ? C.acc : C.red}>{aOk ? `${ageStr(age)} ✓` : "Age ✗"}</Tag>
            {aOk && <Tag c={C.vio}>{ageCat(age)}</Tag>}
            {sex === "1" && <Tag c={C.grn}>♂ Male</Tag>}
            {sex === "2" && <Tag c={C.pink}>♀ Female</Tag>}
            {wFlag && <Tag c={C.orn}>⚠ {w} kg unusual for {ageStr(age)} — confirm</Tag>}
          </div>

          {wOk && aOk && (
            <button
              onClick={() => setCollapsed(true)}
              style={{
                width: "100%",
                marginTop: 10,
                padding: "12px",
                borderRadius: 9,
                border: "none",
                background: `linear-gradient(135deg,${C.acc},${C.vio})`,
                color: "#fff",
                fontSize: 14,
                fontWeight: 800,
                cursor: "pointer",
                fontFamily: sans,
                boxShadow: "0 2px 10px rgba(88,166,255,0.28)",
              }}
            >
              ✓ Done — show doses
            </button>
          )}
        </div>
      )}

      {/* Search + navigation */}
      <div style={{ padding: "10px 14px 0" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            background: C.s2,
            borderRadius: 9,
            border: `1px solid ${C.bdr}`,
            padding: "8px 12px",
            marginBottom: 8,
          }}
        >
          <span style={{ fontSize: 13, opacity: 0.7 }}>🔍</span>
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search drug…"
            style={{
              flex: 1,
              background: "transparent",
              border: "none",
              outline: "none",
              color: C.t1,
              fontSize: 16,
              fontFamily: sans,
              fontWeight: 500,
            }}
          />
          {q && (
            <button
              onClick={() => setQ("")}
              style={{ background: "transparent", border: "none", color: C.t3, fontSize: 14, cursor: "pointer", padding: "2px 4px" }}
            >
              ✕
            </button>
          )}
        </div>

        {q.trim() ? (
          <div style={{ paddingBottom: 60 }}>
            {results.length === 0 && (
              <div style={{ padding: 24, textAlign: "center", color: C.t3, fontSize: 13 }}>
                No drugs match “{q.trim()}”
              </div>
            )}
            {results.map((r) => (
              <button
                key={r.n}
                onClick={() => {
                  setTab(r.t);
                  setQ("");
                  if (wOk && aOk) setCollapsed(true);
                }}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 8,
                  background: C.s1,
                  border: `1px solid ${C.bdr}`,
                  borderRadius: 9,
                  padding: "12px 14px",
                  marginBottom: 4,
                  cursor: "pointer",
                  fontFamily: sans,
                  textAlign: "left",
                }}
              >
                <span style={{ fontSize: 14, fontWeight: 700, color: C.t1 }}>{r.n}</span>
                <Tag c={C.acc}>{tabLbl[r.t]}</Tag>
              </button>
            ))}
          </div>
        ) : (
          <>
            {/* Tiles — 3-column grid so all fit with full labels on phones */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 4, background: C.bg, borderRadius: 12 }}>
              {tabs.map((t) => {
                const active = tab === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => {
                      setTab(t.id);
                      if (wOk && aOk) setCollapsed(true);
                    }}
                    style={{
                      padding: "8px 4px",
                      borderRadius: 9,
                      border: `1px solid ${active ? "transparent" : C.bdr}`,
                      cursor: "pointer",
                      background: active ? `linear-gradient(135deg,${C.acc},${C.vio})` : C.s1,
                      color: active ? "#fff" : C.t2,
                      fontSize: 11,
                      fontWeight: 700,
                      fontFamily: sans,
                      letterSpacing: "-0.01em",
                      transition: "all 0.2s",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 4,
                      minHeight: 52,
                      whiteSpace: "nowrap",
                      WebkitTapHighlightColor: "transparent",
                      boxShadow: active ? "0 2px 10px rgba(88,166,255,0.28)" : "none",
                    }}
                  >
                    <span style={{ fontSize: 16, lineHeight: 1, opacity: active ? 1 : 0.85 }}>{t.i}</span>
                    {t.l}
                  </button>
                );
              })}
            </div>

            {/* Content */}
            <div style={{ paddingBottom: 60 }}>
              {wOk && aOk && <VitalSigns key={tab} w={w} age={age} sex={sex} open={tab === "standard"} />}
              {tab === "standard" && <StdTab w={w} age={age} />}
              {tab === "induction" && <InductionTab w={w} age={age} />}
              {tab === "analgesia" && <AnalgesiaTab w={w} age={age} />}
              {tab === "emergency" && <EmergencyTab w={w} age={age} />}
              {tab === "fluids" && <FluidsTab w={w} age={age} />}
              {tab === "regional" && <RegionalTab w={w} age={age} />}
              {tab === "airway" && <AirwayTab w={w} age={age} ht={ht} />}
              {tab === "addendum" && <AddTab w={w} age={age} />}
              {tab === "inotropy" && <InoTab w={w} age={age} />}
              {tab === "transfusion" && <TransTab w={w} age={age} />}
              {tab === "tiva" && <TIVATab w={w} age={age} ht={ht} sex={sex} />}
            </div>
          </>
        )}
      </div>

      {/* Disclaimer + Credit */}
      <div
        style={{
          padding: "10px 14px env(safe-area-inset-bottom, 0px)",
          background: `${C.s1}ee`,
          borderTop: `1px solid ${C.bdr}`,
          position: "sticky",
          bottom: 0,
          width: "100%",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          zIndex: 99,
        }}
      >
        <p style={{ margin: 0, fontSize: 8, color: C.red, lineHeight: 1.5, fontWeight: 500, opacity: 0.8 }}>
          ⚠ DISCLAIMER: Clinical decision support only. User solely responsible for administered
          medication. Authors accept no liability. Verify doses independently.
        </p>
        <div style={{ marginTop: 4, display: "flex", alignItems: "center", justifyContent: "space-between", opacity: 0.4 }}>
          <span style={{ fontSize: 7, color: C.t3 }}>
            Built by{" "}
            <a href="https://amnestic.co.za" target="_blank" rel="noopener" style={{ color: C.t3, textDecoration: "none", borderBottom: `1px dotted ${C.t4}` }}>
              amnestic.co.za
            </a>
          </span>
          <a href="mailto:pedicalc@amnestic.co.za" style={{ fontSize: 7, color: C.t3, textDecoration: "none", borderBottom: `1px dotted ${C.t4}` }}>
            pedicalc@amnestic.co.za
          </a>
        </div>
      </div>
    </div>
  );
}
