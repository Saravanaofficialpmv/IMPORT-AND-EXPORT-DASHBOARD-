# Demo Users - FleetTrack Pro GPS Dashboard

## Demo User Credentials

The following demo accounts are available for testing the application:

### 1. **Admin Account**
   - **Email**: `admin@gps.com`
   - **Password**: `password123`
   - **Role**: Admin
   - **Access**: Full access to dashboard, all analytics, user management

### 2. **Manager Account**
   - **Email**: `manager@gps.com`
   - **Password**: `password123`
   - **Role**: Manager
   - **Access**: Vehicle management, trip management, team oversight

### 3. **Driver Account**
   - **Email**: `driver1@gps.com`
   - **Password**: `password123`
   - **Role**: Driver
   - **Access**: Live tracking, trip status, personal profile

## Quick Demo Access

On the login page, there are quick demo buttons for each role. Simply click the corresponding button to auto-fill credentials and log in immediately.

## Creating Demo Users

### Option 1: Using Quick Demo Buttons (Recommended)
1. Go to `/login` page
2. Scroll down to "Quick Demo Access" section
3. Click the desired role button (Admin, Manager, or Driver)
4. You will be automatically signed in and redirected to your role-specific dashboard

### Option 2: Manual Signup
1. Go to `/signup` page
2. Fill in the form with your details
3. Select your role from the dropdown
4. Click "Create Account"
5. You will be redirected to login page to sign in with your credentials

### Option 3: Using Login Page
1. Go to `/login` page
2. Enter one of the demo credentials above
3. Click "Sign In"
4. You will be automatically redirected to your role-specific dashboard

## Dashboard Routes by Role

After login, users are redirected to their role-specific dashboard:

- **Admin**: `/dashboard` - Main dashboard with all analytics
- **Manager**: `/dashboard/vehicles` - Vehicle management interface
- **Driver**: `/dashboard/tracking` - Real-time vehicle tracking

## Password Policy

Demo accounts use the same password for simplicity: `password123`

**Note**: In production, each user would have their own unique password and use proper authentication protocols.

## Testing Authentication Flow

1. **Test Login**: Use any demo account credentials
2. **Test Role-Based Redirect**: Each role redirects to appropriate dashboard
3. **Test Logout**: Click logout button to return to login
4. **Test Session**: Session is maintained during your session
5. **Test Remember Me**: Check "Remember me" option for persistent login

## Troubleshooting

### "Email already registered" error
- Demo users may already exist in your database
- Use the provided credentials to log in instead
- If needed, you can create additional test accounts via `/signup`

### Login redirects to dashboard but then redirects back to login
- Check that your `NEXTAUTH_URL` environment variable is properly set
- Verify Supabase credentials in `.env.local`
- Clear browser cookies and try again

### Demo buttons not working
- Ensure you're on the `/login` page
- Try manually entering credentials instead
- Check browser console for errors

## Environment Variables

Ensure these are set in your `.env.local`:

```
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## Demo Data Notes

- Demo users have fixed credentials for ease of testing
- Each user can manage their own data
- Demo data persists across sessions
- To reset demo users, run the database migration scripts again
