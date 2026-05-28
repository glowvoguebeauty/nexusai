import { theme } from "../../styles/theme";

export function Button({ children, variant = "primary", onClick, disabled = false }) {
  const variants = {
    primary: {
      background: `linear-gradient(135deg, ${theme.accent}, ${theme.accent2})`,
      color: "#000",
      border: "none",
    },
    secondary: {
      background: "transparent",
      border: `1px solid ${theme.border}`,
      color: theme.text,
    },
    ghost: {
      background: "transparent",
      border: "none",
      color: theme.muted,
    },
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        padding: "12px 24px",
        borderRadius: 12,
        fontWeight: 600,
        cursor: disabled ? "not-allowed" : "pointer",
        fontFamily: "inherit",
        fontSize: 14,
        transition: "all 0.2s",
        opacity: disabled ? 0.5 : 1,
        ...variants[variant],
      }}
    >
      {children}
    </button>
  );
}