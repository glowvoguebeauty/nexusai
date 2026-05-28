import { useState, useEffect } from "react";

export default function AdminPage({ onBack }) {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({ total: 0, verified: 0, pending: 0 });

  useEffect(() => {
    const allUsers = JSON.parse(localStorage.getItem("nexusai_users") || "[]");
    const currentUser = JSON.parse(localStorage.getItem("nexusai_user") || "{}");
    
    if (currentUser.email && !allUsers.find(u => u.email === currentUser.email)) {
      allUsers.push(currentUser);
    }
    
    setUsers(allUsers);
    
    const verified = allUsers.filter(u => u.verified).length;
    setStats({
      total: allUsers.length,
      verified: verified,
      pending: allUsers.length - verified
    });
  }, []);

  const deleteUser = (email) => {
    const updatedUsers = users.filter(u => u.email !== email);
    localStorage.setItem("nexusai_users", JSON.stringify(updatedUsers));
    setUsers(updatedUsers);
    
    const verified = updatedUsers.filter(u => u.verified).length;
    setStats({
      total: updatedUsers.length,
      verified: verified,
      pending: updatedUsers.length - verified
    });
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#050508",
      color: "#fff",
      fontFamily: "'Syne', sans-serif",
      padding: "40px"
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 4 }}>Admin Dashboard</h1>
          <p style={{ color: "rgba(255,255,255,0.5)" }}>User Management - Secret Access</p>
        </div>
        <button onClick={onBack} style={{
          background: "transparent",
          border: "1px solid rgba(255,255,255,0.2)",
          padding: "10px 24px",
          borderRadius: 10,
          color: "#fff",
          cursor: "pointer"
        }}>← Back to Website</button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20, marginBottom: 32 }}>
        <div style={{ background: "#0d0d14", border: "1px solid rgba(168,85,247,0.2)", borderRadius: 16, padding: 24 }}>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginBottom: 8 }}>Total Users</div>
          <div style={{ fontSize: 36, fontWeight: 800, color: "#A855F7" }}>{stats.total}</div>
        </div>
        <div style={{ background: "#0d0d14", border: "1px solid rgba(16,185,129,0.2)", borderRadius: 16, padding: 24 }}>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginBottom: 8 }}>Verified Users</div>
          <div style={{ fontSize: 36, fontWeight: 800, color: "#10B981" }}>{stats.verified}</div>
        </div>
        <div style={{ background: "#0d0d14", border: "1px solid rgba(245,158,11,0.2)", borderRadius: 16, padding: 24 }}>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginBottom: 8 }}>Pending Verification</div>
          <div style={{ fontSize: 36, fontWeight: 800, color: "#F59E0B" }}>{stats.pending}</div>
        </div>
      </div>

      <div style={{
        background: "#0d0d14",
        border: "1px solid rgba(168,85,247,0.2)",
        borderRadius: 16,
        overflow: "auto"
      }}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 600 }}>
          <thead>
            <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.1)", background: "rgba(168,85,247,0.1)" }}>
              <th style={{ padding: "16px", textAlign: "left" }}>Name</th>
              <th style={{ padding: "16px", textAlign: "left" }}>Email</th>
              <th style={{ padding: "16px", textAlign: "left" }}>Joined</th>
              <th style={{ padding: "16px", textAlign: "left" }}>Status</th>
              <th style={{ padding: "16px", textAlign: "left" }}>Actions</th>
             </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ padding: "40px", textAlign: "center", color: "rgba(255,255,255,0.5)" }}>No users found</td>
              </tr>
            ) : (
              users.map((user, index) => (
                <tr key={index} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                  <td style={{ padding: "16px" }}>{user.name || "—"}</td>
                  <td style={{ padding: "16px" }}>{user.email}</td>
                  <td style={{ padding: "16px" }}>{user.joined ? new Date(user.joined).toLocaleDateString() : "—"}</td>
                  <td style={{ padding: "16px" }}>
                    <span style={{
                      background: user.verified ? "rgba(16,185,129,0.2)" : "rgba(245,158,11,0.2)",
                      color: user.verified ? "#10B981" : "#F59E0B",
                      padding: "4px 12px",
                      borderRadius: 100,
                      fontSize: 12
                    }}>
                      {user.verified ? "Verified" : "Pending"}
                    </span>
                  </td>
                  <td style={{ padding: "16px" }}>
                    <button onClick={() => deleteUser(user.email)} style={{
                      background: "rgba(239,68,68,0.2)",
                      border: "1px solid rgba(239,68,68,0.3)",
                      padding: "6px 12px",
                      borderRadius: 8,
                      color: "#F87171",
                      cursor: "pointer",
                      fontSize: 12
                    }}>Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}