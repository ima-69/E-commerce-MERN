const nodemailer = require('nodemailer');

// Create transporter for sending emails
const createTransporter = () => {
  return nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

// Send password reset email
const sendPasswordResetEmail = async (email, resetToken, firstName) => {
  try {
    const transporter = createTransporter();
    
    const resetUrl = `${process.env.VITE_FRONTEND_URL}/auth/reset-password?token=${resetToken}`;
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset Request - Shopzy',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background-color: #f8f9fa; padding: 30px; border-radius: 10px; text-align: center;">
            <h2 style="color: #333; margin-bottom: 20px;">Password Reset Request</h2>
            <p style="color: #666; font-size: 16px; line-height: 1.6;">
              Hello ${firstName},
            </p>
            <p style="color: #666; font-size: 16px; line-height: 1.6;">
              We received a request to reset your password for your Shopzy account.
            </p>
            <p style="color: #666; font-size: 16px; line-height: 1.6;">
              Click the button below to reset your password:
            </p>
            <div style="margin: 30px 0;">
              <a href="${resetUrl}" 
                 style="background-color: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
                Reset Password
              </a>
            </div>
            <p style="color: #666; font-size: 14px; line-height: 1.6;">
              If the button doesn't work, copy and paste this link into your browser:
            </p>
            <p style="color: #007bff; font-size: 14px; word-break: break-all;">
              ${resetUrl}
            </p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
            <p style="color: #999; font-size: 12px; line-height: 1.6;">
              This link will expire in 1 hour for security reasons.
            </p>
            <p style="color: #999; font-size: 12px; line-height: 1.6;">
              If you didn't request this password reset, please ignore this email.
            </p>
            <p style="color: #999; font-size: 12px; line-height: 1.6;">
              Best regards,<br>
              Shopzy Team
            </p>
          </div>
        </div>
      `,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Password reset email sent successfully:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Error sending password reset email:', error);
    return { success: false, error: error.message };
  }
};

// Send password reset confirmation email
const sendPasswordResetConfirmation = async (email, firstName) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset Successful - Shopzy',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background-color: #f8f9fa; padding: 30px; border-radius: 10px; text-align: center;">
            <h2 style="color: #28a745; margin-bottom: 20px;">Password Reset Successful</h2>
            <p style="color: #666; font-size: 16px; line-height: 1.6;">
              Hello ${firstName},
            </p>
            <p style="color: #666; font-size: 16px; line-height: 1.6;">
              Your password has been successfully reset for your Shopzy account.
            </p>
            <p style="color: #666; font-size: 16px; line-height: 1.6;">
              You can now log in with your new password.
            </p>
            <div style="margin: 30px 0;">
              <a href="${process.env.VITE_FRONTEND_URL}/auth/login" 
                 style="background-color: #28a745; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
                Login to Your Account
              </a>
            </div>
            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
            <p style="color: #999; font-size: 12px; line-height: 1.6;">
              If you didn't make this change, please contact our support team immediately.
            </p>
            <p style="color: #999; font-size: 12px; line-height: 1.6;">
              Best regards,<br>
              Shopzy Team
            </p>
          </div>
        </div>
      `,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Password reset confirmation email sent successfully:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Error sending password reset confirmation email:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendPasswordResetEmail,
  sendPasswordResetConfirmation,
};
