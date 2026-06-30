# Deployment Guide — GreenMeadow Dairy

Complete step-by-step instructions to deploy this website for your client.

---

## STEP 1 — Set Up Supabase (Free)

### 1.1 Create Account
1. Go to **supabase.com** → "Start your project" → sign up with GitHub or email
2. Click **"New project"**
3. Fill in:
   - **Organization:** your name or "GreenMeadow"
   - **Project name:** `greenmeadow-dairy`
   - **Database password:** make a strong password (save it!)
   - **Region:** pick the closest to Pakistan (e.g. Singapore `ap-southeast-1`)
4. Click **"Create new project"** — wait ~2 minutes for it to set up

### 1.2 Run the Database Schema
1. In your Supabase dashboard, click **"SQL Editor"** (left sidebar)
2. Click **"New query"**
3. Open the file `supabase/schema.sql` from this project
4. Copy ALL its contents and paste into the SQL editor
5. Click **"Run"** (green button)
6. You should see "Success. No rows returned" — this means it worked!

### 1.3 Get Your API Keys
1. Click **"Settings"** (gear icon, left sidebar) → **"API"**
2. Copy these values — you'll need them in Step 3:
   - **Project URL** (looks like `https://xxxx.supabase.co`)
   - **anon public** key (long string starting with `eyJ...`)
   - **service_role secret** key (another long string — keep this SECRET)

### 1.4 Set Up Admin Account
1. In Supabase dashboard → **"Authentication"** → **"Users"**
2. Click **"Invite user"** or **"Add user"**
3. Enter the client's email and a temporary password
4. After creating the user, go to **"SQL Editor"** and run:
   ```sql
   UPDATE public.profiles 
   SET role = 'admin' 
   WHERE id = (SELECT id FROM auth.users WHERE email = 'client@email.com');
   ```
   Replace `client@email.com` with the actual admin email.

---

## STEP 2 — Deploy to Vercel (Free)

### 2.1 Create Vercel Account
1. Go to **vercel.com** → "Sign Up" → choose "Continue with GitHub"
2. Authorize Vercel to access your GitHub

### 2.2 Import Project
1. On Vercel dashboard → click **"Add New…"** → **"Project"**
2. Find **`webapp_farm`** in the list → click **"Import"**
3. Keep all default settings
4. **IMPORTANT:** Before clicking Deploy, click **"Environment Variables"**

### 2.3 Add Environment Variables
Add these one by one (click "Add" after each):

| Name | Value |
|------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase Project URL from Step 1.3 |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your anon public key from Step 1.3 |
| `SUPABASE_SERVICE_ROLE_KEY` | Your service_role key from Step 1.3 |
| `NEXT_PUBLIC_SITE_URL` | `https://your-project.vercel.app` (fill after first deploy) |

5. Click **"Deploy"** — wait ~3 minutes
6. You'll get a URL like `https://webapp-farm-xyz.vercel.app` — open it to verify it works!

### 2.4 Update Site URL
After the first deploy:
1. Go to Vercel → your project → **"Settings"** → **"Environment Variables"**
2. Update `NEXT_PUBLIC_SITE_URL` to your actual Vercel URL
3. Also update it in Supabase → **"Authentication"** → **"URL Configuration"**:
   - **Site URL:** your Vercel URL
   - **Redirect URLs:** `https://your-project.vercel.app/**`
4. Redeploy: Vercel → your project → **"Deployments"** → click latest → **"Redeploy"**

---

## STEP 3 — Buy a Custom Domain (Optional but Recommended)

### Option A: Namecheap (Recommended — cheapest)
1. Go to **namecheap.com**
2. Search for the domain you want, e.g. `greenmeadowdairy.com` or `greenmeadow.pk`
3. `.com` domains cost ~$10-15/year; `.pk` domains cost ~PKR 2,000-3,000/year
4. Add to cart → checkout → create account → pay

### Option B: .pk Domain
1. Go to **pknic.net.pk** — the official Pakistan domain registry
2. Search for `yourfarmname.pk` — PKR ~1,500-2,500/year
3. Contact a registrar like **Hosting.com.pk** or **Navicosoft.com** to register

### 3.1 Connect Domain to Vercel
1. In Vercel → your project → **"Settings"** → **"Domains"**
2. Type your domain (e.g. `greenmeadowdairy.com`) → **"Add"**
3. Vercel will show you DNS records to add
4. Go to your domain registrar (Namecheap/etc) → **DNS Settings**
5. Add the records Vercel shows (usually an A record and CNAME)
6. Wait 10-30 minutes for DNS to propagate

### 3.2 Update URLs for Custom Domain
After connecting:
1. Update `NEXT_PUBLIC_SITE_URL` in Vercel to `https://greenmeadowdairy.com`
2. Update Supabase redirect URLs to include `https://greenmeadowdairy.com/**`
3. Redeploy on Vercel

---

## STEP 4 — Future Updates

When you make code changes:
```bash
git add .
git commit -m "describe what you changed"
git push
```
Vercel automatically redeploys within ~2 minutes whenever you push to GitHub.

---

## STEP 5 — Enable Email Auth in Supabase

By default Supabase sends confirmation emails. To configure:
1. Supabase → **"Authentication"** → **"Providers"** → **"Email"**
2. For testing: turn OFF **"Confirm email"** (so users can register immediately)
3. For production: turn it ON and configure SMTP with your email provider

---

## Troubleshooting

**"Page not found" errors after deploy:**
- Check that all environment variables are set correctly in Vercel
- Make sure `NEXT_PUBLIC_SITE_URL` matches your actual URL exactly

**"Invalid login credentials":**
- Make sure the user was created in Supabase Auth (not just profiles table)

**"Row Level Security" errors:**
- Make sure you ran the full `supabase/schema.sql` — it sets up all RLS policies

**Cart/checkout not working:**
- Check Supabase logs: Supabase dashboard → "Logs" → "Database"

**Need to reset admin password:**
- Supabase → "Authentication" → "Users" → find user → "Send recovery email"

---

## Summary Checklist

- [ ] Supabase project created
- [ ] `supabase/schema.sql` executed successfully
- [ ] Admin user created and role set to 'admin'
- [ ] Vercel project imported from GitHub
- [ ] All 4 environment variables added in Vercel
- [ ] Site URL updated in Vercel + Supabase after first deploy
- [ ] Custom domain purchased (optional)
- [ ] Custom domain connected to Vercel (optional)
- [ ] Test: register as customer, place an order
- [ ] Test: register as farm, request silage quote
- [ ] Test: log in as admin, manage products and view orders
