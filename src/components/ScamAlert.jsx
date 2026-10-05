export default function ScamAlert({ compact }) {
  return (
    <aside className="alert alert-warn">
      <strong>⚠️ Protect yourself from visa scams.</strong>
      {compact ? (
        <span> No agent can guarantee a visa. Pay government fees only through official portals.</span>
      ) : (
        <ul>
          <li>No agent, “connection” or lawyer can guarantee a visa. Only the embassy decides.</li>
          <li>Pay visa fees only through official government portals or the official visa centres (VFS Global, TLScontact, etc.).</li>
          <li>Real employers do not sell job offers, Certificates of Sponsorship or LMIAs.</li>
          <li>Never submit fake bank statements or documents. You can be banned for up to 10 years.</li>
          <li>Report fraud to the EFCC or to the relevant embassy.</li>
        </ul>
      )}
    </aside>
  );
}
