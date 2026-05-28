import { useState } from 'react';

export default function ForgotPasswordPage({ onBack }) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleReset = () => {
    if (!email) {
      setError("Please enter your email");
      return;
    }
    const users = JSON.parse(localStorage.getItem("nexusai_users") || "[]");
    const userExists = users.find(u => u.email === email);
    
    if (userExists) {
      const resetToken = Math.random().toString(36).substring(2, 10);
      localStorage.setItem(`reset_${email}`, resetToken);
      setMessage(`Password reset link sent to ${email}. Use token: ${resetToken}`);
      setError("");
    } else {
      setError("No account found with this email");
    }
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "#050508", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ background: "#0d0d14", border: "1px solid rgba(168,85,247,0.3)", borderRadius: 24, padding: 40, width: 440 }}>
        <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8, textAlign: "center" }}>Reset Password</h2>
        <p style={{ color: "rgba(255,255,255,0.5)", textAlign: "center", marginBottom: 24 }}>Enter your email to receive reset link</p>
        
        {message && <div style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)", borderRadius: 12, padding: 12, marginBottom: 20, color: "#10B981", fontSize: 13 }}>{message}</div>}
        {error && <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 12, padding: 12, marginBottom: 20, color: "#F87171", fontSize: 13 }}>{error}</div>}
        
        <input type="email" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: "100%", padding: "14px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(168,85,247,0.3)", borderRadius: 12, color: "#fff", marginBottom: 20 }} />
        
        <button onClick={handleReset} style={{ width: "100%", padding: "14px", background: "linear-gradient(135deg, #A855F7, #7C3AED)", border: "none", borderRadius: 12, color: "#fff", fontWeight: 600, cursor: "pointer" }}>Send Reset Link</button>
        <button onClick={onBack} style={{ width: "100%", marginTop: 12, background: "transparent", border: "none", color: "#A855F7", cursor: "pointer" }}>Back to Login</button>
      </div>
    </div>
  );
}