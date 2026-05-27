# SciWave Frontend - Project Summary

## ✅ What's Been Built

A complete Next.js frontend for your SciWave scientific article repository with:

### Core Features
- ✅ **Bilingual UI** (Spanish/Portuguese) with seamless language switching
- ✅ **Article browsing** with card grid layout
- ✅ **Category filtering** via sidebar
- ✅ **Article detail pages** with clean, centered reading layout
- ✅ **User authentication** using Supabase (client-side)
- ✅ **Ocean blue theme** with modern, minimalist design
- ✅ **Fully responsive** (mobile, tablet, desktop)

### Pages Created
1. **Home** (`/es`, `/pt`) - Article grid with category filter sidebar
2. **Article Detail** (`/es/articles/:id`, `/pt/articles/:id`) - Reading page
3. **Login** (`/es/auth/login`, `/pt/auth/login`) - Authentication form

### Tech Stack
- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- next-intl (for ES/PT switching)
- Supabase (authentication)
- Clean, semantic HTML

## 📁 Project Location

The complete project is at: `/home/claude/sciwave-frontend/`

## 🎨 Design Highlights

### Color Scheme
- **Primary**: Blue-600, Blue-700 (ocean theme)
- **Background**: Gray-50 (light neutral)
- **Cards**: White with subtle shadows
- **Text**: Gray-900 (dark, readable)

### Layout
- **Navbar**: Sticky, blue gradient, logo + language switcher + login
- **Home**: Sidebar (categories) + main grid (3 cols on desktop)
- **Article**: Max-width centered column for readability
- **Cards**: Title + category tag + 3-line preview + "Read more"

## 🔌 Backend Integration

The frontend expects these endpoints from your NestJS backend:

```typescript
GET /:langCode/resources              // List articles
GET /:langCode/resources/:id          // Single article
GET /:langCode/categories             // Categories for filter
POST /auth/login                       // Authentication
```

Expected data structure:
```typescript
interface Resource {
  id: string;
  title: string;
  content: string;
  category: { id: string; name: string; };
  language: { id: string; code: string; name: string; };
  status: string;
}
```

## 🌐 How Language Switching Works

1. **URL-based**: `/es/articles/123` vs `/pt/articles/123`
2. **UI translations**: Buttons, labels from `messages/es.json` or `messages/pt.json`
3. **API calls**: Automatically use correct langCode (`/es/resources` vs `/pt/resources`)
4. **Navbar toggle**: ES ↔ PT button switches both UI and content

## 🚀 Getting Started

### Prerequisites
```bash
# You need:
- Node.js 18+
- sciwave-backend running on localhost:3001
- Supabase account (free tier)
```

### Setup Steps
```bash
cd sciwave-frontend

# 1. Copy environment template
cp .env.local.example .env.local

# 2. Edit .env.local with your Supabase credentials
# (Get these from supabase.com dashboard)

# 3. Install dependencies
npm install

# 4. Run development server
npm run dev

# 5. Visit http://localhost:3000/es
```

Full instructions in `QUICKSTART.md`

## 📝 What You Need to Configure

### Required (won't work without these):
1. **Supabase credentials** in `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
2. **Backend URL** (defaults to `http://localhost:3001`)
3. **Create a test user** in Supabase dashboard to test login

### Optional:
- Customize colors in component files
- Add more translations in `messages/*.json`
- Adjust card preview length in `ArticleCard.tsx`

## 🎓 School Project Tips

### For Your Presentation
1. **Demo flow**: Start at `/es` → filter by category → click article → switch to `/pt` → log in
2. **Highlight features**: Bilingual, responsive, clean design, real backend integration
3. **Show code**: Clean component structure, TypeScript safety, i18n pattern

### For Your Report
- **Problem solved**: Scientific articles are often only in English; we translate and organize them
- **Tech choices**: Next.js for SEO/performance, Supabase for quick auth, i18n for multiple languages
- **Architecture**: Frontend (Next.js) ↔ API (NestJS) ↔ Database (Postgres via Supabase)

## 🐛 Common Issues & Solutions

### "Failed to fetch resources"
→ Backend not running. Start sciwave-backend on port 3001.

### "Supabase error on login"
→ Check credentials in `.env.local`. Create a test user in Supabase dashboard.

### "Page not found"
→ Remember to include language code: use `/es` or `/pt`, not just `/`

### "npm install" fails
→ Check Node.js version: `node --version` (should be 18+)

## 📚 Files You'll Modify Most

- **Translations**: `messages/es.json`, `messages/pt.json`
- **Styling**: Component files (Tailwind classes)
- **API calls**: `lib/api.ts`
- **Pages**: `app/[locale]/page.tsx` (home), `app/[locale]/articles/[id]/page.tsx`

## ✨ Future Enhancements (if you have time)

- [ ] Article search bar
- [ ] User registration page
- [ ] "Related articles" section
- [ ] Dark mode toggle
- [ ] Article sharing buttons
- [ ] Reading time estimate
- [ ] Pagination for article list

## 📖 Documentation

- **README.md** - Full project documentation
- **QUICKSTART.md** - Step-by-step setup guide
- **This file** - High-level summary

---

**Built for**: SciWave school project  
**Status**: ✅ Complete and ready to use  
**Next step**: Follow QUICKSTART.md to configure and run
