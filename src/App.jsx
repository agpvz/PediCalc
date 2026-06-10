import { useState, useMemo } from "react";
import { calcAge, ageStr, ageCat } from "./utils/helpers";
import { C, sans } from "./utils/theme";
import { Inp, Sel, Tag } from "./components/UI";
import StdTab from "./tabs/StdTab";
import AirwayTab from "./tabs/AirwayTab";
import AddTab from "./tabs/AddTab";
import InoTab from "./tabs/InoTab";
import TransTab from "./tabs/TransTab";
import TIVATab from "./tabs/TIVATab";

export default function App() {
  const [tab, setTab] = useState("standard");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [dob, setDob] = useState("");
  const [sex, setSex] = useState("");
  const [am, setAm] = useState("dob");
  const [mY, setMY] = useState("");
  const [mM, setMM] = useState("");
  const [mD, setMD] = useState("");

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

  const age = am === "dob" ? aD : aMan;
  const w = typeof weight === "number" ? weight : 0;
  const ht = typeof height === "number" ? height : 0;
  const wOk = w >= 1 && w <= 45,
    aOk = age !== null;

  const tabs = [
    { id: "standard", l: "Standard", i: "💊" },
    { id: "airway", l: "Airway & Lines", i: "🫁" },
    { id: "addendum", l: "Addendum", i: "🦠" },
    { id: "inotropy", l: "Inotropes", i: "❤️" },
    { id: "transfusion", l: "Transfusion", i: "🩸" },
    { id: "tiva", l: "TIVA", i: "🎯" },
  ];

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
        overflowX: "hidden",
        WebkitFontSmoothing: "antialiased",
      }}
    >
      <link
        href="https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700;9..40,800&family=JetBrains+Mono:wght@400;500;700&display=swap"
        rel="stylesheet"
      />
      <style>{`html,body{margin:0;padding:0;overflow-x:hidden;overscroll-behavior:none;background:${C.bg};-webkit-overflow-scrolling:touch;position:fixed;width:100%;height:100%}#root{width:100%;height:100%;overflow-y:auto;overflow-x:hidden;-webkit-overflow-scrolling:touch}*{box-sizing:border-box;-webkit-tap-highlight-color:transparent}input[type=number]::-webkit-inner-spin-button,input[type=number]::-webkit-outer-spin-button{opacity:1}::selection{background:${C.acc}40;color:#fff}::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:${C.bdr};border-radius:4px}`}</style>

      {/* Header */}
      <div
        style={{
          background: C.s1,
          borderBottom: `1px solid ${C.bdr}`,
          padding: "16px 14px 10px",
          position: "sticky",
          top: 0,
          zIndex: 100,
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
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
        </div>

        {/* Inputs */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6, marginBottom: 8 }}>
          <Inp label="Weight" value={weight} onChange={setWeight} placeholder="1–45" unit="kg" min={1} max={45} step={0.1} />
          <Inp label="Height" value={height} onChange={setHeight} placeholder="20–150" unit="cm" min={20} max={150} step={0.5} />
          <Sel label="Sex" value={sex} onChange={setSex} options={[{ v: "", l: "—" }, { v: "1", l: "♂ Male" }, { v: "2", l: "♀ Female" }]} />
        </div>

        {/* Age mode */}
        <div style={{ display: "flex", gap: 3, marginBottom: 6 }}>
          {[["dob", "📅 Date of Birth"], ["manual", "✏️ Enter Age"]].map(([m, l2]) => (
            <button
              key={m}
              onClick={() => setAm(m)}
              style={{
                flex: 1,
                padding: "6px 8px",
                borderRadius: 7,
                border: `1px solid ${am === m ? C.acc + "60" : C.bdr}`,
                background: am === m ? C.accS : "transparent",
                color: am === m ? C.acc : C.t3,
                fontSize: 10,
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

        {/* Status pills */}
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginTop: 8, marginBottom: 8 }}>
          <Tag c={wOk ? C.grn : C.red}>{wOk ? `${w} kg ✓` : "Weight ✗"}</Tag>
          <Tag c={aOk ? C.acc : C.red}>{aOk ? `${ageStr(age)} ✓` : "Age ✗"}</Tag>
          {aOk && <Tag c={C.vio}>{ageCat(age)}</Tag>}
          {sex === "1" && <Tag c={C.grn}>♂ Male</Tag>}
          {sex === "2" && <Tag c={C.pink}>♀ Female</Tag>}
        </div>

        {/* Tabs — 3×2 grid so all six fit with full labels on phones */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 4, background: C.bg, borderRadius: 12, padding: 4 }}>
          {tabs.map((t) => {
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                style={{
                  padding: "8px 4px",
                  borderRadius: 9,
                  border: `1px solid ${active ? "transparent" : C.bdr}`,
                  cursor: "pointer",
                  background: active ? `linear-gradient(135deg,${C.acc},${C.vio})` : C.s1,
                  color: active ? "#fff" : C.t2,
                  fontSize: 10,
                  fontWeight: 700,
                  fontFamily: sans,
                  letterSpacing: "-0.01em",
                  transition: "all 0.2s",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 4,
                  minHeight: 48,
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
      </div>

      {/* Content */}
      <div style={{ padding: "8px 14px 60px" }}>
        {tab === "standard" && <StdTab w={w} age={age} sex={sex} />}
        {tab === "airway" && <AirwayTab w={w} age={age} ht={ht} />}
        {tab === "addendum" && <AddTab w={w} age={age} />}
        {tab === "inotropy" && <InoTab w={w} age={age} />}
        {tab === "transfusion" && <TransTab w={w} age={age} />}
        {tab === "tiva" && <TIVATab w={w} age={age} ht={ht} sex={sex} />}
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
