const nodemailer = require('nodemailer');

// Create transporter for sending emails
const createTransporter = () => {
  console.log('Creating email transporter with config:', {
    service: process.env.EMAIL_SERVICE || 'gmail',
    user: process.env.EMAIL_USER ? 'configured' : 'missing',
    pass: process.env.EMAIL_PASS ? 'configured' : 'missing'
  });
  
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

// Send order confirmation email
const sendOrderConfirmationEmail = async (email, firstName, orderData) => {
  try {
    console.log('Sending order confirmation email to:', email);
    console.log('Order data:', {
      orderId: orderData._id,
      totalAmount: orderData.totalAmount,
      itemsCount: orderData.cartItems?.length
    });
    
    const transporter = createTransporter();
    
    const orderItems = orderData.cartItems.map(item => `
      <tr style="border-bottom: 1px solid #eee;">
        <td style="padding: 15px; text-align: left;">${item.title}</td>
        <td style="padding: 15px; text-align: center;">${item.quantity}</td>
        <td style="padding: 15px; text-align: right;">$${item.price}</td>
        <td style="padding: 15px; text-align: right;">$${(item.price * item.quantity).toFixed(2)}</td>
      </tr>
    `).join('');

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: `Order Confirmation #${orderData._id.slice(-8)} - Shopzy`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background-color: #f8f9fa; padding: 30px; border-radius: 10px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h2 style="color: #28a745; margin-bottom: 10px;">Order Confirmed!</h2>
              <p style="color: #666; font-size: 16px;">Thank you for your purchase, ${firstName}!</p>
            </div>
            
            <div style="background-color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h3 style="color: #333; margin-bottom: 15px;">Order Details</h3>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 20px;">
                <div>
                  <strong>Order ID:</strong><br>
                  <span style="color: #666;">#${orderData._id.slice(-8)}</span>
                </div>
                <div>
                  <strong>Order Date:</strong><br>
                  <span style="color: #666;">${new Date(orderData.orderDate).toLocaleDateString()}</span>
                </div>
                <div>
                  <strong>Status:</strong><br>
                  <span style="color: #28a745; font-weight: bold;">${orderData.orderStatus.charAt(0).toUpperCase() + orderData.orderStatus.slice(1)}</span>
                </div>
                <div>
                  <strong>Payment Method:</strong><br>
                  <span style="color: #666;">${orderData.paymentMethod.charAt(0).toUpperCase() + orderData.paymentMethod.slice(1)}</span>
                </div>
              </div>
            </div>

            <div style="background-color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h3 style="color: #333; margin-bottom: 15px;">Order Items</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <thead>
                  <tr style="background-color: #f8f9fa;">
                    <th style="padding: 15px; text-align: left; border-bottom: 2px solid #dee2e6;">Item</th>
                    <th style="padding: 15px; text-align: center; border-bottom: 2px solid #dee2e6;">Qty</th>
                    <th style="padding: 15px; text-align: right; border-bottom: 2px solid #dee2e6;">Price</th>
                    <th style="padding: 15px; text-align: right; border-bottom: 2px solid #dee2e6;">Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${orderItems}
                </tbody>
                <tfoot>
                  <tr style="background-color: #f8f9fa; font-weight: bold;">
                    <td colspan="3" style="padding: 15px; text-align: right; border-top: 2px solid #dee2e6;">Total Amount:</td>
                    <td style="padding: 15px; text-align: right; border-top: 2px solid #dee2e6; color: #28a745; font-size: 18px;">$${orderData.totalAmount}</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <div style="background-color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h3 style="color: #333; margin-bottom: 15px;">Shipping Information</h3>
              <div style="color: #666; line-height: 1.6;">
                <p><strong>Address:</strong> ${orderData.addressInfo.address}</p>
                <p><strong>City:</strong> ${orderData.addressInfo.city}</p>
                <p><strong>Pincode:</strong> ${orderData.addressInfo.pincode}</p>
                <p><strong>Phone:</strong> ${orderData.addressInfo.phone}</p>
                ${orderData.addressInfo.notes ? `<p><strong>Notes:</strong> ${orderData.addressInfo.notes}</p>` : ''}
              </div>
            </div>

            <div style="text-align: center; margin-top: 30px;">
              <a href="${process.env.VITE_FRONTEND_URL}/shop/account?tab=orders" 
                 style="background-color: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block; margin-right: 10px;">
                View Order Details
              </a>
              <a href="${process.env.VITE_FRONTEND_URL}/shop/listing" 
                 style="background-color: #6c757d; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
                Continue Shopping
              </a>
            </div>

            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
            <div style="text-align: center; color: #999; font-size: 12px;">
              <p>We'll send you another email when your order ships.</p>
              <p>If you have any questions, please contact our support team.</p>
              <p>Best regards,<br>Shopzy Team</p>
            </div>
          </div>
        </div>
      `,
    };

    console.log('Attempting to send email with options:', {
      from: mailOptions.from,
      to: mailOptions.to,
      subject: mailOptions.subject
    });
    
    const result = await transporter.sendMail(mailOptions);
    console.log('✅ Order confirmation email sent successfully:', result.messageId);
    console.log('Email response:', result.response);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('❌ Error sending order confirmation email:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      command: error.command,
      response: error.response
    });
    return { success: false, error: error.message };
  }
};

// Send order status update email
const sendOrderStatusUpdateEmail = async (email, firstName, orderData, newStatus) => {
  try {
    console.log('Sending order status update email to:', email);
    console.log('Order status:', newStatus);
    
    const transporter = createTransporter();
    
    const statusMessages = {
      'pending': 'Your order is being processed',
      'confirmed': 'Your order has been confirmed',
      'inProcess': 'Your order is being prepared',
      'inShipping': 'Your order has been shipped',
      'delivered': 'Your order has been delivered',
      'rejected': 'Your order has been rejected'
    };

    const statusColors = {
      'pending': '#ffc107',
      'confirmed': '#28a745',
      'inProcess': '#17a2b8',
      'inShipping': '#007bff',
      'delivered': '#28a745',
      'rejected': '#dc3545'
    };

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: `Order Status Update #${orderData._id.slice(-8)} - Shopzy`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background-color: #f8f9fa; padding: 30px; border-radius: 10px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h2 style="color: ${statusColors[newStatus]}; margin-bottom: 10px;">Order Status Update</h2>
              <p style="color: #666; font-size: 16px;">${statusMessages[newStatus]}, ${firstName}!</p>
            </div>
            
            <div style="background-color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h3 style="color: #333; margin-bottom: 15px;">Order Details</h3>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 20px;">
                <div>
                  <strong>Order ID:</strong><br>
                  <span style="color: #666;">#${orderData._id.slice(-8)}</span>
                </div>
                <div>
                  <strong>New Status:</strong><br>
                  <span style="color: ${statusColors[newStatus]}; font-weight: bold; text-transform: capitalize;">${newStatus.replace(/([A-Z])/g, ' $1').trim()}</span>
                </div>
                <div>
                  <strong>Order Date:</strong><br>
                  <span style="color: #666;">${new Date(orderData.orderDate).toLocaleDateString()}</span>
                </div>
                <div>
                  <strong>Total Amount:</strong><br>
                  <span style="color: #666; font-weight: bold;">$${orderData.totalAmount}</span>
                </div>
              </div>
            </div>

            <div style="text-align: center; margin-top: 30px;">
              <a href="${process.env.VITE_FRONTEND_URL}/shop/account?tab=orders" 
                 style="background-color: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
                View Order Details
              </a>
            </div>

            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
            <div style="text-align: center; color: #999; font-size: 12px;">
              <p>If you have any questions about your order, please contact our support team.</p>
              <p>Best regards,<br>Shopzy Team</p>
            </div>
          </div>
        </div>
      `,
    };

    console.log('Attempting to send order status update email...');
    const result = await transporter.sendMail(mailOptions);
    console.log('✅ Order status update email sent successfully:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('❌ Error sending order status update email:', error);
    return { success: false, error: error.message };
  }
};

// Simple email test function
const testEmail = async () => {
  try {
    console.log("=== EMAIL SYSTEM TEST ===");
    console.log("EMAIL_SERVICE:", process.env.EMAIL_SERVICE || 'gmail');
    console.log("EMAIL_USER:", process.env.EMAIL_USER ? "✅ Set" : "❌ Missing");
    console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? "✅ Set" : "❌ Missing");
    console.log("VITE_FRONTEND_URL:", process.env.VITE_FRONTEND_URL || "❌ Missing");
    
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.log("❌ Email configuration incomplete");
      return { success: false, message: "Email configuration incomplete" };
    }
    
    const transporter = createTransporter();
    await transporter.verify();
    console.log("✅ Email system ready");
    return { success: true, message: "Email system ready" };
  } catch (error) {
    console.error("❌ Email test failed:", error.message);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendPasswordResetEmail,
  sendPasswordResetConfirmation,
  sendOrderConfirmationEmail,
  sendOrderStatusUpdateEmail,
  testEmail,
};
