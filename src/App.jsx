import Preloader from './components/Preloader';
import { useState, useEffect, useRef } from "react";
import CustomCursor from './components/CustomCursor';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import DashboardPage from './pages/DashboardPage';
import VerifyEmailPage from './pages/VerifyEmailPage';
import AdminPage from './pages/AdminPage';
import { callClaudeAPI, callOpenAIAPI, getAPIKey, isAPIConfigured } from './utils/api';
import APISettingsModal from './components/APISettingsModal';

const PLANS = [
  {
    id: "starter",
    name: "Starter",
    price: 299,
    annual: 249,
    color: "#00D4FF",
    description: "For growing businesses ready to automate",
    features: [
      "5 AI Automation Workflows",
      "10,000 monthly operations",
      "CRM & Lead Management",
      "Email & SMS Automation",
      "AI Customer Support Bot",
      "Basic Analytics Dashboard",
      "API Access (1,000 calls/mo)",
      "Email Support",
    ],
    cta: "Start Free Trial",
  },
  {
    id: "pro",
    name: "Professional",
    price: 799,
    annual: 649,
    color: "#A855F7",
    badge: "Most Popular",
    description: "For serious businesses scaling globally",
    features: [
      "Unlimited AI Workflows",
      "500,000 monthly operations",
      "Advanced CRM + Sales Pipeline",
      "Omnichannel Marketing Automation",
      "AI Voice & Chat Support (24/7)",
      "Real-time Business Intelligence",
      "API Access (50,000 calls/mo)",
      "Multi-language Support (40+)",
      "White-label Options",
      "Priority Support + SLA",
    ],
    cta: "Start Free Trial",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: 2499,
    annual: 1999,
    color: "#F59E0B",
    description: "For enterprises dominating their markets",
    features: [
      "Everything in Professional",
      "Unlimited Operations",
      "Custom AI Model Training",
      "Dedicated Infrastructure",
      "Advanced Security & Compliance",
      "Custom Integrations (500+)",
      "Unlimited API Access",
      "99.99% SLA Guarantee",
      "Dedicated Success Manager",
      "Custom Contracts & Invoicing",
    ],
    cta: "Contact Sales",
  },
];

const MODULES = [
  { icon: "🤖", title: "AI Sales Agent", desc: "Autonomous AI closes deals 24/7. Qualifies leads, books meetings, sends follow-ups — all without human intervention.", stat: "3.4× revenue increase" },
  { icon: "📊", title: "Revenue Intelligence", desc: "Predictive forecasting powered by machine learning. Know which deals will close before your team does.", stat: "94% forecast accuracy" },
  { icon: "💬", title: "Omnichannel AI Support", desc: "One AI brain across email, chat, WhatsApp, SMS, and voice. Resolves 87% of tickets without human touch.", stat: "87% auto-resolution" },
  { icon: "📣", title: "Marketing Autopilot", desc: "AI-generated campaigns, audience segmentation, A/B testing, and attribution — running 24/7.", stat: "5.8× ROAS improvement" },
  { icon: "⚙️", title: "Process Automation Engine", desc: "Connect 500+ apps. Build workflows with AI drag-and-drop. Eliminate repetitive tasks company-wide.", stat: "82% time saved" },
  { icon: "🌍", title: "Global Compliance Layer", desc: "GDPR, CCPA, SOC2, ISO 27001. Auto-compliance monitoring across 60+ jurisdictions.", stat: "60+ jurisdictions" },
  { icon: "📦", title: "Inventory & Supply Chain AI", desc: "Predict demand, auto-reorder, optimize suppliers. Zero stockouts, zero overstock.", stat: "99.2% inventory accuracy" },
  { icon: "💰", title: "Finance Automation", desc: "Invoicing, collections, reconciliation, and reporting — fully automated and audit-ready.", stat: "92% less manual work" },
];

const TESTIMONIALS = [
  { name: "Sarah Chen", role: "CEO, TechVenture Asia", avatar: "SC", color: "#00D4FF", text: "NexusAI replaced 14 full-time roles and increased our revenue by 340% in 8 months. This is the future of business.", country: "🇸🇬 Singapore" },
  { name: "Marcus Okonkwo", role: "COO, FinEdge Nigeria", avatar: "MO", color: "#A855F7", text: "We went from 200 support tickets/day requiring 12 agents to zero agents. The AI handles everything flawlessly.", country: "🇳🇬 Nigeria" },
  { name: "Isabella Torres", role: "Founder, ScaleUp Brazil", avatar: "IT", color: "#F59E0B", text: "Our sales pipeline went from chaos to clockwork. $2M in new ARR attributed directly to NexusAI's sales automation.", country: "🇧🇷 Brazil" },
  { name: "Dmitri Volkov", role: "CTO, LogiFlow Europe", avatar: "DV", color: "#10B981", text: "The compliance automation alone saves us €180,000/year in consulting fees. ROI was immediate.", country: "🇩🇪 Germany" },
];

const STATS = [
  { value: "12,400+", label: "Businesses Automated" },
  { value: "$4.2B", label: "Revenue Generated for Clients" },
  { value: "99.97%", label: "Platform Uptime" },
  { value: "137", label: "Countries Served" },
];

// AI Agents Data
const AI_AGENTS = [
  { id: "sales", name: "Sales Agent", icon: "💼", color: "#6EE7B7", gradient: "linear-gradient(135deg, #6EE7B7, #34D399)", tagline: "Closes deals while you sleep", description: "Qualifies leads, writes pitches, handles objections.", prompts: ["Write a cold email for SaaS", "Handle price objection", "Qualify this lead"] },
  { id: "support", name: "Support Agent", icon: "🎧", color: "#818CF8", gradient: "linear-gradient(135deg, #818CF8, #6366F1)", tagline: "Resolves tickets fast", description: "Handles customer queries, refunds, escalations.", prompts: ["Customer charged twice", "Write refund policy", "Angry customer response"] },
  { id: "marketing", name: "Marketing Agent", icon: "📣", color: "#FB923C", gradient: "linear-gradient(135deg, #FB923C, #F97316)", tagline: "Campaigns that convert", description: "Ad copy, email campaigns, marketing strategies.", prompts: ["Facebook ad variations", "Email welcome sequence", "SEO blog outline"] },
  { id: "operations", name: "Operations Agent", icon: "⚙️", color: "#F472B6", gradient: "linear-gradient(135deg, #F472B6, #EC4899)", tagline: "Optimizes processes", description: "Workflows, bottlenecks, SOPs.", prompts: ["Onboarding automation", "Invoice workflow", "Process bottlenecks"] },
  { id: "analytics", name: "Analytics Agent", icon: "📊", color: "#38BDF8", gradient: "linear-gradient(135deg, #38BDF8, #0EA5E9)", tagline: "Turns data into decisions", description: "Metrics, trends, forecasts.", prompts: ["Analyze MRR & churn", "Sales conversion low", "Forecast growth"] },
  { id: "finance", name: "Finance Agent", icon: "💰", color: "#A3E635", gradient: "linear-gradient(135deg, #A3E635, #84CC16)", tagline: "CFO intelligence", description: "Reports, projections, pricing.", prompts: ["Cash flow projection", "Burn rate analysis", "Pricing strategy"] },
  { id: "chatbot", name: "ChatBot Agent", icon: "💬", color: "#E1306C", gradient: "linear-gradient(135deg, #E1306C, #DB2777)", tagline: "24/7 across all platforms", description: "Facebook, Instagram, WhatsApp, Twitter, LinkedIn, Website.", prompts: ["Instagram: hours & refunds", "Facebook: Pro plan interest", "WhatsApp: order not arrived", "Website: cancel subscription"] }
];

// Loading Skeleton Components
function StatsSkeleton() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20, marginBottom: 40 }}>
      {[1, 2, 3, 4].map(i => (
        <div key={i} style={{ background: "rgba(13,13,20,0.6)", borderRadius: 20, padding: 24, animation: "skeletonPulse 1.5s ease-in-out infinite" }}>
          <div style={{ height: 12, background: "rgba(255,255,255,0.08)", borderRadius: 4, marginBottom: 16, width: "60%" }} />
          <div style={{ height: 38, background: "rgba(255,255,255,0.06)", borderRadius: 8, marginBottom: 8, width: "50%" }} />
          <div style={{ height: 12, background: "rgba(255,255,255,0.05)", borderRadius: 4, width: "40%" }} />
        </div>
      ))}
      <style>{`@keyframes skeletonPulse { 0%,100%{opacity:1} 50%{opacity:0.5} }`}</style>
    </div>
  );
}

function AgentsSkeleton() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: 20 }}>
      {[1, 2, 3, 4, 5, 6, 7].map(i => (
        <div key={i} style={{ background: "rgba(13,13,20,0.6)", borderRadius: 20, padding: 28, textAlign: "center", animation: "skeletonPulse 1.5s ease-in-out infinite" }}>
          <div style={{ width: 52, height: 52, background: "rgba(255,255,255,0.08)", borderRadius: 26, margin: "0 auto 16px" }} />
          <div style={{ height: 18, background: "rgba(255,255,255,0.08)", borderRadius: 4, marginBottom: 8, width: "70%", margin: "0 auto" }} />
          <div style={{ height: 12, background: "rgba(255,255,255,0.06)", borderRadius: 4, width: "50%", margin: "0 auto" }} />
        </div>
      ))}
    </div>
  );
}

function CountUp({ target, suffix = "", duration = 2000 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const numStr = target.replace(/[^0-9.]/g, "");
          const num = parseFloat(numStr);
          const steps = 60;
          let step = 0;
          const interval = setInterval(() => {
            step++;
            let currentValue = Math.round((num * step) / steps);
            setCount(currentValue);
            if (step >= steps) clearInterval(interval);
          }, duration / steps);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);

  const getFormattedValue = () => {
    if (target.includes("$")) {
      if (target.includes("B")) {
        return `$${count}B+`;
      }
      return `$${count}M+`;
    }
    if (target.includes("%")) {
      return `${count}%`;
    }
    if (target.includes("+")) {
      return `${count}+`;
    }
    return count.toString();
  };

  return <span ref={ref}>{getFormattedValue()}</span>;
}

function generateBeautifulResponse(input, agent) {
  const lower = input.toLowerCase();
  const header = `${agent.icon} **${agent.name}** — *${agent.tagline}*\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
  const footer = `\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n*How would you like to proceed?* ✨`;
  
  if (agent.id === "sales") {
    if (lower.includes("email") || lower.includes("cold")) {
      return header + 
        `**Cold Email Template**\n\n` +
        `**Subject:** Cut response time from 4 hours to 90 seconds\n\n` +
        `Hi {Name},\n\n` +
        `Manual lead follow-up is costing you deals. NexusAI's Sales Agent qualifies and responds to every lead in under 90 seconds - 24/7.\n\n` +
        `**Our clients see:**\n` +
        `• 3.4x revenue increase\n` +
        `• 38% shorter sales cycles\n` +
        `• 100% lead response rate\n\n` +
        `Want a 2-min demo?\n\n` +
        `Best,\n{Your Name}` +
        footer;
    }
    return header +
      `**Analysis Complete**\n\n` +
      `**Strategy Deployed:**\n` +
      `• AI Sales Agent activated\n` +
      `• Lead qualification in <90 seconds\n` +
      `• 12-touch automated follow-up\n` +
      `• Smart meeting booking system\n\n` +
      `**Projected Outcomes:**\n` +
      `• 3.4× revenue increase\n` +
      `• 38% shorter sales cycles\n` +
      `• 100% lead response rate\n\n` +
      `**ROI Timeline:**\n` +
      `• Month 1: Setup & baseline\n` +
      `• Month 2: +65% more qualified meetings\n` +
      `• Month 3: 2.8× revenue per rep\n` +
      `• 6-Month ROI: 420%` +
      footer;
  }
  
  if (agent.id === "support") {
    if (lower.includes("refund") || lower.includes("charged")) {
      return header +
        `**Refund Request Resolution**\n\n` +
        `**Issue:** Duplicate charge detected\n\n` +
        `**Action Taken:**\n` +
        `• Double charge of $299 verified\n` +
        `• Refund initiated immediately\n` +
        `• Confirmation email sent\n\n` +
        `**Timeline:** 3-5 business days to reflect\n\n` +
        `**Status:** Resolved` +
        footer;
    }
    return header +
      `🔍 **Issue Analysis**\n\n` +
      `**Problem:** Customer inquiry received\n` +
      `**Priority:** Normal\n` +
      `**Estimated resolution:** 2 minutes\n\n` +
      `**Recommended Solution:**\n` +
      `• Try refreshing your browser\n` +
      `• Clear cache and cookies\n` +
      `• Technical team notified if persists\n\n` +
      `**Need immediate help?** Reply "ESCALATE"` +
      footer;
  }
  
  if (agent.id === "marketing") {
    if (lower.includes("facebook") || lower.includes("ad")) {
      return header +
        `**Facebook Ad Variations**\n\n` +
        `**Ad 1 (Problem-Agitation):**\n` +
        `"Your sales team is sleeping on qualified leads"\n\n` +
        `**Ad 2 (Social Proof):**\n` +
        `"12,400+ businesses replaced their ops team with AI"\n\n` +
        `**Ad 3 (Urgency):**\n` +
        `"Get 3.4x more revenue. Start free today."\n\n` +
        `**CTA:** "Claim 14-Day Trial →"\n\n` +
        `**Targeting:** B2B, C-Suite, Founders` +
        footer;
    }
    return header +
      `**Campaign Strategy**\n\n` +
      `**Channel Mix:**\n` +
      `• LinkedIn: 50% budget (Thought leadership)\n` +
      `• Google Ads: 30% (High intent search)\n` +
      `• Email: 20% (Nurture sequences)\n\n` +
      `**Target Audience:** SaaS companies & business owners\n\n` +
      `**Projected Outcomes:**\n` +
      `• 5.8x ROAS within 90 days\n` +
      `• 41% email open rates\n` +
      `• $1.2M attributed revenue` +
      footer;
  }
  
  if (agent.id === "operations") {
    return header +
      `**Process Analysis**\n\n` +
      `**Current Workflow Mapped**\n` +
      `**Bottlenecks Identified:**\n` +
      `• Manual data entry between systems\n` +
      `• Approval delays waiting for signatures\n` +
      `• No automated follow-up system\n\n` +
      `**Optimization Recommendations:**\n` +
      `• Connect systems via API\n` +
      `• Set up conditional approval routing\n` +
      `• Deploy automated reminders\n` +
      `• Create central dashboard\n\n` +
      `**Efficiency Gain:** 67% time reduction` +
      footer;
  }
  
  if (agent.id === "analytics") {
    return header +
      `**Key Metrics Analysis**\n\n` +
      `**Current Performance:**\n` +
      `• MRR growth: 12% MoM\n` +
      `• Customer churn: 8%\n` +
      `• CAC: $320\n` +
      `• LTV: $1,200\n\n` +
      `**Top 3 Recommendations:**\n` +
      `1. Reduce churn by 3% → +$47K annual revenue\n` +
      `2. Optimize CAC to $250 → Save $24K/month\n` +
      `3. Increase LTV to $1,500 → +$89K ARPU\n\n` +
      `**Next Quarter Forecast:** 15% growth to $62K MRR` +
      footer;
  }
  
  if (agent.id === "finance") {
    return header +
      `**Financial Analysis**\n\n` +
      `**Current State:**\n` +
      `• Current MRR: $50,000\n` +
      `• Monthly expenses: $35,000\n` +
      `• Gross margin: 70%\n` +
      `• Burn rate: $8,000/month\n\n` +
      `**Key Metrics:**\n` +
      `• CAC: $320\n` +
      `• LTV: $1,200\n` +
      `• LTV/CAC Ratio: 3.75x\n` +
      `• Payback period: 6 months\n\n` +
      `**Optimization Opportunities:**\n` +
      `• Reduce software waste: Save $2K/month\n` +
      `• Negotiate vendor contracts: Save $5K/month\n` +
      `• Automate invoicing: Reduce DSO by 42%` +
      footer;
  }
  
  if (agent.id === "chatbot") {
    if (lower.includes("instagram") || lower.includes("ig")) {
      return header +
        `📸 **Instagram DM Response**\n\n` +
        `Hey! Thanks for reaching out on Instagram!\n\n` +
        `**Quick Info:**\n` +
        `• Pricing: Plans start at $299/month\n` +
        `• Demo: Reply "DEMO" for calendar link\n` +
        `• FAQs: Check nexusai.com/help\n\n` +
        `What specific information are you looking for?` +
        footer;
    }
    if (lower.includes("facebook") || lower.includes("fb") || lower.includes("messenger")) {
      return header +
        `💬 **Facebook Messenger Response**\n\n` +
        `Hi there! Thanks for messaging NexusAI on Facebook.\n\n` +
        `**Quick options:**\n` +
        `1️⃣ Talk to a human agent\n` +
        `2️⃣ Get pricing details\n` +
        `3️⃣ Book a demo call\n\n` +
        `Just reply with 1, 2, or 3 and I'll help you immediately!` +
        footer;
    }
    if (lower.includes("whatsapp") || lower.includes("wa")) {
      return header +
        `💚 **WhatsApp Response**\n\n` +
        `Hello! 👋 This is NexusAI's automated support on WhatsApp.\n\n` +
        `✅ **Your request has been received.**\n` +
        `⏱️ **Response time:** Typically within 2 minutes\n` +
        `📞 **Urgent?** Reply "URGENT" and I'll prioritize\n\n` +
        `Is there anything else I can help with?` +
        footer;
    }
    if (lower.includes("twitter") || lower.includes("x")) {
      return header +
        `**Twitter/X Response**\n\n` +
        `Thanks for the DM!\n\n` +
        `**Quick answer:**\n` +
        `• NexusAI helps automate sales, support & marketing\n` +
        `• Trusted by 12,400+ companies worldwide\n` +
        `• 14-day free trial, no credit card needed\n\n` +
        `Need more details? Just ask!` +
        footer;
    }
    if (lower.includes("linkedin")) {
      return header +
        `**LinkedIn Response**\n\n` +
        `Hello, thank you for connecting!\n\n` +
        `**ROI Example:**\n` +
        `Companies save $284,000+ annually with our AI agents\n` +
        `• 3.4x revenue increase\n` +
        `• 87% ticket auto-resolution\n` +
        `• 48-hour setup\n\n` +
        `**Next step:** 15-min discovery call?\n` +
        `Reply "YES" for a calendar link!` +
        footer;
    }
    return header +
      `🌐 **Available Platforms**\n\n` +
      `**NexusAI ChatBot works on:**\n` +
      `• Facebook Messenger ✓\n` +
      `• Instagram DMs ✓\n` +
      `• WhatsApp Business ✓\n` +
      `• Twitter/X ✓\n` +
      `• LinkedIn ✓\n` +
      `• Website Chat Widget ✓\n\n` +
      `**Quick Actions:**\n` +
      `• Type "PRICING" for plans\n` +
      `• Type "DEMO" for video\n` +
      `• Type "HUMAN" for live agent` +
      footer;
  }
  
  return header +
    `🤖 **AI Analysis**\n\n` +
    `**Request received:** "${input.slice(0, 80)}..."\n\n` +
    `**Processing your business context...**\n\n` +
    `Detailed solution coming momentarily` +
    footer;
}

function TypingDots({ color }) {
  return (
    <span style={{ display: "inline-flex", gap: 6, alignItems: "center" }}>
      {[0, 1, 2].map(i => (
        <span key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: color, animation: `bounceNew 1.4s ${i * 0.15}s infinite` }} />
      ))}
      <style>{`
        @keyframes bounceNew {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
          30% { transform: translateY(-8px); opacity: 1; }
        }
      `}</style>
    </span>
  );
}

function ThemeToggleButton() {
  const { isDark, toggleTheme } = useTheme();
  
  return (
    <button
      onClick={toggleTheme}
      style={{
        background: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.05)",
        border: isDark ? "1px solid rgba(255,255,255,0.2)" : "1px solid rgba(0,0,0,0.15)",
        borderRadius: 40,
        padding: "8px 18px",
        cursor: "pointer",
        color: isDark ? "#fff" : "#1a1a1a",
        display: "flex",
        alignItems: "center",
        gap: 8,
        fontFamily: "'Syne', sans-serif",
        fontSize: 13,
        fontWeight: 500,
        transition: "all 0.3s"
      }}
      onMouseEnter={(e) => {
        e.target.style.background = isDark ? "rgba(168,85,247,0.15)" : "rgba(168,85,247,0.1)";
        e.target.style.borderColor = isDark ? "rgba(168,85,247,0.4)" : "rgba(168,85,247,0.3)";
      }}
      onMouseLeave={(e) => {
        e.target.style.background = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.05)";
        e.target.style.borderColor = isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.15)";
      }}
    >
      <span style={{ fontSize: 16 }}>{isDark ? "☀️" : "🌙"}</span>
      <span>{isDark ? "Light Mode" : "Dark Mode"}</span>
    </button>
  );
}

function AgentChatPage({ agent, onBack }) {
  const [isDark, setIsDark] = useState(true);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [streamText, setStreamText] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamText]);

  const sendMessage = async (text) => {
    const msg = text || input;
    if (!msg.trim() || loading) return;
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: msg }]);
    setLoading(true);
    setStreamText("");
    await new Promise(r => setTimeout(r, 800));
    const response = generateBeautifulResponse(msg, agent);
    const words = response.split(" ");
    for (let i = 0; i <= words.length; i++) {
      await new Promise(r => setTimeout(r, 15));
      setStreamText(words.slice(0, i).join(" "));
    }
    setMessages(prev => [...prev, { role: "agent", content: response }]);
    setStreamText("");
    setLoading(false);
  };

  return (
    <div style={{ 
      position: "fixed", 
      inset: 0, 
      background: isDark ? "#050508" : "#f5f5f5", 
      zIndex: 300, 
      display: "flex", 
      flexDirection: "column",
      overflow: "hidden"
    }}>
      
      <div style={{ 
        position: "absolute", 
        inset: 0, 
        backgroundImage: isDark ? "linear-gradient(rgba(168,85,247,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(168,85,247,0.03) 1px, transparent 1px)" : "linear-gradient(rgba(168,85,247,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(168,85,247,0.02) 1px, transparent 1px)", 
        backgroundSize: "50px 50px", 
        pointerEvents: "none" 
      }} />
      
      <div style={{
        position: "absolute",
        top: "10%",
        left: "-5%",
        width: 400,
        height: 400,
        borderRadius: "50%",
        background: isDark ? "radial-gradient(circle, rgba(168,85,247,0.15), transparent)" : "radial-gradient(circle, rgba(168,85,247,0.08), transparent)",
        filter: "blur(60px)",
        animation: "floatNexus 12s ease-in-out infinite",
        pointerEvents: "none"
      }} />
      <div style={{
        position: "absolute",
        bottom: "10%",
        right: "-5%",
        width: 350,
        height: 350,
        borderRadius: "50%",
        background: isDark ? "radial-gradient(circle, rgba(0,212,255,0.08), transparent)" : "radial-gradient(circle, rgba(0,212,255,0.04), transparent)",
        filter: "blur(60px)",
        animation: "floatNexus 10s ease-in-out infinite reverse",
        pointerEvents: "none"
      }} />
      <div style={{
        position: "absolute",
        top: "40%",
        right: "20%",
        width: 200,
        height: 200,
        borderRadius: "50%",
        background: isDark ? "radial-gradient(circle, rgba(245,158,11,0.08), transparent)" : "radial-gradient(circle, rgba(245,158,11,0.04), transparent)",
        filter: "blur(50px)",
        animation: "floatNexus 14s ease-in-out infinite 2s",
        pointerEvents: "none"
      }} />

      <div style={{ 
        position: "relative",
        zIndex: 10,
        margin: "24px 32px 0 32px",
        borderRadius: 24,
        background: isDark ? "rgba(13,13,20,0.7)" : "rgba(255,255,255,0.7)",
        backdropFilter: "blur(20px)",
        borderBottom: `2px solid ${agent.color}`,
        border: isDark ? `1px solid rgba(168,85,247,0.2)` : `1px solid rgba(168,85,247,0.3)`,
        boxShadow: isDark ? "0 8px 32px rgba(0,0,0,0.3)" : "0 8px 32px rgba(0,0,0,0.1)",
        display: "flex", 
        alignItems: "center", 
        justifyContent: "space-between",
        padding: "12px 24px"
      }}>
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 2,
          background: `linear-gradient(90deg, transparent, ${agent.color}, ${agent.color}, transparent)`,
          opacity: 0.6
        }} />
        
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <button 
            onClick={onBack} 
            style={{ 
              background: isDark ? "rgba(168,85,247,0.1)" : "rgba(168,85,247,0.08)", 
              border: isDark ? "1px solid rgba(168,85,247,0.3)" : "1px solid rgba(168,85,247,0.2)", 
              borderRadius: 14, 
              padding: "10px 16px", 
              color: isDark ? "#fff" : "#1a1a1a", 
              fontSize: 18, 
              cursor: "pointer",
              transition: "all 0.3s",
              fontFamily: "'Syne', sans-serif"
            }}
            onMouseEnter={(e) => {
              e.target.style.background = isDark ? "rgba(168,85,247,0.2)" : "rgba(168,85,247,0.15)";
              e.target.style.transform = "scale(1.05)";
            }}
            onMouseLeave={(e) => {
              e.target.style.background = isDark ? "rgba(168,85,247,0.1)" : "rgba(168,85,247,0.08)";
              e.target.style.transform = "scale(1)";
            }}
          >← Back</button>
          
          <div style={{ 
            width: 56, 
            height: 56, 
            borderRadius: 18, 
            background: `linear-gradient(135deg, ${agent.color}25, ${isDark ? "rgba(13,13,20,0.9)" : "rgba(255,255,255,0.9)"})`, 
            border: `1px solid ${agent.color}50`, 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center", 
            fontSize: 28,
            boxShadow: `0 0 25px ${agent.color}20`,
            animation: "glowPulse 3s infinite"
          }}>{agent.icon}</div>
          
          <div>
            <div style={{ 
              fontWeight: 800, 
              fontSize: 22, 
              letterSpacing: -0.5,
              background: `linear-gradient(135deg, ${isDark ? "#fff" : "#1a1a1a"}, ${agent.color}, ${agent.color})`, 
              WebkitBackgroundClip: "text", 
              WebkitTextFillColor: "transparent",
              backgroundClip: "text"
            }}>{agent.name}</div>
            <div style={{ fontSize: 13, color: agent.color, opacity: 0.8, fontFamily: "'DM Sans', sans-serif" }}>{agent.tagline}</div>
          </div>
        </div>
        
        <div style={{ 
          display: "flex", 
          alignItems: "center", 
          gap: 10, 
          padding: "8px 18px", 
          background: `linear-gradient(135deg, ${agent.color}08, transparent)`, 
          borderRadius: 100,
          border: `1px solid ${agent.color}25`
        }}>
          <div style={{ 
            width: 10, 
            height: 10, 
            borderRadius: "50%", 
            background: "#10B981", 
            boxShadow: "0 0 10px #10B981",
            animation: "pulse-ring 1.5s infinite"
          }} />
          <span style={{ fontSize: 12, color: "#10B981", fontWeight: 500, fontFamily: "'DM Sans', sans-serif" }}>Fully Operational</span>
        </div>
      </div>

      <div style={{ 
        flex: 1, 
        overflowY: "auto", 
        padding: "32px 40px",
        position: "relative",
        zIndex: 10,
        scrollBehavior: "smooth"
      }}>
        {messages.length === 0 ? (
          <div style={{ 
            textAlign: "center", 
            padding: "80px 32px", 
            maxWidth: 600, 
            margin: "60px auto",
            background: isDark ? "rgba(13,13,20,0.5)" : "rgba(255,255,255,0.5)",
            backdropFilter: "blur(10px)",
            borderRadius: 32,
            border: isDark ? "1px solid rgba(168,85,247,0.15)" : "1px solid rgba(168,85,247,0.2)",
            boxShadow: isDark ? "0 20px 40px rgba(0,0,0,0.3)" : "0 20px 40px rgba(0,0,0,0.08)"
          }}>
            <div style={{ 
              fontSize: 80, 
              marginBottom: 24,
              filter: "drop-shadow(0 0 30px rgba(168,85,247,0.4))",
              animation: "floatNexus 4s ease-in-out infinite"
            }}>{agent.icon}</div>
            <h2 style={{ 
              fontSize: 32, 
              marginBottom: 16, 
              fontWeight: 800,
              letterSpacing: -1,
              background: `linear-gradient(135deg, ${isDark ? "#fff" : "#1a1a1a"}, ${agent.color}, #A855F7)`, 
              WebkitBackgroundClip: "text", 
              WebkitTextFillColor: "transparent"
            }}>{agent.name}</h2>
            <p style={{ color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)", marginBottom: 40, fontSize: 15, lineHeight: 1.6 }}>{agent.description}</p>
            
            <div style={{ 
              display: "grid", 
              gridTemplateColumns: "repeat(2,1fr)", 
              gap: 14,
              background: isDark ? "rgba(0,0,0,0.3)" : "rgba(0,0,0,0.05)",
              padding: 24,
              borderRadius: 28,
              border: isDark ? "1px solid rgba(168,85,247,0.1)" : "1px solid rgba(168,85,247,0.15)"
            }}>
              <div style={{ gridColumn: "span 2", marginBottom: 8 }}>
                <span style={{ fontSize: 12, color: agent.color, letterSpacing: 2, fontWeight: 600 }}>SUGGESTED PROMPTS</span>
              </div>
              {agent.prompts.slice(0, 4).map((p, i) => (
                <button 
                  key={i} 
                  onClick={() => sendMessage(p)} 
                  className="premium-prompt-btn"
                  style={{ 
                    padding: "14px 20px", 
                    background: `linear-gradient(135deg, ${agent.color}08, ${isDark ? "rgba(13,13,20,0.8)" : "rgba(255,255,255,0.8)"})`, 
                    border: `1px solid ${agent.color}25`, 
                    borderRadius: 16, 
                    color: isDark ? "#fff" : "#1a1a1a", 
                    cursor: "pointer", 
                    fontSize: 12, 
                    textAlign: "left",
                    transition: "all 0.3s",
                    fontFamily: "'DM Sans', sans-serif",
                    fontWeight: 500
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = `linear-gradient(135deg, ${agent.color}18, ${isDark ? "rgba(13,13,20,0.9)" : "rgba(255,255,255,0.9)"})`;
                    e.target.style.borderColor = agent.color;
                    e.target.style.transform = "translateX(6px)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = `linear-gradient(135deg, ${agent.color}08, ${isDark ? "rgba(13,13,20,0.8)" : "rgba(255,255,255,0.8)"})`;
                    e.target.style.borderColor = `${agent.color}25`;
                    e.target.style.transform = "translateX(0)";
                  }}
                >✨ {p}</button>
              ))}
            </div>
          </div>
        ) : (
          <div style={{ maxWidth: 900, margin: "0 auto" }}>
            {messages.map((msg, i) => (
              <div 
                key={i} 
                className="message-animate"
                style={{ 
                  display: "flex", 
                  justifyContent: msg.role === "user" ? "flex-end" : "flex-start", 
                  marginBottom: 28,
                }}
              >
                {msg.role === "agent" && (
                  <div style={{ 
                    width: 46, 
                    height: 46, 
                    borderRadius: 16, 
                    background: `linear-gradient(135deg, ${agent.color}25, ${agent.color}05)`, 
                    border: `1px solid ${agent.color}35`,
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "center", 
                    fontSize: 22, 
                    marginRight: 16, 
                    flexShrink: 0,
                    boxShadow: `0 4px 15px ${agent.color}15`
                  }}>{agent.icon}</div>
                )}
                
                <div style={{ maxWidth: "68%" }}>
                  <div style={{
                    padding: "18px 24px",
                    borderRadius: msg.role === "user" ? "24px 24px 6px 24px" : "24px 24px 24px 6px",
                    background: msg.role === "user" 
                      ? `linear-gradient(135deg, ${agent.color}20, ${agent.color}08)` 
                      : isDark ? "rgba(18,18,27,0.85)" : "rgba(240,240,245,0.85)",
                    border: `1px solid ${msg.role === "user" ? agent.color + "40" : isDark ? "rgba(168,85,247,0.15)" : "rgba(168,85,247,0.2)"}`,
                    backdropFilter: "blur(10px)",
                    boxShadow: msg.role === "user" 
                      ? `0 6px 20px ${agent.color}15` 
                      : isDark ? "0 6px 20px rgba(0,0,0,0.2)" : "0 6px 20px rgba(0,0,0,0.05)",
                    whiteSpace: "pre-wrap",
                    fontSize: 14,
                    lineHeight: 1.7,
                    color: isDark ? "#f0f0f0" : "#1a1a1a",
                    fontFamily: "'DM Sans', sans-serif"
                  }}>
                    {msg.content}
                  </div>
                  <div style={{ 
                    fontSize: 10, 
                    color: isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)", 
                    marginTop: 8, 
                    paddingLeft: 16,
                    display: "flex",
                    gap: 16,
                    fontFamily: "'DM Sans', sans-serif"
                  }}>
                    <span>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    {msg.role === "agent" && (
                      <span style={{ color: agent.color }}>✦ AI Generated</span>
                    )}
                    {msg.role === "user" && (
                      <span>✓ Delivered</span>
                    )}
                  </div>
                </div>
                
                {msg.role === "user" && (
                  <div style={{ 
                    width: 46, 
                    height: 46, 
                    borderRadius: 16, 
                    background: "linear-gradient(135deg, #A855F7, #7C3AED)", 
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "center", 
                    fontSize: 18, 
                    marginLeft: 16, 
                    flexShrink: 0,
                    boxShadow: "0 4px 15px rgba(168,85,247,0.3)"
                  }}>👤</div>
                )}
              </div>
            ))}
            
            {loading && (
              <div style={{ display: "flex", justifyContent: "flex-start", marginBottom: 28 }}>
                <div style={{ 
                  width: 46, 
                  height: 46, 
                  borderRadius: 16, 
                  background: `${agent.color}18`, 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center", 
                  fontSize: 22, 
                  marginRight: 16,
                  border: `1px solid ${agent.color}30`
                }}>{agent.icon}</div>
                <div style={{
                  padding: "18px 24px",
                  background: isDark ? "rgba(18,18,27,0.85)" : "rgba(240,240,245,0.85)",
                  backdropFilter: "blur(10px)",
                  borderRadius: 24,
                  border: `1px solid ${agent.color}20`,
                  minWidth: 120,
                  color: isDark ? "#fff" : "#1a1a1a"
                }}>
                  {streamText || <TypingDots color={agent.color} />}
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      <div style={{ 
        position: "relative",
        zIndex: 10,
        padding: "20px 40px 32px 40px",
        background: isDark ? "linear-gradient(to top, #0a0a0f, transparent)" : "linear-gradient(to top, #e0e0e5, transparent)",
        borderTop: isDark ? "1px solid rgba(168,85,247,0.08)" : "1px solid rgba(168,85,247,0.1)"
      }}>
        <div style={{ 
          display: "flex", 
          gap: 16, 
          maxWidth: 900, 
          margin: "0 auto",
          position: "relative"
        }}>
          <div style={{
            position: "absolute",
            inset: -1.5,
            borderRadius: 28,
            background: `linear-gradient(90deg, ${agent.color}, #A855F7, #00D4FF, ${agent.color})`,
            backgroundSize: "300% 100%",
            opacity: 0.4,
            filter: "blur(8px)",
            animation: "borderFlow 4s linear infinite"
          }} />
          
          <textarea 
            value={input} 
            onChange={(e) => setInput(e.target.value)} 
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }} 
            placeholder={`Ask ${agent.name} anything... (Press Enter to send)`} 
            style={{ 
              flex: 1, 
              background: isDark ? "rgba(8,8,14,0.95)" : "rgba(255,255,255,0.95)",
              border: `1px solid ${agent.color}35`,
              borderRadius: 24, 
              padding: "16px 24px", 
              color: isDark ? "#fff" : "#1a1a1a", 
              fontSize: 14, 
              resize: "none", 
              outline: "none", 
              fontFamily: "'DM Sans', sans-serif", 
              minHeight: 56,
              backdropFilter: "blur(10px)",
              transition: "all 0.3s"
            }} 
            onFocus={(e) => e.target.style.borderColor = agent.color}
            onBlur={(e) => e.target.style.borderColor = `${agent.color}35`}
            rows={2} 
          />
          
          <button 
            onClick={() => sendMessage()} 
            disabled={loading || !input.trim()} 
            className="send-btn"
            style={{ 
              width: 56, 
              height: 56, 
              borderRadius: 20, 
              background: loading || !input.trim() ? (isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.05)") : `linear-gradient(135deg, ${agent.color}, #A855F7)`, 
              border: "none", 
              cursor: loading || !input.trim() ? "not-allowed" : "pointer", 
              fontSize: 22, 
              color: "#fff",
              transition: "all 0.3s",
              boxShadow: loading || !input.trim() ? "none" : `0 4px 20px ${agent.color}40`
            }}
            onMouseEnter={(e) => {
              if (!loading && input.trim()) {
                e.target.style.transform = "scale(1.05)";
              }
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "scale(1)";
            }}
          >↑</button>
        </div>
        
        <div style={{ 
          display: "flex", 
          justifyContent: "center", 
          gap: 24, 
          marginTop: 16,
          fontSize: 11, 
          color: isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)", 
          fontFamily: "'DM Sans', sans-serif",
          letterSpacing: 0.5
        }}>
          <span>⚡ NexusAI Neural Engine</span>
          <span>🔒 Enterprise Grade Security</span>
          <span>🚀 24/7 AI Operations</span>
        </div>
      </div>

      <style>{`
        @keyframes floatNexus {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(-25px) translateX(15px); }
        }
        @keyframes pulse-ring {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.3); }
        }
        @keyframes glowPulse {
          0%, 100% { box-shadow: 0 0 20px rgba(168,85,247,0.2); }
          50% { box-shadow: 0 0 35px rgba(168,85,247,0.4); }
        }
        @keyframes borderFlow {
          0% { background-position: 0% 50%; }
          100% { background-position: 300% 50%; }
        }
        .message-animate {
          animation: slideUpNexus 0.4s cubic-bezier(0.2, 0.9, 0.4, 1.1) forwards;
          opacity: 0;
          transform: translateY(20px);
        }
        @keyframes slideUpNexus {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .premium-prompt-btn {
          position: relative;
          overflow: hidden;
        }
        .premium-prompt-btn::after {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent);
          transition: left 0.5s;
        }
        .premium-prompt-btn:hover::after {
          left: 100%;
        }
        .send-btn {
          position: relative;
          overflow: hidden;
        }
        .send-btn::after {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          border-radius: 50%;
          background: rgba(255,255,255,0.3);
          transform: translate(-50%, -50%);
          transition: width 0.4s, height 0.4s;
        }
        .send-btn:active::after {
          width: 100%;
          height: 100%;
        }
        
        /* Agent Chat Mobile Responsive */
        @media (max-width: 768px) {
          .agent-chat-container > div:first-child {
            margin: 16px !important;
            padding: 12px 16px !important;
            flex-wrap: wrap !important;
          }
          .agent-chat-container > div:first-child > div:first-child {
            gap: 12px !important;
          }
          .agent-chat-container > div:first-child button {
            padding: 6px 12px !important;
            font-size: 14px !important;
          }
          .agent-chat-container > div:first-child > div:first-child > div {
            width: 40px !important;
            height: 40px !important;
            font-size: 20px !important;
          }
          .agent-chat-container > div:first-child > div:first-child > div:last-child div:first-child {
            font-size: 16px !important;
          }
          .agent-chat-container > div:first-child > div:last-child {
            padding: 4px 12px !important;
          }
          .agent-chat-container > div:nth-child(3) {
            padding: 16px !important;
          }
          .agent-chat-container .message-animate > div:last-child {
            max-width: 85% !important;
          }
          .agent-chat-container .message-animate > div:last-child > div:first-child {
            padding: 12px 16px !important;
            font-size: 13px !important;
          }
          .agent-chat-container > div:last-child {
            padding: 12px 16px 20px 16px !important;
          }
          .agent-chat-container > div:last-child > div {
            gap: 12px !important;
          }
          .agent-chat-container > div:last-child textarea {
            padding: 12px 16px !important;
            font-size: 14px !important;
            min-height: 44px !important;
          }
          .agent-chat-container > div:last-child button {
            width: 44px !important;
            height: 44px !important;
            font-size: 18px !important;
          }
          .agent-chat-container > div:last-child > div:last-child {
            gap: 16px !important;
            font-size: 10px !important;
          }
        }
      `}</style>
    </div>
  );
}

function Dashboard({ user, onLogout }) {
  const [isDark, setIsDark] = useState(true);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [stats, setStats] = useState({ operations: "2,847", revenue: "$48,291", time: "342", automations: "12" });

  useEffect(() => {
    const savedStats = localStorage.getItem(`nexusai_stats_${user.email}`);
    if (savedStats) setStats(JSON.parse(savedStats));
  }, [user.email]);

  if (selectedAgent) {
    return <AgentChatPage agent={selectedAgent} onBack={() => setSelectedAgent(null)} />;
  }

  return (
    <div className="dashboard-container" style={{ fontFamily: "'Syne', 'Space Grotesk', sans-serif", background: isDark ? "#050508" : "#f5f5f5", color: isDark ? "#fff" : "#1a1a1a", minHeight: "100vh" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');*{margin:0;padding:0;box-sizing:border-box;}`}</style>
      
      <div className="dashboard-header" style={{ padding: "20px 40px", borderBottom: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(0,0,0,0.1)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: "linear-gradient(135deg,#A855F7,#7C3AED)", display: "flex", alignItems: "center", justifyContent: "center" }}>⚡</div>
          <span style={{ fontSize: 18, fontWeight: 800 }}>NexusAI Dashboard</span>
        </div>
        <button onClick={onLogout} className="dashboard-logout" style={{ background: "transparent", border: isDark ? "1px solid rgba(255,255,255,0.2)" : "1px solid rgba(0,0,0,0.15)", padding: "8px 20px", borderRadius: 10, color: isDark ? "#fff" : "#1a1a1a", cursor: "pointer" }}>Logout</button>
      </div>
      
      <div className="dashboard-welcome" style={{ padding: 32 }}>
        <h1 style={{ fontSize: 28, marginBottom: 8 }}>Welcome back, {user.name}! 👋</h1>
        <p style={{ color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)" }}>Your AI workforce is running at full capacity.</p>
        
        <div className="dashboard-stats" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 20, margin: "32px 0" }}>
          <div className="stat-card" style={{ background: isDark ? "#0d0d14" : "#ffffff", border: isDark ? "1px solid rgba(255,255,255,0.07)" : "1px solid rgba(0,0,0,0.08)", borderRadius: 16, padding: 20 }}><div style={{ fontSize: 12, color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)" }}>AI Operations Used</div><div style={{ fontSize: 32, fontWeight: 800, color: "#A855F7" }}>{stats.operations}</div><div style={{ fontSize: 11, color: "#10B981" }}>+23% this month</div></div>
          <div className="stat-card" style={{ background: isDark ? "#0d0d14" : "#ffffff", border: isDark ? "1px solid rgba(255,255,255,0.07)" : "1px solid rgba(0,0,0,0.08)", borderRadius: 16, padding: 20 }}><div style={{ fontSize: 12, color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)" }}>Revenue Generated</div><div style={{ fontSize: 32, fontWeight: 800, color: "#00D4FF" }}>{stats.revenue}</div><div style={{ fontSize: 11, color: "#10B981" }}>+12% this month</div></div>
          <div className="stat-card" style={{ background: isDark ? "#0d0d14" : "#ffffff", border: isDark ? "1px solid rgba(255,255,255,0.07)" : "1px solid rgba(0,0,0,0.08)", borderRadius: 16, padding: 20 }}><div style={{ fontSize: 12, color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)" }}>Time Saved (hours)</div><div style={{ fontSize: 32, fontWeight: 800, color: "#10B981" }}>{stats.time}</div><div style={{ fontSize: 11, color: "#10B981" }}>+156 this week</div></div>
          <div className="stat-card" style={{ background: isDark ? "#0d0d14" : "#ffffff", border: isDark ? "1px solid rgba(255,255,255,0.07)" : "1px solid rgba(0,0,0,0.08)", borderRadius: 16, padding: 20 }}><div style={{ fontSize: 12, color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)" }}>Active Automations</div><div style={{ fontSize: 32, fontWeight: 800, color: "#F59E0B" }}>{stats.automations}</div><div style={{ fontSize: 11, color: "#10B981" }}>+3 new this week</div></div>
        </div>
        
        <h2 style={{ fontSize: 20, marginBottom: 20 }}>Your AI Agents</h2>
        <div className="agents-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
          {AI_AGENTS.map(agent => (
            <div 
              key={agent.id} 
              onClick={() => setSelectedAgent(agent)} 
              className={`agent-card-${agent.id}`}
              style={{ 
                background: isDark ? `linear-gradient(135deg, ${agent.color}08, #0d0d14)` : `linear-gradient(135deg, ${agent.color}08, #ffffff)`, 
                border: `1px solid ${agent.color}40`, 
                borderRadius: 16, 
                padding: 24, 
                textAlign: "center", 
                cursor: "pointer", 
                transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)"
              }}
            >
              <div style={{ fontSize: 40, marginBottom: 8 }}>{agent.icon}</div>
              <div style={{ fontWeight: 600, background: agent.gradient, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{agent.name}</div>
              <div style={{ fontSize: 11, color: agent.color, marginTop: 4 }}>{agent.tagline}</div>
              <div style={{ fontSize: 10, color: agent.color, marginTop: 8 }}>● Active</div>
              <style>{`
                .agent-card-${agent.id}:hover {
                  transform: translateY(-6px);
                  border-color: ${agent.color};
                  box-shadow: 0 10px 30px ${agent.color}40;
                }
              `}</style>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        /* Dashboard Responsive */
        @media (max-width: 1024px) {
          .dashboard-stats {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 16px !important;
          }
          .agents-grid {
            grid-template-columns: repeat(3, 1fr) !important;
          }
        }
        
        @media (max-width: 768px) {
          .dashboard-header {
            padding: 16px 20px !important;
            flex-direction: column !important;
            gap: 12px !important;
          }
          .dashboard-welcome {
            padding: 20px !important;
          }
          .dashboard-welcome h1 {
            font-size: 24px !important;
          }
          .dashboard-stats {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 12px !important;
            margin: 20px 0 !important;
          }
          .dashboard-stats .stat-card {
            padding: 16px !important;
          }
          .dashboard-stats .stat-card > div:first-child {
            font-size: 11px !important;
          }
          .dashboard-stats .stat-card > div:nth-child(2) {
            font-size: 26px !important;
          }
          .agents-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 12px !important;
          }
          .agents-grid > div {
            padding: 16px !important;
          }
          .agents-grid > div > div:first-child {
            font-size: 32px !important;
          }
          .agents-grid > div > div:nth-child(2) {
            font-size: 14px !important;
          }
          .dashboard-logout {
            padding: 6px 16px !important;
            font-size: 13px !important;
          }
        }
        
        @media (max-width: 480px) {
          .dashboard-stats {
            grid-template-columns: 1fr !important;
          }
          .agents-grid {
            grid-template-columns: 1fr !important;
          }
          .dashboard-welcome h1 {
            font-size: 20px !important;
          }
          .dashboard-stats .stat-card > div:nth-child(2) {
            font-size: 28px !important;
          }
        }
      `}</style>
    </div>
  );
}

export default function NexusAI() {
  const [showAPISettings, setShowAPISettings] = useState(false);
const [apiKey, setApiKey] = useState("");
const [apiProvider, setApiProvider] = useState("claude");
  const [showPreloader, setShowPreloader] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [billing, setBilling] = useState("annual");
  const [toast, setToast] = useState(null);
  const [demoOpen, setDemoOpen] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);
  const [demoResult, setDemoResult] = useState("");
  const [demoInput, setDemoInput] = useState("");
  const [activeFaq, setActiveFaq] = useState(null);
  const [currentView, setCurrentView] = useState("landing");
  const [user, setUser] = useState(null);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [loading, setLoading] = useState(true);
  const [isDark, setIsDark] = useState(true);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [pendingUser, setPendingUser] = useState(null);
  const [selectedAgent, setSelectedAgent] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("nexusai_user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setCurrentView("dashboard");
      setTimeout(() => setLoading(false), 1500);
    }
    const savedTheme = localStorage.getItem('nexusai_theme');
    if (savedTheme === 'light') {
      setIsDark(false);
    }
    setTimeout(() => setLoading(false), 1500);

    const savedApiKey = localStorage.getItem("nexusai_api_key");
  const savedApiProvider = localStorage.getItem("nexusai_api_provider");
  if (savedApiKey) setApiKey(savedApiKey);
  if (savedApiProvider) setApiProvider(savedApiProvider); const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('admin') === 'nexus2026') {
    setShowAdmin(true);
  }
}, []);

  const toggleTheme = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    localStorage.setItem('nexusai_theme', newIsDark ? 'dark' : 'light');
    
    if (newIsDark) {
      document.body.style.backgroundColor = '#050508';
      document.body.style.color = '#ffffff';
    } else {
      document.body.style.backgroundColor = '#f5f5f5';
      document.body.style.color = '#1a1a1a';
    }
  };

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const handleSignup = () => {
  if (!signupName || !signupEmail || !signupPassword) {
    setAuthError("Please fill in all fields");
    return;
  }
  if (signupPassword.length < 6) {
    setAuthError("Password must be at least 6 characters");
    return;
  }
  
  const newUser = { 
    name: signupName, 
    email: signupEmail, 
    password: signupPassword, 
    verified: true,
    joined: new Date().toISOString()
  };
  
  localStorage.setItem("nexusai_user", JSON.stringify(newUser));
  setUser(newUser);
  setCurrentView("dashboard");
  setShowVerification(true);
  showToast("Account created successfully!");
};

const handleLogin = () => {
  if (!loginEmail || !loginPassword) {
    setAuthError("Please fill in all fields");
    return;
  }
  
  // Check if user exists in localStorage
  const savedUser = localStorage.getItem("nexusai_user");
  if (savedUser) {
    const userData = JSON.parse(savedUser);
    if (userData.email === loginEmail && userData.password === loginPassword) {
      setUser(userData);
      setCurrentView("dashboard");
      showToast("Logged in successfully!");
      return;
    }
  }
  
  // Demo mode - allow any login for testing
  const demoUser = {
    name: loginEmail.split("@")[0],
    email: loginEmail,
    verified: true
  };
  localStorage.setItem("nexusai_user", JSON.stringify(demoUser));
  setUser(demoUser);
  setCurrentView("dashboard");
  showToast("Logged in successfully!");
};

  const handleLogout = () => {
    localStorage.removeItem("nexusai_user");
    setUser(null);
    setCurrentView("landing");
    showToast("Logged out successfully");
  };

  const handleDemo = async () => {
    if (!demoInput.trim()) return;
    setDemoLoading(true);
    setDemoResult("");
    await new Promise(r => setTimeout(r, 1800));
    const demoAgent = { id: "demo", name: "AI Strategy", icon: "⚡", color: "#A855F7", tagline: "Business Intelligence", gradient: "linear-gradient(135deg, #A855F7, #7C3AED)" };
    setDemoResult(generateBeautifulResponse(demoInput, demoAgent));
    setDemoLoading(false);
  };

  const faqs = [
    { q: "How long does it take to set up?", a: "Most businesses are fully operational in 48 hours. Our AI-guided onboarding automatically connects your existing tools, imports your data, and configures workflows based on your industry." },
    { q: "Do I need technical expertise?", a: "Zero technical skills required. NexusAI is built for business leaders, not engineers. Our visual workflow builder and AI assistant handle all complexity." },
    { q: "What integrations are supported?", a: "500+ native integrations including Salesforce, HubSpot, Shopify, QuickBooks, Slack, Stripe, AWS, Google Workspace, Microsoft 365, and all major ERPs." },
    { q: "Is my data secure?", a: "Bank-grade security: AES-256 encryption at rest and in transit, SOC2 Type II certified, ISO 27001 compliant, GDPR/CCPA ready." },
    { q: "What's the ROI timeline?", a: "Average clients see positive ROI within 6 weeks. Our case studies show 3-8× ROI within 6 months across industries." }
  ];

   if (showAdmin) {
    return <AdminPage onBack={() => setShowAdmin(false)} />;
  }

  if (showPreloader) {
    return <Preloader onComplete={() => setShowPreloader(false)} />;
  }

  if (showAPISettings) {
  return <APISettingsModal onClose={() => setShowAPISettings(false)} onSaved={() => {
    const savedKey = localStorage.getItem("nexusai_api_key");
    const savedProvider = localStorage.getItem("nexusai_api_provider");
    setApiKey(savedKey);
    setApiProvider(savedProvider);
    showToast("API key saved successfully!");
  }} />;
}

  if (user && currentView === "dashboard") {
  return <DashboardPage user={user} onLogout={handleLogout} />;
}

  if (showForgotPassword) {
    return <ForgotPasswordPage onBack={() => setShowForgotPassword(false)} />;
  }

  if (showVerification && pendingUser) {
    return <VerifyEmailPage email={pendingUser.email} onVerified={() => {
      setShowVerification(false);
      setLoginEmail(pendingUser.email);
      setLoginPassword(pendingUser.password);
      handleLogin();
    }} />;
  }

  return (
    <div>
      <CustomCursor />
    <ThemeProvider>
    <div style={{ fontFamily: "'Syne', 'Space Grotesk', sans-serif", background: isDark ? "#050508" : "#f5f5f5", color: isDark ? "#fff" : "#1a1a1a", minHeight: "100vh", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: ${isDark ? "#0a0a0f" : "#e0e0e5"}; }
        ::-webkit-scrollbar-thumb { background: #A855F7; border-radius: 2px; }
        @keyframes float { 0%,100%{transform:translateY(0px)} 50%{transform:translateY(-12px)} }
        @keyframes pulse-ring { 0%{transform:scale(1);opacity:0.8} 100%{transform:scale(1.6);opacity:0} }
        @keyframes slide-up { from{opacity:0;transform:translateY(40px)} to{opacity:1;transform:translateY(0)} }
        @keyframes ticker { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
        @keyframes glow-pulse { 0%,100%{box-shadow:0 0 20px rgba(168,85,247,0.3)} 50%{box-shadow:0 0 50px rgba(168,85,247,0.7)} }
        .hero-gradient { background: ${isDark ? "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(168,85,247,0.25) 0%, transparent 60%), radial-gradient(ellipse 40% 40% at 80% 50%, rgba(0,212,255,0.1) 0%, transparent 50%), #050508" : "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(168,85,247,0.1) 0%, transparent 60%), radial-gradient(ellipse 40% 40% at 80% 50%, rgba(0,212,255,0.05) 0%, transparent 50%), #f5f5f5"}; }
        .card-hover { transition: all 0.3s cubic-bezier(0.4,0,0.2,1); }
        .card-hover:hover { transform: translateY(-6px); }
        .btn-primary { background: linear-gradient(135deg, #A855F7, #7C3AED); border: none; cursor: pointer; color: white; font-family: 'Syne', sans-serif; font-weight: 700; transition: all 0.3s; }
        .btn-primary:hover { transform: scale(1.04); box-shadow: 0 0 40px rgba(168,85,247,0.5); }
        .btn-ghost { background: transparent; border: ${isDark ? "1px solid rgba(255,255,255,0.15)" : "1px solid rgba(0,0,0,0.15)"}; cursor: pointer; color: ${isDark ? "#fff" : "#1a1a1a"}; font-family: 'Syne', sans-serif; transition: all 0.3s; }
        .btn-ghost:hover { border-color: rgba(168,85,247,0.6); background: rgba(168,85,247,0.08); }
        .gradient-text { background: linear-gradient(135deg, ${isDark ? "#fff" : "#1a1a1a"} 0%, #A855F7 50%, #00D4FF 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        .ticker-inner { display: inline-block; animation: ticker 30s linear infinite; }
        a { color: ${isDark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.6)"}; }
        a:hover { color: ${isDark ? "#fff" : "#1a1a1a"}; }
        footer { border-top-color: ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.08)"}; }

        /* ========== COMPLETE RESPONSIVE STYLES ========== */
        
        /* Tablet (max-width: 1024px) */
        @media (max-width: 1024px) {
          nav { padding: 12px 24px !important; flex-wrap: wrap !important; }
          .hero-section h1 { font-size: 48px !important; }
          .hero-section p { font-size: 16px !important; }
          .stats-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 16px !important; }
          .modules-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 16px !important; }
          .pricing-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 20px !important; }
        }
        
        /* Mobile (max-width: 768px) */
        @media (max-width: 768px) {
          nav { padding: 12px 16px !important; flex-wrap: wrap !important; }
          .desktop-nav-links, .desktop-buttons { display: none !important; }
          .hamburger-btn { display: flex !important; }
          
          .hero-section { padding: 100px 20px 60px !important; }
          .hero-section h1 { font-size: 36px !important; line-height: 1.2 !important; }
          .hero-section p { font-size: 14px !important; padding: 0 16px !important; }
          
          .stats-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 12px !important; padding: 0 16px !important; }
          .stats-grid > div { padding: 20px 12px !important; }
          .stats-grid > div > div:first-child { font-size: 28px !important; }
          
          .modules-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 12px !important; padding: 0 16px !important; }
          .modules-grid > div { padding: 20px !important; }
          .modules-grid h3 { font-size: 15px !important; }
          .modules-grid p { font-size: 12px !important; }
          
          .testimonials-grid { grid-template-columns: 1fr !important; gap: 16px !important; padding: 0 16px !important; }
          
          .pricing-grid { grid-template-columns: 1fr !important; gap: 20px !important; padding: 0 16px !important; }
          .pricing-grid > div { padding: 24px !important; }
          .pricing-grid > div > div:first-child { font-size: 36px !important; }
          .pricing-grid > div > div:first-child > span:first-child { font-size: 36px !important; }
          .pricing-grid button { padding: 12px !important; font-size: 14px !important; }
          .pricing-grid ul li { font-size: 12px !important; }
          
          .faq-section { padding: 40px 20px !important; }
          .faq-section button { font-size: 14px !important; }
          
          .cta-banner { margin: 20px !important; padding: 40px 20px !important; }
          .cta-banner h2 { font-size: 28px !important; }
          .cta-banner p { font-size: 14px !important; padding: 0 16px !important; }
          .cta-banner button { padding: 12px 24px !important; font-size: 14px !important; }
          
          
@media (max-width: 768px) {
  .nexus-footer {
    padding: 40px 20px !important;
  }
  .nexus-footer > div > div:first-child {
    grid-template-columns: 1fr !important;
    gap: 30px !important;
    text-align: center !important;
  }
  .nexus-footer > div > div:first-child > div:first-child p {
    margin: 0 auto !important;
  }
  .nexus-footer > div > div:first-child > div:first-child div {
    justify-content: center !important;
  }
  .nexus-footer > div > div:first-child > div:not(:first-child) {
    text-align: center !important;
  }
  .nexus-footer > div:last-child {
    flex-direction: column !important;
    text-align: center !important;
    gap: 12px !important;
  }
}
          
          .integrations-grid { flex-wrap: wrap !important; gap: 8px !important; padding: 0 16px !important; }
          .integrations-grid > div { padding: 6px 12px !important; font-size: 11px !important; }
          
          .modal-container { width: 90% !important; margin: 20px !important; padding: 24px !important; }
          .modal-container h2 { font-size: 22px !important; }
          .modal-container input { padding: 12px !important; font-size: 14px !important; }
          
          .ticker-inner span { font-size: 11px !important; gap: 30px !important; }
        }
        
        /* Small Mobile (max-width: 480px) */
        @media (max-width: 480px) {
          .stats-grid { grid-template-columns: 1fr !important; }
          .modules-grid { grid-template-columns: 1fr !important; }
          .hero-section h1 { font-size: 28px !important; }
          .hero-section .btn-primary, .hero-section .btn-ghost { padding: 12px 20px !important; font-size: 14px !important; }
          .pricing-grid > div > div:first-child { font-size: 32px !important; }
          .pricing-grid > div > div:first-child > span:first-child { font-size: 32px !important; }
          .cta-banner h2 { font-size: 24px !important; }
          .cta-banner button { padding: 10px 20px !important; font-size: 13px !important; }
          nav span { font-size: 16px !important; }
          footer { font-size: 11px !important; }
          footer > div:last-child { gap: 8px !important; }
        }
        
        /* Desktop */
        @media (min-width: 769px) {
          .mobile-menu { display: none !important; }
          .hamburger-btn { display: none !important; }
        }
        
        @keyframes mobileMenuSlide {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes skeletonPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }, /* Custom Cursor - Hide default on non-touch devices */
@media (hover: hover) and (pointer: fine) {
  body, button, a, input, textarea, .card-hover, .btn-primary, .btn-ghost {
    cursor: none;
  }
}

/* On mobile, show default cursor */
@media (max-width: 768px) {
  body, button, a, input, textarea {
    cursor: auto; 
  }
} 
        }
      `}</style>

      {toast && <div style={{ position: "fixed", bottom: 32, right: 32, background: "linear-gradient(135deg,#A855F7,#7C3AED)", padding: "14px 24px", borderRadius: 12, zIndex: 9999, fontSize: 14, fontWeight: 600, boxShadow: "0 20px 60px rgba(168,85,247,0.4)" }}>✓ {toast}</div>}

      {demoOpen && (
        <div className="modal-container" style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }} onClick={(e) => e.target === e.currentTarget && setDemoOpen(false)}>
          <div style={{ background: isDark ? "#0d0d14" : "#ffffff", border: isDark ? "1px solid rgba(168,85,247,0.3)" : "1px solid rgba(168,85,247,0.2)", borderRadius: 20, padding: 40, maxWidth: 600, width: "100%", maxHeight: "90vh", overflowY: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <div><div style={{ fontSize: 11, color: "#A855F7", fontWeight: 700, letterSpacing: 3, marginBottom: 6 }}>LIVE AI DEMO</div><h3 style={{ fontSize: 22, fontWeight: 800, color: isDark ? "#fff" : "#1a1a1a" }}>Ask NexusAI Anything</h3></div>
              <button onClick={() => setDemoOpen(false)} style={{ background: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)", border: "none", color: isDark ? "#fff" : "#1a1a1a", width: 36, height: 36, borderRadius: 8, cursor: "pointer", fontSize: 18 }}>×</button>
            </div>
            <p style={{ color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)", fontSize: 13, marginBottom: 20 }}>Describe a business challenge and watch our AI build an automation strategy.</p>
            <textarea value={demoInput} onChange={(e) => setDemoInput(e.target.value)} placeholder="e.g. We lose 40% of leads because our sales team can't follow up fast enough." style={{ width: "100%", background: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)", border: isDark ? "1px solid rgba(168,85,247,0.3)" : "1px solid rgba(168,85,247,0.2)", borderRadius: 12, padding: 16, color: isDark ? "#fff" : "#1a1a1a", fontSize: 14, resize: "none", height: 100, outline: "none" }} />
            <button onClick={handleDemo} disabled={demoLoading} className="btn-primary" style={{ width: "100%", padding: "14px", borderRadius: 12, marginTop: 12 }}>{demoLoading ? "🤖 AI Analyzing..." : "⚡ Generate Strategy"}</button>
            {demoResult && <div style={{ marginTop: 24, background: isDark ? "rgba(168,85,247,0.08)" : "rgba(168,85,247,0.05)", border: isDark ? "1px solid rgba(168,85,247,0.2)" : "1px solid rgba(168,85,247,0.15)", borderRadius: 12, padding: 20, fontSize: 14, lineHeight: 1.7, color: isDark ? "rgba(255,255,255,0.85)" : "rgba(0,0,0,0.85)", whiteSpace: "pre-wrap" }}>{demoResult}</div>}
          </div>
        </div>
      )}

      <nav style={{ 
        position: "fixed", 
        top: 0, 
        left: 0, 
        right: 0, 
        zIndex: 9999, 
        padding: "16px 40px", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "space-between", 
        borderBottom: isDark ? "1px solid rgba(255,255,255,0.05)" : "1px solid rgba(0,0,0,0.08)", 
        background: isDark ? "rgba(5,5,8,0.95)" : "rgba(255,255,255,0.95)", 
        backdropFilter: "blur(20px)" 
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: "linear-gradient(135deg,#A855F7,#7C3AED)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>⚡</div>
          <span style={{ fontSize: 18, fontWeight: 800, letterSpacing: -0.5, color: isDark ? "#fff" : "#1a1a1a" }}>NexusAI</span>
        </div>
        <div className="desktop-nav-links" style={{ display: "flex", gap: 32, alignItems: "center" }}>
          {["Product", "Pricing", "Customers", "Docs", "Blog"].map((item) => (
            <a key={item} href="#" onClick={(e) => { e.preventDefault(); document.getElementById(item.toLowerCase())?.scrollIntoView({ behavior: "smooth" }); }} style={{ textDecoration: "none", color: isDark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.6)", fontSize: 14, fontWeight: 500 }}>{item}</a>
          ))}
        </div>
        <div className="desktop-buttons" style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <button 
            onClick={toggleTheme}
            style={{
              background: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.05)",
              border: isDark ? "1px solid rgba(255,255,255,0.2)" : "1px solid rgba(0,0,0,0.15)",
              borderRadius: 40,
              padding: "8px 18px",
              cursor: "pointer",
              color: isDark ? "#fff" : "#1a1a1a",
              fontSize: 13,
              fontFamily: "'Syne', sans-serif",
              display: "flex",
              alignItems: "center",
              gap: 8,
              transition: "all 0.3s"
            }}
            onMouseEnter={(e) => {
              e.target.style.background = isDark ? "rgba(168,85,247,0.2)" : "rgba(168,85,247,0.1)";
              e.target.style.borderColor = isDark ? "rgba(168,85,247,0.5)" : "rgba(168,85,247,0.3)";
            }}
            onMouseLeave={(e) => {
              e.target.style.background = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.05)";
              e.target.style.borderColor = isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.15)";
            }}
          >
            <span style={{ fontSize: 16 }}>{isDark ? "☀️" : "🌙"}</span>
            <span>{isDark ? "Light Mode" : "Dark Mode"}</span>
          </button>
          <button 
  onClick={() => setShowAPISettings(true)}
  style={{
    background: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.05)",
    border: isDark ? "1px solid rgba(255,255,255,0.2)" : "1px solid rgba(0,0,0,0.15)",
    borderRadius: 40,
    padding: "8px 16px",
    cursor: "pointer",
    color: isDark ? "#fff" : "#1a1a1a",
    fontSize: 12,
    fontFamily: "'Syne', sans-serif",
    display: "flex",
    alignItems: "center",
    gap: 6
  }}
>
  <span>🔑</span>
  <span>API</span>
</button>
          <button className="btn-ghost" style={{ padding: "9px 20px", borderRadius: 10, fontSize: 14, cursor: "pointer" }} onClick={() => setCurrentView("login")}>Sign In</button>
          <button className="btn-primary" style={{ padding: "9px 20px", borderRadius: 10, fontSize: 14, cursor: "pointer" }} onClick={() => setCurrentView("signup")}>Start Free Trial</button>
        </div>
        
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="hamburger-btn"
          style={{
            display: "none",
            background: "transparent",
            border: "none",
            fontSize: 28,
            cursor: "pointer",
            color: isDark ? "#fff" : "#1a1a1a",
            padding: "4px 8px"
          }}
        >
          {mobileMenuOpen ? "✕" : "☰"}
        </button>
        
        {mobileMenuOpen && (
          <div className="mobile-menu" style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            background: isDark ? "rgba(5,5,8,0.98)" : "rgba(255,255,255,0.98)",
            backdropFilter: "blur(20px)",
            borderBottom: isDark ? "1px solid rgba(255,255,255,0.05)" : "1px solid rgba(0,0,0,0.08)",
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 16,
            zIndex: 9998,
            animation: "mobileMenuSlide 0.3s ease-out"
          }}>
            {["Product", "Pricing", "Customers", "Docs", "Blog"].map((item) => (
              <a key={item} href="#" onClick={(e) => { e.preventDefault(); document.getElementById(item.toLowerCase())?.scrollIntoView({ behavior: "smooth" }); setMobileMenuOpen(false); }} style={{ textDecoration: "none", color: isDark ? "rgba(255,255,255,0.8)" : "rgba(0,0,0,0.7)", fontSize: 16, fontWeight: 500, padding: "8px 0" }}>{item}</a>
            ))}
            <div style={{ display: "flex", gap: 12, marginTop: 8, flexWrap: "wrap", justifyContent: "center" }}>
              <button 
                onClick={toggleTheme}
                style={{
                  background: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.05)",
                  border: isDark ? "1px solid rgba(255,255,255,0.2)" : "1px solid rgba(0,0,0,0.15)",
                  borderRadius: 40,
                  padding: "8px 18px",
                  cursor: "pointer",
                  color: isDark ? "#fff" : "#1a1a1a",
                  fontSize: 13,
                  fontFamily: "'Syne', sans-serif",
                  display: "flex",
                  alignItems: "center",
                  gap: 8
                }}
              >
                <span>{isDark ? "☀️" : "🌙"}</span>
                <span>{isDark ? "Light Mode" : "Dark Mode"}</span>
              </button>
              <button 
  onClick={() => { setShowAPISettings(true); setMobileMenuOpen(false); }}
  style={{
    background: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.05)",
    border: isDark ? "1px solid rgba(255,255,255,0.2)" : "1px solid rgba(0,0,0,0.15)",
    borderRadius: 40,
    padding: "8px 16px",
    cursor: "pointer",
    color: isDark ? "#fff" : "#1a1a1a",
    fontSize: 13,
    fontFamily: "'Syne', sans-serif",
    display: "flex",
    alignItems: "center",
    gap: 8
  }}
>
  <span>🔑</span>
  <span>API Settings</span>
</button>
              <button className="btn-ghost" style={{ padding: "9px 20px", borderRadius: 10, fontSize: 14, cursor: "pointer" }} onClick={() => { setCurrentView("login"); setMobileMenuOpen(false); }}>Sign In</button>
              <button className="btn-primary" style={{ padding: "9px 20px", borderRadius: 10, fontSize: 14, cursor: "pointer" }} onClick={() => { setCurrentView("signup"); setMobileMenuOpen(false); }}>Start Free Trial</button>
            </div>
          </div>
        )}
      </nav>

      <section className="hero-gradient hero-section" style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "140px 40px 80px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: isDark ? "linear-gradient(rgba(168,85,247,0.06) 1px,transparent 1px),linear-gradient(90deg,rgba(168,85,247,0.06) 1px,transparent 1px)" : "linear-gradient(rgba(168,85,247,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(168,85,247,0.03) 1px,transparent 1px)", backgroundSize: "60px 60px", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: "15%", left: "8%", width: 300, height: 300, borderRadius: "50%", background: isDark ? "radial-gradient(circle,rgba(168,85,247,0.15),transparent)" : "radial-gradient(circle,rgba(168,85,247,0.08),transparent)", filter: "blur(40px)", animation: "float 6s ease-in-out infinite" }} />
        <div style={{ position: "absolute", bottom: "20%", right: "8%", width: 200, height: 200, borderRadius: "50%", background: isDark ? "radial-gradient(circle,rgba(0,212,255,0.12),transparent)" : "radial-gradient(circle,rgba(0,212,255,0.06),transparent)", filter: "blur(30px)", animation: "float 8s ease-in-out infinite 2s" }} />
        
        <div style={{ position: "relative", zIndex: 2, maxWidth: 900 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: isDark ? "rgba(168,85,247,0.12)" : "rgba(168,85,247,0.08)", border: isDark ? "1px solid rgba(168,85,247,0.3)" : "1px solid rgba(168,85,247,0.2)", borderRadius: 100, padding: "8px 18px", marginBottom: 32, fontSize: 13 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#A855F7", animation: "pulse-ring 1.5s infinite" }} />
            <span style={{ color: "#C084FC" }}>Now serving 12,400+ businesses across 137 countries</span>
          </div>
          <h1 style={{ fontSize: "clamp(42px,7vw,88px)", fontWeight: 800, lineHeight: 1.02, letterSpacing: -3, marginBottom: 28 }}>The AI Operating System<br /><span className="gradient-text">for Modern Business</span></h1>
          <p style={{ fontSize: "clamp(16px,2vw,22px)", color: isDark ? "rgba(255,255,255,0.55)" : "rgba(0,0,0,0.55)", fontWeight: 300, lineHeight: 1.6, maxWidth: 680, margin: "0 auto 48px" }}>Replace entire departments with intelligent automation. Sales, support, marketing, finance, operations — all running autonomously while you sleep.</p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap", marginBottom: 60 }}>
            <button className="btn-primary" style={{ padding: "18px 40px", borderRadius: 14, fontSize: 17, fontWeight: 700, animation: "glow-pulse 3s infinite" }} onClick={() => setCurrentView("signup")}>Start Free Trial — No Card Needed</button>
            <button className="btn-ghost" style={{ padding: "18px 32px", borderRadius: 14, fontSize: 17 }} onClick={() => setDemoOpen(true)}>▶ Live AI Demo</button>
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 24, flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ display: "flex" }}>
                {["SC","MO","IT","DV"].map((a, i) => (<div key={i} style={{ width: 32, height: 32, borderRadius: "50%", background: ["#00D4FF","#A855F7","#F59E0B","#10B981"][i], border: `2px solid ${isDark ? "#050508" : "#f5f5f5"}`, marginLeft: i ? -10 : 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700 }}>{a}</div>))}
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.1)", border: `2px solid ${isDark ? "#050508" : "#f5f5f5"}`, marginLeft: -10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700 }}>+</div>
              </div>
              <span style={{ fontSize: 13, color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)" }}>12,400+ businesses trust NexusAI</span>
            </div>
            <div style={{ display: "flex", gap: 4 }}>
              {"★★★★★".split("").map((s, i) => <span key={i} style={{ color: "#F59E0B", fontSize: 16 }}>{s}</span>)}
              <span style={{ fontSize: 13, color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)", marginLeft: 6 }}>4.9/5 from 2,847 reviews</span>
            </div>
          </div>
        </div>

        <div style={{ marginTop: 80, maxWidth: 1000, width: "100%" }}>
          <div style={{ background: isDark ? "rgba(13,13,20,0.9)" : "rgba(255,255,255,0.9)", border: isDark ? "1px solid rgba(168,85,247,0.2)" : "1px solid rgba(168,85,247,0.15)", borderRadius: 20, overflow: "hidden", boxShadow: isDark ? "0 40px 120px rgba(168,85,247,0.2)" : "0 40px 120px rgba(0,0,0,0.1)" }}>
            <div style={{ padding: "14px 20px", borderBottom: isDark ? "1px solid rgba(255,255,255,0.07)" : "1px solid rgba(0,0,0,0.08)", display: "flex", alignItems: "center", gap: 8, background: isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)" }}>
              {["#FF5F57","#FFBD2E","#28CA41"].map((c) => <div key={c} style={{ width: 12, height: 12, borderRadius: "50%", background: c }} />)}
              <div style={{ flex: 1, background: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)", borderRadius: 6, padding: "5px 12px", fontSize: 12, color: isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)", textAlign: "center", maxWidth: 300, margin: "0 auto" }}>app.nexusai.io/dashboard</div>
            </div>
            <div style={{ padding: 24, display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 16 }}>
              {[{ label: "Revenue Today", value: "$48,291", change: "+23%", color: "#10B981" }, { label: "Leads Processed", value: "1,847", change: "+156", color: "#00D4FF" }, { label: "Tickets Resolved", value: "342", change: "100% AI", color: "#A855F7" }, { label: "Automations Active", value: "94", change: "All running", color: "#F59E0B" }].map((s) => (
                <div key={s.label} style={{ background: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)", border: isDark ? "1px solid rgba(255,255,255,0.07)" : "1px solid rgba(0,0,0,0.08)", borderRadius: 12, padding: 16 }}><div style={{ fontSize: 11, color: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)", marginBottom: 8 }}>{s.label}</div><div style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>{s.value}</div><div style={{ fontSize: 11, color: s.color }}>{s.change}</div></div>
              ))}
            </div>
            <div style={{ padding: "0 24px 24px", display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16 }}>
              <div style={{ background: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)", border: isDark ? "1px solid rgba(255,255,255,0.07)" : "1px solid rgba(0,0,0,0.08)", borderRadius: 12, padding: 16, height: 120 }}><div style={{ fontSize: 11, color: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)", marginBottom: 12 }}>Revenue Automation (Last 30 days)</div><svg width="100%" height="70" viewBox="0 0 300 70" preserveAspectRatio="none"><defs><linearGradient id="lg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#A855F7" stopOpacity="0.3"/><stop offset="100%" stopColor="#A855F7" stopOpacity="0"/></linearGradient></defs><path d="M0,60 C20,55 40,50 60,42 C80,34 100,30 120,25 C140,20 160,18 180,12 C200,6 220,8 240,4 C260,0 280,5 300,3" fill="none" stroke="#A855F7" strokeWidth="2"/><path d="M0,60 C20,55 40,50 60,42 C80,34 100,30 120,25 C140,20 160,18 180,12 C200,6 220,8 240,4 C260,0 280,5 300,3 L300,70 L0,70Z" fill="url(#lg)"/></svg></div>
              <div style={{ background: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)", border: isDark ? "1px solid rgba(255,255,255,0.07)" : "1px solid rgba(0,0,0,0.08)", borderRadius: 12, padding: 16, height: 120 }}><div style={{ fontSize: 11, color: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)", marginBottom: 8 }}>AI Efficiency Score</div><div style={{ fontSize: 36, fontWeight: 800, color: "#10B981" }}>98%</div><div style={{ fontSize: 11, color: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)" }}>↑ 12% this week</div></div>
            </div>
          </div>
        </div>
      </section>

      <div style={{ background: isDark ? "rgba(168,85,247,0.1)" : "rgba(168,85,247,0.05)", borderTop: isDark ? "1px solid rgba(168,85,247,0.2)" : "1px solid rgba(168,85,247,0.1)", borderBottom: isDark ? "1px solid rgba(168,85,247,0.2)" : "1px solid rgba(168,85,247,0.1)", padding: "12px 0", overflow: "hidden" }}>
              {/* ========== PREMIUM TICKER SECTION - ULTRA ADVANCED ========== */}
      <div style={{
        background: isDark ? "linear-gradient(135deg, rgba(168,85,247,0.08), rgba(0,212,255,0.04))" : "linear-gradient(135deg, rgba(168,85,247,0.04), rgba(0,212,255,0.02))",
        borderTop: `1px solid ${isDark ? "rgba(168,85,247,0.2)" : "rgba(168,85,247,0.15)"}`,
        borderBottom: `1px solid ${isDark ? "rgba(168,85,247,0.2)" : "rgba(168,85,247,0.15)"}`,
        padding: "20px 0",
        overflow: "hidden",
        position: "relative"
      }}>
        
        {/* Animated Gradient Background */}
        <div style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(circle at 20% 50%, rgba(168,85,247,0.08), transparent 50%)",
          animation: "pulseGlow 3s ease-in-out infinite"
        }} />
        
        {/* Main Marquee Container */}
        <div className="premium-marquee" style={{
          display: "flex",
          width: "100%",
          overflow: "hidden",
          position: "relative"
        }}>
          {/* First Marquee Row */}
          <div className="marquee-content" style={{
            display: "flex",
            animation: "marqueeScroll 25s linear infinite",
            whiteSpace: "nowrap"
          }}>
            {[...Array(3)].map((_, i) => (
              <div key={i} style={{ display: "flex" }}>
                {/* Stats Cards */}
                <div className="ticker-card" style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "24px",
                  padding: "0 32px",
                  marginRight: "32px"
                }}>
                  <div style={{
                    background: isDark ? "rgba(168,85,247,0.12)" : "rgba(168,85,247,0.08)",
                    backdropFilter: "blur(10px)",
                    borderRadius: "60px",
                    padding: "8px 24px",
                    border: `1px solid ${isDark ? "rgba(168,85,247,0.3)" : "rgba(168,85,247,0.2)"}`,
                    transition: "all 0.3s",
                    display: "flex",
                    alignItems: "center",
                    gap: "16px",
                    flexWrap: "wrap"
                  }}>
                    {[
                      { icon: "🌍", label: "Countries", value: "137", color: "#00D4FF" },
                      { icon: "💰", label: "ROI", value: "Guaranteed", color: "#10B981" },
                      { icon: "🔒", label: "Certified", value: "SOC2", color: "#A855F7" },
                      { icon: "📱", label: "No-Code", value: "Builder", color: "#F59E0B" }
                    ].map((item, idx) => (
                      <div key={idx} className="ticker-stat" style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        padding: "6px 16px",
                        borderRadius: "40px",
                        background: isDark ? "rgba(0,0,0,0.3)" : "rgba(255,255,255,0.5)",
                        transition: "all 0.2s"
                      }}>
                        <span style={{ fontSize: "18px" }}>{item.icon}</span>
                        <span style={{
                          fontSize: "14px",
                          fontWeight: 700,
                          color: item.color,
                          letterSpacing: "0.5px"
                        }}>{item.value}</span>
                        <span style={{
                          fontSize: "12px",
                          color: isDark ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.5)",
                          fontWeight: 500
                        }}>{item.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Separator */}
                <div style={{
                  display: "inline-flex",
                  alignItems: "center",
                  padding: "0 16px"
                }}>
                  <span style={{
                    fontSize: "20px",
                    color: isDark ? "rgba(168,85,247,0.5)" : "rgba(168,85,247,0.4)",
                    fontWeight: 300
                  }}>✦</span>
                </div>
              </div>
            ))}
          </div>

          {/* Duplicate for seamless loop */}
          <div className="marquee-content" style={{
            display: "flex",
            animation: "marqueeScroll 25s linear infinite",
            whiteSpace: "nowrap"
          }}>
            {[...Array(3)].map((_, i) => (
              <div key={i} style={{ display: "flex" }}>
                <div className="ticker-card" style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "24px",
                  padding: "0 32px",
                  marginRight: "32px"
                }}>
                  <div style={{
                    background: isDark ? "rgba(168,85,247,0.12)" : "rgba(168,85,247,0.08)",
                    backdropFilter: "blur(10px)",
                    borderRadius: "60px",
                    padding: "8px 24px",
                    border: `1px solid ${isDark ? "rgba(168,85,247,0.3)" : "rgba(168,85,247,0.2)"}`,
                    display: "flex",
                    alignItems: "center",
                    gap: "16px",
                    flexWrap: "wrap"
                  }}>
                    {[
                      { icon: "🌍", label: "Countries", value: "137", color: "#00D4FF" },
                      { icon: "💰", label: "ROI", value: "Guaranteed", color: "#10B981" },
                      { icon: "🔒", label: "Certified", value: "SOC2", color: "#A855F7" },
                      { icon: "📱", label: "No-Code", value: "Builder", color: "#F59E0B" }
                    ].map((item, idx) => (
                      <div key={idx} className="ticker-stat" style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        padding: "6px 16px",
                        borderRadius: "40px",
                        background: isDark ? "rgba(0,0,0,0.3)" : "rgba(255,255,255,0.5)",
                        transition: "all 0.2s"
                      }}>
                        <span style={{ fontSize: "18px" }}>{item.icon}</span>
                        <span style={{ fontSize: "14px", fontWeight: 700, color: item.color }}>{item.value}</span>
                        <span style={{ fontSize: "12px", color: isDark ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.5)", fontWeight: 500 }}>{item.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{ display: "inline-flex", alignItems: "center", padding: "0 16px" }}>
                  <span style={{ fontSize: "20px", color: isDark ? "rgba(168,85,247,0.5)" : "rgba(168,85,247,0.4)" }}>✦</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CSS Animations */}
        <style>{`
          @keyframes marqueeScroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          
          @keyframes pulseGlow {
            0%, 100% { opacity: 0.4; }
            50% { opacity: 1; }
          }
          
          .ticker-stat {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            cursor: default;
          }
          
          .ticker-stat:hover {
            transform: translateY(-2px) scale(1.05);
            background: ${isDark ? "rgba(168,85,247,0.2)" : "rgba(168,85,247,0.15)"} !important;
            box-shadow: 0 4px 15px rgba(168,85,247,0.2);
          }
          
          .ticker-card:hover .ticker-stat {
            animation: subtleGlow 0.5s ease;
          }
          
          @keyframes subtleGlow {
            0% { text-shadow: 0 0 0px transparent; }
            50% { text-shadow: 0 0 8px rgba(168,85,247,0.5); }
            100% { text-shadow: 0 0 0px transparent; }
          }
          
          @media (max-width: 768px) {
            .ticker-stat {
              padding: 4px 10px !important;
            }
            .ticker-stat span:first-child {
              font-size: 14px !important;
            }
            .ticker-stat span:nth-child(2) {
              font-size: 11px !important;
            }
            .ticker-stat span:last-child {
              font-size: 10px !important;
            }
          }
        `}</style>
      </div></div>

      <section style={{ padding: "100px 40px", maxWidth: 1100, margin: "0 auto" }}>
        <div className="stats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 24 }}>          
          {STATS.map((s) => (
            <div key={s.label} className="card-hover" style={{ textAlign: "center", background: isDark ? "#0d0d14" : "rgba(255,255,255,0.9)", border: isDark ? "1px solid rgba(168,85,247,0.2)" : "1px solid rgba(0,0,0,0.08)", borderRadius: 16, padding: "40px 24px" }}>
              <div style={{ fontSize: "clamp(28px,4vw,48px)", fontWeight: 800, marginBottom: 8, color: isDark ? "#A855F7" : "#A855F7" }}><CountUp target={s.value} /></div>
              <div style={{ color: isDark ? "#ffffff" : "rgba(0,0,0,0.6)", fontSize: 14 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section id="product" style={{ padding: "80px 40px 120px", background: isDark ? "rgba(255,255,255,0.01)" : "rgba(0,0,0,0.01)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 70 }}>
            <div style={{ fontSize: 11, color: "#A855F7", fontWeight: 700, letterSpacing: 4, marginBottom: 16 }}>AUTOMATION MODULES</div>
            <h2 style={{ fontSize: "clamp(32px,5vw,56px)", fontWeight: 800, letterSpacing: -2, marginBottom: 20 }}>Every department.<br /><span className="gradient-text">Fully automated.</span></h2>
            <p style={{ color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)", fontSize: 18, maxWidth: 540, margin: "0 auto" }}>Eight AI-powered modules work together as one brain, optimizing your entire business 24/7/365.</p>
          </div>
          <div className="modules-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 24 }}>
            {MODULES.map((m) => (
              <div key={m.title} className="card-hover" style={{ background: isDark ? "rgba(13,13,20,0.8)" : "rgba(255,255,255,0.9)", border: isDark ? "1px solid rgba(255,255,255,0.07)" : "1px solid rgba(0,0,0,0.08)", borderRadius: 16, padding: 28, position: "relative", overflow: "hidden", cursor: "pointer" }}>
                <div style={{ position: "absolute", top: 0, right: 0, width: 80, height: 80, background: isDark ? "radial-gradient(circle,rgba(168,85,247,0.15),transparent)" : "radial-gradient(circle,rgba(168,85,247,0.08),transparent)", borderRadius: "0 16px 0 80px" }} />
                <div style={{ fontSize: 32, marginBottom: 16 }}>{m.icon}</div>
                <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 10 }}>{m.title}</h3>
                <p style={{ color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)", fontSize: 13, lineHeight: 1.6, marginBottom: 16 }}>{m.desc}</p>
                <div style={{ display: "inline-block", background: "rgba(168,85,247,0.15)", color: "#C084FC", padding: "4px 12px", borderRadius: 100, fontSize: 12, fontWeight: 600 }}>{m.stat}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="customers" style={{ padding: "100px 40px", background: isDark ? "rgba(168,85,247,0.04)" : "rgba(168,85,247,0.02)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <div style={{ fontSize: 11, color: "#A855F7", fontWeight: 700, letterSpacing: 4, marginBottom: 16 }}>CUSTOMER RESULTS</div>
            <h2 style={{ fontSize: "clamp(28px,4vw,48px)", fontWeight: 800, letterSpacing: -2 }}>Real businesses. <span className="gradient-text">Real results.</span></h2>
          </div>
          <div className="testimonials-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 24 }}>
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="card-hover" style={{ background: isDark ? "#0d0d14" : "#ffffff", border: isDark ? "1px solid rgba(255,255,255,0.07)" : "1px solid rgba(0,0,0,0.08)", borderRadius: 16, padding: 28 }}>
                <div style={{ display: "flex", gap: 4, marginBottom: 16 }}>{"★★★★★".split("").map((s, i) => <span key={i} style={{ color: "#F59E0B", fontSize: 14 }}>{s}</span>)}</div>
                <p style={{ color: isDark ? "rgba(255,255,255,0.75)" : "rgba(0,0,0,0.75)", fontSize: 14, lineHeight: 1.7, marginBottom: 20, fontStyle: "italic" }}>"{t.text}"</p>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: "50%", background: t.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "#000" }}>{t.avatar}</div>
                  <div><div style={{ fontSize: 14, fontWeight: 700 }}>{t.name}</div><div style={{ fontSize: 12, color: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)" }}>{t.role} · {t.country}</div></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" style={{ padding: "100px 40px 120px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <div style={{ fontSize: 11, color: "#A855F7", fontWeight: 700, letterSpacing: 4, marginBottom: 16 }}>TRANSPARENT PRICING</div>
            <h2 style={{ fontSize: "clamp(28px,4vw,48px)", fontWeight: 800, letterSpacing: -2, marginBottom: 24 }}>Built to scale.<br /><span className="gradient-text">Priced to grow with you.</span></h2>
            <div style={{ display: "inline-flex", background: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)", border: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(0,0,0,0.1)", borderRadius: 12, padding: 4 }}>
              {["monthly", "annual"].map((b) => (
                <button key={b} onClick={() => setBilling(b)} style={{ padding: "8px 24px", borderRadius: 9, border: "none", cursor: "pointer", fontSize: 14, fontWeight: 600, fontFamily: "'Syne', sans-serif", background: billing === b ? "linear-gradient(135deg,#A855F7,#7C3AED)" : "transparent", color: billing === b ? "#fff" : isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)" }}>{b === "annual" ? "Annual (Save 20%)" : "Monthly"}</button>
              ))}
            </div>
          </div>
          <div className="pricing-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 24 }}>
            {PLANS.map((plan) => (
              <div key={plan.id} className="card-hover" style={{ background: plan.badge ? (isDark ? "linear-gradient(160deg,rgba(168,85,247,0.12),rgba(124,58,237,0.06))" : "linear-gradient(160deg,rgba(168,85,247,0.08),rgba(124,58,237,0.03))") : (isDark ? "#0d0d14" : "#ffffff"), border: plan.badge ? (isDark ? "1px solid rgba(168,85,247,0.4)" : "1px solid rgba(168,85,247,0.3)") : (isDark ? "1px solid rgba(255,255,255,0.07)" : "1px solid rgba(0,0,0,0.08)"), borderRadius: 20, padding: 36, position: "relative", overflow: "hidden" }}>
                {plan.badge && <div style={{ position: "absolute", top: 20, right: 20, background: "linear-gradient(135deg,#A855F7,#7C3AED)", color: "#fff", padding: "4px 12px", borderRadius: 100, fontSize: 11, fontWeight: 700 }}>{plan.badge}</div>}
                <div style={{ fontSize: 13, color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)", marginBottom: 8 }}>{plan.name}</div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 8 }}><span style={{ fontSize: 48, fontWeight: 800, color: plan.color }}>${billing === "annual" ? plan.annual : plan.price}</span><span style={{ color: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)" }}>/mo</span></div>
                {billing === "annual" && <div style={{ fontSize: 12, color: "#10B981", marginBottom: 16 }}>Save ${(plan.price - plan.annual) * 12}/year</div>}
                <p style={{ color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)", fontSize: 13, marginBottom: 24, lineHeight: 1.5 }}>{plan.description}</p>
                <button className="btn-primary" style={{ width: "100%", padding: "14px", borderRadius: 12, fontSize: 15, fontWeight: 700, marginBottom: 28, background: plan.badge ? "linear-gradient(135deg,#A855F7,#7C3AED)" : `linear-gradient(135deg,${plan.color}33,${plan.color}22)`, border: `1px solid ${plan.color}44`, color: "#fff" }} onClick={() => plan.id === "enterprise" ? showToast("Our sales team will contact you within 2 hours!") : setCurrentView("signup")}>{plan.cta}</button>
                <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>{plan.features.map((f) => (<li key={f} style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: 13, color: isDark ? "rgba(255,255,255,0.75)" : "rgba(0,0,0,0.75)" }}><span style={{ color: plan.color, flexShrink: 0, marginTop: 1 }}>✓</span>{f}</li>))}</ul>
              </div>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: 40 }}><p style={{ color: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)", fontSize: 14 }}>All plans include 14-day free trial · No credit card required · Cancel anytime · ROI guarantee on Pro & Enterprise</p></div>
        </div>
      </section>

      <section style={{ padding: "80px 40px", background: isDark ? "rgba(255,255,255,0.01)" : "rgba(0,0,0,0.01)", textAlign: "center" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ fontSize: 11, color: "#00D4FF", fontWeight: 700, letterSpacing: 4, marginBottom: 16 }}>INTEGRATIONS</div>
          <h2 style={{ fontSize: "clamp(24px,3vw,40px)", fontWeight: 800, letterSpacing: -1, marginBottom: 16 }}>Connects with everything you use</h2>
          <p style={{ color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)", fontSize: 16, marginBottom: 48 }}>500+ native integrations. Custom webhooks. REST API. GraphQL.</p>
          <div className="integrations-grid" style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center" }}>
            {["Salesforce", "HubSpot", "Shopify", "Stripe", "AWS", "Google Workspace", "Microsoft 365", "Slack", "QuickBooks", "Zapier", "Twilio", "SendGrid", "Zendesk", "Intercom", "Notion", "Airtable", "PostgreSQL", "MongoDB"].map((app) => (<div key={app} style={{ background: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)", border: isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(0,0,0,0.08)", borderRadius: 10, padding: "10px 18px", fontSize: 13, color: isDark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.7)" }}>{app}</div>))}
          </div>
        </div>
      </section>

      <section style={{ padding: "100px 40px", maxWidth: 720, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 60 }}>
          <div style={{ fontSize: 11, color: "#A855F7", fontWeight: 700, letterSpacing: 4, marginBottom: 16 }}>FAQ</div>
          <h2 style={{ fontSize: "clamp(28px,4vw,44px)", fontWeight: 800, letterSpacing: -2 }}>Common questions</h2>
        </div>
        {faqs.map((faq, i) => (
          <div key={i} style={{ borderBottom: isDark ? "1px solid rgba(255,255,255,0.07)" : "1px solid rgba(0,0,0,0.08)", padding: "24px 0" }}>
            <button onClick={() => setActiveFaq(activeFaq === i ? null : i)} style={{ width: "100%", background: "none", border: "none", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", textAlign: "left", color: isDark ? "#fff" : "#1a1a1a", fontFamily: "'Syne', sans-serif", fontSize: 16, fontWeight: 600, gap: 16 }}>
              {faq.q}<span style={{ fontSize: 20, color: "#A855F7", flexShrink: 0, transition: "transform 0.2s", transform: activeFaq === i ? "rotate(45deg)" : "none" }}>+</span>
            </button>
            {activeFaq === i && <p style={{ marginTop: 16, color: isDark ? "rgba(255,255,255,0.55)" : "rgba(0,0,0,0.55)", fontSize: 15, lineHeight: 1.7 }}>{faq.a}</p>}
          </div>
        ))}
      </section>

      <section style={{ padding: "80px 40px", margin: "0 40px 80px", background: isDark ? "linear-gradient(135deg,rgba(168,85,247,0.2),rgba(0,212,255,0.08))" : "linear-gradient(135deg,rgba(168,85,247,0.1),rgba(0,212,255,0.04))", border: isDark ? "1px solid rgba(168,85,247,0.3)" : "1px solid rgba(168,85,247,0.2)", borderRadius: 24, maxWidth: 1100, marginLeft: "auto", marginRight: "auto", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "-50%", left: "30%", width: 400, height: 400, borderRadius: "50%", background: isDark ? "radial-gradient(circle,rgba(168,85,247,0.15),transparent)" : "radial-gradient(circle,rgba(168,85,247,0.08),transparent)", filter: "blur(60px)", pointerEvents: "none" }} />
        <div style={{ position: "relative" }}>
          <h2 style={{ fontSize: "clamp(28px,5vw,56px)", fontWeight: 800, letterSpacing: -2, marginBottom: 20 }}>Start automating today.<br /><span className="gradient-text">First 14 days free.</span></h2>
          <p style={{ color: isDark ? "rgba(255,255,255,0.55)" : "rgba(0,0,0,0.55)", fontSize: 18, marginBottom: 40 }}>Join 12,400+ businesses that replaced manual work with intelligent automation.</p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <button className="btn-primary" style={{ padding: "18px 48px", borderRadius: 14, fontSize: 17, fontWeight: 700 }} onClick={() => setCurrentView("signup")}>Get Started Free</button>
            <button className="btn-ghost" style={{ padding: "18px 32px", borderRadius: 14, fontSize: 17 }} onClick={() => setDemoOpen(true)}>Watch Live Demo</button>
          </div>
        </div>
      </section>

      <footer className="nexus-footer" style={{ borderTop: isDark ? "1px solid rgba(255,255,255,0.06)" : "1px solid rgba(0,0,0,0.08)", padding: "60px 40px 40px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr", gap: 40, marginBottom: 60 }}>
            <div><div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}><div style={{ width: 32, height: 32, borderRadius: 8, background: "linear-gradient(135deg,#A855F7,#7C3AED)", display: "flex", alignItems: "center", justifyContent: "center" }}>⚡</div><span style={{ fontSize: 18, fontWeight: 800, color: isDark ? "#fff" : "#1a1a1a" }}>NexusAI</span></div><p style={{ color: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)", fontSize: 13, lineHeight: 1.7, maxWidth: 240 }}>The AI operating system powering the next generation of autonomous businesses worldwide.</p><div style={{ display: "flex", gap: 12, marginTop: 20 }}>{["𝕏", "in", "▶", "f"].map((icon) => (<div key={icon} style={{ width: 32, height: 32, border: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(0,0,0,0.1)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, cursor: "pointer", color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)" }}>{icon}</div>))}</div></div>
            {[{ title: "Product", links: ["Features", "Pricing", "Integrations", "API Docs", "Changelog"] }, { title: "Company", links: ["About", "Careers", "Blog", "Press", "Partners"] }, { title: "Resources", links: ["Help Center", "Case Studies", "Templates", "Community", "Status"] }, { title: "Legal", links: ["Privacy", "Terms", "Security", "GDPR", "Cookies"] }].map((col) => (<div key={col.title}><div style={{ fontSize: 13, fontWeight: 700, marginBottom: 16, color: isDark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.7)" }}>{col.title}</div>{col.links.map((link) => (<div key={link} style={{ marginBottom: 10 }}><a href="#" style={{ color: isDark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.35)", fontSize: 13, textDecoration: "none" }}>{link}</a></div>))}</div>))}
          </div>
          <div style={{ borderTop: isDark ? "1px solid rgba(255,255,255,0.06)" : "1px solid rgba(0,0,0,0.08)", paddingTop: 24, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
            <span style={{ color: isDark ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.25)", fontSize: 13 }}>© 2026 NexusAI Inc. All rights reserved. Serving 137 countries worldwide.</span>
            <div style={{ display: "flex", gap: 16 }}>{["🇺🇸 English", "🇪🇺 EUR", "SOC2 ✓", "ISO 27001 ✓"].map((badge) => (<span key={badge} style={{ color: isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)", fontSize: 12 }}>{badge}</span>))}</div>
          </div>
        </div>
      </footer>

            {/* Signup Modal */}
      {currentView === "signup" && (
        <div style={{ 
          position: "fixed", 
          inset: 0, 
          background: "rgba(0,0,0,0.85)", 
          zIndex: 200, 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center",
          backdropFilter: "blur(8px)"
        }}>
          <div style={{ 
            position: "relative",
            background: isDark ? "#0d0d14" : "#ffffff", 
            border: isDark ? "1px solid rgba(168,85,247,0.3)" : "1px solid rgba(168,85,247,0.2)", 
            borderRadius: 24, 
            padding: 48, 
            width: 440,
            maxWidth: "90%",
            boxShadow: isDark ? "0 25px 50px rgba(0,0,0,0.5)" : "0 25px 50px rgba(0,0,0,0.15)"
          }}>
            {/* Exit Button */}
            <button 
              onClick={() => { setCurrentView("landing"); setAuthError(""); }} 
              style={{
                position: "absolute",
                top: 20,
                right: 20,
                background: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)",
                border: "none",
                width: 36,
                height: 36,
                borderRadius: 10,
                color: isDark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.6)",
                cursor: "pointer",
                fontSize: 20,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.2s"
              }}
              onMouseEnter={(e) => {
                e.target.style.background = isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.1)";
                e.target.style.color = isDark ? "#fff" : "#1a1a1a";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)";
                e.target.style.color = isDark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.6)";
              }}
            >✕</button>

            <div style={{ textAlign: "center", marginBottom: 24 }}>
              <div style={{ 
                width: 56, 
                height: 56, 
                borderRadius: 14, 
                background: "linear-gradient(135deg,#A855F7,#7C3AED)", 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center", 
                fontSize: 28, 
                margin: "0 auto 16px",
                boxShadow: "0 4px 15px rgba(168,85,247,0.3)"
              }}>⚡</div>
              <h2 style={{ fontSize: 24, fontWeight: 800, color: isDark ? "#fff" : "#1a1a1a" }}>Create Account</h2>
              <p style={{ color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)", marginTop: 4 }}>Start your 14-day free trial</p>
            </div>
            
            {authError && <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 12, padding: 12, marginBottom: 20, color: "#F87171", fontSize: 13, textAlign: "center" }}>{authError}</div>}
            
            <input 
              type="text" 
              placeholder="Full name" 
              value={signupName} 
              onChange={(e) => setSignupName(e.target.value)} 
              style={{ 
                width: "100%", 
                padding: "14px 16px", 
                background: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)", 
                border: isDark ? "1px solid rgba(168,85,247,0.3)" : "1px solid rgba(168,85,247,0.25)", 
                borderRadius: 12, 
                color: isDark ? "#fff" : "#1a1a1a", 
                marginBottom: 16,
                fontSize: 14,
                outline: "none"
              }}
              onFocus={(e) => e.target.style.borderColor = "#A855F7"}
              onBlur={(e) => e.target.style.borderColor = isDark ? "rgba(168,85,247,0.3)" : "rgba(168,85,247,0.25)"}
            />
            
            <input 
              type="email" 
              placeholder="Email address" 
              value={signupEmail} 
              onChange={(e) => setSignupEmail(e.target.value)} 
              style={{ 
                width: "100%", 
                padding: "14px 16px", 
                background: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)", 
                border: isDark ? "1px solid rgba(168,85,247,0.3)" : "1px solid rgba(168,85,247,0.25)", 
                borderRadius: 12, 
                color: isDark ? "#fff" : "#1a1a1a", 
                marginBottom: 16,
                fontSize: 14,
                outline: "none"
              }}
              onFocus={(e) => e.target.style.borderColor = "#A855F7"}
              onBlur={(e) => e.target.style.borderColor = isDark ? "rgba(168,85,247,0.3)" : "rgba(168,85,247,0.25)"}
            />
            
            <input 
              type="password" 
              placeholder="Password (min 6 characters)" 
              value={signupPassword} 
              onChange={(e) => setSignupPassword(e.target.value)} 
              style={{ 
                width: "100%", 
                padding: "14px 16px", 
                background: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)", 
                border: isDark ? "1px solid rgba(168,85,247,0.3)" : "1px solid rgba(168,85,247,0.25)", 
                borderRadius: 12, 
                color: isDark ? "#fff" : "#1a1a1a", 
                marginBottom: 24,
                fontSize: 14,
                outline: "none"
              }}
              onFocus={(e) => e.target.style.borderColor = "#A855F7"}
              onBlur={(e) => e.target.style.borderColor = isDark ? "rgba(168,85,247,0.3)" : "rgba(168,85,247,0.25)"}
            />
            
            <button 
              className="btn-primary" 
              style={{ width: "100%", padding: "14px", borderRadius: 12, fontSize: 16, fontWeight: 600, cursor: "pointer" }} 
              onClick={handleSignup}
            >Start Free Trial →</button>
            
            <p style={{ textAlign: "center", marginTop: 20, color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)", fontSize: 13 }}>
              Already have an account?{" "}
              <button 
                onClick={() => { setCurrentView("login"); setAuthError(""); }} 
                style={{ background: "none", border: "none", color: "#A855F7", cursor: "pointer", fontWeight: 600 }}
              >Sign in</button>
            </p>
          </div>
        </div>
      )}

            {/* Login Modal */}
      {currentView === "login" && (
        <div style={{ 
          position: "fixed", 
          inset: 0, 
          background: "rgba(0,0,0,0.85)", 
          zIndex: 200, 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center",
          backdropFilter: "blur(8px)"
        }}>
          <div style={{ 
            position: "relative",
            background: isDark ? "#0d0d14" : "#ffffff", 
            border: isDark ? "1px solid rgba(168,85,247,0.3)" : "1px solid rgba(168,85,247,0.2)", 
            borderRadius: 24, 
            padding: 48, 
            width: 440,
            maxWidth: "90%",
            boxShadow: isDark ? "0 25px 50px rgba(0,0,0,0.5)" : "0 25px 50px rgba(0,0,0,0.15)"
          }}>
            {/* Exit Button */}
            <button 
              onClick={() => { setCurrentView("landing"); setAuthError(""); }} 
              style={{
                position: "absolute",
                top: 20,
                right: 20,
                background: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)",
                border: "none",
                width: 36,
                height: 36,
                borderRadius: 10,
                color: isDark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.6)",
                cursor: "pointer",
                fontSize: 20,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.2s"
              }}
              onMouseEnter={(e) => {
                e.target.style.background = isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.1)";
                e.target.style.color = isDark ? "#fff" : "#1a1a1a";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)";
                e.target.style.color = isDark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.6)";
              }}
            >✕</button>

            <div style={{ textAlign: "center", marginBottom: 24 }}>
              <div style={{ 
                width: 56, 
                height: 56, 
                borderRadius: 14, 
                background: "linear-gradient(135deg,#A855F7,#7C3AED)", 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center", 
                fontSize: 28, 
                margin: "0 auto 16px",
                boxShadow: "0 4px 15px rgba(168,85,247,0.3)"
              }}>⚡</div>
              <h2 style={{ fontSize: 24, fontWeight: 800, color: isDark ? "#fff" : "#1a1a1a" }}>Welcome Back</h2>
              <p style={{ color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)", marginTop: 4 }}>Sign in to your account</p>
            </div>
            
            {authError && <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 12, padding: 12, marginBottom: 20, color: "#F87171", fontSize: 13, textAlign: "center" }}>{authError}</div>}
            
            <input 
              type="email" 
              placeholder="Email address" 
              value={loginEmail} 
              onChange={(e) => setLoginEmail(e.target.value)} 
              style={{ 
                width: "100%", 
                padding: "14px 16px", 
                background: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)", 
                border: isDark ? "1px solid rgba(168,85,247,0.3)" : "1px solid rgba(168,85,247,0.25)", 
                borderRadius: 12, 
                color: isDark ? "#fff" : "#1a1a1a", 
                marginBottom: 16,
                fontSize: 14,
                outline: "none",
                transition: "all 0.2s"
              }}
              onFocus={(e) => e.target.style.borderColor = "#A855F7"}
              onBlur={(e) => e.target.style.borderColor = isDark ? "rgba(168,85,247,0.3)" : "rgba(168,85,247,0.25)"}
            />
            
            <input 
              type="password" 
              placeholder="Password" 
              value={loginPassword} 
              onChange={(e) => setLoginPassword(e.target.value)} 
              style={{ 
                width: "100%", 
                padding: "14px 16px", 
                background: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)", 
                border: isDark ? "1px solid rgba(168,85,247,0.3)" : "1px solid rgba(168,85,247,0.25)", 
                borderRadius: 12, 
                color: isDark ? "#fff" : "#1a1a1a", 
                marginBottom: 24,
                fontSize: 14,
                outline: "none"
              }}
              onFocus={(e) => e.target.style.borderColor = "#A855F7"}
              onBlur={(e) => e.target.style.borderColor = isDark ? "rgba(168,85,247,0.3)" : "rgba(168,85,247,0.25)"}
            />
            
            <button 
              className="btn-primary" 
              style={{ width: "100%", padding: "14px", borderRadius: 12, fontSize: 16, fontWeight: 600, cursor: "pointer" }} 
              onClick={handleLogin}
            >Sign In</button>
            
            <p style={{ textAlign: "center", marginTop: 20, color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)", fontSize: 13 }}>
              Don't have an account?{" "}
              <button 
                onClick={() => { setCurrentView("signup"); setAuthError(""); }} 
                style={{ background: "none", border: "none", color: "#A855F7", cursor: "pointer", fontWeight: 600 }}
              >Sign up</button>
            </p>
            
            <button 
              onClick={() => setShowForgotPassword(true)} 
              style={{ 
                background: "none", 
                border: "none", 
                color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)", 
                cursor: "pointer", 
                fontSize: 12, 
                marginTop: 12, 
                display: "block", 
                width: "100%", 
                textAlign: "center" 
              }}
            >Forgot Password?</button>
          </div>
        </div>
      )}
    </div>
    </ThemeProvider>
     </div>
  );
}