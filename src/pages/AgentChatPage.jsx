// Agent Chat Component
function AgentChatPage({ agent, onBack }) {
  const { isDark } = useTheme();
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
  
  await new Promise(r => setTimeout(r, 500));
  
  // Get API key from localStorage
  const savedApiKey = localStorage.getItem("nexusai_api_key");
  const savedApiProvider = localStorage.getItem("nexusai_api_provider") || "claude";
  
  let response;
  if (savedApiKey && savedApiKey.trim()) {
    try {
      if (savedApiProvider === "claude") {
        response = await callClaudeAPI(agent.systemPrompt, msg, savedApiKey);
      } else {
        response = await callOpenAIAPI(agent.systemPrompt, msg, savedApiKey);
      }
    } catch (error) {
      console.error("API Error:", error);
      response = generateBeautifulResponse(msg, agent);
    }
  } else {
    response = generateBeautifulResponse(msg, agent);
  }
  
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
      
      {/* NexusAI Animated Background Grid */}
      <div style={{ 
        position: "absolute", 
        inset: 0, 
        backgroundImage: isDark ? "linear-gradient(rgba(168,85,247,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(168,85,247,0.03) 1px, transparent 1px)" : "linear-gradient(rgba(168,85,247,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(168,85,247,0.02) 1px, transparent 1px)", 
        backgroundSize: "50px 50px", 
        pointerEvents: "none" 
      }} />
      
      {/* Floating Orbs - NexusAI Signature */}
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

      {/* Premium Header - Glassmorphism with NexusAI Style */}
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
        {/* Gradient border line */}
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

      {/* Messages Area - Premium Design */}
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

      {/* Premium Input Area - NexusAI Style */}
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
          {/* Animated gradient border */}
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

      {/* NexusAI Premium Animations */}
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
          @media (max-width: 768px) {
  .agent-chat-sidebar {
    width: 70px !important;
  }
  .agent-chat-sidebar-open {
    width: 200px !important;
  }
}
      `}</style>
    </div>
  );
}