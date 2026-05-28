import { useState, useEffect } from "react";
import { getAPIKey, setAPIKey, isAPIConfigured } from "../utils/api";

export default function APISettingsModal({ onClose, onSaved }) {
  const [apiKey, setApiKey] = useState("");
  const [apiProvider, setApiProvider] = useState("claude");
  const [saved, setSaved] = useState(false);
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const savedKey = getAPIKey();
    if (savedKey) setApiKey(savedKey);
    
    const savedTheme = localStorage.getItem('nexusai_theme');
    setIsDark(savedTheme !== 'light');
  }, []);

  const handleSave = () => {
    if (apiKey.trim()) {
      setAPIKey(apiKey.trim());
      localStorage.setItem("nexusai_api_provider", apiProvider);
      setSaved(true);
      setTimeout(() => {
        setSaved(false);
        onSaved();
        onClose();
      }, 1500);
    }
  };

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.85)",
      zIndex: 10000,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'DM Sans', sans-serif"
    }}>
      <div style={{
        background: isDark ? "#0d0d14" : "#ffffff",
        border: isDark ? "1px solid rgba(168,85,247,0.3)" : "1px solid rgba(168,85,247,0.2)",
        borderRadius: 24,
        padding: 40,
        maxWidth: 500,
        width: "90%",
        boxShadow: isDark ? "0 25px 50px rgba(0,0,0,0.5)" : "0 25px 50px rgba(0,0,0,0.15)"
      }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <div>
            <div style={{ fontSize: 11, color: "#A855F7", letterSpacing: 2, marginBottom: 6, fontWeight: 600 }}>API SETTINGS</div>
            <h2 style={{ fontSize: 24, fontWeight: 800, color: isDark ? "#fff" : "#1a1a1a" }}>Connect AI API</h2>
          </div>
          <button 
            onClick={onClose} 
            style={{ 
              background: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)", 
              border: "none", 
              width: 36, 
              height: 36, 
              borderRadius: 10, 
              color: isDark ? "#fff" : "#1a1a1a", 
              cursor: "pointer", 
              fontSize: 20,
              transition: "all 0.2s"
            }}
            onMouseEnter={(e) => e.target.style.background = isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.15)"}
            onMouseLeave={(e) => e.target.style.background = isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)"}
          >×</button>
        </div>

        {/* Description */}
        <p style={{ 
          color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.6)", 
          marginBottom: 24, 
          fontSize: 13, 
          lineHeight: 1.6 
        }}>
          Enter your Claude or OpenAI API key to enable real AI responses. Your key is stored locally and never shared.
        </p>

        {/* API Provider Selection */}
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: "block", fontSize: 13, marginBottom: 8, color: isDark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.7)", fontWeight: 500 }}>API Provider</label>
          <div style={{ display: "flex", gap: 12 }}>
            <button 
              onClick={() => setApiProvider("claude")} 
              style={{
                flex: 1,
                padding: "12px",
                background: apiProvider === "claude" ? "linear-gradient(135deg,#A855F7,#7C3AED)" : (isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"),
                border: apiProvider === "claude" ? "none" : (isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(0,0,0,0.1)"),
                borderRadius: 12,
                color: apiProvider === "claude" ? "#fff" : (isDark ? "rgba(255,255,255,0.8)" : "rgba(0,0,0,0.7)"),
                cursor: "pointer",
                fontWeight: 600,
                fontSize: 13,
                transition: "all 0.2s"
              }}
            >
              Claude (Anthropic)
            </button>
            <button 
              onClick={() => setApiProvider("openai")} 
              style={{
                flex: 1,
                padding: "12px",
                background: apiProvider === "openai" ? "linear-gradient(135deg,#A855F7,#7C3AED)" : (isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"),
                border: apiProvider === "openai" ? "none" : (isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(0,0,0,0.1)"),
                borderRadius: 12,
                color: apiProvider === "openai" ? "#fff" : (isDark ? "rgba(255,255,255,0.8)" : "rgba(0,0,0,0.7)"),
                cursor: "pointer",
                fontWeight: 600,
                fontSize: 13,
                transition: "all 0.2s"
              }}
            >
              OpenAI
            </button>
          </div>
        </div>

        {/* API Key Input */}
        <div style={{ marginBottom: 24 }}>
          <label style={{ display: "block", fontSize: 13, marginBottom: 8, color: isDark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.7)", fontWeight: 500 }}>
            {apiProvider === "claude" ? "Claude API Key" : "OpenAI API Key"}
          </label>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder={apiProvider === "claude" ? "sk-ant-api03-..." : "sk-..."}
            style={{
              width: "100%",
              padding: "14px 16px",
              background: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)",
              border: isDark ? "1px solid rgba(168,85,247,0.3)" : "1px solid rgba(168,85,247,0.25)",
              borderRadius: 12,
              color: isDark ? "#fff" : "#1a1a1a",
              fontSize: 14,
              outline: "none",
              fontFamily: "'DM Sans', sans-serif",
              transition: "all 0.2s"
            }}
            onFocus={(e) => e.target.style.borderColor = "#A855F7"}
            onBlur={(e) => e.target.style.borderColor = isDark ? "rgba(168,85,247,0.3)" : "rgba(168,85,247,0.25)"}
          />
        </div>

        {/* Buttons */}
        <div style={{ display: "flex", gap: 12 }}>
          <button 
            onClick={handleSave} 
            style={{
              flex: 1,
              padding: "12px",
              background: "linear-gradient(135deg,#A855F7,#7C3AED)",
              border: "none",
              borderRadius: 12,
              color: "#fff",
              fontWeight: 600,
              cursor: "pointer",
              fontSize: 14,
              transition: "all 0.2s"
            }}
            onMouseEnter={(e) => e.target.style.transform = "scale(1.02)"}
            onMouseLeave={(e) => e.target.style.transform = "scale(1)"}
          >
            {saved ? "✓ Saved!" : "Save API Key"}
          </button>
          <button 
            onClick={onClose} 
            style={{
              flex: 1,
              padding: "12px",
              background: "transparent",
              border: isDark ? "1px solid rgba(255,255,255,0.15)" : "1px solid rgba(0,0,0,0.15)",
              borderRadius: 12,
              color: isDark ? "#fff" : "#1a1a1a",
              cursor: "pointer",
              fontWeight: 500,
              fontSize: 14,
              transition: "all 0.2s"
            }}
            onMouseEnter={(e) => e.target.style.background = isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"}
            onMouseLeave={(e) => e.target.style.background = "transparent"}
          >
            Cancel
          </button>
        </div>

        {/* Help Text */}
        <div style={{ marginTop: 20, paddingTop: 16, borderTop: isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(0,0,0,0.08)", textAlign: "center" }}>
          <p style={{ fontSize: 11, color: isDark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.4)" }}>
            {apiProvider === "claude" 
              ? "Get your Claude API key from console.anthropic.com" 
              : "Get your OpenAI API key from platform.openai.com"}
          </p>
        </div>
      </div>
    </div>
  );
}