export function verificationEmailTemplate({
  code,
  year = new Date().getFullYear(),
}: {
  code: string;
  year?: number;
}): string {
  const digits = code.split("");

  const digitBoxes = digits
    .map(
      (d) => `
        <td style="padding:0 4px;">
          <div style="
            width:42px;
            height:50px;
            line-height:50px;
            text-align:center;
            background:#ffffff;
            border:1.5px solid #86efac;
            border-radius:8px;
            font-size:24px;
            font-weight:800;
            color:#15803d;
            font-family:'Courier New',Courier,monospace;
          ">${d}</div>
        </td>
      `,
    )
    .join("");

  return `
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <meta http-equiv="X-UA-Compatible" content="IE=edge"/>
  <title>Verifikasi Email – Rimbasmita</title>
</head>
<body style="
  margin:0;
  padding:0;
  background:linear-gradient(160deg,#f0fdf4 0%,#dcfce7 100%);
  font-family:'Segoe UI',Arial,sans-serif;
  -webkit-font-smoothing:antialiased;
">

  <!--[if mso]>
  <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#f0fdf4">
  <tr><td align="center">
  <![endif]-->

  <!-- ═══ OUTER WRAPPER ═══ -->
  <table
    role="presentation"
    width="100%"
    cellpadding="0"
    cellspacing="0"
    border="0"
    style="min-width:100%;background:linear-gradient(160deg,#f0fdf4,#dcfce7);"
  >
    <tr>
      <td align="center" style="padding:48px 16px;">

        <!-- ═══ CARD ═══ -->
        <table
          role="presentation"
          cellpadding="0"
          cellspacing="0"
          border="0"
          style="
            width:100%;
            max-width:480px;
            background:#ffffff;
            border-radius:18px;
            overflow:hidden;
            border:1px solid #bbf7d0;
            border-collapse:separate;
          "
        >

          <!-- ── HEADER ── -->
          <tr>
            <td style="
              background:linear-gradient(135deg,#14532d 0%,#166534 40%,#15803d 75%,#16a34a 100%);
              padding:34px 24px 26px;
              text-align:center;
            ">
              <!--
                LOGO: ganti <span> emoji di bawah dengan hosted PNG di production:
                <img src="https://yourdomain.com/logo.png" width="36" height="36" alt="Rimbasmita"/>
                Emoji SVG inline diblokir Gmail/Outlook.
              -->
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 auto 14px;">
                <tr>
                  <td style="
                    width:60px;
                    height:60px;
                    text-align:center;
                    vertical-align:middle;
                    background:rgba(255,255,255,0.15);
                    border-radius:14px;
                    border:1.5px solid rgba(255,255,255,0.25);
                    font-size:28px;
                    line-height:60px;
                  ">🌿</td>
                </tr>
              </table>
              <div style="color:#ffffff;font-size:22px;font-weight:700;letter-spacing:-0.3px;margin-bottom:4px;">
                Rimbasmita
              </div>
              <div style="color:rgba(187,247,208,0.9);font-size:12px;letter-spacing:0.3px;">
                Setiap langkah punya cerita
              </div>
            </td>
          </tr>

          <!-- ── BODY ── -->
          <tr>
            <td style="padding:34px 28px 28px;text-align:center;">

              <!-- Icon kunci -->
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 auto 18px;">
                <tr>
                  <td style="
                    width:56px;
                    height:56px;
                    text-align:center;
                    vertical-align:middle;
                    background:linear-gradient(135deg,#dcfce7,#bbf7d0);
                    border-radius:50%;
                    border:1.5px solid #86efac;
                    font-size:24px;
                    line-height:56px;
                  ">🔐</td>
                </tr>
              </table>

              <div style="color:#14532d;font-size:19px;font-weight:700;margin-bottom:8px;">
                Verifikasi Email Kamu
              </div>
              <div style="color:#374151;font-size:14px;line-height:1.7;margin-bottom:24px;">
                Gunakan kode berikut untuk melanjutkan<br/>
                pendaftaran akun kamu di
                <span style="color:#15803d;font-weight:600;">Rimbasmita</span>.
              </div>

              <!-- ── OTP CONTAINER ── -->
              <table
                role="presentation"
                cellpadding="0"
                cellspacing="0"
                border="0"
                width="100%"
                style="
                  background:linear-gradient(160deg,#f0fdf4,#dcfce7);
                  border:1.5px solid #86efac;
                  border-radius:12px;
                  margin-bottom:18px;
                  border-collapse:separate;
                "
              >
                <tr>
                  <td style="padding:20px 16px 16px;text-align:center;">
                    <div style="
                      color:#166534;
                      font-size:10px;
                      text-transform:uppercase;
                      letter-spacing:2.5px;
                      font-weight:700;
                      margin-bottom:14px;
                      opacity:0.7;
                    ">Kode Verifikasi</div>

                    <!-- ✅ Digit boxes — table untuk center sempurna di semua mail client -->
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 auto;">
                      <tr>
                        ${digitBoxes}
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Expiry pill -->
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 auto 18px;">
                <tr>
                  <td style="
                    background:#dcfce7;
                    border:1px solid #86efac;
                    border-radius:20px;
                    padding:7px 16px;
                    font-size:13px;
                    color:#15803d;
                    font-weight:500;
                    white-space:nowrap;
                  ">
                    ⏱&nbsp; Berlaku selama <strong>5 menit</strong>
                  </td>
                </tr>
              </table>

              <!-- Divider -->
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom:16px;">
                <tr>
                  <td style="border-top:1px solid #e5e7eb;height:1px;font-size:0;line-height:0;">&nbsp;</td>
                </tr>
              </table>

              <!-- Disclaimer -->
              <div style="color:#9ca3af;font-size:12px;line-height:1.7;">
                Email ini dikirim karena ada pendaftaran akun baru di Rimbasmita.<br/>
                Jika bukan kamu, abaikan saja — kode akan kadaluarsa otomatis.
              </div>

            </td>
          </tr>

          <!-- ── FOOTER ── -->
          <tr>
            <td style="
              background:linear-gradient(135deg,#f0fdf4,#dcfce7);
              border-top:1px solid #bbf7d0;
              padding:16px 24px;
              text-align:center;
            ">
              <div style="font-size:13px;font-weight:600;color:#15803d;margin-bottom:3px;">
                🌿 Rimbasmita
              </div>
              <div style="font-size:11px;color:#9ca3af;">
                © ${year} Rimbasmita &middot; Setiap langkah punya cerita
              </div>
            </td>
          </tr>

        </table>
        <!-- /CARD -->

      </td>
    </tr>
  </table>
  <!-- /OUTER WRAPPER -->

  <!--[if mso]>
  </td></tr></table>
  <![endif]-->

</body>
</html>
  `;
}
