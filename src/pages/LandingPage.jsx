import { useState } from "react";

const PLANS = [
  { id: "starter", name: "Starter", price: 299, annual: 249, color: "#00D4FF", description: "For growing businesses ready to automate", badge: null, features: ["5 AI Automation Workflows", "10,000 monthly operations", "CRM & Lead Management", "Email & SMS Automation", "AI Customer Support Bot", "Basic Analytics Dashboard", "API Access (1,000 calls/mo)", "Email Support"], cta: "Start Free Trial" },
  { id: "pro", name: "Professional", price: 799, annual: 649, color: "#A855F7", description: "For serious businesses scaling globally", badge: "Most Popular", features: ["Unlimited AI Workflows", "500,000 monthly operations", "Advanced CRM + Sales Pipeline", "Omnichannel Marketing Automation", "AI Voice & Chat Support (24/7)", "Real-time Business Intelligence", "API Access (50,000 calls/mo)", "Multi-language Support (40+)", "White-label Options", "Priority Support + SLA"], cta: "Start Free Trial" },
  { id: "enterprise", name: "Enterprise", price: 2499, annual: 1999, color: "#F59E0B", description: "For enterprises dominating their markets", badge: null, features: ["Everything in Professional", "Unlimited Operations", "Custom AI Model Training", "Dedicated Infrastructure", "Advanced Security & Compliance", "Custom Integrations (500+)", "Unlimited API Access", "99.99% SLA Guarantee", "Dedicated Success Manager", "Custom Contracts & Invoicing"], cta: "Contact Sales" }
];

const MODULES = [
  { icon: "🤖", title: "AI Sales Agent", desc: "Autonomous AI closes deals 24/7. Qualifies leads, books meetings, sends follow-ups — all without human intervention.", stat: "3.4× revenue increase" },
  { icon: "📊", title: "Revenue Intelligence", desc: "Predictive forecasting powered by machine learning. Know which deals will close before your team does.", stat: "94% forecast accuracy" },
  { icon: "💬", title: "Omnichannel AI Support", desc: "One AI brain across email, chat, WhatsApp, SMS, and voice. Resolves 87% of tickets without human touch.", stat: "87% auto-resolution" },
  { icon: "📣", title: "Marketing Autopilot", desc: "AI-generated campaigns, audience segmentation, A/B testing, and attribution — running 24/7.", stat: "5.8× ROAS improvement" },
  { icon: "⚙️", title: "Process Automation Engine", desc: "Connect 500+ apps. Build workflows with AI drag-and-drop. Eliminate repetitive tasks company-wide.", stat: "82% time saved" },
  { icon: "🌍", title: "Global Compliance Layer", desc: "GDPR, CCPA, SOC2, ISO 27001. Auto-compliance monitoring across 60+ jurisdictions.", stat: "60+ jurisdictions" },
  { icon: "📦", title: "Inventory & Supply Chain AI", desc: "Predict demand, auto-reorder, optimize suppliers. Zero stockouts, zero overstock.", stat: "99.2% inventory accuracy" },
  { icon: "💰", title: "Finance Automation", desc: "Invoicing, collections, reconciliation, and reporting — fully automated and audit-ready.", stat: "92% less manual work" }
];

const TESTIMONIALS = [
  { name: "Sarah Chen", role: "CEO, TechVenture Asia", avatar: "SC", color: "#00D4FF", text: "NexusAI replaced 14 full-time roles and increased our revenue by 340% in 8 months. This is the future of business.", country: "🇸🇬 Singapore" },
  { name: "Marcus Okonkwo", role: "COO, FinEdge Nigeria", avatar: "MO", color: "#A855F7", text: "We went from 200 support tickets/day requiring 12 agents to zero agents. The AI handles everything flawlessly.", country: "🇳🇬 Nigeria" },
  { name: "Isabella Torres", role: "Founder, ScaleUp Brazil", avatar: "IT", color: "#F59E0B", text: "Our sales pipeline went from chaos to clockwork. $2M in new ARR attributed directly to NexusAI's sales automation.", country: "🇧🇷 Brazil" },
  { name: "Dmitri Volkov", role: "CTO, LogiFlow Europe", avatar: "DV", color: "#10B981", text: "The compliance automation alone saves us €180,000/year in consulting fees. ROI was immediate.", country: "🇩🇪 Germany" }
];

const STATS = [
  { value: "12,400+", label: "Businesses Automated" },
  { value: "$4.2B", label: "Revenue Generated for Clients" },
  { value: "99.97%", label: "Platform Uptime" },
  { value: "137", label: "Countries Served" }
];

export default function LandingPage({ onGetStarted }) {
  const [billing, setBilling] = useState("annual");
  const [activeFaq, setActiveFaq] = useState(null);
  const [demoOpen, setDemoOpen] = useState(false);
  const [demoInput, setDemoInput] = useState("");
  const [demoResult, setDemoResult] = useState("");
  const [demoLoading, setDemoLoading] = useState(false);

  const generateAIResponse = (input) => {
    const lower = input.toLowerCase();
    if (lower.includes("sales") || lower.includes("lead")) {
      return `⚡ NexusAI Sales Automation — Activated\n\n🎯 PROBLEM DETECTED: Slow lead follow-up\n\n🤖 MODULES DEPLOYED:\n• AI Sales Agent — qualifies & responds in <90 seconds\n• Smart Pipeline Manager — auto-scores leads\n• Follow-up Sequencer — 12-touch automated nurture\n\n📊 EXPECTED OUTCOMES:\n• Lead response time: 4 hours → 90 seconds\n• Sales cycle: reduced by 38%\n\n💰 ROI: 420% in 6 months\n\n🚀 GO-LIVE: 48 hours.`;
    }
    if (lower.includes("support") || lower.includes("ticket")) {
      return `⚡ NexusAI Support Automation — Activated\n\n🎯 PROBLEM DETECTED: High support volume\n\n🤖 MODULES DEPLOYED:\n• Omnichannel AI Bot — email, chat, WhatsApp, phone\n• Intent Classifier — prioritizes tickets\n• Knowledge Engine — 87% auto-resolution\n\n📊 EXPECTED OUTCOMES:\n• First response: 6 hours → 12 seconds\n• Support headcount: reduced by 70%\n\n💰 Annual Savings: $340,000+\n\n🚀 GO-LIVE: 48 hours.`;
    }
    return `⚡ NexusAI Business Intelligence — Activated\n\n🎯 CHALLENGE ANALYZED: "${input.slice(0, 60)}..."\n\n🤖 RECOMMENDED MODULES:\n• Process Automation Engine\n• Revenue Intelligence\n• AI Operations Brain\n\n📊 PROJECTIONS:\n• Efficiency: +74% within 90 days\n• Cost savings: $280,000–$1.2M\n\n🚀 NEXT STEP: Book a strategy call.`;
  };

  const handleDemo = async () => {
    if (!demoInput.trim()) return;
    setDemoLoading(true);
    setDemoResult("");
    await new Promise(r => setTimeout(r, 1800));
    setDemoResult(generateAIResponse(demoInput));
    setDemoLoading(false);
  };

  const faqs = [
    { q: "How long does it take to set up?", a: "Most businesses are fully operational in 48 hours. Our AI-guided onboarding automatically connects your existing tools, imports your data, and configures workflows based on your industry." },
    { q: "Do I need technical expertise?", a: "Zero technical skills required. NexusAI is built for business leaders, not engineers. Our visual workflow builder and AI assistant handle all complexity." },
    { q: "What integrations are supported?", a: "500+ native integrations including Salesforce, HubSpot, Shopify, QuickBooks, Slack, Stripe, AWS, Google Workspace, Microsoft 365, and all major ERPs." },
    { q: "Is my data secure?", a: "Bank-grade security: AES-256 encryption, SOC2 Type II certified, ISO 27001 compliant, GDPR/CCPA ready. Data residency options in US, EU, and APAC." },
    { q: "What's the ROI timeline?", a: "Average clients see positive ROI within 6 weeks. Our case studies show 3-8× ROI within 6 months across industries." }
  ];

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: "#050508", color: "#fff", minHeight: "100vh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;800;900&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        .gradient-text { background: linear-gradient(135deg, #fff 0%, #A855F7 50%, #00D4FF 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .btn-primary { background: linear-gradient(135deg, #A855F7, #7C3AED); border: none; cursor: pointer; color: white; font-weight: 700; transition: all 0.3s; }
        .btn-primary:hover { transform: scale(1.02); box-shadow: 0 0 30px rgba(168,85,247,0.4); }
        .btn-ghost { background: transparent; border: 1px solid rgba(255,255,255,0.15); cursor: pointer; color: white; transition: all 0.3s; }
        .btn-ghost:hover { border-color: #A855F7; background: rgba(168,85,247,0.1); }
        .card-hover { transition: all 0.3s; }
        .card-hover:hover { transform: translateY(-6px); }
        @keyframes slide-up { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      {/* Demo Modal */}
      {demoOpen && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.9)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }} onClick={(e) => e.target === e.currentTarget && setDemoOpen(false)}>
          <div style={{ background: "#0d0d14", border: "1px solid rgba(168,85,247,0.3)", borderRadius: 20, padding: 40, maxWidth: 600, width: "100%", maxHeight: "90vh", overflowY: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <div><div style={{ fontSize: 11, color: "#A855F7", fontWeight: 700, letterSpacing: 3 }}>LIVE AI DEMO</div><h3 style={{ fontSize: 22, fontWeight: 800 }}>Ask NexusAI Anything</h3></div>
              <button onClick={() => setDemoOpen(false)} style={{ background: "rgba(255,255,255,0.1)", border: "none", color: "#fff", width: 36, height: 36, borderRadius: 8, cursor: "pointer", fontSize: 18 }}>×</button>
            </div>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, marginBottom: 20 }}>Describe a business challenge and watch our AI build an automation strategy.</p>
            <textarea value={demoInput} onChange={(e) => setDemoInput(e.target.value)} placeholder="e.g. We lose 40% of leads because our sales team can't follow up fast enough." style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(168,85,247,0.3)", borderRadius: 12, padding: 16, color: "#fff", fontSize: 14, resize: "none", height: 100, outline: "none" }} />
            <button onClick={handleDemo} disabled={demoLoading} className="btn-primary" style={{ width: "100%", padding: "14px", borderRadius: 12, marginTop: 12 }}>{demoLoading ? "🤖 AI Analyzing..." : "⚡ Generate Strategy"}</button>
            {demoResult && <div style={{ marginTop: 24, background: "rgba(168,85,247,0.08)", border: "1px solid rgba(168,85,247,0.2)", borderRadius: 12, padding: 20, fontSize: 14, lineHeight: 1.7, whiteSpace: "pre-wrap" }}>{demoResult}</div>}
          </div>
        </div>
      )}

      {/* Navbar */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, padding: "16px 40px", display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(5,5,8,0.95)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: "linear-gradient(135deg,#A855F7,#7C3AED)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>⚡</div>
          <span style={{ fontSize: 18, fontWeight: 800 }}>NexusAI</span>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <button className="btn-ghost" style={{ padding: "9px 20px", borderRadius: 10 }} onClick={() => window.location.href = "/login"}>Sign In</button>
          <button className="btn-primary" style={{ padding: "9px 20px", borderRadius: 10 }} onClick={onGetStarted}>Start Free Trial</button>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center", padding: "140px 40px 80px", background: "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(168,85,247,0.15) 0%, transparent 60%)" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(168,85,247,0.12)", border: "1px solid rgba(168,85,247,0.3)", borderRadius: 100, padding: "8px 18px", marginBottom: 32 }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#A855F7" }} />
          <span style={{ color: "#C084FC", fontSize: 13 }}>Now serving 12,400+ businesses across 137 countries</span>
        </div>
        <h1 style={{ fontSize: "clamp(42px,7vw,80px)", fontWeight: 800, lineHeight: 1.1, letterSpacing: -2, marginBottom: 24 }}>The AI Operating System<br /><span className="gradient-text">for Modern Business</span></h1>
        <p style={{ fontSize: "clamp(16px,2vw,20px)", color: "rgba(255,255,255,0.6)", maxWidth: 600, marginBottom: 40 }}>Replace entire departments with intelligent automation. Sales, support, marketing, finance, operations — all running autonomously 24/7.</p>
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center" }}>
          <button className="btn-primary" style={{ padding: "16px 40px", borderRadius: 14, fontSize: 16 }} onClick={onGetStarted}>Start Free Trial — No Card Needed</button>
          <button className="btn-ghost" style={{ padding: "16px 32px", borderRadius: 14, fontSize: 16 }} onClick={() => setDemoOpen(true)}>▶ Live AI Demo</button>
        </div>
      </section>

      {/* Stats Section */}
      <section style={{ padding: "80px 40px", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 24 }}>
          {STATS.map(s => (
            <div key={s.label} className="card-hover" style={{ textAlign: "center", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: "40px 24px" }}>
              <div style={{ fontSize: "clamp(28px,4vw,48px)", fontWeight: 800, marginBottom: 8, color: "#A855F7" }}>{s.value}</div>
              <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 14 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Modules Section */}
      <section style={{ padding: "80px 40px", maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 60 }}>
          <div style={{ fontSize: 12, color: "#A855F7", letterSpacing: 3, marginBottom: 12 }}>AUTOMATION MODULES</div>
          <h2 style={{ fontSize: "clamp(32px,5vw,48px)", fontWeight: 800 }}>Every department.<br /><span className="gradient-text">Fully automated.</span></h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
          {MODULES.map((m, i) => (
            <div key={i} className="card-hover" style={{ background: "#0d0d14", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: 28 }}>
              <div style={{ fontSize: 40, marginBottom: 16 }}>{m.icon}</div>
              <h3 style={{ fontSize: 18, marginBottom: 10 }}>{m.title}</h3>
              <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, lineHeight: 1.6, marginBottom: 16 }}>{m.desc}</p>
              <div style={{ display: "inline-block", background: "rgba(168,85,247,0.15)", color: "#C084FC", padding: "4px 12px", borderRadius: 100, fontSize: 12 }}>{m.stat}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section style={{ padding: "80px 40px", maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 60 }}>
          <div style={{ fontSize: 12, color: "#A855F7", letterSpacing: 3, marginBottom: 12 }}>PRICING</div>
          <h2 style={{ fontSize: "clamp(32px,5vw,48px)", fontWeight: 800 }}>Simple, transparent pricing</h2>
          <div style={{ display: "inline-flex", background: "rgba(255,255,255,0.05)", borderRadius: 12, padding: 4, marginTop: 24 }}>
            {["monthly", "annual"].map(b => (
              <button key={b} onClick={() => setBilling(b)} style={{ padding: "8px 24px", borderRadius: 8, border: "none", cursor: "pointer", background: billing === b ? "linear-gradient(135deg,#A855F7,#7C3AED)" : "transparent", color: billing === b ? "#fff" : "rgba(255,255,255,0.6)", fontWeight: 600 }}>{b === "annual" ? "Annual (Save 20%)" : "Monthly"}</button>
            ))}
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 24 }}>
          {PLANS.map(plan => (
            <div key={plan.id} className="card-hover" style={{ background: plan.badge ? "linear-gradient(160deg,rgba(168,85,247,0.1),rgba(0,0,0,0.2))" : "#0d0d14", border: `1px solid ${plan.badge ? "rgba(168,85,247,0.4)" : "rgba(255,255,255,0.07)"}`, borderRadius: 20, padding: 32, position: "relative" }}>
              {plan.badge && <div style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)", background: "linear-gradient(135deg,#A855F7,#7C3AED)", padding: "4px 16px", borderRadius: 100, fontSize: 12, fontWeight: 700 }}>{plan.badge}</div>}
              <div style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", marginBottom: 8 }}>{plan.name}</div>
              <div style={{ fontSize: 48, fontWeight: 800, color: plan.color }}>${billing === "annual" ? plan.annual : plan.price}<span style={{ fontSize: 16, color: "rgba(255,255,255,0.4)" }}>/mo</span></div>
              {billing === "annual" && <div style={{ fontSize: 12, color: "#10B981", marginBottom: 16 }}>Save ${(plan.price - plan.annual) * 12}/year</div>}
              <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, margin: "16px 0 24px" }}>{plan.description}</p>
              <button className="btn-primary" style={{ width: "100%", padding: "14px", borderRadius: 12, marginBottom: 24 }} onClick={onGetStarted}>{plan.cta}</button>
              <ul style={{ listStyle: "none" }}>{plan.features.slice(0, 8).map(f => (<li key={f} style={{ display: "flex", gap: 8, fontSize: 13, color: "rgba(255,255,255,0.7)", marginBottom: 10 }}><span style={{ color: plan.color }}>✓</span>{f}</li>))}</ul>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ padding: "80px 40px", background: "rgba(168,85,247,0.03)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontSize: 32, fontWeight: 800, marginBottom: 48 }}>Trusted by <span className="gradient-text">12,400+ businesses</span></h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
            {TESTIMONIALS.map(t => (
              <div key={t.name} style={{ background: "#0d0d14", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: 24, textAlign: "left" }}>
                <div style={{ display: "flex", gap: 2, marginBottom: 16 }}>{"★★★★★".split("").map((s, i) => <span key={i} style={{ color: "#F59E0B", fontSize: 14 }}>{s}</span>)}</div>
                <p style={{ fontSize: 14, lineHeight: 1.6, marginBottom: 20, fontStyle: "italic" }}>"{t.text}"</p>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: "50%", background: t.color, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: "#000" }}>{t.avatar}</div>
                  <div><div style={{ fontWeight: 700 }}>{t.name}</div><div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>{t.role} · {t.country}</div></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: "80px 40px", maxWidth: 800, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{ fontSize: 12, color: "#A855F7", letterSpacing: 3, marginBottom: 12 }}>FAQ</div>
          <h2 style={{ fontSize: 32, fontWeight: 800 }}>Frequently Asked Questions</h2>
        </div>
        {faqs.map((faq, i) => (
          <div key={i} style={{ borderBottom: "1px solid rgba(255,255,255,0.1)", padding: "20px 0" }}>
            <button onClick={() => setActiveFaq(activeFaq === i ? null : i)} style={{ width: "100%", background: "none", border: "none", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", color: "#fff", fontSize: 16, fontWeight: 600 }}>
              {faq.q}<span style={{ fontSize: 24, color: "#A855F7" }}>{activeFaq === i ? "−" : "+"}</span>
            </button>
            {activeFaq === i && <p style={{ marginTop: 16, color: "rgba(255,255,255,0.6)", lineHeight: 1.6 }}>{faq.a}</p>}
          </div>
        ))}
      </section>

      {/* CTA Banner */}
      <section style={{ padding: "80px 40px", margin: "0 40px 80px", background: "linear-gradient(135deg,rgba(168,85,247,0.15),rgba(0,212,255,0.05))", borderRadius: 24, textAlign: "center" }}>
        <h2 style={{ fontSize: "clamp(28px,4vw,48px)", fontWeight: 800, marginBottom: 16 }}>Start automating today.<br /><span className="gradient-text">First 14 days free.</span></h2>
        <p style={{ color: "rgba(255,255,255,0.6)", marginBottom: 32 }}>Join 12,400+ businesses that replaced manual work with intelligent automation.</p>
        <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
          <button className="btn-primary" style={{ padding: "16px 48px", borderRadius: 14, fontSize: 16 }} onClick={onGetStarted}>Get Started Free</button>
          <button className="btn-ghost" style={{ padding: "16px 32px", borderRadius: 14, fontSize: 16 }} onClick={() => setDemoOpen(true)}>Watch Live Demo</button>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid rgba(255,255,255,0.05)", padding: "40px", textAlign: "center", color: "rgba(255,255,255,0.4)", fontSize: 13 }}>
        <p>© 2026 NexusAI Inc. All rights reserved. Serving 137 countries worldwide.</p>
      </footer>
    </div>
  );
}