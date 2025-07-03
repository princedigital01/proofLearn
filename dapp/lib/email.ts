import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API)

export async function sendWelcomeEmail(to: string, name?: string) {
  const html = `
    <!DOCTYPE html>
    <html lang="en">
      <head><meta charset="UTF-8" /></head>
      <body style="background-color:#f9fafb;margin:0;padding:40px 0;">
        <table width="100%" cellspacing="0" cellpadding="0">
          <tr>
            <td align="center">
              <table width="600" style="background:#fff;border-radius:8px;overflow:hidden;">
                <tr>
                  <td align="center" style="background:#1e3a8a;padding:30px;">
                    <img src="https://proof-learn-e.vercel.app/logo.svg" width="130" />
                  </td>
                </tr>
                <tr>
                  <td style="padding:30px 40px;font-family:sans-serif;font-size:24px;font-weight:bold;color:#111827;">
                    Welcome to ProofLearn 🎓
                  </td>
                </tr>
                <tr>
                  <td style="padding:0 40px 20px;font-family:sans-serif;font-size:16px;line-height:1.6;color:#4b5563;">
                    Hi ${name || 'there'},<br/><br/>
                    We’re so excited to have you join ProofLearn — your future of decentralized learning starts now!
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding:20px 40px;">
                    <a href="https://proof-learn-e.vercel.app" style="background:#1e3a8a;color:#fff;padding:14px 28px;text-decoration:none;border-radius:6px;font-size:16px;">Open Dashboard</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding:0 40px 30px;font-family:sans-serif;font-size:14px;color:#6b7280;">
                    If you have any questions, just reply to this email — we’re always here.
                  </td>
                </tr>
                <tr>
                  <td align="center" style="background:#f3f4f6;padding:20px 40px;font-size:12px;color:#9ca3af;">
                    &copy; 2025 ProofLearn. All rights reserved.
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `

  return await resend.emails.send({
    from: 'ProofLearn <onboarding@resend.dev>',
    to:[to],
    subject: 'Welcome to ProofLearn!',
    react: html,
  })
}


export async function sendNewUserEmail(email?: string) {
  const html = `
    <!DOCTYPE html>
    <html lang="en">
      <head><meta charset="UTF-8" /></head>
      <body style="background-color:#f9fafb;margin:0;padding:40px 0;">
        <table width="100%" cellspacing="0" cellpadding="0">
          <tr>
            <td align="center">
              <table width="600" style="background:#fff;border-radius:8px;overflow:hidden;">
                <tr>
                  <td align="center" style="background:#1e3a8a;padding:30px;">
                    <img src="https://proof-learn-e.vercel.app/logo.svg" width="130" />
                  </td>
                </tr>
                <tr>
                  <td style="padding:30px 40px;font-family:sans-serif;font-size:24px;font-weight:bold;color:#111827;">
                    Welcome to ProofLearn 🎓
                  </td>
                </tr>
                <tr>
                  <td style="padding:0 40px 20px;font-family:sans-serif;font-size:16px;line-height:1.6;color:#4b5563;">
                    Hi ${email || 'there'},<br/><br/>
                    just joined ProofLearn 
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding:20px 40px;">
                    <a href="https://proof-learn-e.vercel.app" style="background:#1e3a8a;color:#fff;padding:14px 28px;text-decoration:none;border-radius:6px;font-size:16px;">Open Dashboard</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding:0 40px 30px;font-family:sans-serif;font-size:14px;color:#6b7280;">
                    If you have any questions, just reply to this email — we’re always here.
                  </td>
                </tr>
                <tr>
                  <td align="center" style="background:#f3f4f6;padding:20px 40px;font-size:12px;color:#9ca3af;">
                    &copy; 2025 ProofLearn. All rights reserved.
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `

  return await resend.emails.send({
    from: 'ProofLearn <onboarding@resend.dev>',
    to: [process.env.ADMIN_EMAIL!],
    subject: 'Welcome to ProofLearn!',
    react:html,
  })
}
