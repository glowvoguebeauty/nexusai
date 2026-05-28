import { useState } from "react";
import { theme } from "../../styles/theme";

const FAQS = [
  { q: "Do I need technical skills?", a: "Zero. NexusAI is built for business leaders. Our AI-guided setup takes 48 hours, no engineers needed." },
  { q: "What integrations do you support?", a: "500+ native integrations: Salesforce, HubSpot, Shopify, Stripe, Slack, QuickBooks, Microsoft 365, and every major ERP." },
  { q: "Is my data secure?", a: "Bank-grade security. AES-256 encryption, SOC2 Type II, ISO 27001, GDPR/CCPA compliant." },
  { q: "What's the ROI timeline?", a: "Average clients go ROI-positive in 6 weeks. We guarantee ROI on Pro and Enterprise plans." },
  { q: "Does the ChatBot work on all social media?", a: "Yes! Our AI ChatBot works on Facebook Messenger, Instagram DMs, WhatsApp Business, Twitter/X, LinkedIn, and your website." },
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section style={{ padding: "80px 40px 100px", maxWidth: 720, margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: 48 }}>
        <div style={{ fontSize: 11, color: theme.accent, fontWeight: 700, letterSpacing: 3, marginBottom: 14 }}>FAQ</div>
        <h2 style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 800, letterSpacing: -2 }}>Common questions</h2>
      </div>

      {FAQS.map((faq, index) => (
        <div key={index} style={{ borderBottom: `1px solid ${theme.border}`, padding: "20px 0" }}>
          <button onClick={() => setOpenIndex(openIndex === index ? null : index)} style={{
            width: "100%",
            background: "none",
            border: "none",
            cursor: "pointer",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            color: theme.text,
            fontSize: 16,
            fontWeight: 600,
          }}>
            {faq.q}
            <span style={{ color: theme.accent, fontSize: 22, transform: openIndex === index ? "rotate(45deg)" : "none" }}>+</span>
          </button>
          {openIndex === index && <p style={{ marginTop: 16, color: theme.muted, fontSize: 15, lineHeight: 1.7 }}>{faq.a}</p>}
        </div>
      ))}
    </section>
  );
}