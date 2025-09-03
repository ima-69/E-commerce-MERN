# Forgot Password Feature Setup Guide - Shopzy

## Overview
The forgot password feature has been successfully implemented with email-based password reset functionality for Shopzy.

## Features Implemented

### ✅ **Backend Features:**
- **User Model Updates**: Added `resetPasswordToken` and `resetPasswordExpires` fields
- **Email Service**: Created comprehensive email service with Nodemailer
- **API Endpoints**:
  - `POST /api/auth/forgot-password` - Request password reset
  - `POST /api/auth/reset-password` - Reset password with token
  - `GET /api/auth/verify-reset-token/:token` - Verify reset token validity
- **Security Features**:
  - Secure token generation using crypto.randomBytes
  - Token expiration (1 hour)
  - Password validation and hashing
  - Email confirmation after password reset

### ✅ **Frontend Features:**
- **Forgot Password Page**: Modern UI for requesting password reset
- **Reset Password Page**: Secure password reset with token validation
- **Password Strength Indicator**: Real-time password strength feedback
- **Form Validation**: Comprehensive client-side validation
- **Error Handling**: User-friendly error messages and loading states
- **Responsive Design**: Works on all screen sizes

## Email Configuration

### Required Environment Variables
Add these to your `server/.env` file:

```env
# Email Configuration
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Frontend URL (for reset links)
FRONTEND_URL=http://localhost:3000
```

### Gmail Setup (Recommended)
1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate App Password**:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate password for "Mail"
   - Use this password as `EMAIL_PASS`

### Alternative Email Services
The system supports any Nodemailer-compatible service:
- **Outlook**: `EMAIL_SERVICE=hotmail`
- **Yahoo**: `EMAIL_SERVICE=yahoo`
- **Custom SMTP**: Configure with host, port, secure settings

## Installation

### 1. Install Dependencies
```bash
cd server
npm install nodemailer crypto
```

### 2. Update Environment Variables
Copy the email configuration to your `server/.env` file.

### 3. Test Email Service
Start the server and test the forgot password flow:
```bash
cd server
npm start
```

## Usage Flow

### 1. **Request Password Reset**
- User clicks "Forgot your password?" on login page
- Enters email address
- System sends reset email with secure token

### 2. **Reset Password**
- User clicks link in email
- System validates token and shows reset form
- User enters new password with strength validation
- Password is updated and confirmation email sent

### 3. **Security Features**
- Tokens expire after 1 hour
- Tokens are single-use (cleared after reset)
- Password strength requirements enforced
- Email confirmation for successful reset

## API Endpoints

### Request Password Reset
```http
POST /api/auth/forgot-password
Content-Type: application/json

{
  "email": "user@example.com"
}
```

### Reset Password
```http
POST /api/auth/reset-password
Content-Type: application/json

{
  "token": "reset-token-from-email",
  "newPassword": "newSecurePassword123!"
}
```

### Verify Reset Token
```http
GET /api/auth/verify-reset-token/:token
```

## Email Templates

The system includes two professional email templates:

1. **Password Reset Request**: Contains secure reset link
2. **Password Reset Confirmation**: Confirms successful password change

Both emails include:
- Professional styling
- Clear instructions
- Security information
- Branded design

## Security Considerations

- ✅ **Token Security**: Cryptographically secure random tokens
- ✅ **Token Expiration**: 1-hour expiration for security
- ✅ **Single Use**: Tokens are cleared after use
- ✅ **Password Validation**: Strong password requirements
- ✅ **Email Verification**: Confirmation emails for all actions
- ✅ **Error Handling**: No information leakage in error messages

## Testing

### Test the Complete Flow:
1. Go to `/auth/login`
2. Click "Forgot your password?"
3. Enter a registered email address
4. Check email for reset link
5. Click link and reset password
6. Verify you can login with new password

### Test Error Cases:
- Invalid email address
- Expired reset token
- Weak password
- Invalid reset link

## Troubleshooting

### Email Not Sending
- Check email credentials in `.env`
- Verify 2FA is enabled for Gmail
- Check app password is correct
- Check server logs for errors

### Reset Link Not Working
- Verify `FRONTEND_URL` in environment
- Check token hasn't expired
- Ensure user exists in database

### Password Reset Failing
- Check password meets requirements
- Verify token is valid and not expired
- Check server logs for errors

## Support

The forgot password feature is now fully integrated and ready for production use. All security best practices have been implemented to ensure a safe and user-friendly password reset experience.
