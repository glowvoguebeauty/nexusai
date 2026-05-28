import { useState, useEffect } from 'react';

export default function VerifyEmailPage({ email, onVerified }) {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  const handleVerify = () => {
    const savedCode = localStorage.getItem(`verify_${email}`);
    if (code === savedCode) {
      const users = JSON.parse(localStorage.getItem("nexusai_users") || "[]");
      const updatedUsers = users.map(u => 
        u.email === email ? { ...u, verified: true } : u
      );
      localStorage.setItem("nexusai_users", JSON.stringify(updatedUsers));
      onVerified();
    } else {
      setError("Invalid verification code");
    }
  };

  useEffect(() => {
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
    localStorage.setItem(`verify_${email}`, verifyCode);
    console.log(`Verification code for ${email}: ${verifyCode}`);
  }, [email]);

  return (
    <div style={{ position: "fixed", inset: 0, background: "#050508", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ background: "#0d0d14", border: "1px solid rgba(168,85,247,0.3)", borderRadius: 24, padding: 40, width: 440 }}>
        <h2 style={{ fontSize: 24, fontWeight: 800, textAlign: "center", marginBottom: 8 }}>Verify Your Email</h2>
        <p style={{ color: "rgba(255,255,255,0.5)", textAlign: "center", marginBottom: 24 }}>Enter the 6-digit code sent to {email}</p>
        
        {error && <div style={{ background: "rgba(239,68,68,0.1)", borderRadius: 12, padding: 12, marginBottom: 20, color: "#F87171", fontSize: 13 }}>{error}</div>}
        
        <input type="text" placeholder="Enter 6-digit code" maxLength="6" value={code} onChange={(e) => setCode(e.target.value)} style={{ width: "100%", padding: "14px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(168,85,247,0.3)", borderRadius: 12, color: "#fff", textAlign: "center", fontSize: 18, letterSpacing: 4, marginBottom: 20 }} />
        
        <button onClick={handleVerify} style={{ width: "100%", padding: "14px", background: "linear-gradient(135deg, #A855F7, #7C3AED)", border: "none", borderRadius: 12, color: "#fff", fontWeight: 600, cursor: "pointer" }}>Verify Email</button>
      </div>
    </div>
  );
}