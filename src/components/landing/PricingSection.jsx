import { useState } from "react";
import { Button } from "../common/Button";
import { theme } from "../../styles/theme";

const PLANS = [
  { name: "Starter", price: 299, annual: 249, color: theme.accent, features: ["All 7 AI Agents", "10K ops/month", "CRM + Email Automation", "Basic Analytics", "API Access", "Email Support"] },
  { name: "Professional", price: 799, annual: 649, color: theme.accent2, badge: "Most Popular", features: ["All 7 AI Agents", "500K ops/month", "Full Automation Suite", "Revenue Intelligence", "50K API calls/mo", "Multi-language (40+)", "White-label", "Priority SLA"] },
  { name: "Enterprise", price: 2499, annual: 1999, color: theme.accent3, features: ["Everything in Pro", "Unlimited Ops", "Custom AI Training", "Dedicated Infra", "99.99% SLA", "Custom Integrations", "Unlimited API", "Dedicated Manager"] },
];

export function PricingSection({ onEnterApp }) {
  const [billing, setBilling] = useState("annual");

  return (
    <section style={{ padding: "80px 40px", maxWidth: 1200, margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: 52 }}>
        <div style={{ fontSize: 11, color: theme.accent2, fontWeight: 700, letterSpacing: 3, marginBottom: 14 }}>PRICING</div>
        <h2 style={{ fontSize: "clamp(26px, 4vw, 46px)", fontWeight: 800, letterSpacing: -1.5, marginBottom: 24 }}>Simple, transparent pricing</h2>
        
        <div style={{ display: "inline-flex", background: "rgba(255,255,255,0.04)", border: `1px solid ${theme.border}`, borderRadius: 10, padding: 4 }}>
          {["monthly", "annual"].map(b => (
            <button key={b} onClick={() => setBilling(b)} style={{
              padding: "8px 22px",
              borderRadius: 8,
              border: "none",
              cursor: "pointer",
              fontSize: 13,
              fontWeight: 600,
              background: billing === b ? `linear-gradient(135deg, ${theme.accent}, ${theme.accent2})` : "transparent",
              color: billing === b ? "#000" : theme.muted,
            }}>{b === "annual" ? "Annual · Save 20%" : "Monthly"}</button>
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
        {PLANS.map(plan => (
          <div key={plan.name} className="hover-lift" style={{
            background: plan.badge ? `linear-gradient(160deg, ${plan.color}12, rgba(0,0,0,0.2))` : theme.card,
            border: `1px solid ${plan.badge ? plan.color + "50" : theme.border}`,
            borderRadius: 18,
            padding: 32,
            position: "relative",
          }}>
            {plan.badge && <div style={{
              position: "absolute",
              top: -12,
              left: "50%",
              transform: "translateX(-50%)",
              background: `linear-gradient(135deg, ${theme.accent2}, ${theme.accent})`,
              color: "#000",
              padding: "4px 16px",
              borderRadius: 100,
              fontSize: 11,
              fontWeight: 800,
            }}>{plan.badge}</div>}
            
            <div style={{ fontSize: 13, color: theme.muted, marginBottom: 6 }}>{plan.name}</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 20 }}>
              <span style={{ fontSize: 44, fontWeight: 900, color: plan.color }}>${billing === "annual" ? plan.annual : plan.price}</span>
              <span style={{ color: theme.muted, fontSize: 14 }}>/mo</span>
            </div>
            
            <button onClick={onEnterApp} style={{
              width: "100%",
              padding: "13px",
              borderRadius: 11,
              border: `1px solid ${plan.color}50`,
              background: `${plan.color}15`,
              color: plan.color,
              fontWeight: 700,
              cursor: "pointer",
              fontSize: 14,
              marginBottom: 24,
            }}>Start Free Trial</button>
            
            <ul style={{ listStyle: "none" }}>
              {plan.features.map(f => (
                <li key={f} style={{ display: "flex", gap: 8, alignItems: "flex-start", fontSize: 13, color: theme.muted, marginBottom: 8 }}>
                  <span style={{ color: plan.color }}>✓</span>{f}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}