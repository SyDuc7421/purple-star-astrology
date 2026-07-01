export const metadata = { title: 'Privacy Policy · Zi Wei Chart', description: 'Zi Wei Chart privacy policy' };

export default function PrivacyPage() {
  return (
    <>
      <header style={{ position: 'sticky', top: 0, zIndex: 50, background: 'var(--bg-0)', borderBottom: '1px solid var(--bdr)', padding: '14px 24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <a href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--tx-3)', textDecoration: 'none' }}>
          <span style={{ fontSize: '16px' }}>‹</span>
          <span>Back to home</span>
        </a>
        <div style={{ width: '1px', height: '20px', background: 'var(--bdr-med)' }} />
        <span style={{ fontSize: '12px', color: 'var(--ac)', letterSpacing: '0.2em' }}>Zi Wei Chart</span>
      </header>
      <main style={{ maxWidth: 800, margin: '0 auto', padding: '60px 24px 80px', color: 'var(--tx-1)', lineHeight: 1.8 }}>
        <h1 style={{ fontSize: 28, fontWeight: 600, marginBottom: 8 }}>Privacy Policy</h1>
        <p style={{ fontSize: 12, color: 'var(--tx-3)', marginBottom: 32 }}>Last updated: April 2026</p>

      <h2 style={{ fontSize: 18, marginTop: 32, marginBottom: 12 }}>1. Information We Collect</h2>
      <p>To provide chart generation and reading services, we may collect the following information:</p>
      <ul style={{ paddingLeft: 24 }}>
        <li><strong>Chart required information</strong>: Name (optional), Gregorian birth date, birth hour, gender, birth longitude</li>
        <li><strong>Account information (after registration)</strong>: Phone number (for SMS verification and membership services)</li>
        <li><strong>Interaction information</strong>: Your clicks, browsing, and chart history on the platform</li>
        <li><strong>Feedback information</strong>: Your "accurate / inaccurate" ratings and text feedback on readings</li>
        <li><strong>Payment information</strong>: Processed through third-party payment providers (Alipay / WeChat Pay) when purchasing membership or individual services — we do not store full card numbers or passwords</li>
      </ul>

      <h2 style={{ fontSize: 18, marginTop: 32, marginBottom: 12 }}>2. How We Use Information</h2>
      <ul style={{ paddingLeft: 24 }}>
        <li>Chart information is used only for the current reading and your account's chart history</li>
        <li>Phone number is used for registration, login, and order notifications</li>
        <li>Feedback is used to continuously improve reading quality (aggregated and anonymized analysis)</li>
        <li>Aggregated data may be used for industry research and platform optimization</li>
      </ul>

      <h2 style={{ fontSize: 18, marginTop: 32, marginBottom: 12 }}>3. Information Sharing and Third Parties</h2>
      <p>Except in the following circumstances, we do not share your personal information with third parties:</p>
      <ul style={{ paddingLeft: 24 }}>
        <li>Payment providers (Alipay / WeChat Pay): order settlement</li>
        <li>SMS providers (e.g. Alibaba Cloud SMS): sending verification codes</li>
        <li>Cloud providers (e.g. Vercel / Cloudflare / Alibaba Cloud): technical infrastructure</li>
        <li>AI reading service (e.g. Anthropic Claude): processing your free follow-up conversations (anonymized)</li>
        <li>Judicial or government authorities based on lawful legal requirements</li>
      </ul>

      <h2 style={{ fontSize: 18, marginTop: 32, marginBottom: 12 }}>4. Information Security</h2>
      <p>We take industry-standard technical and administrative measures to protect your information (HTTPS transmission encryption, encrypted database storage, access control, etc.). Please note that no internet transmission can be guaranteed 100% secure.</p>

      <h2 style={{ fontSize: 18, marginTop: 32, marginBottom: 12 }}>5. Your Rights</h2>
      <ul style={{ paddingLeft: 24 }}>
        <li><strong>Access</strong>: View all your chart history and orders in the account center</li>
        <li><strong>Deletion</strong>: Contact support to delete specific charts or deactivate your account</li>
        <li><strong>Export</strong>: Request an export of all your personal data</li>
      </ul>

      <h2 style={{ fontSize: 18, marginTop: 32, marginBottom: 12 }}>6. Cookies and Local Storage</h2>
      <p>This site uses cookies / localStorage to: save your dark/light theme preference, recent chart history, and membership login state. You may disable these in your browser settings, but some features may be affected.</p>

      <h2 style={{ fontSize: 18, marginTop: 32, marginBottom: 12 }}>7. Minors</h2>
      <p>The divination content on this platform is intended for users 18 years of age or older. Minors should use it only with guardian consent and should not rely on readings for major life decisions.</p>

      <h2 style={{ fontSize: 18, marginTop: 32, marginBottom: 12 }}>8. Policy Changes</h2>
      <p>This policy may be updated periodically. Significant changes will be communicated in a prominent manner. Continued use of the platform constitutes acceptance of the updated version.</p>

        <p style={{ marginTop: 48, fontSize: 12, color: 'var(--tx-3)' }}>
          <a href="/terms" style={{ color: 'var(--ac)' }}>Terms of Service</a> · <a href="/" style={{ color: 'var(--ac)' }}>Back to home</a>
        </p>
      </main>
    </>
  );
}
