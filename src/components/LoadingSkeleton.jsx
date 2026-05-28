export function StatsSkeleton() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20, marginBottom: 40 }}>
      {[1, 2, 3, 4].map(i => (
        <div key={i} style={{
          background: "rgba(13,13,20,0.6)",
          borderRadius: 20,
          padding: 24,
          animation: "skeletonPulse 1.5s ease-in-out infinite"
        }}>
          <div style={{ height: 12, background: "rgba(255,255,255,0.08)", borderRadius: 4, marginBottom: 16, width: "60%" }} />
          <div style={{ height: 38, background: "rgba(255,255,255,0.06)", borderRadius: 8, marginBottom: 8, width: "50%" }} />
          <div style={{ height: 12, background: "rgba(255,255,255,0.05)", borderRadius: 4, width: "40%" }} />
        </div>
      ))}
      <style>{`
        @keyframes skeletonPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}

export function AgentsSkeleton() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: 20 }}>
      {[1, 2, 3, 4, 5, 6, 7].map(i => (
        <div key={i} style={{
          background: "rgba(13,13,20,0.6)",
          borderRadius: 20,
          padding: 28,
          textAlign: "center",
          animation: "skeletonPulse 1.5s ease-in-out infinite"
        }}>
          <div style={{ width: 52, height: 52, background: "rgba(255,255,255,0.08)", borderRadius: 26, margin: "0 auto 16px" }} />
          <div style={{ height: 18, background: "rgba(255,255,255,0.08)", borderRadius: 4, marginBottom: 8, width: "70%", margin: "0 auto" }} />
          <div style={{ height: 12, background: "rgba(255,255,255,0.06)", borderRadius: 4, width: "50%", margin: "0 auto" }} />
        </div>
      ))}
    </div>
  );
}