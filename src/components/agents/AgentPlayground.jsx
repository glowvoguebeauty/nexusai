import { useState, useEffect, useRef } from "react";
import { AGENTS } from "../../config/agents";
import { theme } from "../../styles/theme";
import { Pill } from "../common/Pill";
import { TypingDots } from "../common/TypingDots";

function generateAIResponse(input, agent) {
  const lower = input.toLowerCase();
  
  if (agent.id === "chatbot") {
    if (lower.includes("instagram")) {
      return `📸 **Instagram DM Reply**\n\nHey! ✨ Thanks for DMing NexusAI!\n\nI see you're interested in our AI automation platform. Here's what you need to know:\n\n💰 **Pricing starts at:** $299/month (14-day free trial)\n\n📅 **Want to see a demo?** Reply with "DEMO" and I'll send you a calendar link!\n\nTalk soon! 💫`;
    }
    if (lower.includes("whatsapp")) {
      return `💚 **WhatsApp Response**\n\nHello! 👋 This is NexusAI's automated support.\n\n✅ **Resolution:** Our team will process your request within 3-5 business days.\n\n📞 **Need immediate help?** Reply "HUMAN" and I'll connect you to a live agent.`;
    }
    if (lower.includes("facebook")) {
      return `💬 **Facebook Messenger Response**\n\nHi there! 👋\n\nThanks for reaching out on Facebook.\n\nWould you like me to:\n1️⃣ Connect you with a human agent\n2️⃣ Send you our pricing guide\n3️⃣ Book a demo call\n\nJust reply with 1, 2, or 3! 🚀`;
    }
    return `💬 **AI ChatBot Response**\n\nThanks for your message! I'm NexusAI's automated assistant.\n\n📌 **Available on all platforms:**\n• Facebook Messenger ✓\n• Instagram DMs ✓\n• WhatsApp Business ✓\n• Twitter/X ✓\n• LinkedIn ✓\n• Website Chat Widget ✓\n\n⚡ **Quick actions:**\n→ Type "PRICING" for plans\n→ Type "DEMO" for video\n→ Type "HUMAN" to talk to a person`;
  }
  
  return `🤖 **${agent.name} Response**\n\nI've analyzed your request: "${input.slice(0, 100)}"\n\n✅ **Next steps:**\n1. Our AI is processing your specific business context\n2. I'll provide a detailed solution momentarily\n\nHow else can I assist you today?`;
}

export function AgentPlayground() {
  const [activeAgent, setActiveAgent] = useState(AGENTS[0]);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [streamingText, setStreamingText] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingText]);

  const sendMessage = async (text) => {
    const message = text || input;
    if (!message.trim() || loading) return;
    
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: message }]);
    setLoading(true);
    setStreamingText("");
    
    await new Promise(resolve => setTimeout(resolve, 800));
    const response = generateAIResponse(message, activeAgent);
    const words = response.split(" ");
    
    for (let i = 0; i <= words.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 20));
      setStreamingText(words.slice(0, i).join(" "));
    }
    
    setMessages(prev => [...prev, { role: "agent", content: response }]);
    setStreamingText("");
    setLoading(false);
  };

  return (
    <div style={{ display: "flex", height: "100%", background: theme.bg }}>
      <div style={{ width: 280, borderRight: `1px solid ${theme.border}`, padding: 20, background: theme.card, overflowY: "auto" }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: theme.muted, letterSpacing: 2, marginBottom: 16 }}>AI AGENTS</div>
        {AGENTS.map(agent => (
          <div key={agent.id} onClick={() => { setActiveAgent(agent); setMessages([]); setInput(""); }} style={{
            padding: "14px 16px",
            borderRadius: 12,
            cursor: "pointer",
            background: activeAgent.id === agent.id ? `${agent.color}15` : "transparent",
            border: `1px solid ${activeAgent.id === agent.id ? agent.color + "50" : "transparent"}`,
            marginBottom: 8,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 24 }}>{agent.icon}</span>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{agent.name}</div>
                <div style={{ fontSize: 11, color: theme.muted }}>{agent.tagline}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "16px 24px", borderBottom: `1px solid ${theme.border}`, background: theme.card }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: `${activeAgent.color}20`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>{activeAgent.icon}</div>
            <div>
              <div style={{ fontWeight: 700 }}>{activeAgent.name}</div>
              <div style={{ fontSize: 12, color: theme.muted }}>{activeAgent.description.substring(0, 60)}...</div>
            </div>
            <div style={{ marginLeft: "auto" }}><Pill color={activeAgent.color}>● Active</Pill></div>
          </div>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "24px" }}>
          {messages.length === 0 && (
            <div style={{ textAlign: "center", padding: "60px 20px" }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>{activeAgent.icon}</div>
              <h3 style={{ fontSize: 20, marginBottom: 8 }}>{activeAgent.name} is ready</h3>
              <p style={{ color: theme.muted, maxWidth: 400, margin: "0 auto 32px" }}>{activeAgent.description}</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10, maxWidth: 500, margin: "0 auto" }}>
                {activeAgent.prompts.slice(0, 4).map((prompt, i) => (
                  <button key={i} onClick={() => sendMessage(prompt)} style={{ padding: "10px 14px", background: `${activeAgent.color}10`, border: `1px solid ${activeAgent.color}30`, borderRadius: 10, color: theme.text, fontSize: 12, cursor: "pointer", textAlign: "left" }}>{prompt.length > 50 ? prompt.slice(0, 50) + "..." : prompt}</button>
                ))}
              </div>
            </div>
          )}
          
          {messages.map((msg, idx) => (
            <div key={idx} style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start", marginBottom: 16 }}>
              <div style={{ maxWidth: "70%", padding: "12px 16px", borderRadius: msg.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px", background: msg.role === "user" ? `${activeAgent.color}20` : theme.card, border: `1px solid ${msg.role === "user" ? activeAgent.color + "40" : theme.border}`, whiteSpace: "pre-wrap", fontSize: 13, lineHeight: 1.6 }}>{msg.content}</div>
            </div>
          ))}
          
          {loading && (
            <div style={{ display: "flex", justifyContent: "flex-start", marginBottom: 16 }}>
              <div style={{ padding: "12px 16px", borderRadius: "16px 16px 16px 4px", background: theme.card, border: `1px solid ${theme.border}` }}>{streamingText || <TypingDots color={activeAgent.color} />}</div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div style={{ padding: "16px 24px", borderTop: `1px solid ${theme.border}`, background: theme.card }}>
          <div style={{ display: "flex", gap: 12 }}>
            <textarea value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }} placeholder={`Ask ${activeAgent.name} anything... (Enter to send)`} style={{ flex: 1, background: theme.bg, border: `1px solid ${theme.border}`, borderRadius: 12, padding: "12px 16px", color: theme.text, fontSize: 14, resize: "none", outline: "none", minHeight: 48 }} rows={2} />
            <button onClick={() => sendMessage()} disabled={loading || !input.trim()} style={{ width: 48, height: 48, borderRadius: 12, background: loading || !input.trim() ? theme.muted : `linear-gradient(135deg, ${activeAgent.color}, ${activeAgent.color}cc)`, border: "none", cursor: loading || !input.trim() ? "not-allowed" : "pointer", fontSize: 18, color: "#000" }}>↑</button>
          </div>
        </div>
      </div>
    </div>
  );
}