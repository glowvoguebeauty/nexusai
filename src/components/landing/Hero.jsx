import { Button } from "../common/Button";
import { theme } from "../../styles/theme";

export function Hero({ onEnterApp }) {
  return (
    <section style={{
      padding: "110px 40px 80px",
      textAlign: "center",
      maxWidth: 860,
      margin: "0 auto",
      position: "relative",
    }}>
      <div style={{
        position: "absolute",
        top: "20%",
        left: "5%",
        width: 250,
        height: 250,
        borderRadius: "50%",
        background: `radial-gradient(circle, ${theme.accent}18, transparent)`,
        filter: "blur(50px)",
        pointerEvents: "none",
      }} />
      
      <div style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        background: `${theme.accent}12`,
        border: `1px solid ${theme.accent}30`,
        borderRadius: 100,
        padding: "7px 16px",
        marginBottom: 32,
      }}>
        <div style={{ width: 6, height: 6, borderRadius: "50%", background: theme.accent, animation: "blink 1.5s infinite" }} />
        <span style={{ color: theme.accent }}>12,400+ businesses automated · 137 countries</span>
      </div>

      <h1 style={{
        fontSize: "clamp(38px, 6.5vw, 80px)",
        fontWeight: 900,
        lineHeight: 1.04,
        letterSpacing: -2.5,
        marginBottom: 24,
      }}>
        Replace your entire
        <br />
        <span style={{
          background: `linear-gradient(135deg, ${theme.accent}, ${theme.accent2}, ${theme.accent3})`,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}>operations team with AI</span>
      </h1>

      <p style={{
        fontSize: 19,
        color: theme.muted,
        lineHeight: 1.65,
        maxWidth: 600,
        margin: "0 auto 44px",
      }}>
        Seven specialized AI agents handle sales, support, marketing, operations, analytics, finance, and customer chat.
        24/7. Zero salaries.
      </p>

      <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
        <Button variant="primary" onClick={onEnterApp}>Launch Your AI Team Free →</Button>
        <Button variant="secondary" onClick={onEnterApp}>▶ See Live Demo</Button>
      </div>

      <div style={{ marginTop: 28, color: theme.muted, fontSize: 13 }}>
        No credit card · 14-day free trial · Cancel anytime
      </div>

      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </section>
  );
}