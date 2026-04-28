import https from 'https';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    console.error('[send-confirmation] BREVO_API_KEY is not set');
    return res.status(500).json({ error: 'Missing API key' });
  }

  const { name, email, city, country } = req.body || {};
  if (!email) {
    return res.status(400).json({ error: 'Missing email' });
  }

  const firstName = name?.split(' ')[0] || 'there';

  const payload = JSON.stringify({
    sender: { name: 'Kaya', email: 'noreply@kayafast.com' },
    to: [{ email, name: name || email }],
    subject: "You're on the Kaya waitlist!",
    htmlContent: `<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#0b0f1a;font-family:'Helvetica Neue',Arial,sans-serif;color:#fff;">
<div style="max-width:560px;margin:0 auto;padding:48px 32px;">
  <div style="margin-bottom:32px;">
    <span style="font-size:2rem;font-weight:900;letter-spacing:-1px;">Kay<span style="color:#16c45e;">a</span></span>
  </div>
  <div style="background:#0f1626;border:1px solid rgba(255,255,255,.1);border-radius:20px;padding:40px 36px;margin-bottom:24px;">
    <p style="margin:0 0 8px;font-size:.75rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#16c45e;">You're in</p>
    <h1 style="margin:0 0 16px;font-size:1.8rem;font-weight:800;line-height:1.2;">Hey ${firstName}, welcome to the waitlist!</h1>
    <p style="margin:0 0 24px;font-size:1rem;color:rgba(255,255,255,.6);line-height:1.7;">
      Thanks for signing up — you're now on the Kaya early access list for <strong style="color:#fff;">${city || 'your city'}, ${country || 'Ghana'}</strong>. We'll reach out the moment we launch in your area.
    </p>
    <div style="background:rgba(22,196,94,.08);border:1px solid rgba(22,196,94,.25);border-radius:12px;padding:16px 20px;">
      <p style="margin:0;font-size:.9rem;color:#16c45e;font-weight:600;">Keep an eye on your inbox — your exclusive invite is coming soon.</p>
    </div>
  </div>
  <p style="margin:0;font-size:.8rem;color:rgba(255,255,255,.25);text-align:center;line-height:1.6;">
    © 2026 Kaya Technologies Inc. · You're receiving this because you signed up at kayafast.com
  </p>
</div>
</body>
</html>`,
  });

  return new Promise((resolve) => {
    const options = {
      hostname: 'api.brevo.com',
      path: '/v3/smtp/email',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': apiKey,
        'Content-Length': Buffer.byteLength(payload),
      },
    };

    const request = https.request(options, (response) => {
      let data = '';
      response.on('data', (chunk) => { data += chunk; });
      response.on('end', () => {
        if (response.statusCode >= 200 && response.statusCode < 300) {
          console.log('[send-confirmation] Email sent to:', email);
          res.status(200).json({ success: true });
        } else {
          console.error('[send-confirmation] Brevo error:', data);
          res.status(500).json({ error: 'Failed to send email', detail: data });
        }
        resolve();
      });
    });

    request.on('error', (err) => {
      console.error('[send-confirmation] Request error:', err.message);
      res.status(500).json({ error: err.message });
      resolve();
    });

    request.write(payload);
    request.end();
  });
}
