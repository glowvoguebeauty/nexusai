import { useState } from "react";

export default function LoginPage({ onLogin, onSwitchToSignup }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }
    if (!email.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }
    // Demo login - any email/password works
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("userEmail", email);
    localStorage.setItem("userName", email.split("@")[0]);
    onLogin();
  };

  return (
    <div style={{ minHeight: "100vh", background: "#050508", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;800;900&display=swap');*{margin:0;padding:0;box-sizing:border-box;}`}</style>
      
      <div style={{ background: "#0d0d14", border: "1px solid rgba(168,85,247,0.2)", borderRadius: 24, padding: 48, width: "100%", maxWidth: 440 }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ width: 56, height: 56, borderRadius: 14, background: "linear-gradient(135deg,#A855F7,#7C3AED)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, margin: "0 auto 20px" }}>⚡</div>
          <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>Welcome Back</h1>
          <p style={{ color: "rgba(255,255,255,0.5)" }}>Sign in to your NexusAI account</p>
        </div>

        {error && <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 12, padding: 12, marginBottom: 24, color: "#F87171", fontSize: 14, textAlign: "center" }}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: "block", fontSize: 14, fontWeight: 500, marginBottom: 8, color: "rgba(255,255,255,0.8)" }}>Email Address</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" style={{ width: "100%", padding: "14px 16px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(168,85,247,0.3)", borderRadius: 12, color: "#fff", fontSize: 14, outline: "none" }} />
          </div>
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: "block", fontSize: 14, fontWeight: 500, marginBottom: 8, color: "rgba(255,255,255,0.8)" }}>Password</label>
            <div style={{ position: "relative" }}>
              <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" style={{ width: "100%", padding: "14px 16px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(168,85,247,0.3)", borderRadius: 12, color: "#fff", fontSize: 14, outline: "none" }} />
              <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "transparent", border: "none", color: "rgba(255,255,255,0.5)", cursor: "pointer" }}>{showPassword ? "🙈" : "👁️"}</button>
            </div>
          </div>
          <button type="submit" style={{ width: "100%", padding: "14px", background: "linear-gradient(135deg,#A855F7,#7C3AED)", border: "none", borderRadius: 12, color: "#fff", fontSize: 16, fontWeight: 700, cursor: "pointer", marginBottom: 20 }}>Sign In</button>
        </form>

        <p style={{ textAlign: "center", color: "rgba(255,255,255,0.5)", fontSize: 14 }}>
          Don't have an account?{" "}
          <button onClick={onSwitchToSignup} style={{ background: "none", border: "none", color: "#A855F7", cursor: "pointer", fontWeight: 600 }}>Sign up</button>
        </p>

        <div style={{ marginTop: 24, paddingTop: 24, borderTop: "1px solid rgba(255,255,255,0.1)", textAlign: "center" }}>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.3)" }}>Demo credentials: any email/password works</p>
        </div>
      </div>
    </div>
  );
}