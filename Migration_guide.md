# Migration Guide for Adding Google Authentication

This guide will walk you through implementing Google authentication in your Prompt Library application. We'll be adding Google OAuth support alongside the existing credentials-based authentication.

## 1. Update Environment Variables

Create a `.env` file in your project root (if it doesn't exist already) and add the following:

```
# PostgreSQL Database URL (Use your existing database URL)
DATABASE_URL="postgresql://username:password@localhost:5432/prompt_library"

# NextAuth Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret" # Generate with: openssl rand -base64 32

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

## 2. Set Up Google OAuth Credentials

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to "APIs & Services" > "Credentials"
4. Click "Create Credentials" > "OAuth client ID"
5. Select "Web application" as the application type
6. Add a name for your application
7. Add authorized JavaScript origins:
   - `http://localhost:3000` (for development)
   - `https://your-production-domain.com` (for production)
8. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (for development)
   - `https://your-production-domain.com/api/auth/callback/google` (for production)
9. Click "Create" and copy the Client ID and Client Secret
10. Add these values to your `.env` file

## 3. Update Schema and Run Migration

1. The schema.prisma file has been updated to include NextAuth models (Account, Session, VerificationToken) and the UserPromptUpvote model for tracking upvotes.

2. Run the migration:

```bash
npx prisma migrate dev --name add_nextauth_models
```

3. Check the migration output and make sure it was successful:

```bash
npx prisma studio
```

## 4. Install Additional Dependencies

```bash
npm install next-auth@latest
```

## 5. Verify Configuration

Make sure your NextAuth configuration in `src/app/api/auth/[...nextauth]/route.ts` has both Google and Credentials providers properly configured.

## 6. Test Authentication

1. Start your development server:

```bash
npm run dev
```

2. Navigate to your sign-in page and try signing in with Google
3. Verify that the user is created in the database and has the appropriate role

## 7. Upvoting Functionality

The upvoting API has been updated to use the new UserPromptUpvote model, ensuring users can only upvote a prompt once.

## Troubleshooting

### Database Issues

If you encounter database errors after migration:

1. Check that your DATABASE_URL is correct
2. Try resetting your database (warning: this will delete all data):
   ```bash
   npx prisma migrate reset
   ```

### Authentication Issues

If users can't sign in with Google:

1. Verify your GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET are correct
2. Make sure your authorized redirect URIs are properly configured
3. Check the browser console and server logs for errors

### NextAuth Configuration

If you encounter issues with NextAuth configuration:

1. Make sure your NEXTAUTH_SECRET and NEXTAUTH_URL are set correctly
2. Verify that your NextAuth callbacks are properly configured

## Additional Resources

- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Google OAuth Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Prisma Documentation](https://www.prisma.io/docs/)