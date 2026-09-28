const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DEFAULT_FROM = "Adara AI Lab <onboarding@resend.dev>";

function json(status: number, body: Record<string, unknown>): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

const SITE = "https://adaraai.xyz";
const ORANGE = "#EB551E";
const INK = "#171717";
const BODY_FONT = "'Noto Sans',Helvetica,Arial,sans-serif";
const MONO_FONT = "'Geist Mono',ui-monospace,Menlo,Consolas,monospace";

const PRODUCTS = [
  ["Corpus", "Language and cultural datasets built with local researchers and communities."],
  ["Models", "Speech and language models tuned for African languages and accents."],
  ["Context API", "Translation, speech and cultural context you can plug into any product."],
  ["Speech", "Speech-to-text and text-to-speech across African languages."],
];

const SOCIALS = [
  ["LinkedIn", "https://www.linkedin.com/company/adara-ai-lab"],
  ["X", "https://x.com/adaraaii"],
  ["Instagram", "https://www.instagram.com/adara.africa"],
  ["YouTube", "https://www.youtube.com/@adaraaii"],
  ["GitHub", "https://github.com/adaraai"],
];

function confirmationHtml(): string {
  const productRows = PRODUCTS.map(
    ([name, description]) => `
                <tr>
                  <td width="14" valign="top" style="padding:3px 0 14px;">
                    <div style="width:6px;height:6px;margin-top:6px;border-radius:999px;background:${ORANGE};"></div>
                  </td>
                  <td valign="top" style="padding:0 0 14px;font-family:${BODY_FONT};font-size:14px;line-height:1.55;color:#525252;">
                    <strong style="color:${INK};font-weight:700;">${name}</strong> &middot; ${description}
                  </td>
                </tr>`
  ).join("");

  const socialLinks = SOCIALS.map(
    ([label, href]) =>
      `<a href="${href}" style="color:#a3a3a3;text-decoration:none;font-family:${MONO_FONT};font-size:11px;letter-spacing:0.5px;">${label}</a>`
  ).join(`<span style="color:#525252;padding:0 8px;">&middot;</span>`);

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="color-scheme" content="light only" />
    <title>You're on the Adara waitlist</title>
    <link href="https://fonts.googleapis.com/css2?family=Geist+Mono:wght@400;500&family=Noto+Sans:wght@400;700&display=swap" rel="stylesheet" />
  </head>
  <body style="margin:0;padding:0;background:#f4f4f5;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;">
      Thanks for joining. We'll let you know the moment early access opens.
    </div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:32px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;border-radius:20px;overflow:hidden;background:#ffffff;box-shadow:0 1px 2px rgba(0,0,0,0.04);">
            <tr>
              <td style="background:#050505;background-image:radial-gradient(120% 90% at 50% 120%, rgba(45,212,191,0.35) 0%, rgba(124,58,237,0.35) 40%, rgba(5,5,5,0) 75%);padding:36px 36px 40px;">
                <a href="${SITE}/" style="text-decoration:none;">
                  <img src="${SITE}/assets/adara-logo-on-dark.png" width="132" height="33" alt="Adara" style="display:block;border:0;width:132px;height:33px;" />
                </a>
                <p style="margin:36px 0 10px;font-family:${MONO_FONT};font-size:11px;letter-spacing:2.6px;text-transform:uppercase;color:${ORANGE};">
                  Early access
                </p>
                <h1 style="margin:0;font-family:${BODY_FONT};font-size:28px;line-height:1.2;font-weight:700;letter-spacing:-0.5px;color:#ffffff;">
                  You're on the list.
                </h1>
                <p style="margin:12px 0 0;font-family:${BODY_FONT};font-size:15px;line-height:1.6;color:#d4d4d4;">
                  Data and tools that make AI understand Africa.
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding:36px;">
                <p style="margin:0 0 16px;font-family:${BODY_FONT};font-size:15px;line-height:1.65;color:#404040;">
                  Thanks for joining the Adara waitlist. Most AI still misses African languages and local life.
                  We're building the data and tools that fix that, so AI understands Africa in its languages,
                  its logic, and its lived reality.
                </p>
                <p style="margin:0 0 28px;font-family:${BODY_FONT};font-size:15px;line-height:1.65;color:#404040;">
                  Nothing is live yet. You'll be among the first to hear when early access opens.
                </p>

                <p style="margin:0 0 14px;font-family:${MONO_FONT};font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#737373;">
                  What's coming
                </p>
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${productRows}
                </table>

                <table role="presentation" cellpadding="0" cellspacing="0" style="margin-top:14px;">
                  <tr>
                    <td style="border-radius:999px;background:${ORANGE};">
                      <a href="${SITE}/" style="display:inline-block;padding:13px 26px;font-family:${BODY_FONT};font-size:14px;font-weight:700;color:#ffffff;text-decoration:none;border-radius:999px;">
                        Explore Adara &rarr;
                      </a>
                    </td>
                  </tr>
                </table>

                <p style="margin:28px 0 0;padding-top:20px;border-top:1px solid #e5e5e5;font-family:${BODY_FONT};font-size:13px;line-height:1.6;color:#737373;">
                  Questions or ideas? Just reply to this email, it reaches the team directly.
                </p>
              </td>
            </tr>
            <tr>
              <td style="background:#0a0a0a;padding:26px 36px;">
                <img src="${SITE}/assets/adara-logo-on-dark.png" width="84" height="21" alt="Adara" style="display:block;border:0;width:84px;height:21px;" />
                <p style="margin:12px 0 14px;font-family:${BODY_FONT};font-size:12px;line-height:1.6;color:#a3a3a3;">
                  Teaching AI to understand Africa in its languages, its logic, and its lived reality.<br />
                  <span style="font-family:${MONO_FONT};font-size:11px;color:#737373;">Accra &middot; Lagos &middot; Nairobi</span>
                </p>
                <p style="margin:0;">${socialLinks}</p>
              </td>
            </tr>
          </table>
          <p style="margin:18px 0 0;font-family:${BODY_FONT};font-size:11px;color:#a3a3a3;">
            You received this because you joined the waitlist at adaraai.xyz. &copy; 2026 Adara AI Lab.
          </p>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

const CONFIRMATION_TEXT = `ADARA · EARLY ACCESS

You're on the list.

Thanks for joining the Adara waitlist. Most AI still misses African languages and local life. We're building the data and tools that fix that, so AI understands Africa in its languages, its logic, and its lived reality.

Nothing is live yet. You'll be among the first to hear when early access opens.

What's coming
${PRODUCTS.map(([name, description]) => `- ${name}: ${description}`).join("\n")}

Explore Adara: ${SITE}/

Questions or ideas? Just reply to this email, it reaches the team directly.

Adara AI Lab · Accra · Lagos · Nairobi`;

type Env = Record<string, string | undefined>;

export async function POST(request: Request, env: Env = process.env): Promise<Response> {
  const apiKey = env.RESEND_API_KEY;
  if (!apiKey) return json(503, { ok: false, error: "RESEND_API_KEY is not set" });

  let email = "";
  try {
    const body = (await request.json()) as { email?: unknown };
    email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  } catch {
    return json(400, { ok: false, error: "Invalid JSON body" });
  }
  if (!EMAIL_PATTERN.test(email) || email.length > 254) {
    return json(400, { ok: false, error: "Invalid email" });
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: env.WAITLIST_FROM_EMAIL || DEFAULT_FROM,
      to: [email],
      reply_to: "infoadaraai@gmail.com",
      subject: "You're on the Adara waitlist",
      html: confirmationHtml(),
      text: CONFIRMATION_TEXT,
    }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    return json(502, { ok: false, error: "Resend rejected the request", detail });
  }
  return json(200, { ok: true });
}
