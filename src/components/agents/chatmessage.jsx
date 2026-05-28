// Chat Message Component - Individual message bubble
import { useState } from "react";
import { theme } from "../../styles/theme";

export function ChatMessage({ message, agentColor, agentIcon, isUser }) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: isUser ? "flex-end" : "flex-start",
        marginBottom: 20,
      }}
    >
      {/* Agent Avatar (only for agent messages) */}
      {!isUser && (
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: `${agentColor}20`,
            border: `1px solid ${agentColor}40`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 18,
            flexShrink: 0,
            marginRight: 10,
          }}
        >
          {agentIcon}
        </div>
      )}

      {/* Message Bubble */}
      <div
        style={{
          maxWidth: "70%",
          position: "relative",
        }}
      >
        <div
          style={{
            padding: "14px 18px",
            borderRadius: isUser ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
            background: isUser ? `${agentColor}15` : theme.card,
            border: `1px solid ${isUser ? agentColor + "40" : theme.border}`,
            fontSize: 14,
            lineHeight: 1.6,
            color: theme.text,
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
          }}
        >
          {message}
        </div>

        {/* Copy Button */}
        <button
          onClick={copyToClipboard}
          style={{
            position: "absolute",
            bottom: -20,
            right: isUser ? 0 : "auto",
            left: isUser ? "auto" : 0,
            background: "transparent",
            border: "none",
            color: theme.muted,
            fontSize: 11,
            cursor: "pointer",
            padding: "2px 6px",
            borderRadius: 6,
            transition: "all 0.2s",
          }}
        >
          {copied ? "✓ Copied!" : "📋 Copy"}
        </button>
      </div>

      {/* User Avatar */}
      {isUser && (
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: "rgba(255,255,255,0.08)",
            border: `1px solid ${theme.border}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 14,
            flexShrink: 0,
            marginLeft: 10,
          }}
        >
          👤
        </div>
      )}
    </div>
  );
}