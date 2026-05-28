// Dashboard Metrics Cards - KPI display
import { theme } from "../../styles/theme";

const METRICS = [
  { label: "Revenue Saved", value: "$284,000", change: "+23%", sub: "this month", color: theme.accent, icon: "💰" },
  { label: "Leads Processed", value: "12,847", change: "+156", sub: "this week", color: theme.accent2, icon: "🎯" },
  { label: "Tickets Resolved", value: "3,421", change: "94%", sub: "auto-resolution", color: theme.accent3, icon: "✅" },
  { label: "Workflows Active", value: "94", change: "+12", sub: "new this month", color: theme.accent4, icon: "⚡" },
  { label: "AI Uptime", value: "99.97%", change: "+0.02%", sub: "last 30 days", color: theme.accent5, icon: "📊" },
  { label: "Cost Savings", value: "$48,291", change: "+18%", sub: "vs last month", color: theme.accent6, icon: "💰" },
];

export function DashboardMetrics() {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: 16,
        marginBottom: 28,
      }}
    >
      {METRICS.map((metric) => (
        <div
          key={metric.label}
          className="metric-card"
          style={{
            background: theme.card,
            border: `1px solid ${theme.border}`,
            borderRadius: 16,
            padding: 20,
            transition: "all 0.25s",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: 16,
            }}
          >
            <span
              style={{
                fontSize: 12,
                color: theme.muted,
                fontWeight: 500,
                textTransform: "uppercase",
                letterSpacing: 1,
              }}
            >
              {metric.label}
            </span>
            <span
              style={{
                fontSize: 24,
                opacity: 0.8,
              }}
            >
              {metric.icon}
            </span>
          </div>

          <div
            style={{
              fontSize: 32,
              fontWeight: 800,
              color: metric.color,
              marginBottom: 8,
              letterSpacing: -1,
            }}
          >
            {metric.value}
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span
              style={{
                background: `${metric.color}20`,
                color: metric.color,
                padding: "2px 8px",
                borderRadius: 100,
                fontSize: 11,
                fontWeight: 600,
              }}
            >
              {metric.change}
            </span>
            <span
              style={{
                fontSize: 11,
                color: theme.muted,
              }}
            >
              {metric.sub}
            </span>
          </div>
        </div>
      ))}

      <style>{`
        .metric-card:hover {
          transform: translateY(-2px);
          border-color: ${theme.accent}40;
        }
      `}</style>
    </div>
  );
}