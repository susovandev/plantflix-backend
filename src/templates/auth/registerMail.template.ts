export const registerEmailTemplate = (name: string, otp: string): string => `
  <!DOCTYPE html>
<html lang="en" style="margin:0; padding:0;">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width" />
    <title>Your Verification Code</title>
  </head>

  <body
    style="
      margin: 0;
      padding: 0;
      background-color: #f4f4f7;
      font-family: Arial, Helvetica, sans-serif;
    "
  >
    <table
      width="100%"
      cellpadding="0"
      cellspacing="0"
      style="margin-top: 20px;"
    >
      <tr>
        <td align="center">
          <table
            width="600"
            cellpadding="0"
            cellspacing="0"
            style="
              background: #ffffff;
              border-radius: 10px;
              padding: 30px;
              text-align: center;
              margin: 5px auto;
              box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            "
          >
            <tr>
              <td align="center">
                <h1
                  style="
                    margin: 0;
                    font-size: 24px;
                    font-weight: bold;
                    color: #333333;
                  "
                >
                  Account Verification Request
                </h1>
                <p
                  style="
                    font-size: 16px;
                    margin: 15px 0;
                    color: #555555;
                  "
                >
                  Hello <b>${name}</b>👋,<br />
                  Thank you for registering with us.<br />
                  Please use the OTP below to verify your email address:
                </p>
              </td>
            </tr>

            <tr>
              <td align="center" style="padding: 20px 0;">
                <div
                  style="
                    font-size: 36px;
                    font-weight: bold;
                    letter-spacing: 8px;
                    color: #4caf50;
                    background: #f1fdf3;
                    padding: 15px 30px;
                    border-radius: 8px;
                    border: 1px solid #d2efd2;
                    display: inline-block;
                  "
                >
                  ${otp}
                </div>
              </td>
            </tr>

            <tr>
              <td>
                <p style="font-size: 15px; color: #333333;">
                  This OTP will expire in <strong>3 minutes</strong> for
                  security reasons.<br />
                  If you did not request this, please ignore this email.
                </p>

                <p style="font-size: 15px; margin-top: 25px; color: #555555;">
                  Regards,<br />
                  <strong>Plantflix Team 🪴</strong>
                </p>

                <hr style="margin: 30px 0; opacity: 0.2;" />

                <p
                  style="
                    font-size: 12px;
                    text-align: center;
                    color: #999999;
                  "
                >
                  © 2026 Plantflix. All rights reserved.<br />
                  This is an automated email. Please do not reply.
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
