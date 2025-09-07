# Auth0 Logout Implementation

This document explains the Auth0 logout functionality implemented in the MERN e-commerce system.

## Overview

The system now supports proper logout functionality for both regular users and Auth0 users. The logout process automatically detects the authentication method and handles logout accordingly.

## Implementation Details

### 1. Backend (Server)

**File**: `server/routes/auth0/auth0.js`

- **Route**: `GET /api/auth0/logout`
- **Functionality**:
  - Clears the server session
  - Clears the authentication cookie (`token`)
  - Redirects to Auth0's logout URL with proper return URL
  - Handles errors gracefully by redirecting to home page

### 2. Frontend (Client)

#### Auth Slice (`client/src/store/auth-slice/index.js`)

The `logoutUser` action now:
- Detects Auth0 users by checking if `userName` starts with `'auth0|'`
- For Auth0 users: Redirects to the Auth0 logout endpoint
- For regular users: Uses the standard logout API call
- Clears localStorage for regular users

#### Header Components

**Files**:
- `client/src/components/admin-view/header.jsx`
- `client/src/components/shopping-view/header.jsx`

Both header components now:
- Use async logout handlers
- Wait for logout completion before navigation
- Handle Auth0 redirects properly
- Provide fallback navigation on errors

#### Login Page (`client/src/pages/auth/login.jsx`)

The login page now:
- Shows different content for authenticated users
- Displays the authentication method (Auth0 vs regular)
- Provides logout functionality for already authenticated users
- Maintains consistent user experience

## How It Works

### For Auth0 Users

1. User clicks logout button
2. System detects Auth0 user by `userName` pattern
3. Frontend redirects to `/api/auth0/logout`
4. Backend clears session and cookies
5. Backend redirects to Auth0 logout URL
6. Auth0 handles the logout and redirects back to home page

### For Regular Users

1. User clicks logout button
2. System detects regular user
3. Frontend calls standard logout API
4. Backend clears session and cookies
5. Frontend navigates to home page

## User Experience

- **Seamless**: Users don't need to know which authentication method they used
- **Consistent**: Same logout button works for both authentication types
- **Secure**: Proper session and cookie cleanup
- **Reliable**: Error handling with fallback navigation

## Testing

To test the Auth0 logout functionality:

1. **Auth0 Login**: Use the "Sign in with Auth0" button on the login page
2. **Verify Detection**: Check that the user's `userName` starts with `'auth0|'`
3. **Test Logout**: Click any logout button (header, dropdown menu, or login page)
4. **Verify Redirect**: Should redirect to Auth0 logout and then back to home page
5. **Verify Cleanup**: Check that cookies are cleared and user is logged out

## Configuration

The Auth0 logout URL is configured with:
- **Client ID**: From environment variable `AUTH0_CLIENT_ID`
- **Domain**: From environment variable `AUTH0_DOMAIN`
- **Return URL**: `http://localhost:5173` (frontend URL)

Make sure these environment variables are properly set in your `.env` file.

## Security Considerations

- Cookies are cleared on both client and server side
- Auth0 logout ensures complete session termination
- Error handling prevents authentication state inconsistencies
- Proper redirect URLs prevent open redirect vulnerabilities
