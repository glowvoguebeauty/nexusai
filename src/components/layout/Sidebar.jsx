// Sidebar Component - Main navigation sidebar
import { useState } from "react";
import { theme } from "../../styles/theme";
import { AGENTS } from "../../config/agents";

export function Sidebar({ currentView, onViewChange, onBackToLanding }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navItems = [
    { id: "agents", icon: "🤖", label: "AI Agents", description: "Chat with AI" },
    { id: "dashboard", icon: "▦", label: "Dashboard", description: "Analytics & KPIs" },
    { id: "chatbot", icon: "💬", label: "ChatBot", description: "Social Media" },
  ];

  const quickAgents = AGENTS.slice(0, 4);

  return (
    <div
      style={{
        width: isCollapsed ? 70 : 260,
        background: theme.card,
        borderRight: `1px solid ${theme.border}`,
        display: "flex",
        flexDirection: "column",
        transition: "width 0.25s ease",
        overflow: "hidden",
        flexShrink: 0,
        position: "relative",
      }}
    >
      {/* Logo Area */}
      <div
        style={{
          padding: "18px 16px",
          borderBottom: `1px solid ${theme.border}`,
          display: "flex",
          alignItems: "center",
          gap: 12,
          minHeight: 60,
        }}
      >
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            background: `linear-gradient(135deg, ${theme.accent}, ${theme.accent2})`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 16,
            flexShrink: 0,
          }}
        >
          ⚡
        </div>
        {!isCollapsed && (
          <div>
            <span style={{ fontWeight: 800, fontSize: 16 }}>NexusAI</span>
            <div style={{ fontSize: 10, color: theme.muted }}>v2.0 · AI OS</div>
          </div>
        )}
      </div>

      {/* Main Navigation */}
      <nav style={{ flex: 1, padding: "16px 12px" }}>
        <div
          style={{
            fontSize: 10,
            color: theme.muted,
            letterSpacing: 1,
            marginBottom: 12,
            paddingLeft: 12,
            display: isCollapsed ? "none" : "block",
          }}
        >
          MAIN MENU
        </div>

        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "10px 12px",
              borderRadius: 10,
              width: "100%",
              border: "none",
              cursor: "pointer",
              background: currentView === item.id ? `${theme.accent}15` : "transparent",
              color: currentView === item.id ? theme.accent : theme.muted,
              fontFamily: "inherit",
              fontSize: 14,
              fontWeight: currentView === item.id ? 600 : 500,
              marginBottom: 4,
              transition: "all 0.15s",
            }}
          >
            <span style={{ fontSize: 18, flexShrink: 0 }}>{item.icon}</span>
            {!isCollapsed && (
              <div style={{ textAlign: "left", flex: 1 }}>
                <div>{item.label}</div>
                <div style={{ fontSize: 10, color: theme.muted }}>{item.description}</div>
              </div>
            )}
            {currentView === item.id && !isCollapsed && (
              <span style={{ fontSize: 10, color: theme.accent }}>●</span>
            )}
          </button>
        ))}

        {/* Quick Agents Section */}
        <div
          style={{
            marginTop: 24,
            paddingTop: 16,
            borderTop: `1px solid ${theme.border}`,
          }}
        >
          <div
            style={{
              fontSize: 10,
              color: theme.muted,
              letterSpacing: 1,
              marginBottom: 12,
              paddingLeft: 12,
              display: isCollapsed ? "none" : "block",
            }}
          >
            QUICK AGENTS
          </div>

          {quickAgents.map((agent) => (
            <button
              key={agent.id}
              onClick={() => onViewChange("agents")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "8px 12px",
                borderRadius: 10,
                width: "100%",
                border: "none",
                cursor: "pointer",
                background: "transparent",
                color: theme.muted,
                fontFamily: "inherit",
                fontSize: 13,
                marginBottom: 2,
                transition: "all 0.15s",
              }}
            >
              <span style={{ fontSize: 16, flexShrink: 0 }}>{agent.icon}</span>
              {!isCollapsed && <span>{agent.name}</span>}
            </button>
          ))}
        </div>
      </nav>

      {/* Footer Actions */}
      <div
        style={{
          padding: "16px 12px",
          borderTop: `1px solid ${theme.border}`,
        }}
      >
        <button
          onClick={onBackToLanding}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "10px 12px",
            borderRadius: 10,
            width: "100%",
            border: "none",
            cursor: "pointer",
            background: "transparent",
            color: theme.muted,
            fontFamily: "inherit",
            fontSize: 14,
            marginBottom: 8,
          }}
        >
          <span style={{ fontSize: 16 }}>🌐</span>
          {!isCollapsed && "View Website"}
        </button>

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "10px 12px",
            borderRadius: 10,
            width: "100%",
            border: "none",
            cursor: "pointer",
            background: "transparent",
            color: theme.muted,
            fontFamily: "inherit",
            fontSize: 14,
          }}
        >
          <span style={{ fontSize: 16 }}>{isCollapsed ? "▶" : "◀"}</span>
          {!isCollapsed && "Collapse Menu"}
        </button>
      </div>

      {/* User Profile (Collapsed view) */}
      {isCollapsed && (
        <div
          style={{
            padding: "12px",
            borderTop: `1px solid ${theme.border}`,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: `${theme.accent2}20`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 16,
              cursor: "pointer",
            }}
          >
            👤
          </div>
        </div>
      )}
    </div>
  );
}