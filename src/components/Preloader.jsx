import { useState, useEffect } from 'react';

export default function Preloader({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const duration = 2500; // 2.5 seconds total
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + 2;
        if (newProgress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setFadeOut(true);
            setTimeout(() => onComplete(), 500);
          }, 200);
          return 100;
        }
        return newProgress;
      });
    }, duration / 50);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      background: "#050508",
      zIndex: 9999,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'Syne', 'Space Grotesk', sans-serif",
      opacity: fadeOut ? 0 : 1,
      transition: "opacity 0.5s ease-out",
      pointerEvents: fadeOut ? "none" : "auto"
    }}>
      
      {/* Animated Grid Background */}
      <div style={{
        position: "absolute",
        inset: 0,
        backgroundImage: "linear-gradient(rgba(168,85,247,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(168,85,247,0.05) 1px, transparent 1px)",
        backgroundSize: "50px 50px",
        animation: "gridMove 20s linear infinite"
      }} />
      
      {/* Animated Gradient Orbs */}
      <div style={{
        position: "absolute",
        top: "15%",
        left: "10%",
        width: 350,
        height: 350,
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(168,85,247,0.2), transparent)",
        filter: "blur(60px)",
        animation: "orbFloat 8s ease-in-out infinite"
      }} />
      <div style={{
        position: "absolute",
        bottom: "15%",
        right: "10%",
        width: 300,
        height: 300,
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(0,212,255,0.15), transparent)",
        filter: "blur(55px)",
        animation: "orbFloat 10s ease-in-out infinite reverse"
      }} />
      <div style={{
        position: "absolute",
        top: "50%",
        left: "30%",
        width: 200,
        height: 200,
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(245,158,11,0.1), transparent)",
        filter: "blur(45px)",
        animation: "orbFloat 12s ease-in-out infinite 2s"
      }} />

      {/* Rotating Ring */}
      <div style={{
        position: "relative",
        width: 120,
        height: 120,
        marginBottom: 40,
        animation: "ringRotate 3s linear infinite"
      }}>
        <svg width="120" height="120" viewBox="0 0 120 120">
          <defs>
            <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#A855F7" />
              <stop offset="50%" stopColor="#00D4FF" />
              <stop offset="100%" stopColor="#A855F7" />
            </linearGradient>
          </defs>
          <circle
            cx="60"
            cy="60"
            r="50"
            fill="none"
            stroke="url(#ringGrad)"
            strokeWidth="3"
            strokeDasharray="314"
            strokeDashoffset={314 - (314 * progress) / 100}
            strokeLinecap="round"
            transform="rotate(-90 60 60)"
            style={{ transition: "stroke-dashoffset 0.05s linear" }}
          />
        </svg>
        <div style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          fontSize: 28,
          fontWeight: 700,
          color: "#A855F7"
        }}>⚡</div>
      </div>

      {/* NexusAI Text */}
      <h1 style={{
        fontSize: 36,
        fontWeight: 800,
        letterSpacing: -1.5,
        background: "linear-gradient(135deg, #fff, #A855F7, #00D4FF)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        marginBottom: 8,
        animation: "textGlow 2s ease-in-out infinite"
      }}>NexusAI</h1>
      
      <p style={{
        color: "rgba(255,255,255,0.45)",
        fontSize: 11,
        letterSpacing: 3,
        marginBottom: 32,
        fontFamily: "'DM Sans', sans-serif"
      }}>INTELLIGENT AUTOMATION</p>

      {/* Progress Bar Container */}
      <div style={{
        width: 280,
        marginBottom: 16
      }}>
        <div style={{
          height: 2,
          background: "rgba(255,255,255,0.08)",
          borderRadius: 2,
          overflow: "hidden"
        }}>
          <div style={{
            width: `${progress}%`,
            height: "100%",
            background: "linear-gradient(90deg, #A855F7, #00D4FF)",
            borderRadius: 2,
            transition: "width 0.05s linear",
            position: "relative"
          }}>
            <div style={{
              position: "absolute",
              top: 0,
              right: 0,
              width: 20,
              height: "100%",
              background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)",
              animation: "shimmer 1s infinite"
            }} />
          </div>
        </div>
      </div>

      {/* Progress Percentage */}
      <div style={{
        fontSize: 12,
        fontWeight: 500,
        color: "rgba(255,255,255,0.5)",
        fontFamily: "'DM Sans', sans-serif",
        letterSpacing: 1
      }}>
        {Math.floor(progress)}%
      </div>

      {/* Loading Dots Animation */}
      <div style={{
        display: "flex",
        gap: 10,
        marginTop: 30,
        position: "absolute",
        bottom: 40
      }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: "#A855F7",
            animation: `dotPulse 1.4s ${i * 0.2}s infinite`
          }} />
        ))}
      </div>

      <style>{`
        @keyframes ringRotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes orbFloat {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(-30px) translateX(20px); }
        }
        
        @keyframes gridMove {
          0% { background-position: 0 0; }
          100% { background-position: 50px 50px; }
        }
        
        @keyframes textGlow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; text-shadow: 0 0 20px rgba(168,85,247,0.3); }
        }
        
        @keyframes shimmer {
          0% { transform: translateX(-20px); }
          100% { transform: translateX(20px); }
        }
        
        @keyframes dotPulse {
          0%, 100% { opacity: 0.2; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.2); }
        }
      `}</style>
    </div>
  );
}