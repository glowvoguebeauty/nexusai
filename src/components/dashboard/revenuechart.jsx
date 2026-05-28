// Revenue Chart Component - SVG chart
import { theme } from "../../styles/theme";

export function RevenueChart() {
  // Data points for the chart
  const data = [45, 52, 48, 61, 68, 72, 84, 79, 91, 98, 112, 128];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const maxValue = 140;
  const chartHeight = 140;
  const chartWidth = 500;

  // Calculate points for SVG path
  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * chartWidth;
    const y = chartHeight - (value / maxValue) * chartHeight;
    return `${x},${y}`;
  }).join(" ");

  return (
    <div
      style={{
        background: theme.card,
        border: `1px solid ${theme.border}`,
        borderRadius: 16,
        padding: 24,
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <div>
          <div style={{ fontWeight: 700, marginBottom: 4 }}>Revenue Automation</div>
          <div style={{ color: theme.muted, fontSize: 12 }}>Last 12 months — AI-generated forecast</div>
        </div>
        <div style={{ display: "flex", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 10, height: 10, borderRadius: 2, background: theme.accent }} />
            <span style={{ fontSize: 11, color: theme.muted }}>Actual Revenue</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 10, height: 10, borderRadius: 2, background: `${theme.accent2}80` }} />
            <span style={{ fontSize: 11, color: theme.muted }}>AI Forecast</span>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div style={{ position: "relative", marginBottom: 16 }}>
        <svg
          width="100%"
          height="160"
          viewBox={`0 0 ${chartWidth} 160`}
          preserveAspectRatio="none"
          style={{ overflow: "visible" }}
        >
          {/* Grid lines */}
          {[0, 35, 70, 105, 140].map((value, i) => (
            <line
              key={i}
              x1="0"
              y1={chartHeight - (value / maxValue) * chartHeight + 10}
              x2={chartWidth}
              y2={chartHeight - (value / maxValue) * chartHeight + 10}
              stroke={theme.border}
              strokeWidth="0.5"
              strokeDasharray="4"
            />
          ))}

          {/* Gradient */}
          <defs>
            <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={theme.accent} stopOpacity="0.3" />
              <stop offset="100%" stopColor={theme.accent} stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Area under curve */}
          <path
            d={`M0,${chartHeight - (data[0] / maxValue) * chartHeight + 10} L${points} L${chartWidth},${chartHeight + 10} L0,${chartHeight + 10} Z`}
            fill="url(#revenueGradient)"
          />

          {/* Line */}
          <polyline
            points={points}
            fill="none"
            stroke={theme.accent}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data points */}
          {data.map((value, index) => {
            const x = (index / (data.length - 1)) * chartWidth;
            const y = chartHeight - (value / maxValue) * chartHeight + 10;
            return (
              <circle
                key={index}
                cx={x}
                cy={y}
                r="3"
                fill={theme.accent}
                stroke={theme.card}
                strokeWidth="1.5"
              />
            );
          })}
        </svg>

        {/* X-axis labels */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: 8,
            paddingLeft: 0,
            paddingRight: 0,
          }}
        >
          {months.map((month, i) => (
            <span
              key={i}
              style={{
                fontSize: 10,
                color: theme.muted,
                textAlign: "center",
                flex: 1,
              }}
            >
              {month}
            </span>
          ))}
        </div>
      </div>

      {/* Stats footer */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: 20,
          paddingTop: 16,
          borderTop: `1px solid ${theme.border}`,
        }}
      >
        <div>
          <div style={{ fontSize: 20, fontWeight: 800, color: theme.accent }}>+$284K</div>
          <div style={{ fontSize: 11, color: theme.muted }}>This Month</div>
        </div>
        <div>
          <div style={{ fontSize: 20, fontWeight: 800 }}>+23%</div>
          <div style={{ fontSize: 11, color: theme.muted }}>MoM Growth</div>
        </div>
        <div>
          <div style={{ fontSize: 20, fontWeight: 800, color: theme.accent2 }}>$1.2M</div>
          <div style={{ fontSize: 11, color: theme.muted }}>YTD Revenue</div>
        </div>
        <div>
          <div style={{ fontSize: 20, fontWeight: 800, color: theme.accent3 }}>94%</div>
          <div style={{ fontSize: 11, color: theme.muted }}>Forecast Accuracy</div>
        </div>
      </div>
    </div>
  );
}