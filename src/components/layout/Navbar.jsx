import { Button } from "../common/Button";
import { theme } from "../../styles/theme";

export function Navbar({ onEnterApp }) {
  return (
    <nav style={{
      position: "sticky",
      top: 0,
      zIndex: 50,
      padding: "14px 40px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      background: "rgba(7,8,15,0.9)",
      backdropFilter: "blur(20px)",
      borderBottom: `1px solid ${theme.border}`,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{
          width: 30,
          height: 30,
          borderRadius: 8,
          background: `linear-gradient(135deg, ${theme.accent}, ${theme.accent2})`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 14,
        }}>⚡</div>
        <span style={{ fontWeight: 800, fontSize: 17 }}>NexusAI</span>
      </div>
      <div style={{ display: "flex", gap: 12 }}>
        <Button variant="secondary" onClick={onEnterApp}>Sign In</Button>
        <Button variant="primary" onClick={onEnterApp}>Try Free →</Button>
      </div>
    </nav>
  );
}