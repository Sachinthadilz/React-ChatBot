# Supabase Setup - Automated Database Migration

## Option 1: Manual Setup (Recommended for First Time)

1. Go to Supabase Dashboard → SQL Editor
2. Copy the contents of `supabase/migrations/20260126_initial_schema.sql`
3. Paste and run in SQL Editor
4. Done! ✅

## Option 2: Automated Setup (Using Supabase CLI)

### Install Supabase CLI

```bash
npm install -g supabase
```

### Login to Supabase

```bash
supabase login
```

### Link to Your Project

```bash
supabase link --project-ref YOUR_PROJECT_REF
```

(Find your project ref in Supabase Dashboard → Settings → General)

### Run Migrations

```bash
supabase db push
```

This will automatically apply all migrations in the `supabase/migrations` folder.

## Option 3: Using the Setup Script (Advanced)

### Prerequisites

1. Get your Supabase Service Role Key:
   - Go to Supabase Dashboard → Settings → API
   - Copy the `service_role` key (⚠️ Keep this secret!)

2. Add to `.env`:
```env
SUPABASE_SERVICE_KEY=your-service-role-key
```

### Run Setup

```bash
node supabase/setup.js
```

⚠️ **Warning:** The service role key bypasses Row Level Security. Never expose it in client-side code!

## Verifying Setup

After running migrations, verify in Supabase Dashboard:

1. Go to **Table Editor**
2. You should see:
   - `chats` table
   - `messages` table
3. Click on each table to verify columns and RLS policies

## Troubleshooting

### "Table already exists" error
- This is fine! The migration uses `IF NOT EXISTS` to prevent errors
- Your existing tables won't be affected

### "Permission denied" error
- Make sure you're using the service role key, not the anon key
- Or use the Supabase dashboard SQL Editor instead

### Migration not applying
- Check that the SQL file exists in `supabase/migrations/`
- Verify your Supabase credentials are correct

## For New Developers

When someone clones your repository:

1. They copy `.env.example` to `.env`
2. They add their Supabase credentials
3. They run the migration (using any option above)
4. Database is ready to use!

## Migration Files

- `20260126_initial_schema.sql` - Creates tables, indexes, and RLS policies
- Future migrations can be added with timestamps: `YYYYMMDD_description.sql`

---

**Recommended:** For first-time setup, use Option 1 (manual). It's the simplest and most reliable.
