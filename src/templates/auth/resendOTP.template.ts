export interface IResendOtpTemplate {
	firstName: string;
	appName: string;
	otp: string;
	expiryMinutes: number;
	supportEmail: string;
	year: number;
}

export const resendOtpEmailTemplate = ({
	firstName,
	appName,
	otp,
	expiryMinutes,
	supportEmail,
	year,
}: IResendOtpTemplate) => {
	return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Resend OTP</title>

    <style>
      body {
        margin: 0;
        padding: 0;
        background-color: #f4f6f8;
        font-family: Arial, Helvetica, sans-serif;
        color: #333333;
      }

      table {
        border-collapse: collapse;
      }

      .wrapper {
        width: 100%;
        padding: 24px 0;
      }

      .container {
        max-width: 600px;
        margin: 0 auto;
        background-color: #ffffff;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
      }

      .header {
        background-color: #27ee5cff;
        padding: 20px;
        text-align: center;
        color: #ffffff;
      }

      .header h1 {
        margin: 0;
        font-size: 22px;
        font-weight: bold;
      }

      .body {
        padding: 32px 24px;
      }

      .body h2 {
        margin: 0 0 12px 0;
        font-size: 20px;
        color: #111827;
      }

      .body p {
        font-size: 15px;
        line-height: 1.6;
        margin: 12px 0;
        color: #374151;
      }

      .otp-box {
        margin: 24px 0;
        padding: 16px 0;
        background-color: #f3f4f6;
        border-radius: 6px;
        text-align: center;
        font-size: 28px;
        font-weight: bold;
        letter-spacing: 6px;
        color: #111827;
      }

      .footer {
        padding: 20px;
        background-color: #27ee5cff;
        font-size: 12px;
        color: #6b7280;
        text-align: center;
      }

      .footer p {
        margin: 6px 0;
      }

      .footer a {
        color: #27ee5cff;
        text-decoration: none;
      }

      @media (max-width: 600px) {
        .body {
          padding: 24px 16px;
        }

        .otp-box {
          font-size: 24px;
          letter-spacing: 4px;
        }
      }
    </style>
  </head>

  <body>
    <div class="wrapper">
      <div class="container">
        <!-- Header -->
        <div class="header">
          <h1>${appName}</h1>
        </div>

        <!-- Body -->
        <div class="body">
          <h2>Hello ${firstName},</h2>

          <p>
            You recently requested to resend your One-Time Password (OTP).
            Please use the code below to continue.
          </p>

          <div class="otp-box">${otp}</div>

          <p>
            This OTP is valid for
            <strong>${expiryMinutes} minutes</strong>.
            For your security, please do not share this code with anyone.
          </p>

          <p>
            If you did not request this OTP, you can safely ignore this email
            or contact our support team.
          </p>

          <p>
            Best regards,<br />
            <strong>${appName} Team</strong>
          </p>
        </div>

        <!-- Footer -->
        <div class="footer">
          <p>
            Need help?
            <a href="mailto:${supportEmail}">${supportEmail}</a>
          </p>
          <p>&copy; ${year} ${appName}. All rights reserved.</p>
          <p>This is an automated email. Please do not reply.</p>
        </div>
      </div>
    </div>
  </body>
</html>
`;
};
