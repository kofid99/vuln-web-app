export default function Dashboard() {
  // VULN 4: No server-side session check — anyone can access this page directly
  // VULN 5: Sensitive info exposed in frontend
  const OAUTH_CLIENT_ID = "civic-oauth-client-id-7x9k2m";
  const SUPABASE_URL = "https://xyzcompany.supabase.co";

  return (
    <div style={{ padding: "50px" }}>
      <h1>Admin Dashboard</h1>
      <p>Welcome, Admin.</p>
      <div style={{ marginTop: "20px", padding: "20px", background: "#f0f0f0" }}>
        <h3>System Configuration</h3>
        <p>OAuth Client ID: {OAUTH_CLIENT_ID}</p>
        <p>Database URL: {SUPABASE_URL}</p>
        <p>Environment: Production</p>
      </div>
    </div>
  );
}

