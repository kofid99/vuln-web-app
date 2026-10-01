"use client"

export default function Dashboard() {
  return (
    <div style={{ padding: "50px" }}>
      <h1>Admin Dashboard</h1>
      <p>Welcome, Admin.</p>
      <div style={{ marginTop: "20px", padding: "20px", background: "#f0f0f0" }}>
        <h3>System Configuration</h3>
        <p>OAuth Client ID: {process.env.NEXT_PUBLIC_OAUTH_CLIENT_ID}</p>
        <p>Database URL: {process.env.NEXT_PUBLIC_SUPABASE_URL}</p>
        <p>Anon Key: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}</p>
        <p>Environment: Production</p>
      </div>
    </div>
  );
}

