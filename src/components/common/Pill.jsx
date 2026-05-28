import { theme } from "../../styles/theme";

export function Pill({ children, color = theme.accent }) {
  return (
    <span style={{
      display: "inline-block",
      background: `${color}18`,
      color: color,
      border: `1px solid ${color}33`,
      borderRadius: 100,
      padding: "3px 10px",
      fontSize: 11,
      fontWeight: 700,
      letterSpacing: 0.5,
    }}>
      {children}
    </span>
  );
}