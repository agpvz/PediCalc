import { useState } from "react";
import { C, mono, sans } from "../utils/theme";

export const Pill = ({ v, u, c = C.acc }) => (
  <span
    style={{
      display: "inline-flex",
      alignItems: "baseline",
      gap: 2,
      background: `${c}16`,
      borderRadius: 6,
      padding: "2px 8px",
      fontFamily: mono,
      fontSize: 12,
      fontWeight: 700,
      color: c,
      whiteSpace: "nowrap",
      lineHeight: 1.4,
      border: `1px solid ${c}20`,
    }}
  >
    {v}
    {u && (
      <span style={{ fontSize: 9, fontWeight: 600, opacity: 0.6, marginLeft: 1 }}>
        {u}
      </span>
    )}
  </span>
);

export const Tag = ({ children, c = C.t3 }) => (
  <span
    style={{
      fontSize: 9,
      fontWeight: 700,
      color: c,
      background: `${c}18`,
      borderRadius: 5,
      padding: "2px 7px",
      textTransform: "uppercase",
      letterSpacing: ".05em",
      whiteSpace: "nowrap",
      lineHeight: 1.4,
    }}
  >
    {children}
  </span>
);

export function Badge({ l, v, c = C.acc }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        background: `${c}0c`,
        borderRadius: 8,
        padding: "6px 11px",
        minWidth: 52,
        border: `1px solid ${c}18`,
        transition: "transform 0.1s",
        cursor: "default",
      }}
    >
      <span
        style={{
          fontSize: 7,
          fontWeight: 700,
          color: C.t3,
          textTransform: "uppercase",
          letterSpacing: ".06em",
          marginBottom: 1,
        }}
      >
        {l}
      </span>
      <span
        style={{
          fontSize: 16,
          fontWeight: 800,
          color: c,
          fontFamily: mono,
          lineHeight: 1.2,
        }}
      >
        {v ?? "—"}
      </span>
    </div>
  );
}

export function Inp({ label, value, onChange, type = "number", unit, placeholder, min, max, step }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {label && (
        <label
          style={{
            fontSize: 9,
            fontWeight: 700,
            color: C.t3,
            textTransform: "uppercase",
            letterSpacing: ".05em",
          }}
        >
          {label}
        </label>
      )}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 4,
          background: C.s2,
          borderRadius: 8,
          border: `1px solid ${C.bdr}`,
          padding: "6px 10px",
          transition: "border-color 0.15s",
        }}
      >
        <input
          type={type}
          value={value}
          onChange={(e) =>
            onChange(
              type === "number"
                ? e.target.value === ""
                  ? ""
                  : parseFloat(e.target.value)
                : e.target.value,
            )
          }
          placeholder={placeholder}
          min={min}
          max={max}
          step={step}
          style={{
            flex: 1,
            background: "transparent",
            border: "none",
            outline: "none",
            color: C.t1,
            fontSize: 14,
            fontFamily: mono,
            fontWeight: 600,
            width: "100%",
            colorScheme: "dark",
            lineHeight: 1.3,
          }}
          onFocus={(e) => (e.target.parentElement.style.borderColor = C.acc)}
          onBlur={(e) => (e.target.parentElement.style.borderColor = C.bdr)}
        />
        {unit && <span style={{ fontSize: 10, color: C.t4, fontWeight: 700 }}>{unit}</span>}
      </div>
    </div>
  );
}

export function Sel({ label, value, onChange, options }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <label
        style={{
          fontSize: 9,
          fontWeight: 700,
          color: C.t3,
          textTransform: "uppercase",
          letterSpacing: ".05em",
        }}
      >
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          background: C.s2,
          border: `1px solid ${C.bdr}`,
          borderRadius: 8,
          padding: "7px 10px",
          color: C.t1,
          fontSize: 13,
          outline: "none",
          cursor: "pointer",
          appearance: "none",
          fontFamily: sans,
          transition: "border-color 0.15s",
        }}
        onFocus={(e) => (e.target.style.borderColor = C.acc)}
        onBlur={(e) => (e.target.style.borderColor = C.bdr)}
      >
        {options.map((o) => (
          <option key={o.v} value={o.v}>
            {o.l}
          </option>
        ))}
      </select>
    </div>
  );
}

export function Sec({ title, icon, children, warn, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{ marginTop: 14 }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          marginBottom: open ? 8 : 2,
          padding: "6px 2px",
          background: "transparent",
          border: "none",
          cursor: "pointer",
          width: "100%",
          textAlign: "left",
          WebkitTapHighlightColor: "transparent",
          borderRadius: 6,
          transition: "background 0.1s",
        }}
        onTouchStart={(e) => (e.currentTarget.style.background = C.s2)}
        onTouchEnd={(e) => (e.currentTarget.style.background = "transparent")}
      >
        {icon && <span style={{ fontSize: 15, lineHeight: 1 }}>{icon}</span>}
        <span
          style={{
            fontSize: 11,
            fontWeight: 800,
            color: open ? C.t1 : C.t2,
            textTransform: "uppercase",
            letterSpacing: ".07em",
            fontFamily: sans,
            flex: 1,
            transition: "color 0.15s",
          }}
        >
          {title}
        </span>
        {warn && <Tag c={C.orn}>{warn}</Tag>}
        <span
          style={{
            fontSize: 10,
            color: C.t3,
            transition: "transform 0.2s",
            transform: open ? "rotate(0)" : "rotate(-90deg)",
            display: "inline-block",
          }}
        >
          ▾
        </span>
      </button>
      <div
        style={{
          overflow: "hidden",
          maxHeight: open ? 9999 : 0,
          opacity: open ? 1 : 0,
          transition: "opacity 0.15s ease",
        }}
      >
        {children}
      </div>
    </div>
  );
}

export const Warn = ({ children }) => (
  <div
    style={{
      background: C.ornS,
      borderRadius: 8,
      padding: "6px 10px",
      fontSize: 10,
      color: C.orn,
      fontWeight: 600,
      marginBottom: 6,
      border: `1px solid ${C.orn}18`,
    }}
  >
    ⚠ {children}
  </div>
);

export function Drug({ name, conc, rows, note, children, defaultOpen = false }) {
  const ex = !!children;
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div
      style={{
        background: C.s1,
        borderRadius: 10,
        border: `1px solid ${C.bdr}`,
        overflow: "hidden",
        marginBottom: 3,
        transition: "border-color 0.15s",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = C.bdrH)}
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = C.bdr)}
    >
      <div style={{ padding: "10px 12px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: rows.length ? 5 : 0,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: C.t1, fontFamily: sans }}>
              {name}
            </span>
            {conc && <Tag>{conc}</Tag>}
          </div>
          {ex && (
            <button
              onClick={() => setOpen(!open)}
              style={{
                background: open ? C.accM : C.s3,
                border: `1px solid ${open ? C.acc + "40" : C.bdr}`,
                borderRadius: 6,
                padding: "3px 10px",
                cursor: "pointer",
                color: open ? C.acc : C.t3,
                fontSize: 9,
                fontWeight: 700,
                fontFamily: sans,
                transition: "all 0.15s",
                WebkitTapHighlightColor: "transparent",
              }}
            >
              {open ? "▾ Less" : "▸ Calc"}
            </button>
          )}
        </div>
        {note && <div style={{ fontSize: 10, color: C.orn, marginBottom: 4, fontWeight: 500 }}>{note}</div>}
        {rows.map((r, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 6,
              padding: "4px 0",
              borderTop: i ? `1px solid ${C.bdr}55` : "none",
              flexWrap: "wrap",
            }}
          >
            <span style={{ fontSize: 11, color: C.t2, flex: 1, minWidth: 100, lineHeight: 1.4 }}>
              {r.label}
            </span>
            <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
              {r.mg !== undefined && <Pill v={r.mg} u={r.unit || "mg"} c={C.acc} />}
              {r.ml !== undefined && <Pill v={r.ml} u="ml" c={C.grn} />}
              {r.text && <Pill v={r.text} u="" c={r.tc || C.t2} />}
            </div>
          </div>
        ))}
      </div>
      {ex && open && (
        <div style={{ borderTop: `1px solid ${C.bdr}`, padding: "10px 12px", background: C.s2 }}>
          {children}
        </div>
      )}
    </div>
  );
}
