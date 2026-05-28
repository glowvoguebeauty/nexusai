import { AGENTS } from "../../config/agents";
import { theme } from "../../styles/theme";

export function AgentsShowcase({ onEnterApp }) {
  return (
    <section style={{ padding: "80px 40px", maxWidth: 1200, margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: 56 }}>
        <div style={{ fontSize: 11, color: theme.accent, fontWeight: 700, letterSpacing: 3, marginBottom: 14 }}>
          YOUR AI WORKFORCE
        </div>
        <h2 style={{ fontSize: "clamp(26px, 4vw, 48px)", fontWeight: 800, letterSpacing: -1.5 }}>
          7 agents. Every department. All autonomous.
        </h2>
        <p style={{ color: theme.muted, fontSize: 16, marginTop: 16, maxWidth: 540, marginLeft: "auto", marginRight: "auto" }}>
          Including our new AI ChatBot that works across all social media platforms and your website 24/7.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20 }}>
        {AGENTS.map((agent) => (
          <div
            key={agent.id}
            className="hover-lift"
            style={{
              background: theme.card,
              border: `1px solid ${theme.border}`,
              borderRadius: 16,
              padding: 26,
              cursor: "pointer",
              transition: "all 0.25s",
            }}
            onClick={onEnterApp}
          >
            <div style={{ fontSize: 40, marginBottom: 14 }}>{agent.icon}</div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <span style={{ fontWeight: 700, fontSize: 18 }}>{agent.name}</span>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: agent.color, animation: "blink 2s infinite" }} />
            </div>
            <p style={{ color: theme.muted, fontSize: 14, lineHeight: 1.6 }}>{agent.description}</p>
            <div style={{ marginTop: 16 }}>
              <span style={{
                display: "inline-block",
                background: `${agent.color}18`,
                color: agent.color,
                borderRadius: 100,
                padding: "4px 12px",
                fontSize: 11,
                fontWeight: 600,
              }}>{agent.tagline}</span>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .hover-lift:hover { transform: translateY(-4px); box-shadow: 0 20px 60px rgba(0,0,0,0.4); }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.4} }
      `}</style>
    </section>
  );
}