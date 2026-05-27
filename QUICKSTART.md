# SciWave Frontend - Quick Start Guide 🚀

## What You Need Before Starting

1. **Backend running**: Your sciwave-backend should be running on `http://localhost:3001`
2. **Supabase account**: Free tier works fine
3. **Node.js 18+**: Check with `node --version`

## Step-by-Step Setup

### 1. Get Your Supabase Credentials

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Create a new project
3. Go to **Project Settings** → **API**
4. Copy these two values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon/public key** (long string starting with `eyJ...`)

### 2. Configure the Frontend

The project is already created at `/home/claude/sciwave-frontend`. Now:

```bash
cd sciwave-frontend

# Create your environment file
cp .env.local.example .env.local

# Edit .env.local with your credentials
nano .env.local  # or use your preferred editor
```

Paste your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...your-long-key
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### 3. Install & Run

```bash
# Install dependencies (this might take a minute)
npm install

# Start the development server
npm run dev
```

The app will be available at:
- Spanish: [http://localhost:3000/es](http://localhost:3000/es)
- Portuguese: [http://localhost:3000/pt](http://localhost:3000/pt)

## Testing the Login

You'll need to create a test user in Supabase:

1. Go to your Supabase dashboard
2. Click **Authentication** → **Users**
3. Click **Add User** → **Create new user**
4. Enter an email and password
5. Use these credentials to test the login at `/es/auth/login`

## Common Issues

### "Failed to fetch resources"
- ✅ Make sure your backend is running on port 3001
- ✅ Check that your backend has articles in the database
- ✅ Verify the API_URL in `.env.local` is correct

### "Supabase error"
- ✅ Double-check your Supabase URL and anon key
- ✅ Make sure you created a user in the Supabase dashboard
- ✅ Verify the credentials match what you're entering in the login form

### "Module not found"
- ✅ Run `npm install` again
- ✅ Delete `node_modules` and `.next` folders, then reinstall

## Project Structure Quick Reference

```
sciwave-frontend/
├── app/[locale]/              # Pages (ES/PT routing)
│   ├── page.tsx              # Home with article grid
│   ├── articles/[id]/        # Article detail
│   └── auth/login/           # Login page
├── components/               # Reusable UI components
├── lib/                      # API & Supabase clients
├── messages/                 # ES/PT translations
└── .env.local               # Your secret credentials (NOT committed to git)
```

## Next Steps

1. **Add articles**: Use your backend to add some test articles
2. **Add categories**: Create categories through your backend
3. **Test language switching**: Click the ES/PT button in the navbar
4. **Customize design**: Edit the Tailwind classes in components

## Need Help?

- Frontend code is in `/home/claude/sciwave-frontend`
- Check the main `README.md` for detailed documentation
- Look at the code comments for explanations

Happy coding! 🌊
