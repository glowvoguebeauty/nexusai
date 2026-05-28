// Agent Status Grid - Shows all agents with status
import { theme } from "../../styles/theme";
import { AGENTS } from "../../config/agents";

export function AgentStatusGrid() {
  const getStatusMessage = (agentId) => {
    const messages = {
      sales: "Processing 47 leads",
      support: "12 tickets in queue",
      marketing: "Running 8 campaigns",
      operations: "Optimizing 23 workflows",
      analyst: "Analyzing 6 reports",
      finance: "Processing 34 invoices",
      chatbot: "Active on 6 platforms",
    };
    return messages[agentId] || "Active";
  };

  const getUsagePercent = (agentId) => {
    const usage = {
      sales: 78,
      support: 45,
      marketing: 92,
      operations: 34,
      analyst: 67,
      finance: 23,
      chatbot: 89,
    };
    return usage[agentId] || 50;
  };

  return (
    <div>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <div>
          <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 4 }}>Agent Status</div>
          <div style={{ color: theme.muted, fontSize: 13 }}>
            All 7 agents operational · 99.97% uptime
          </div>
        </div>
        <div
          style={{
            background: `${theme.success}15`,
            color: theme.success,
            padding: "6px 14px",
            borderRadius: 100,
            fontSize: 12,
            fontWeight: 600,
          }}
        >
          ● All Systems Go
        </div>
      </div>

      {/* Agent Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: 16,
        }}
      >
        {AGENTS.map((agent) => (
          <div
            key={agent.id}
            className="agent-status-card"
            style={{
              background: theme.card,
              border: `1px solid ${theme.border}`,
              borderRadius: 14,
              padding: "18px 20px",
              transition: "all 0.25s",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
              {/* Agent Icon */}
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  background: `${agent.color}15`,
                  border: `1px solid ${agent.color}30`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 24,
                }}
              >
                {agent.icon}
              </div>

              {/* Agent Info */}
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 4,
                  }}
                >
                  <span style={{ fontWeight: 700, fontSize: 15 }}>{agent.name}</span>
                  <span
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: agent.color,
                      animation: "blink 1.5s infinite",
                    }}
                  />
                </div>
                <div style={{ fontSize: 11, color: theme.muted }}>{agent.tagline}</div>
              </div>

              {/* Status Badge */}
              <div
                style={{
                  background: `${agent.color}15`,
                  color: agent.color,
                  padding: "4px 10px",
                  borderRadius: 100,
                  fontSize: 10,
                  fontWeight: 600,
                }}
              >
                Active
              </div>
            </div>

            {/* Usage Bar */}
            <div style={{ marginBottom: 12 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 11,
                  color: theme.muted,
                  marginBottom: 6,
                }}
              >
                <span>Usage</span>
                <span>{getUsagePercent(agent.id)}%</span>
              </div>
              <div
                style={{
                  height: 4,
                  background: `${theme.border}`,
                  borderRadius: 2,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: `${getUsagePercent(agent.id)}%`,
                    height: "100%",
                    background: agent.color,
                    borderRadius: 2,
                    transition: "width 0.5s",
                  }}
                />
              </div>
            </div>

            {/* Status Message */}
            <div
              style={{
                fontSize: 12,
                color: agent.color,
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <span>⚡</span>
              {getStatusMessage(agent.id)}
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .agent-status-card:hover {
          transform: translateY(-2px);
          border-color: ${theme.accent}40;
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>
    </div>
  );
}