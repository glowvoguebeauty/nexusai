import { useState } from "react";

export default function SignupPage({ onSignup, onSwitchToLogin }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError("Please fill in all fields");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (!email.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("userName", name);
    localStorage.setItem("userEmail", email);
    onSignup();
  };

  return (
    <div style={{ minHeight: "100vh", background: "#050508", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ background: "#0d0d14", border: "1px solid rgba(168,85,247,0.2)", borderRadius: 24, padding: 48, width: "100%", maxWidth: 440 }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ width: 56, height: 56, borderRadius: 14, background: "linear-gradient(135deg,#A855F7,#7C3AED)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, margin: "0 auto 20px" }}>⚡</div>
          <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>Create Account</h1>
          <p style={{ color: "rgba(255,255,255,0.5)" }}>Start your 14-day free trial</p>
        </div>

        {error && <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 12, padding: 12, marginBottom: 24, color: "#F87171", fontSize: 14, textAlign: "center" }}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: "block", fontSize: 14, fontWeight: 500, marginBottom: 8, color: "rgba(255,255,255,0.8)" }}>Full Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" style={{ width: "100%", padding: "14px 16px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(168,85,247,0.3)", borderRadius: 12, color: "#fff", fontSize: 14, outline: "none" }} />
          </div>
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: "block", fontSize: 14, fontWeight: 500, marginBottom: 8, color: "rgba(255,255,255,0.8)" }}>Email Address</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" style={{ width: "100%", padding: "14px 16px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(168,85,247,0.3)", borderRadius: 12, color: "#fff", fontSize: 14, outline: "none" }} />
          </div>
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: "block", fontSize: 14, fontWeight: 500, marginBottom: 8, color: "rgba(255,255,255,0.8)" }}>Password</label>
            <div style={{ position: "relative" }}>
              <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Minimum 6 characters" style={{ width: "100%", padding: "14px 16px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(168,85,247,0.3)", borderRadius: 12, color: "#fff", fontSize: 14, outline: "none" }} />
              <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "transparent", border: "none", color: "rgba(255,255,255,0.5)", cursor: "pointer" }}>{showPassword ? "🙈" : "👁️"}</button>
            </div>
          </div>
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: "block", fontSize: 14, fontWeight: 500, marginBottom: 8, color: "rgba(255,255,255,0.8)" }}>Confirm Password</label>
            <input type={showPassword ? "text" : "password"} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm your password" style={{ width: "100%", padding: "14px 16px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(168,85,247,0.3)", borderRadius: 12, color: "#fff", fontSize: 14, outline: "none" }} />
          </div>
          <button type="submit" style={{ width: "100%", padding: "14px", background: "linear-gradient(135deg,#A855F7,#7C3AED)", border: "none", borderRadius: 12, color: "#fff", fontSize: 16, fontWeight: 700, cursor: "pointer", marginBottom: 20 }}>Start Free Trial →</button>
        </form>

        <p style={{ textAlign: "center", color: "rgba(255,255,255,0.5)", fontSize: 14 }}>
          Already have an account?{" "}
          <button onClick={onSwitchToLogin} style={{ background: "none", border: "none", color: "#A855F7", cursor: "pointer", fontWeight: 600 }}>Sign in</button>
        </p>

        <div style={{ marginTop: 24, paddingTop: 24, borderTop: "1px solid rgba(255,255,255,0.1)", textAlign: "center" }}>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.3)" }}>14-day free trial · No credit card required · Cancel anytime</p>
        </div>
      </div>
    </div>
  );
}