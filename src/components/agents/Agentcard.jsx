// Agent Card Component - Individual agent display card
import { theme } from "../../styles/theme";

export function AgentCard({ agent, onClick, active }) {
  return (
    <div
      onClick={() => onClick(agent)}
      style={{
        background: active ? `${agent.color}10` : theme.card,
        border: `1px solid ${active ? agent.color + "50" : theme.border}`,
        borderRadius: 14,
        padding: "18px 20px",
        cursor: "pointer",
        transition: "all 0.2s",
        display: "flex",
        alignItems: "flex-start",
        gap: 14,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Active indicator glow */}
      {active && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 2,
            background: `linear-gradient(90deg, ${agent.color}, transparent)`,
          }}
        />
      )}

      {/* Agent Icon */}
      <div
        style={{
          fontSize: 28,
          lineHeight: 1,
          flexShrink: 0,
          width: 44,
          height: 44,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: active ? `${agent.color}20` : "transparent",
          borderRadius: 12,
        }}
      >
        {agent.icon}
      </div>

      {/* Agent Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
          <span
            style={{
              fontWeight: 700,
              fontSize: 14,
              color: active ? agent.color : theme.text,
            }}
          >
            {agent.name}
          </span>
          {active && (
            <span
              style={{
                display: "inline-block",
                background: `${agent.color}18`,
                color: agent.color,
                border: `1px solid ${agent.color}33`,
                borderRadius: 100,
                padding: "2px 8px",
                fontSize: 9,
                fontWeight: 700,
              }}
            >
              Active
            </span>
          )}
        </div>
        <div
          style={{
            fontSize: 11,
            color: theme.muted,
            lineHeight: 1.4,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {agent.tagline}
        </div>
        {active && (
          <div
            style={{
              fontSize: 10,
              color: agent.color,
              marginTop: 6,
              display: "flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            <span
              style={{
                width: 5,
                height: 5,
                borderRadius: "50%",
                background: agent.color,
                animation: "blink 1.5s infinite",
              }}
            />
            Ready to assist
          </div>
        )}
      </div>

      {/* Arrow indicator */}
      {active && (
        <div style={{ color: agent.color, fontSize: 12, flexShrink: 0 }}>→</div>
      )}

      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>
    </div>
  );
}