export interface IAccountVerifiedTemplate {
	firstName: string;
	appName: string;
	loginUrl: string;
	supportEmail: string;
	year: number;
}

export const accountVerifiedTemplate = ({
	firstName,
	appName,
	loginUrl,
	supportEmail,
	year,
}: IAccountVerifiedTemplate) => `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width" />
    <title>Account Activated</title>
  </head>

  <body style="margin:0; padding:0; background-color:#f4f6f8; font-family:Arial, Helvetica, sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="padding:24px 0;">
      <tr>
        <td align="center">

          <!-- Container -->
          <table width="600" cellpadding="0" cellspacing="0"
            style="background-color:#ffffff; border-radius:8px; overflow:hidden; box-shadow:0 4px 12px rgba(0,0,0,0.08);">

            <!-- Header -->
            <tr>
              <td align="center"
                style="background-color:#4caf50; padding:24px; color:#ffffff;">
                <h1 style="margin:0; font-size:22px; font-weight:bold;">
                  ${appName}
                </h1>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding:32px 24px; color:#111827;">
                <h2 style="margin-top:0; font-size:20px;">
                  Hello ${firstName},
                </h2>

                <p style="font-size:15px; line-height:1.6; margin:12px 0;">
                  We’re happy to inform you that your account has been
                  <strong>successfully activated</strong> 🎉
                </p>

                <p style="font-size:15px; line-height:1.6; margin:12px 0;">
                  You can now log in and start using all the features available to you.
                </p>

                <!-- Button -->
                <table cellpadding="0" cellspacing="0" style="margin:24px 0;">
                  <tr>
                    <td align="center">
                      <a href="${loginUrl}"
                        style="
                          background-color:#4caf50;
                          color:#ffffff;
                          text-decoration:none;
                          padding:12px 24px;
                          font-size:14px;
                          font-weight:bold;
                          border-radius:6px;
                          display:inline-block;
                        ">
                        Log in to your account
                      </a>
                    </td>
                  </tr>
                </table>

                <p style="font-size:14px; line-height:1.6; color:#374151;">
                  If you did not perform this action or believe this was a mistake,
                  please contact our support team immediately.
                </p>

                <p style="font-size:15px; margin-top:24px;">
                  Best regards,<br />
                  <strong>${appName} Team</strong>
                </p>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td align="center"
                style="background-color:#4caf50; padding:20px; font-size:12px; color:#ffffff;">
                <p style="margin:4px 0;">
                  Need help?
                  <a href="mailto:${supportEmail}" style="color:#ffffff;">
                    ${supportEmail}
                  </a>
                </p>
                <p style="margin:4px 0;">
                  © ${year} ${appName}. All rights reserved.
                </p>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`;
