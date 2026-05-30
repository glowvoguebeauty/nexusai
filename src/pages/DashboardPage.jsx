import { useState, useEffect, useRef, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { AGENTS } from '../config/agents';

gsap.registerPlugin(ScrollTrigger);

// ============================================================
// SAFE GRADIENT TEXT  — never causes black/white box bug
// Usage: <GradText isDark={isDark} gradient="linear-gradient(...)">text</GradText>
// In dark mode  → gradient clip
// In light mode → solid dark color (no clip = no box glitch)
// ============================================================
const GradText = ({ children, isDark, gradient = 'linear-gradient(135deg,#A855F7,#7C3AED)', solidLight = '#1a1a2e', style = {}, as: Tag = 'span' }) => {
  if (isDark) {
    return (
      <Tag style={{
        background: gradient,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        display: 'inline',
        ...style,
      }}>
        {children}
      </Tag>
    );
  }
  // Light mode: plain color, no gradient clip — eliminates black-box bug
  return (
    <Tag style={{ color: solidLight, WebkitTextFillColor: solidLight, ...style }}>
      {children}
    </Tag>
  );
};

// ============================================================
// CUSTOM CURSOR
// ============================================================
const CustomCursor = () => {
  const ringRef = useRef(null);
  const cursorRef = useRef(null);
  const dotRef = useRef(null);

  useEffect(() => {
    const ring = ringRef.current;
    const cursor = cursorRef.current;
    const dot = dotRef.current;
    if (!ring || !cursor || !dot) return;
    document.body.style.cursor = 'none';
    gsap.set([cursor, ring, dot], { xPercent: -50, yPercent: -50, opacity: 0 });
    const onMove = (e) => {
      gsap.to(dot,    { duration: 0.05, x: e.clientX, y: e.clientY, ease: 'power2.out' });
      gsap.to(ring,   { duration: 0.30, x: e.clientX, y: e.clientY, ease: 'back.out(0.5)' });
      gsap.to(cursor, { duration: 0.15, x: e.clientX, y: e.clientY, ease: 'power2.out' });
    };
    const onEnter = () => gsap.to([cursor, ring, dot], { duration: 0.3, opacity: 1 });
    const onLeave = () => gsap.to([cursor, ring, dot], { duration: 0.3, opacity: 0 });
    window.addEventListener('mousemove', onMove);
    document.body.addEventListener('mouseenter', onEnter);
    document.body.addEventListener('mouseleave', onLeave);
    return () => {
      window.removeEventListener('mousemove', onMove);
      document.body.removeEventListener('mouseenter', onEnter);
      document.body.removeEventListener('mouseleave', onLeave);
      document.body.style.cursor = 'auto';
    };
  }, []);

  return (
    <>
      <div ref={ringRef} style={{ position: 'fixed', top: 0, left: 0, width: '42px', height: '42px', borderRadius: '50%', border: '2px solid rgba(168,85,247,0.6)', boxShadow: '0 0 20px rgba(168,85,247,0.4)', backdropFilter: 'blur(3px)', pointerEvents: 'none', zIndex: 99999, willChange: 'transform' }} />
      <div ref={cursorRef} style={{ position: 'fixed', top: 0, left: 0, width: '12px', height: '12px', borderRadius: '50%', background: 'radial-gradient(circle,#A855F7,#7C3AED)', boxShadow: '0 0 12px #A855F7', pointerEvents: 'none', zIndex: 99999, willChange: 'transform' }} />
      <div ref={dotRef} style={{ position: 'fixed', top: 0, left: 0, width: '4px', height: '4px', borderRadius: '50%', background: '#fff', pointerEvents: 'none', zIndex: 100000, willChange: 'transform' }} />
    </>
  );
};

// ============================================================
// AGENT CHAT MODAL — fully fixed for dark + light mode
// ============================================================
// ============================================================
// PREMIUM AGENT CHAT MODAL — Addictive UI with Theme Toggle
// ============================================================
const AgentChatModal = ({ agent, onClose, isDark, user, onToggleTheme }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [stream, setStream] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const endRef = useRef(null);
  const inputRef = useRef(null);

  // Theme-aware styling (supercharged)
  const bgOverlay = isDark 
    ? 'radial-gradient(ellipse at 50% 30%, rgba(10,10,20,0.98), rgba(5,5,10,0.99))'
    : 'radial-gradient(ellipse at 50% 30%, rgba(250,250,255,0.98), rgba(245,245,255,0.99))';
  
  const panelBg = isDark 
    ? 'rgba(15,15,25,0.85)' 
    : 'rgba(255,255,255,0.85)';
  const border = isDark ? 'rgba(255,255,255,0.12)' : 'rgba(100,80,180,0.15)';
  const textMain = isDark ? '#f0f0ff' : '#0a0a1a';
  const textMuted = isDark ? 'rgba(200,200,240,0.6)' : 'rgba(40,30,80,0.55)';
  const inputBg = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.04)';
  const userBubble = isDark ? `${agent.color}28` : `${agent.color}12`;
  const agentBubble = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.03)';
  const glowColor = agent.color;

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
    inputRef.current?.focus();
  }, [messages, stream]);

  const send = async (text) => {
  const msg = text || input;
  if (!msg.trim() || loading) return;

  setInput('');

// Yeh line important hai: system prompt ko pehle daalo
  let apiMessages = [];
  if (agent.system) {
    apiMessages.push({ role: 'system', content: agent.system });
  }

  // Purani messages (history) + naya user message
  apiMessages.push(...messages, { role: 'user', content: msg });

  setMessages(prev => [...prev, { role: 'user', content: msg }]);
  setLoading(true);
  
  const updatedMessages = [...messages, { role: 'user', content: msg }];
  setMessages(updatedMessages);
  setLoading(true);

  try {
    // Determine API URL based on environment
const isDevelopment = process.env.NODE_ENV === 'development';
const API_BASE = isDevelopment 
  ? 'http://localhost:8888/.netlify/functions'   // local testing with netlify dev
  : '/.netlify/functions';                       // production mein relative path

const response = await fetch(`${API_BASE}/chat-ai`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ messages: updatedMessages }),
});

    const data = await response.json();
    const aiReply = data.reply;          // ✅ Declare and assign

    // 2. Update UI with AI reply
    setMessages(prev => [...prev, { role: 'agent', content: aiReply }]);

    // 3. Optional: Save chat (only if user is defined)
    if (user && user.id) {
      await fetch('http://localhost:5001/api/chat/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          agentId: agent.id,
          messages: [
            { role: 'user', content: msg },
            { role: 'agent', content: aiReply }
          ]
        }),
      });
    }
  } catch (error) {
    console.error('AI fetch error:', error);
    setMessages(prev => [...prev, {
      role: 'agent',
      content: '⚠️ AI service is temporarily unavailable. Please try again later.'
    }]);
  } finally {
    setLoading(false);
  }
};

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: bgOverlay,
      backdropFilter: 'blur(12px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '20px',
      fontFamily: "'Inter', 'Syne', 'Space Grotesk', sans-serif",
      animation: 'modalFadeIn 0.3s cubic-bezier(0.2, 0.9, 0.4, 1.1)'
    }}>
      {/* Animated gradient orb background */}
      <div style={{
        position: 'absolute', width: '600px', height: '600px',
        borderRadius: '50%', background: `radial-gradient(circle, ${glowColor}30, transparent 70%)`,
        filter: 'blur(80px)', animation: 'floatOrb 12s infinite ease-in-out',
        pointerEvents: 'none'
      }} />

      {/* Modal Container */}
      <div style={{
        width: '100%', maxWidth: '1000px', height: '85vh', minHeight: '550px',
        background: panelBg, backdropFilter: 'blur(24px)',
        borderRadius: '42px', border: `1px solid ${border}`,
        boxShadow: isDark 
          ? `0 25px 60px rgba(0,0,0,0.5), 0 0 0 1px ${glowColor}20 inset`
          : `0 25px 60px rgba(100,60,200,0.2), 0 0 0 1px ${glowColor}15 inset`,
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
        position: 'relative'
      }}>
        {/* Animated top gradient bar */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '4px',
          background: `linear-gradient(90deg, ${glowColor}, #A855F7, ${glowColor})`,
          backgroundSize: '200% 100%', animation: 'gradientFlow 2s linear infinite',
          zIndex: 5
        }} />

        {/* Header with theme toggle */}
        <div style={{
          padding: '20px 28px', borderBottom: `1px solid ${border}`,
          background: panelBg, backdropFilter: 'blur(20px)',
          display: 'flex', alignItems: 'center', gap: 16,
          position: 'relative', zIndex: 2
        }}>
          <button onClick={onClose} style={{
            width: 44, height: 44, borderRadius: 16,
            background: `${glowColor}15`, border: `1px solid ${glowColor}35`,
            color: textMain, fontSize: 22, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.2s', backdropFilter: 'blur(4px)'
          }}>←</button>

          <div style={{
            width: 56, height: 56, borderRadius: 20,
            background: `${glowColor}20`, border: `1px solid ${glowColor}50`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 32, boxShadow: `0 0 30px ${glowColor}40`,
            animation: 'pulseGlow 2s infinite'
          }}>{agent.icon}</div>

          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 900, fontSize: 22, letterSpacing: '-0.3px', color: textMain }}>
              {agent.name}
            </div>
            <div style={{ fontSize: 13, color: textMuted, marginTop: 4, display: 'flex', gap: 8 }}>
              <span>{agent.tagline}</span>
              <span>•</span>
              <span style={{ color: glowColor, fontWeight: 600 }}>Nexus AI</span>
            </div>
          </div>

          {/* Theme Toggle Button */}
          <button onClick={onToggleTheme} style={{
            background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)',
            border: `1px solid ${border}`, borderRadius: 40,
            padding: '8px 18px', cursor: 'pointer', color: textMain,
            fontSize: 14, display: 'flex', alignItems: 'center', gap: 8,
            transition: 'all 0.2s', fontFamily: 'inherit', fontWeight: 500
          }}>
            <span>{isDark ? '☀️' : '🌙'}</span>
            <span>{isDark ? 'Light' : 'Dark'}</span>
          </button>

          {/* Online status */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '6px 16px', background: `${glowColor}12`,
            border: `1px solid ${glowColor}30`, borderRadius: 60
          }}>
            <div style={{
              width: 10, height: 10, borderRadius: '50%',
              background: '#10B981', boxShadow: '0 0 12px #10B981',
              animation: 'pulse 1.5s infinite'
            }} />
            <span style={{ fontSize: 12, color: glowColor, fontWeight: 800, letterSpacing: '0.5px' }}>ACTIVE</span>
          </div>
        </div>

        {/* Messages Area */}
        <div style={{
          flex: 1, overflowY: 'auto', padding: '28px 32px',
          scrollbarWidth: 'thin', scrollbarColor: `${glowColor}40 transparent`
        }}>
          {messages.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '50px 20px', maxWidth: 520, margin: '0 auto' }}>
              <div style={{
                width: 110, height: 110, borderRadius: 36,
                background: `${glowColor}18`, border: `2px solid ${glowColor}40`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 58, margin: '0 auto 28px',
                boxShadow: `0 0 50px ${glowColor}30`, animation: 'floatSoft 3s infinite'
              }}>{agent.icon}</div>
              <h2 style={{ fontSize: 32, fontWeight: 900, marginBottom: 14, color: textMain, letterSpacing: '-0.5px' }}>
                {agent.name} <span style={{ color: glowColor }}>⚡</span>
              </h2>
              <p style={{ color: textMuted, lineHeight: 1.7, fontSize: 15, marginBottom: 36 }}>
                {agent.description}
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px,1fr))', gap: 12 }}>
                {agent.prompts?.slice(0, 4).map((p, i) => (
                  <button key={i} onClick={() => send(p)} style={{
                    padding: '14px 18px', background: `${glowColor}0c`,
                    border: `1px solid ${glowColor}25`, borderRadius: 20,
                    cursor: 'pointer', color: textMain, fontSize: 13,
                    textAlign: 'left', transition: 'all 0.2s',
                    fontFamily: 'inherit', fontWeight: 500, backdropFilter: 'blur(4px)'
                  }} onMouseEnter={e => e.currentTarget.style.background = `${glowColor}18`}
                     onMouseLeave={e => e.currentTarget.style.background = `${glowColor}0c`}>
                    {p}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {messages.map((msg, i) => (
                <div key={i} style={{
                  display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                  marginBottom: 20, animation: 'slideUp 0.2s ease'
                }}>
                  <div style={{
                    maxWidth: '78%', padding: '14px 22px',
                    borderRadius: msg.role === 'user' ? '28px 28px 8px 28px' : '28px 28px 28px 8px',
                    background: msg.role === 'user' ? userBubble : agentBubble,
                    border: `1px solid ${msg.role === 'user' ? glowColor + '40' : border}`,
                    fontSize: 14, lineHeight: 1.6, color: textMain,
                    backdropFilter: 'blur(8px)', fontWeight: 450,
                    boxShadow: msg.role === 'user' ? `0 4px 12px ${glowColor}20` : 'none'
                  }}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: 20 }}>
                  <div style={{
                    padding: '14px 22px', background: agentBubble,
                    borderRadius: '28px 28px 28px 8px', border: `1px solid ${border}`,
                    backdropFilter: 'blur(8px)', fontSize: 14, color: textMain,
                    display: 'flex', alignItems: 'center', gap: 8
                  }}>
                    {stream ? stream : (
                      <>
                        <span className="typing-dot" style={{ animationDelay: '0s' }}>•</span>
                        <span className="typing-dot" style={{ animationDelay: '0.2s' }}>•</span>
                        <span className="typing-dot" style={{ animationDelay: '0.4s' }}>•</span>
                      </>
                    )}
                  </div>
                </div>
              )}
              <div ref={endRef} />
            </>
          )}
        </div>

        {/* Input Area */}
        <div style={{
          padding: '20px 28px', borderTop: `1px solid ${border}`,
          background: panelBg, backdropFilter: 'blur(20px)'
        }}>
          <div style={{ position: 'relative' }}>
            <textarea
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
              placeholder={`Message ${agent.name}...`}
              rows={2}
              style={{
                width: '100%', background: inputBg, border: `1px solid ${border}`,
                borderRadius: 24, padding: '16px 130px 16px 24px',
                color: textMain, resize: 'none', outline: 'none',
                fontFamily: 'inherit', fontSize: 14, lineHeight: 1.5,
                transition: 'all 0.2s', boxSizing: 'border-box',
                fontWeight: 450
              }}
            />
            <button onClick={() => send()} disabled={loading || !input.trim()} style={{
              position: 'absolute', right: 12, bottom: 12,
              padding: '10px 24px', borderRadius: 40,
              background: loading || !input.trim() ? `${glowColor}20` : `linear-gradient(135deg, ${glowColor}, ${glowColor}cc)`,
              border: 'none', color: loading || !input.trim() ? textMuted : '#fff',
              cursor: loading || !input.trim() ? 'default' : 'pointer',
              fontWeight: 700, fontSize: 13, fontFamily: 'inherit',
              boxShadow: loading || !input.trim() ? 'none' : `0 6px 20px ${glowColor}60`,
              transition: 'all 0.2s', letterSpacing: '0.3px'
            }}>Send →</button>
          </div>
        </div>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes modalFadeIn {
          from { opacity: 0; backdrop-filter: blur(0px); transform: scale(0.98); }
          to { opacity: 1; backdrop-filter: blur(12px); transform: scale(1); }
        }
        @keyframes gradientFlow {
          0% { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }
        @keyframes floatOrb {
          0%,100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(30px, -20px) scale(1.05); }
        }
        @keyframes floatSoft {
          0%,100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        @keyframes pulseGlow {
          0%,100% { box-shadow: 0 0 30px ${glowColor}40; }
          50% { box-shadow: 0 0 50px ${glowColor}80; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .typing-dot {
          display: inline-block;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: ${glowColor};
          margin: 0 2px;
          animation: typingWave 1.2s infinite ease-in-out;
        }
        @keyframes typingWave {
          0%,60%,100% { transform: translateY(0); opacity: 0.4; }
          30% { transform: translateY(-6px); opacity: 1; }
        }
        @media (max-width: 768px) {
          div[style*="padding: 20px 28px"] { padding: 16px 20px !important; }
          div[style*="padding: 28px 32px"] { padding: 20px !important; }
          textarea { font-size: 16px !important; }
          button[style*="padding: 8px 18px"] { padding: 6px 12px !important; font-size: 12px !important; }
          div[style*="width: 56px"] { width: 44px !important; height: 44px !important; font-size: 26px !important; }
        }
      `}</style>
    </div>
  );
};

// ============================================================
// ANIMATED BACKGROUND
// ============================================================
const AnimatedBackground = ({ isDark }) => (
  <>
    <div style={{ position: 'fixed', inset: 0, background: isDark ? 'radial-gradient(ellipse at 20% 50%,#0d0520 0%,#050508 50%,#020210 100%)' : 'radial-gradient(ellipse at 20% 50%,#ede8ff 0%,#f5f5ff 50%,#eeeeff 100%)', zIndex: 0, pointerEvents: 'none' }} />
    <div style={{ position: 'fixed', inset: 0, backgroundImage: `linear-gradient(${isDark ? 'rgba(168,85,247,0.04)' : 'rgba(168,85,247,0.07)'} 1px,transparent 1px),linear-gradient(90deg,${isDark ? 'rgba(168,85,247,0.04)' : 'rgba(168,85,247,0.07)'} 1px,transparent 1px)`, backgroundSize: '60px 60px', zIndex: 0, pointerEvents: 'none', animation: 'gridMove 20s linear infinite' }} />
    <div style={{ position: 'fixed', top: '5%', left: '-15%', width: '700px', height: '700px', borderRadius: '50%', background: 'radial-gradient(circle,rgba(168,85,247,0.18),rgba(120,40,200,0.08),transparent 70%)', filter: 'blur(60px)', animation: 'floatOrb 20s ease-in-out infinite', pointerEvents: 'none', zIndex: 0 }} />
    <div style={{ position: 'fixed', bottom: '0%', right: '-15%', width: '600px', height: '600px', borderRadius: '50%', background: 'radial-gradient(circle,rgba(0,212,255,0.14),rgba(0,100,200,0.06),transparent 70%)', filter: 'blur(70px)', animation: 'floatOrb 16s ease-in-out infinite reverse', pointerEvents: 'none', zIndex: 0 }} />
    <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '900px', height: '400px', borderRadius: '50%', background: 'radial-gradient(ellipse,rgba(99,102,241,0.06),transparent 70%)', filter: 'blur(80px)', animation: 'floatOrb 25s ease-in-out infinite 5s', pointerEvents: 'none', zIndex: 0 }} />
    <div style={{ position: 'fixed', top: '30%', right: '10%', width: '350px', height: '350px', borderRadius: '50%', background: 'radial-gradient(circle,rgba(16,185,129,0.1),transparent 70%)', filter: 'blur(50px)', animation: 'floatOrb 18s ease-in-out infinite 8s', pointerEvents: 'none', zIndex: 0 }} />
    <div style={{ position: 'fixed', inset: 0, opacity: isDark ? 0.03 : 0.015, backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")", backgroundRepeat: 'repeat', backgroundSize: '200px 200px', zIndex: 0, pointerEvents: 'none' }} />
  </>
);

// ============================================================
// SECTION HEADER
// ============================================================
const SectionHeader = ({ title, subtitle, badge, isDark }) => (
  <div style={{ marginBottom: 36 }}>
    {badge && (
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '5px 14px', background: 'rgba(168,85,247,0.1)', border: '1px solid rgba(168,85,247,0.25)', borderRadius: 40, marginBottom: 14 }}>
        <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#A855F7', boxShadow: '0 0 8px #A855F7', animation: 'pulse 2s infinite' }} />
        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '1.5px', color: '#A855F7', textTransform: 'uppercase' }}>{badge}</span>
      </div>
    )}
    {/* Title: safe for both modes */}
    <h2 style={{ fontSize: 'clamp(22px,3vw,32px)', fontWeight: 900, letterSpacing: '-0.5px', margin: 0, color: isDark ? '#e8e0ff' : '#0d0020' }}>
      {title}
    </h2>
    {subtitle && <p style={{ marginTop: 8, fontSize: 14, color: isDark ? 'rgba(200,200,230,0.5)' : 'rgba(30,20,60,0.55)', lineHeight: 1.5 }}>{subtitle}</p>}
  </div>
);

// ============================================================
// CIRCULAR PROGRESS
// ============================================================
const CircularProgress = ({ value, max = 100, color, size = 80, label, sublabel, isDark }) => {
  const r = (size / 2) - 6;
  const circ = 2 * Math.PI * r;
  const offset = circ - (value / max) * circ;
  const textColor = isDark ? 'rgba(200,200,230,0.75)' : 'rgba(30,20,60,0.65)';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
      <div style={{ position: 'relative', width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.07)'} strokeWidth={5} />
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={5} strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={offset} style={{ filter: `drop-shadow(0 0 6px ${color})`, transition: 'stroke-dashoffset 1.5s cubic-bezier(0.4,0,0.2,1)' }} />
        </svg>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: size > 70 ? 16 : 12, fontWeight: 800, color, lineHeight: 1 }}>{value}%</span>
        </div>
      </div>
      {label && <div style={{ fontSize: 12, fontWeight: 600, color: textColor, textAlign: 'center' }}>{label}</div>}
      {sublabel && <div style={{ fontSize: 10, color: isDark ? 'rgba(200,200,230,0.38)' : 'rgba(30,20,60,0.4)', textAlign: 'center' }}>{sublabel}</div>}
    </div>
  );
};

// ============================================================
// MINI SPARKLINE
// ============================================================
const Sparkline = ({ data, color, width = 80, height = 32 }) => {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * width},${height - ((v - min) / range) * height}`).join(' ');
  const id = `sg${color.replace(/[^a-zA-Z0-9]/g, '')}`;
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.5" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polyline points={pts + ` ${width},${height} 0,${height}`} fill={`url(#${id})`} stroke="none" />
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ filter: `drop-shadow(0 0 4px ${color})` }} />
    </svg>
  );
};

// ============================================================
// MAIN DASHBOARD COMPONENT
// ============================================================
const DashboardPage = ({ user, onLogout }) => {
  const [isDark, setIsDark]               = useState(true);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [hoveredAgent, setHoveredAgent]   = useState(null);

  // Refs for GSAP
  const statsRef      = useRef([]);
  const agentsRef     = useRef([]);
  const chartRef      = useRef(null);
  const welcomeRef    = useRef(null);
  const metricBarsRef = useRef([]);
  const commandRef    = useRef(null);
  const insightsRef   = useRef([]);
  const networkRef    = useRef(null);
  const activityRef   = useRef(null);

  // ── Theme init ──────────────────────────────────────────
  useEffect(() => {
    const saved = localStorage.getItem('nexusai_theme');
    setIsDark(saved !== 'light');
  }, []);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    localStorage.setItem('nexusai_theme', next ? 'dark' : 'light');
    document.body.style.backgroundColor = next ? '#050508' : '#f4f4fb';
    document.body.style.color = next ? '#f0f0ff' : '#0d0d1a';
  };

  // ── Derived theme tokens ─────────────────────────────────
  const bg      = isDark ? '#050508'                      : '#f4f4fb';
  const glBg    = isDark ? 'rgba(13,13,22,0.60)'          : 'rgba(255,255,255,0.72)';
  const glBd    = isDark ? 'rgba(255,255,255,0.07)'        : 'rgba(100,80,180,0.12)';
  const navBg   = isDark ? 'rgba(5,5,8,0.92)'             : 'rgba(248,246,255,0.94)';
  const textMain = isDark ? '#e8e0ff'                     : '#0d0020';
  const textSub  = isDark ? 'rgba(200,200,230,0.55)'      : 'rgba(30,20,60,0.52)';
  const textMid  = isDark ? 'rgba(200,200,230,0.28)'      : 'rgba(30,20,60,0.28)';
  const cardBg   = isDark ? 'rgba(255,255,255,0.03)'       : 'rgba(80,40,160,0.04)';

  const glassStyle = {
    background: glBg,
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: `1px solid ${glBd}`,
    borderRadius: 24,
    position: 'relative',
    overflow: 'hidden',
  };

  // ── GSAP animations ──────────────────────────────────────
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(welcomeRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out', scrollTrigger: { trigger: welcomeRef.current, start: 'top 90%' } });

      statsRef.current.filter(Boolean).forEach((el, i) => {
        gsap.fromTo(el,
          { opacity: 0, y: 50, scale: 0.92 },
          { opacity: 1, y: 0, scale: 1, duration: 0.7, delay: i * 0.06, ease: 'back.out(1)', scrollTrigger: { trigger: el, start: 'top 88%' } });
      });

      agentsRef.current.filter(Boolean).forEach((el, i) => {
        gsap.fromTo(el,
          { opacity: 0, scale: 0.88, y: 30 },
          { opacity: 1, scale: 1, y: 0, duration: 0.65, delay: i * 0.07, ease: 'elastic.out(1,0.45)', scrollTrigger: { trigger: el, start: 'top 88%' } });
      });

      if (chartRef.current) {
        const path = chartRef.current.querySelector('.revenue-path');
        if (path) {
          const len = path.getTotalLength();
          gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
          gsap.to(path, { strokeDashoffset: 0, duration: 2.5, ease: 'power2.out', scrollTrigger: { trigger: chartRef.current, start: 'top 80%' } });
        }
      }

      metricBarsRef.current.filter(Boolean).forEach((el, i) => {
        gsap.fromTo(el,
          { width: '0%' },
          { width: el.getAttribute('data-target') + '%', duration: 1.4, delay: i * 0.08, ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top 90%' } });
      });

      if (commandRef.current) {
        gsap.fromTo(commandRef.current,
          { opacity: 0, y: 60 },
          { opacity: 1, y: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: commandRef.current, start: 'top 85%' } });
      }

      insightsRef.current.filter(Boolean).forEach((el, i) => {
        gsap.fromTo(el,
          { opacity: 0, x: i % 2 === 0 ? -30 : 30 },
          { opacity: 1, x: 0, duration: 0.8, delay: i * 0.1, ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top 88%' } });
      });

      if (networkRef.current) {
        gsap.fromTo(networkRef.current,
          { opacity: 0, scale: 0.96 },
          { opacity: 1, scale: 1, duration: 1, ease: 'power2.out', scrollTrigger: { trigger: networkRef.current, start: 'top 85%' } });
      }

      if (activityRef.current) {
        gsap.fromTo(activityRef.current,
          { opacity: 0, x: 40 },
          { opacity: 1, x: 0, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: activityRef.current, start: 'top 85%' } });
      }
    });
    return () => ctx.revert();
  }, []);

  if (selectedAgent) return (
  <AgentChatModal 
    agent={selectedAgent} 
    onClose={() => setSelectedAgent(null)} 
    isDark={isDark}
    user={user}
    onToggleTheme={toggleTheme}
  />
);

  // ── DATA ────────────────────────────────────────────────
  const statCards = [
    { label: 'AI Operations', value: '2,847',    change: '+23%',    icon: '⚡', color: '#A855F7', sparkData: [40, 55, 48, 70, 62, 80, 75, 90, 85, 95] },
    { label: 'Revenue',       value: '$48,291',  change: '+12%',    icon: '💰', color: '#00D4FF', sparkData: [30, 40, 38, 55, 50, 65, 70, 68, 80, 88] },
    { label: 'Time Saved',    value: '342 hrs',  change: '+156',    icon: '⏱️', color: '#10B981', sparkData: [20, 35, 30, 50, 45, 60, 58, 72, 68, 80] },
    { label: 'Automations',   value: '12',       change: '+3',      icon: '🔄', color: '#F59E0B', sparkData: [5, 8, 7, 10, 9, 11, 12, 12, 12, 12] },
    { label: 'Leads',         value: '1,847',    change: '+23%',    icon: '🎯', color: '#6EE7B7', sparkData: [60, 70, 65, 80, 78, 90, 85, 95, 92, 100] },
    { label: 'Tickets',       value: '342',      change: '94% Auto', icon: '✅', color: '#818CF8', sparkData: [80, 75, 85, 90, 88, 92, 91, 94, 93, 95] },
    { label: 'AI Accuracy',   value: '94.2%',    change: '+2.1%',   icon: '📊', color: '#38BDF8', sparkData: [88, 89, 90, 91, 91, 92, 93, 93, 94, 94] },
    { label: 'Uptime',        value: '99.97%',   change: '99.99%',  icon: '🌍', color: '#F472B6', sparkData: [99, 99, 100, 100, 99, 100, 100, 100, 100, 100] },
    { label: 'Active Users',  value: '127',      change: '+12%',    icon: '👥', color: '#A855F7', sparkData: [80, 88, 85, 95, 100, 110, 105, 115, 120, 127] },
    { label: 'Conversion',    value: '28.5%',    change: '+5.2%',   icon: '📈', color: '#10B981', sparkData: [18, 20, 19, 22, 21, 24, 25, 26, 27, 28] },
    { label: 'Avg Response',  value: '12s',      change: '-2s',     icon: '⚡', color: '#00D4FF', sparkData: [20, 18, 19, 17, 16, 15, 14, 14, 13, 12] },
  ];

  const activities = [
    { agent: 'Sales Agent',     action: 'Qualified 24 new leads from LinkedIn campaign and scheduled 8 discovery calls',      time: '2 min ago',  icon: '💼', color: '#6EE7B7', status: 'success' },
    { agent: 'Support Agent',   action: 'Resolved 18 customer tickets automatically with 94% satisfaction rate',               time: '15 min ago', icon: '🎧', color: '#818CF8', status: 'success' },
    { agent: 'Marketing Agent', action: 'Launched new email campaign reaching 12,400 subscribers with 34% open rate',          time: '1 hr ago',   icon: '📣', color: '#FB923C', status: 'running' },
    { agent: 'ChatBot Agent',   action: 'Handled 47 customer conversations across Instagram, Facebook and WhatsApp',           time: '2 hrs ago',  icon: '💬', color: '#E1306C', status: 'success' },
    { agent: 'Analytics Agent', action: 'Generated weekly revenue report showing 23% month-over-month growth',                 time: '3 hrs ago',  icon: '📊', color: '#38BDF8', status: 'complete' },
  ];

  const metrics = [
    { label: 'Revenue Growth',        value: 23,   color: '#10B981' },
    { label: 'Customer Satisfaction', value: 98,   color: '#00D4FF' },
    { label: 'Forecast Accuracy',     value: 94,   color: '#A855F7' },
    { label: 'Cost Reduction',        value: 48,   color: '#F59E0B' },
    { label: 'Lead Conversion',       value: 28,   color: '#6EE7B7' },
    { label: 'Response Time',         value: 40,   color: '#818CF8' },
  ];

  const commandMetrics = [
    { label: 'Neural CPU', value: 78, color: '#A855F7', unit: '%' },
    { label: 'GPU Tensor', value: 92, color: '#00D4FF', unit: '%' },
    { label: 'Memory',     value: 61, color: '#10B981', unit: '%' },
    { label: 'Bandwidth',  value: 84, color: '#F59E0B', unit: '%' },
  ];

  const networkNodes = [
    { region: 'North America', nodes: 847, traffic: '2.4 TB', uptime: '99.99%', color: '#A855F7', x: '22%', y: '35%' },
    { region: 'Europe',        nodes: 634, traffic: '1.8 TB', uptime: '99.97%', color: '#00D4FF', x: '48%', y: '28%' },
    { region: 'Asia Pacific',  nodes: 912, traffic: '3.1 TB', uptime: '99.98%', color: '#10B981', x: '72%', y: '38%' },
    { region: 'Middle East',   nodes: 298, traffic: '0.9 TB', uptime: '99.95%', color: '#F59E0B', x: '58%', y: '46%' },
    { region: 'Latin America', nodes: 187, traffic: '0.6 TB', uptime: '99.92%', color: '#F472B6', x: '30%', y: '62%' },
    { region: 'Africa',        nodes: 124, traffic: '0.4 TB', uptime: '99.90%', color: '#6EE7B7', x: '50%', y: '58%' },
  ];

  const smartInsights = [
    { title: 'Revenue Spike Detected',  body: 'AI models predict 34% revenue increase next week based on current funnel velocity.',              icon: '📈', color: '#10B981', type: 'OPPORTUNITY', priority: 'HIGH' },
    { title: 'Automation Efficiency',   body: 'Support automations running 12% above baseline. Recommend expanding to new channels.',           icon: '🤖', color: '#A855F7', type: 'INSIGHT',     priority: 'MEDIUM' },
    { title: 'Lead Quality Alert',      body: 'LinkedIn campaign leads converting 2.3x better than average. Scale budget recommended.',         icon: '🎯', color: '#00D4FF', type: 'ACTION',      priority: 'HIGH' },
    { title: 'Neural Model Upgrade',    body: 'New model version available with 8.2% accuracy improvement on your dataset.',                    icon: '⚡', color: '#F59E0B', type: 'UPDATE',      priority: 'LOW' },
    { title: 'Churn Risk Identified',   body: '3 enterprise accounts showing engagement drop. Automated re-engagement triggered.',              icon: '🛡️', color: '#F472B6', type: 'ALERT',       priority: 'HIGH' },
    { title: 'Cost Optimization Found', body: 'Reallocating 18% of compute to off-peak hours saves estimated $2,400/month.',                    icon: '💡', color: '#6EE7B7', type: 'SAVINGS',     priority: 'MEDIUM' },
  ];

  const quickActions = [
    { label: 'Launch Agent',    icon: '🚀', color: '#A855F7', desc: 'Deploy new AI agent' },
    { label: 'Generate Report', icon: '📊', color: '#00D4FF', desc: 'AI-powered report' },
    { label: 'View Analytics',  icon: '📈', color: '#10B981', desc: 'Deep dive metrics' },
    { label: 'Run Automation',  icon: '⚙️', color: '#F59E0B', desc: 'Execute workflow' },
    { label: 'Neural Sync',     icon: '🧠', color: '#818CF8', desc: 'Sync AI models' },
    { label: 'AI Diagnostics',  icon: '🔬', color: '#F472B6', desc: 'Health check' },
  ];

  const statusColor = { success: '#10B981', running: '#F59E0B', complete: '#00D4FF' };
  const AI_AGENTS = AGENTS;

  // ── Reusable status chip ─────────────────────────────────
  const priorityStyles = {
    HIGH:   { bg: 'rgba(239,68,68,0.1)',   color: '#EF4444', border: 'rgba(239,68,68,0.22)' },
    MEDIUM: { bg: 'rgba(249,115,22,0.1)',  color: '#F97316', border: 'rgba(249,115,22,0.22)' },
    LOW:    { bg: 'rgba(16,185,129,0.1)',  color: '#10B981', border: 'rgba(16,185,129,0.22)' },
  };

  return (
    <div style={{ background: bg, color: textMain, minHeight: '100vh', fontFamily: "'Syne','Space Grotesk',sans-serif", position: 'relative', overflowX: 'hidden' }}>
      <CustomCursor />
      <AnimatedBackground isDark={isDark} />

      {/* ══════════════════════════════════════════
          NAVBAR
      ══════════════════════════════════════════ */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 100, padding: '16px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: `1px solid ${glBd}`, background: navBg, backdropFilter: 'blur(20px)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg,#A855F7,#7C3AED)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, boxShadow: '0 0 20px rgba(168,85,247,0.4)' }}>⚡</div>
          <span style={{ fontSize: 18, fontWeight: 800, letterSpacing: -0.5, color: textMain }}>NexusAI Dashboard</span>
        </div>

        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', background: 'rgba(16,185,129,0.09)', border: '1px solid rgba(16,185,129,0.22)', borderRadius: 40 }}>
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#10B981', boxShadow: '0 0 8px #10B981', animation: 'pulse 2s infinite' }} />
            <span style={{ fontSize: 12, color: '#10B981', fontWeight: 700 }}>All Systems Online</span>
          </div>
          <button onClick={toggleTheme} style={{ background: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(100,60,200,0.07)', border: `1px solid ${glBd}`, borderRadius: 40, padding: '8px 18px', cursor: 'pointer', color: textMain, fontSize: 13, display: 'flex', alignItems: 'center', gap: 8, transition: 'all 0.2s', fontFamily: 'inherit' }}>
            <span>{isDark ? '☀️' : '🌙'}</span><span style={{ color: textMain }}>{isDark ? 'Light Mode' : 'Dark Mode'}</span>
          </button>
          <button onClick={onLogout} style={{ padding: '9px 20px', borderRadius: 10, fontSize: 14, cursor: 'pointer', background: 'transparent', border: `1px solid ${glBd}`, color: textMain, fontFamily: 'inherit', transition: 'all 0.2s' }}>Sign Out</button>
        </div>
      </nav>

      {/* ══════════════════════════════════════════
          MAIN CONTENT
      ══════════════════════════════════════════ */}
      <div style={{ padding: '48px clamp(20px,4vw,48px)', maxWidth: '1440px', margin: '0 auto', position: 'relative', zIndex: 2 }}>

        {/* ── SECTION 1 · HERO WELCOME ── */}
        <div ref={welcomeRef} style={{ ...glassStyle, marginBottom: 48, padding: '48px 48px 40px' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg,#A855F7,#00D4FF,#10B981,#A855F7)', backgroundSize: '300% 100%', animation: 'gradientFlow 4s linear infinite' }} />
          <div style={{ position: 'absolute', top: '-40%', right: '-5%', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle,rgba(168,85,247,0.14),transparent 70%)', filter: 'blur(60px)', animation: 'floatOrb 12s ease-in-out infinite', pointerEvents: 'none' }} />

          <div style={{ position: 'relative', zIndex: 1, display: 'grid', gridTemplateColumns: '1fr auto', gap: 32, alignItems: 'center' }}>
            <div>
              {/* Badge */}
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '5px 14px', background: 'rgba(168,85,247,0.1)', border: '1px solid rgba(168,85,247,0.3)', borderRadius: 40, marginBottom: 20 }}>
                <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#A855F7', boxShadow: '0 0 10px #A855F7', animation: 'pulse 1.5s infinite' }} />
                <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '2px', color: '#A855F7' }}>AI SYSTEM v4.2.0 · ONLINE</span>
              </div>

              {/* Welcome heading — fixed for both modes */}
              <h1 style={{ fontSize: 'clamp(32px,5vw,56px)', fontWeight: 900, lineHeight: 1.1, margin: '0 0 16px', letterSpacing: '-1.5px', color: textMain }}>
                Welcome back,{' '}
                {/* User name: gradient only in dark; solid vivid purple in light */}
                {isDark
                  ? <span style={{ background: 'linear-gradient(135deg,#A855F7,#00D4FF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', animation: 'auroraShift 5s ease-in-out infinite', display: 'inline' }}>{user.name}</span>
                  : <span style={{ color: '#6d28d9', WebkitTextFillColor: '#6d28d9' }}>{user.name}</span>
                }
              </h1>

              <p style={{ fontSize: 16, color: textSub, lineHeight: 1.7, maxWidth: 520, marginBottom: 28 }}>
                Your AI workforce is operating at{' '}
                <span style={{ color: '#10B981', fontWeight: 700 }}>peak performance</span>. All neural networks synchronized. Predictive models updated.
              </p>

              {/* Stat chips */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                {[
                  { label: 'Agents Active', val: '12/12',  color: '#10B981' },
                  { label: 'Uptime',        val: '99.97%', color: '#00D4FF' },
                  { label: 'Tasks Today',   val: '2,847',  color: '#A855F7' },
                  { label: 'Revenue Today', val: '$14.2K', color: '#F59E0B' },
                ].map((chip, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 14px', background: `${chip.color}12`, border: `1px solid ${chip.color}28`, borderRadius: 40 }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: chip.color, boxShadow: `0 0 8px ${chip.color}` }} />
                    <span style={{ fontSize: 12, color: chip.color, fontWeight: 700 }}>{chip.val}</span>
                    <span style={{ fontSize: 11, color: textMid }}>{chip.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* System status column */}
            <div style={{ minWidth: 200, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { label: 'Neural Engine', status: 'ACTIVE',  color: '#10B981' },
                { label: 'Data Pipeline', status: 'SYNCING', color: '#F59E0B' },
                { label: 'AI Models',     status: 'LIVE',    color: '#A855F7' },
                { label: 'API Gateway',   status: 'ONLINE',  color: '#00D4FF' },
              ].map((s, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: cardBg, border: `1px solid ${s.color}1e`, borderRadius: 12, gap: 16 }}>
                  <span style={{ fontSize: 12, color: textSub, fontWeight: 500 }}>{s.label}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: s.color, boxShadow: `0 0 8px ${s.color}`, animation: 'pulse 2s infinite' }} />
                    <span style={{ fontSize: 11, color: s.color, fontWeight: 700, letterSpacing: '1px' }}>{s.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── SECTION 2 · KPI STAT CARDS ── */}
        <div style={{ marginBottom: 48 }}>
          <SectionHeader title="Live Performance Metrics" badge="Real-Time KPIs" subtitle="AI-driven insights updated every 30 seconds" isDark={isDark} />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: 20 }}>
            {statCards.map((stat, idx) => (
              <div key={idx} ref={el => statsRef.current[idx] = el} className="stat-card-premium"
                style={{ ...glassStyle, padding: '24px 20px', cursor: 'pointer', transition: 'all 0.35s cubic-bezier(0.2,0.9,0.4,1.1)', borderColor: `${stat.color}22` }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: `linear-gradient(90deg,transparent,${stat.color},transparent)`, opacity: 0.8 }} />
                <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '80px', height: '80px', borderRadius: '50%', background: `radial-gradient(circle,${stat.color}18,transparent)`, filter: 'blur(20px)', pointerEvents: 'none' }} />

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <span style={{ fontSize: 11, letterSpacing: '1.5px', fontWeight: 700, color: stat.color, textTransform: 'uppercase' }}>{stat.label}</span>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: `${stat.color}14`, border: `1px solid ${stat.color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>{stat.icon}</div>
                </div>
                <div style={{ fontSize: 'clamp(24px,2.5vw,32px)', fontWeight: 900, color: stat.color, marginBottom: 6, lineHeight: 1, letterSpacing: '-0.5px' }}>{stat.value}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#10B981', padding: '2px 8px', background: 'rgba(16,185,129,0.1)', borderRadius: 20 }}>{stat.change}</span>
                  <Sparkline data={stat.sparkData} color={stat.color} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── SECTION 3 · AI COMMAND CENTER ── */}
        <div ref={commandRef} style={{ ...glassStyle, marginBottom: 48, padding: '40px' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg,transparent,#00D4FF,#A855F7,transparent)' }} />
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 70% 50%,rgba(0,212,255,0.05),transparent 60%)', pointerEvents: 'none' }} />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, alignItems: 'start' }}>
            <div>
              <SectionHeader title="AI Command Center" badge="Neural Operations" subtitle="Real-time processing metrics and system health" isDark={isDark} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 28 }}>
                {commandMetrics.map((m, i) => (
                  <div key={i}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span style={{ fontSize: 12, color: textSub, fontWeight: 600 }}>{m.label}</span>
                      <span style={{ fontSize: 12, color: m.color, fontWeight: 800 }}>{m.value}{m.unit}</span>
                    </div>
                    <div style={{ height: 8, background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.07)', borderRadius: 10, overflow: 'hidden', position: 'relative' }}>
                      <div style={{ height: '100%', width: `${m.value}%`, background: `linear-gradient(90deg,${m.color}80,${m.color})`, borderRadius: 10, boxShadow: `0 0 12px ${m.color}55`, transition: 'width 0.8s ease', position: 'relative' }}>
                        <div style={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)', width: 4, height: 14, background: m.color, borderRadius: 2, boxShadow: `0 0 8px ${m.color}` }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
                <span style={{ fontSize: 12, color: textSub, marginRight: 4 }}>Signal Strength</span>
                {[3, 6, 9, 12, 16, 20, 24, 20, 16].map((h, i) => (
                  <div key={i} style={{ width: 6, height: h, borderRadius: 3, background: i < 7 ? '#A855F7' : 'rgba(168,85,247,0.18)', boxShadow: i < 7 ? '0 0 6px #A855F7' : undefined }} />
                ))}
                <span style={{ fontSize: 12, color: '#A855F7', fontWeight: 700, marginLeft: 4 }}>98.4%</span>
              </div>
            </div>

            <div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 20, marginBottom: 28 }}>
                {[
                  { v: 94, label: 'Model Acc.', color: '#A855F7' },
                  { v: 78, label: 'CPU Load',   color: '#00D4FF' },
                  { v: 61, label: 'Memory',     color: '#10B981' },
                  { v: 99, label: 'Uptime',     color: '#F472B6' },
                ].map((p, i) => (
                  <CircularProgress key={i} value={p.v} color={p.color} size={75} label={p.label} isDark={isDark} />
                ))}
              </div>

              {/* Neural activity */}
              <div style={{ padding: 20, background: isDark ? 'rgba(0,0,0,0.2)' : 'rgba(80,40,160,0.05)', borderRadius: 16, border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(100,60,200,0.1)'}` }}>
                <div style={{ fontSize: 11, color: textSub, fontWeight: 700, letterSpacing: '1px', marginBottom: 12 }}>NEURAL ACTIVITY</div>
                <svg width="100%" height="60" viewBox="0 0 300 60" preserveAspectRatio="none">
                  {[0, 1, 2].map(row =>
                    [0, 1, 2, 3].map(col => {
                      const x = 20 + col * 85;
                      const y = 10 + row * 20;
                      return (
                        <g key={`${row}-${col}`}>
                          <circle cx={x} cy={y} r={5} fill="#A855F7" fillOpacity={0.4} />
                          {col < 3 && <line x1={x + 5} y1={y} x2={x + 80} y2={y} stroke="#A855F7" strokeOpacity="0.15" strokeWidth="1" />}
                        </g>
                      );
                    })
                  )}
                </svg>
                <div style={{ display: 'flex', gap: 4, marginTop: 8 }}>
                  {Array.from({ length: 20 }).map((_, i) => (
                    <div key={i} style={{ flex: 1, height: 20, background: 'rgba(168,85,247,0.12)', borderRadius: 2, position: 'relative', overflow: 'hidden' }}>
                      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: `${30 + (i * 17) % 60}%`, background: 'linear-gradient(to top,#A855F7,#A855F780)', borderRadius: 2 }} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── SECTION 4 + 5 · REVENUE CHART + ACTIVITY ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 48 }}>

          {/* Revenue Chart */}
          <div ref={chartRef} style={{ ...glassStyle, padding: 32 }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg,transparent,#A855F7,transparent)' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
              <div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', background: 'rgba(168,85,247,0.1)', border: '1px solid rgba(168,85,247,0.22)', borderRadius: 20, marginBottom: 10 }}>
                  <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#A855F7', animation: 'pulse 1.5s infinite' }} />
                  <span style={{ fontSize: 10, color: '#A855F7', fontWeight: 700, letterSpacing: '1px' }}>AI PREDICTION</span>
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 800, margin: 0, color: textMain }}>Revenue Forecast</h3>
                <p style={{ fontSize: 12, color: textSub, margin: '4px 0 0' }}>AI-powered predictive analytics</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 28, fontWeight: 900, color: '#A855F7', lineHeight: 1 }}>$284K</div>
                <div style={{ fontSize: 11, color: '#10B981', fontWeight: 700 }}>↑ +23% MoM</div>
              </div>
            </div>

            <svg width="100%" height="160" viewBox="0 0 500 160" preserveAspectRatio="none">
              <defs>
                <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#A855F7" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#A855F7" stopOpacity="0" />
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                  <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
              </defs>
              {[40, 80, 120].map(y => <line key={y} x1="0" y1={y} x2="500" y2={y} stroke={isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.05)'} strokeWidth="1" />)}
              <path d="M0,140 C40,130 80,115 120,105 C160,95 200,85 240,70 C280,55 320,60 360,45 C400,30 440,35 480,20 C490,15 495,18 500,10 L500,160 L0,160 Z" fill="url(#areaGrad)" />
              <path className="revenue-path" d="M0,140 C40,130 80,115 120,105 C160,95 200,85 240,70 C280,55 320,60 360,45 C400,30 440,35 480,20 C490,15 495,18 500,10" fill="none" stroke="#A855F7" strokeWidth="3" strokeLinecap="round" filter="url(#glow)" />
              {[[0, 140], [120, 105], [240, 70], [360, 45], [500, 10]].map(([x, y], i) => (
                <circle key={i} cx={x} cy={y} r={4} fill="#A855F7" stroke={isDark ? '#fff' : '#ede8ff'} strokeWidth={1.5} style={{ filter: 'drop-shadow(0 0 6px #A855F7)' }} />
              ))}
            </svg>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 20, paddingTop: 16, borderTop: `1px solid ${glBd}` }}>
              {[{ l: 'This Month', v: '$284K', c: '#A855F7' }, { l: 'MoM Growth', v: '+23%', c: textMain }, { l: 'AI Accuracy', v: '94.2%', c: '#00D4FF' }].map((s, i) => (
                <div key={i} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 20, fontWeight: 800, color: s.c }}>{s.v}</div>
                  <div style={{ fontSize: 11, color: textSub, marginTop: 2 }}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Activity Feed */}
          <div ref={activityRef} style={{ ...glassStyle, padding: 32 }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg,transparent,#00D4FF,transparent)' }} />
            <h3 style={{ fontSize: 18, fontWeight: 800, marginTop: 0, marginBottom: 24, color: textMain }}>Real-Time Agent Activity</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0, position: 'relative' }}>
              <div style={{ position: 'absolute', left: 22, top: 20, bottom: 20, width: 2, background: 'linear-gradient(to bottom,#A855F7,#00D4FF,#10B981)', borderRadius: 2, opacity: 0.28 }} />
              {activities.map((act, idx) => (
                <div key={idx} className="activity-item"
                  style={{ display: 'flex', alignItems: 'flex-start', gap: 16, padding: '14px 0', borderBottom: idx < activities.length - 1 ? `1px solid ${glBd}` : 'none', position: 'relative', cursor: 'default', transition: 'all 0.2s' }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: `${act.color}14`, border: `1px solid ${act.color}28`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0, boxShadow: `0 0 12px ${act.color}18`, position: 'relative', zIndex: 1 }}>
                    {act.icon}
                    <div style={{ position: 'absolute', top: -3, right: -3, width: 10, height: 10, borderRadius: '50%', background: statusColor[act.status], boxShadow: `0 0 8px ${statusColor[act.status]}`, animation: 'pulse 2s infinite' }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                      <span style={{ fontWeight: 700, fontSize: 13, color: act.color }}>{act.agent}</span>
                      <span style={{ fontSize: 10, color: textMid, flexShrink: 0, marginLeft: 8 }}>{act.time}</span>
                    </div>
                    <p style={{ fontSize: 12, color: textSub, margin: 0, lineHeight: 1.5 }}>{act.action}</p>
                    <div style={{ marginTop: 6, display: 'inline-flex', alignItems: 'center', gap: 5, padding: '2px 8px', background: `${statusColor[act.status]}10`, border: `1px solid ${statusColor[act.status]}22`, borderRadius: 20 }}>
                      <div style={{ width: 5, height: 5, borderRadius: '50%', background: statusColor[act.status] }} />
                      <span style={{ fontSize: 10, color: statusColor[act.status], fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{act.status}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── SECTION 6 · PERFORMANCE MATRIX ── */}
        <div style={{ ...glassStyle, marginBottom: 48, padding: '36px 40px' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg,transparent,#10B981,transparent)' }} />
          <SectionHeader title="AI Performance Matrix" badge="Health Score" subtitle="Real-time neural KPIs and processing benchmarks" isDark={isDark} />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {metrics.map((metric, idx) => (
                <div key={idx}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span style={{ fontSize: 13, color: textSub, fontWeight: 600 }}>{metric.label}</span>
                    <span style={{ fontSize: 13, fontWeight: 800, color: metric.color }}>{metric.value}%</span>
                  </div>
                  <div style={{ height: 8, background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.07)', borderRadius: 10, overflow: 'hidden', position: 'relative' }}>
                    <div ref={el => metricBarsRef.current[idx] = el} data-target={metric.value}
                      style={{ width: '0%', height: '100%', background: `linear-gradient(90deg,${metric.color}70,${metric.color})`, borderRadius: 10, boxShadow: `0 0 10px ${metric.color}48`, position: 'relative' }}>
                      <div style={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)', width: 4, height: 14, background: metric.color, borderRadius: 2 }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20, alignContent: 'start' }}>
              {[
                { v: 94, label: 'Forecast',    sub: 'Accuracy',  color: '#A855F7' },
                { v: 98, label: 'Satisfaction',sub: 'Score',     color: '#00D4FF' },
                { v: 87, label: 'Auto-Resolve',sub: 'Tickets',   color: '#10B981' },
                { v: 23, label: 'Revenue',     sub: 'Growth %',  color: '#F59E0B' },
                { v: 99, label: 'Uptime',      sub: 'Guarantee', color: '#F472B6' },
                { v: 28, label: 'Conversion',  sub: 'Rate %',    color: '#6EE7B7' },
              ].map((p, i) => (
                <CircularProgress key={i} value={p.v} color={p.color} size={85} label={p.label} sublabel={p.sub} isDark={isDark} />
              ))}
            </div>
          </div>
        </div>

        {/* ── SECTION 7 · AI AGENTS GRID ── */}
        <div style={{ marginBottom: 48 }}>
          <SectionHeader title="Your AI Agents" badge="Agent Fleet" subtitle="Click any agent to open an AI-powered conversation" isDark={isDark} />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: 24 }}>
            {AI_AGENTS.map((agent, idx) => (
              <div key={agent.id} ref={el => agentsRef.current[idx] = el}
                onClick={() => setSelectedAgent(agent)}
                onMouseEnter={() => setHoveredAgent(agent.id)}
                onMouseLeave={() => setHoveredAgent(null)}
                className="agent-card-premium"
                style={{
                  ...glassStyle,
                  padding: '36px 24px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  borderColor: `${agent.color}28`,
                  transition: 'all 0.35s cubic-bezier(0.2,0.9,0.4,1.2)',
                  ...(hoveredAgent === agent.id ? { transform: 'translateY(-10px) scale(1.02)', boxShadow: `0 24px 60px ${agent.color}22`, borderColor: `${agent.color}55` } : {}),
                }}>

                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: `linear-gradient(90deg,transparent,${agent.color},#A855F7,transparent)`, transform: hoveredAgent === agent.id ? 'scaleX(1)' : 'scaleX(0)', transition: 'transform 0.4s', transformOrigin: 'left' }} />
                <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse at 50% 0%,${agent.color}0d,transparent 60%)`, pointerEvents: 'none', opacity: hoveredAgent === agent.id ? 1 : 0, transition: 'opacity 0.3s' }} />

                <div style={{ position: 'relative', display: 'inline-block', marginBottom: 20 }}>
                  <div style={{ width: 80, height: 80, borderRadius: 22, background: `${agent.color}14`, border: `2px solid ${agent.color}${hoveredAgent === agent.id ? '66' : '28'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40, margin: '0 auto', boxShadow: hoveredAgent === agent.id ? `0 0 30px ${agent.color}38` : `0 0 12px ${agent.color}14`, transition: 'all 0.3s' }}>
                    {agent.icon}
                  </div>
                  <div style={{ position: 'absolute', top: 4, right: 4, width: 14, height: 14, borderRadius: '50%', background: '#10B981', border: '2px solid rgba(0,0,0,0.3)', boxShadow: '0 0 10px #10B981', animation: 'pulse 2s infinite' }} />
                </div>

                {/* Agent name — safe for both modes */}
                <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 8, letterSpacing: '-0.3px', color: isDark ? '#e8e0ff' : '#1a0040' }}>
                  {agent.name}
                </h3>
                <p style={{ fontSize: 12, color: agent.color, marginBottom: 20, fontWeight: 600, letterSpacing: '0.5px' }}>{agent.tagline}</p>

                <div style={{ display: 'flex', justifyContent: 'center', gap: 10 }}>
                  <div style={{ padding: '5px 14px', background: `${agent.color}14`, border: `1px solid ${agent.color}28`, borderRadius: 40, fontSize: 11, fontWeight: 700, color: agent.color, display: 'flex', alignItems: 'center', gap: 5 }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: agent.color, boxShadow: `0 0 8px ${agent.color}`, animation: 'pulse 1.5s infinite' }} />
                    ACTIVE
                  </div>
                  <div style={{ padding: '5px 14px', background: hoveredAgent === agent.id ? `${agent.color}1a` : 'transparent', border: `1px solid ${agent.color}28`, borderRadius: 40, fontSize: 11, fontWeight: 700, color: agent.color, transition: 'all 0.2s', cursor: 'pointer' }}>
                    CHAT →
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── SECTION 8 · GLOBAL AI NETWORK ── */}
        <div ref={networkRef} style={{ ...glassStyle, marginBottom: 48, padding: '40px', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg,transparent,#6EE7B7,transparent)' }} />
          <SectionHeader title="Global AI Network" badge="Infrastructure" subtitle="Active nodes and traffic across 137 countries worldwide" isDark={isDark} />

          <div style={{ position: 'relative', height: 220, background: isDark ? 'rgba(0,0,0,0.2)' : 'rgba(80,40,180,0.05)', borderRadius: 16, border: `1px solid ${glBd}`, marginBottom: 28, overflow: 'hidden' }}>
            <div style={{ position: 'absolute', inset: 0, backgroundImage: `radial-gradient(circle,${isDark ? 'rgba(255,255,255,0.12)' : 'rgba(80,40,180,0.13)'} 1px,transparent 1px)`, backgroundSize: '18px 18px', opacity: 0.6 }} />
            <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 100%,rgba(16,185,129,0.07),transparent 60%)' }} />
            <svg style={{ position: 'absolute', inset: 0 }} width="100%" height="100%">
              <line x1="22%" y1="35%" x2="48%" y2="28%" stroke="rgba(168,85,247,0.2)" strokeWidth="1" strokeDasharray="4,4" />
              <line x1="48%" y1="28%" x2="72%" y2="38%" stroke="rgba(0,212,255,0.2)" strokeWidth="1" strokeDasharray="4,4" />
              <line x1="48%" y1="28%" x2="58%" y2="46%" stroke="rgba(249,115,22,0.2)" strokeWidth="1" strokeDasharray="4,4" />
              <line x1="22%" y1="35%" x2="30%" y2="62%" stroke="rgba(244,114,182,0.2)" strokeWidth="1" strokeDasharray="4,4" />
            </svg>
            {networkNodes.map((n, i) => (
              <div key={i} style={{ position: 'absolute', left: n.x, top: n.y, transform: 'translate(-50%,-50%)' }}>
                <div style={{ width: 14, height: 14, borderRadius: '50%', background: n.color, boxShadow: `0 0 16px ${n.color},0 0 30px ${n.color}55`, animation: `pulse ${1.5 + i * 0.2}s ease-in-out infinite` }} />
                <div style={{ position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)', marginTop: 6, whiteSpace: 'nowrap', fontSize: 10, color: n.color, fontWeight: 700, background: isDark ? 'rgba(0,0,0,0.75)' : 'rgba(255,255,255,0.9)', padding: '2px 6px', borderRadius: 6, backdropFilter: 'blur(8px)', border: `1px solid ${n.color}22` }}>{n.region}</div>
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(190px,1fr))', gap: 16 }}>
            {networkNodes.map((n, i) => (
              <div key={i} className="node-card" style={{ padding: '16px 18px', background: cardBg, border: `1px solid ${n.color}1e`, borderRadius: 14, transition: 'all 0.2s' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: n.color }}>{n.region}</span>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: n.color, boxShadow: `0 0 8px ${n.color}`, animation: 'pulse 2s infinite' }} />
                </div>
                <div style={{ fontSize: 18, fontWeight: 800, color: textMain, marginBottom: 4 }}>
                  {n.nodes.toLocaleString()}<span style={{ fontSize: 11, color: textSub, fontWeight: 400 }}> nodes</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11 }}>
                  <span style={{ color: textSub }}>{n.traffic} traffic</span>
                  <span style={{ color: '#10B981', fontWeight: 700 }}>{n.uptime}</span>
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 20, marginTop: 24, paddingTop: 24, borderTop: `1px solid ${glBd}` }}>
            {[
              { l: 'Total AI Nodes',    v: '3,002',  color: '#A855F7' },
              { l: 'Countries Served',  v: '137',    color: '#00D4FF' },
              { l: 'Total Traffic',     v: '9.2 TB', color: '#10B981' },
              { l: 'Avg Global Uptime', v: '99.97%', color: '#F472B6' },
            ].map((s, i) => (
              <div key={i} style={{ textAlign: 'center', padding: '16px 0' }}>
                <div style={{ fontSize: 28, fontWeight: 900, color: s.color, lineHeight: 1 }}>{s.v}</div>
                <div style={{ fontSize: 11, color: textSub, marginTop: 6, fontWeight: 500 }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── SECTION 9 · SMART INSIGHTS ── */}
        <div style={{ marginBottom: 48 }}>
          <SectionHeader title="Smart AI Insights" badge="Intelligence Engine" subtitle="Real-time recommendations generated by your neural models" isDark={isDark} />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 20 }}>
            {smartInsights.map((ins, idx) => {
              const ps = priorityStyles[ins.priority];
              return (
                <div key={idx} ref={el => insightsRef.current[idx] = el} className="insight-card"
                  style={{ ...glassStyle, padding: 24, cursor: 'pointer', borderColor: `${ins.color}1e`, transition: 'all 0.3s' }}>
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: `linear-gradient(90deg,transparent,${ins.color},transparent)`, opacity: 0.8 }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                    <div style={{ width: 44, height: 44, borderRadius: 12, background: `${ins.color}14`, border: `1px solid ${ins.color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>{ins.icon}</div>
                    <div style={{ display: 'flex', gap: 6, flexDirection: 'column', alignItems: 'flex-end' }}>
                      <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: '1.5px', color: ins.color, padding: '3px 8px', background: `${ins.color}0e`, border: `1px solid ${ins.color}1e`, borderRadius: 20 }}>{ins.type}</span>
                      <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: '1px', padding: '3px 8px', borderRadius: 20, background: ps.bg, color: ps.color, border: `1px solid ${ps.border}` }}>{ins.priority}</span>
                    </div>
                  </div>
                  <h4 style={{ fontSize: 15, fontWeight: 800, color: textMain, marginBottom: 8, letterSpacing: '-0.2px' }}>{ins.title}</h4>
                  <p style={{ fontSize: 13, color: textSub, lineHeight: 1.6, margin: 0 }}>{ins.body}</p>
                  <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 6, color: ins.color, fontSize: 12, fontWeight: 700 }}>
                    <span>View details</span><span>→</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── SECTION 10 · QUICK ACTIONS ── */}
        <div style={{ ...glassStyle, marginBottom: 48, padding: '40px' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg,transparent,#F59E0B,transparent)' }} />
          <SectionHeader title="Quick Actions" badge="Command Panel" subtitle="Instant access to your most powerful AI tools" isDark={isDark} />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(160px,1fr))', gap: 16 }}>
            {quickActions.map((action, i) => (
              <button key={i} className="quick-action-btn"
                style={{ padding: '24px 16px', background: cardBg, border: `1px solid ${action.color}22`, borderRadius: 18, cursor: 'pointer', fontFamily: 'inherit', color: textMain, transition: 'all 0.3s cubic-bezier(0.2,0.9,0.4,1.1)', position: 'relative', overflow: 'hidden', textAlign: 'center' }}>
                <div className="action-glow" style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse at 50% 0%,${action.color}12,transparent 70%)`, opacity: 0, transition: 'opacity 0.3s' }} />
                <div style={{ width: 52, height: 52, borderRadius: 15, background: `${action.color}14`, border: `1px solid ${action.color}28`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, margin: '0 auto 14px', boxShadow: `0 0 16px ${action.color}18`, transition: 'all 0.3s' }}>{action.icon}</div>
                <div style={{ fontSize: 13, fontWeight: 800, marginBottom: 4, letterSpacing: '-0.2px', color: textMain }}>{action.label}</div>
                <div style={{ fontSize: 11, color: textSub, fontWeight: 500 }}>{action.desc}</div>
                <div className="action-line" style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '2px', background: `linear-gradient(90deg,transparent,${action.color},transparent)`, transform: 'scaleX(0)', transition: 'transform 0.3s', transformOrigin: 'center' }} />
              </button>
            ))}
          </div>
        </div>

        {/* ── SECTION 11 · EFFICIENCY REPORT ── */}
        <div style={{ ...glassStyle, marginBottom: 48, padding: '40px' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg,transparent,#818CF8,transparent)' }} />
          <SectionHeader title="AI Efficiency Report" badge="Summary" isDark={isDark} />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24, textAlign: 'center' }}>
            {[
              { v: '87%',  l: 'Ticket Auto-resolution', c: '#00D4FF', icon: '🎫', sub: '+12% vs last month' },
              { v: '3.4x', l: 'Revenue Increase',       c: '#6EE7B7', icon: '💰', sub: 'via AI automation'  },
              { v: '94%',  l: 'Forecast Accuracy',      c: '#A855F7', icon: '🎯', sub: 'neural prediction'  },
            ].map((s, i) => (
              <div key={i} className="efficiency-card"
                style={{ padding: 28, background: cardBg, border: `1px solid ${s.c}1e`, borderRadius: 18, position: 'relative', overflow: 'hidden', transition: 'all 0.3s' }}>
                <div style={{ position: 'absolute', top: '-30px', right: '-30px', width: '100px', height: '100px', borderRadius: '50%', background: `radial-gradient(circle,${s.c}12,transparent)`, filter: 'blur(20px)' }} />
                <div style={{ fontSize: 40, marginBottom: 12 }}>{s.icon}</div>
                <div style={{ fontSize: 44, fontWeight: 900, color: s.c, lineHeight: 1, marginBottom: 6, letterSpacing: '-1px' }}>{s.v}</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: textMain, marginBottom: 4 }}>{s.l}</div>
                <div style={{ fontSize: 11, color: textSub }}>{s.sub}</div>
              </div>
            ))}
          </div>
        </div>

      </div>

     {/* FOOTER */}
<footer style={{
  background: isDark ? '#0a0a12' : '#f0f0f8',
  borderTop: `2px solid ${isDark ? '#2a2a35' : '#ddd'}`,
  padding: '48px 24px 32px',
  marginTop: '60px',
  width: '100%',
  fontFamily: "'DM Sans', sans-serif",
  position: 'relative',
  zIndex: 100
}}>
  <div style={{ maxWidth: 1100, margin: '0 auto' }}>
    <div className="footer-grid" style={{
      display: 'grid',
      gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr',
      gap: 32,
      marginBottom: 48
    }}>
      {/* Logo + description */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: 'linear-gradient(135deg,#A855F7,#7C3AED)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>⚡</div>
          <span style={{ fontSize: 18, fontWeight: 800, color: isDark ? '#fff' : '#111' }}>NexusAI</span>
        </div>
        <p style={{
          color: isDark ? '#ccc' : '#333',
          fontSize: 13, lineHeight: 1.6, maxWidth: 240
        }}>
          The AI operating system powering the next generation of autonomous businesses worldwide.
        </p>
        <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
          {['𝕏', 'in', '▶', 'f'].map(icon => (
            <div key={icon} style={{
              width: 32, height: 32,
              border: `1px solid ${isDark ? '#2a2a35' : '#ccc'}`,
              borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 14, cursor: 'pointer',
              color: isDark ? '#ddd' : '#333'
            }}>{icon}</div>
          ))}
        </div>
      </div>

      {/* Link columns */}
      {[
        { title: 'Product', links: ['Features', 'Pricing', 'Integrations', 'API Docs', 'Changelog'] },
        { title: 'Company', links: ['About', 'Careers', 'Blog', 'Press', 'Partners'] },
        { title: 'Resources', links: ['Help Center', 'Case Studies', 'Templates', 'Community', 'Status'] },
        { title: 'Legal', links: ['Privacy', 'Terms', 'Security', 'GDPR', 'Cookies'] }
      ].map(col => (
        <div key={col.title}>
          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 16, color: isDark ? '#eee' : '#222' }}>
            {col.title}
          </div>
          {col.links.map(link => (
            <div key={link} style={{ marginBottom: 8 }}>
              <a href="#" style={{
                color: isDark ? '#aaa' : '#555',
                fontSize: 12, textDecoration: 'none',
                transition: 'color 0.2s'
              }}>{link}</a>
            </div>
          ))}
        </div>
      ))}
    </div>

    <div className="footer-bottom" style={{
      borderTop: `1px solid ${isDark ? '#2a2a35' : '#ddd'}`,
      paddingTop: 24,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: 12
    }}>
      <span style={{ color: isDark ? '#aaa' : '#555', fontSize: 12 }}>
        © 2026 NexusAI Inc. All rights reserved. Serving 137 countries worldwide.
      </span>
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        {['🇺🇸 English', '🇪🇺 EUR', 'SOC2 ✓', 'ISO 27001 ✓'].map(badge => (
          <span key={badge} style={{ color: isDark ? '#aaa' : '#555', fontSize: 11 }}>
            {badge}
          </span>
        ))}
      </div>
    </div>
  </div>

  {/* Responsive CSS */}
  <style>{`
    @media (max-width: 768px) {
      .footer-grid {
        grid-template-columns: 1fr !important;
        gap: 32px !important;
        text-align: center;
      }
      .footer-grid > div:first-child {
        text-align: center;
      }
      .footer-grid > div:first-child p {
        margin-left: auto;
        margin-right: auto;
      }
      .footer-grid > div:first-child div {
        justify-content: center;
      }
      .footer-bottom {
        flex-direction: column;
        text-align: center;
        gap: 16px !important;
      }
    }
    @media (max-width: 480px) {
      footer {
        padding: 32px 16px !important;
      }
      .footer-bottom div {
        justify-content: center;
      }
    }
  `}</style>
</footer>

      {/* ══════════════════════════════════════════
          GLOBAL STYLES
      ══════════════════════════════════════════ */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800;900&display=swap');

        @keyframes floatOrb {
          0%,100% { transform: translateY(0px) translateX(0px) rotate(0deg); }
          33%      { transform: translateY(-30px) translateX(20px) rotate(5deg); }
          66%      { transform: translateY(20px) translateX(-15px) rotate(-3deg); }
        }
        @keyframes gradientFlow {
          0%   { background-position: 0% 50%; }
          100% { background-position: 300% 50%; }
        }
        @keyframes auroraShift {
          0%,100% { filter: hue-rotate(0deg); }
          50%     { filter: hue-rotate(30deg); }
        }
        @keyframes pulse {
          0%,100% { opacity: 1; transform: scale(1); }
          50%     { opacity: 0.5; transform: scale(0.85); }
        }
        @keyframes gridMove {
          0%   { background-position: 0 0; }
          100% { background-position: 60px 60px; }
        }

        /* Stat cards */
        .stat-card-premium:hover {
          transform: translateY(-8px) scale(1.02) !important;
          box-shadow: 0 20px 50px rgba(0,0,0,0.25), 0 0 30px rgba(168,85,247,0.12) !important;
        }

        /* Agent cards */
        .agent-card-premium { transition: all 0.35s cubic-bezier(0.2,0.9,0.4,1.2); }

        /* Activity */
        .activity-item:hover { transform: translateX(6px); }

        /* Insight cards */
        .insight-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 16px 40px rgba(0,0,0,0.18) !important;
        }

        /* Quick action buttons */
        .quick-action-btn:hover {
          transform: translateY(-6px) scale(1.04) !important;
          border-color: rgba(168,85,247,0.45) !important;
          box-shadow: 0 16px 40px rgba(0,0,0,0.18) !important;
        }
        .quick-action-btn:hover .action-glow  { opacity: 1 !important; }
        .quick-action-btn:hover .action-line  { transform: scaleX(1) !important; }

        
        .node-card:hover { transform: translateY(-3px); box-shadow: 0 8px 20px rgba(0,0,0,0.14); }

        
        .efficiency-card:hover { transform: translateY(-6px); box-shadow: 0 14px 40px rgba(0,0,0,0.16) !important; }

        /* Scrollbar */
        ::-webkit-scrollbar       { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(168,85,247,0.3); border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(168,85,247,0.6); }

        /* Responsive */
        @media (max-width: 1024px) {
          div[style*="grid-template-columns: 1fr 1fr"] { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 768px) {
          nav { padding: 12px 20px !important; }
          div[style*="padding: 48px 48px"] { padding: 28px 24px !important; }
          div[style*="maxWidth: 1440px"]   { padding: 24px 16px !important; }
          div[style*="grid-template-columns: 1fr auto"] { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 480px) {
          div[style*="repeat(3, 1fr)"] { grid-template-columns: 1fr !important; }
          div[style*="repeat(4, 1fr)"] { grid-template-columns: repeat(2,1fr) !important; }
        }
      `}</style>
    </div>
  );
};

export default DashboardPage;