export const resetPasswordTemplate = ({ link, userName }: { link: string; userName: string }) => {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <title>Reset Your Password</title>
      </head>
      <body>
        <div style="max-width: 600px; margin: 0 auto;">
          <h1>Reset Your Password</h1>
          <p>Dear ${userName},</p>
          <p>We received a request to reset your password for your LostFish account. To proceed with the password reset process, please click on the link below:</p>
          <p><a href="${link}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: #fff; text-decoration: none;">Reset Password</a></p>
          <p>If you did not initiate this request, please ignore this email. Your password will remain unchanged.</p>
          <p>Please note that this link is valid for 24 hours. After that, you will need to request a new password reset link.</p>
          <p>If you have any questions or need further assistance, please don't hesitate to contact our support team at <a href="mailto:[Support Email]">[Support Email]</a> or visit our website at <a href="[Your App Website]">[Your App Website]</a>.</p>
          <p>Thank you,</p>
          <p>The LostFish Team</p>
        </div>
      </body>
    </html>
  `;

  const text = ``;
  return {
    html,
    text
  };
};
