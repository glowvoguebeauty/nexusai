// Activity Feed Component - Real-time agent actions
import { useState, useEffect } from "react";
import { theme } from "../../styles/theme";
import { AGENTS } from "../../config/agents";

// Sample activity data
const generateActivity = () => {
  const actions = [
    "Qualified {count} leads from {source}",
    "Resolved {count} tickets in {time}",
    "Generated {count} new campaign ideas",
    "Optimized {count} workflows",
    "Detected {count} anomalies in data",
    "Processed {count} invoice payments",
    "Responded to {count} social media messages",
  ];
  
  const sources = ["LinkedIn", "Facebook", "Instagram", "Website", "Twitter", "Email"];
  const times = ["12 sec", "34 sec", "1.2 min", "45 sec", "23 sec"];
  const counts = ["12", "8", "24", "6", "15", "42"];
  
  const action = actions[Math.floor(Math.random() * actions.length)];
  const source = sources[Math.floor(Math.random() * sources.length)];
  const time = times[Math.floor(Math.random() * times.length)];
  const count = counts[Math.floor(Math.random() * counts.length)];
  
  return action
    .replace("{count}", count)
    .replace("{source}", source)
    .replace("{time}", time);
};

export function ActivityFeed() {
  const [activities, setActivities] = useState([
    { agent: "Sales Agent", action: "Qualified 12 leads from LinkedIn campaign", time: "2 min ago", color: theme.accent },
    { agent: "Support Agent", action: "Resolved 8 tickets — avg 43 sec each", time: "5 min ago", color: theme.accent2 },
    { agent: "Marketing Agent", action: "Launched A/B test — 3 email variants", time: "12 min ago", color: theme.accent3 },
    { agent: "ChatBot Agent", action: "Responded to 24 messages across Instagram & Facebook", time: "8 min ago", color: theme.accent7 },
    { agent: "Finance Agent", action: "Generated Q2 cash flow report", time: "1 hr ago", color: theme.accent6 },
    { agent: "Analytics Agent", action: "Churn spike detected — alert sent to CEO", time: "2 hr ago", color: theme.accent5 },
    { agent: "Operations Agent", action: "Onboarding workflow updated — 3 steps removed", time: "3 hr ago", color: theme.accent4 },
  ]);

  // Simulate real-time activity updates
  useEffect(() => {
    const interval = setInterval(() => {
      const randomAgent = AGENTS[Math.floor(Math.random() * AGENTS.length)];
      const newActivity = {
        agent: randomAgent.name,
        action: generateActivity(),
        time: "Just now",
        color: randomAgent.color,
      };
      setActivities(prev => [newActivity, ...prev.slice(0, 9)]);
    }, 15000); // New activity every 15 seconds

    return () => clearInterval(interval);
  }, []);

  const getAgentIcon = (agentName) => {
    const agent = AGENTS.find(a => a.name === agentName);
    return agent?.icon || "🤖";
  };

  return (
    <div
      style={{
        background: theme.card,
        border: `1px solid ${theme.border}`,
        borderRadius: 16,
        padding: 24,
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontWeight: 700, marginBottom: 4 }}>Live Agent Activity</div>
        <div style={{ color: theme.muted, fontSize: 12 }}>
          Real-time actions across all agents
          <span
            style={{
              display: "inline-block",
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: theme.success,
              marginLeft: 8,
              animation: "blink 1.5s infinite",
            }}
          />
        </div>
      </div>

      {/* Activity List */}
      <div style={{ flex: 1, overflowY: "auto", maxHeight: 400 }}>
        {activities.map((activity, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              gap: 12,
              padding: "12px 0",
              borderBottom: index < activities.length - 1 ? `1px solid ${theme.border}` : "none",
              transition: "all 0.2s",
            }}
          >
            {/* Agent Icon */}
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: `${activity.color}15`,
                border: `1px solid ${activity.color}30`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 16,
                flexShrink: 0,
              }}
            >
              {getAgentIcon(activity.agent)}
            </div>

            {/* Activity Content */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: activity.color,
                  marginBottom: 2,
                }}
              >
                {activity.agent}
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: theme.muted,
                  lineHeight: 1.4,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {activity.action}
              </div>
            </div>

            {/* Time */}
            <div
              style={{
                fontSize: 10,
                color: theme.muted,
                flexShrink: 0,
              }}
            >
              {activity.time}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div
        style={{
          marginTop: 16,
          paddingTop: 12,
          borderTop: `1px solid ${theme.border}`,
          fontSize: 11,
          color: theme.muted,
          textAlign: "center",
        }}
      >
        🤖 All agents operating normally · Last sync: just now
      </div>

      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>
    </div>
  );
}