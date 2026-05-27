# SciWave Frontend - Project Structure

## File Tree

```
sciwave-frontend/
│
├── 📱 app/                          # Next.js App Router
│   ├── globals.css                 # Global styles
│   ├── layout.tsx                  # Root layout (wraps everything)
│   │
│   └── [locale]/                   # Language-based routing (es/ or pt/)
│       ├── layout.tsx              # Locale layout (adds Navbar + translations)
│       ├── page.tsx                # 🏠 HOME PAGE (article grid)
│       │
│       ├── articles/
│       │   └── [id]/
│       │       └── page.tsx        # 📄 ARTICLE DETAIL PAGE
│       │
│       └── auth/
│           └── login/
│               └── page.tsx        # 🔐 LOGIN PAGE
│
├── 🧩 components/                   # Reusable UI components
│   ├── Navbar.tsx                  # Sticky nav with language switcher
│   └── ArticleCard.tsx             # Article preview card
│
├── 📚 lib/                          # Utilities and clients
│   ├── api.ts                      # Backend API client (fetch functions)
│   └── supabase.ts                 # Supabase auth client
│
├── 🌍 messages/                     # Translations
│   ├── es.json                     # Spanish UI text
│   └── pt.json                     # Portuguese UI text
│
├── ⚙️ Configuration files
│   ├── i18n.ts                     # next-intl setup
│   ├── middleware.ts               # Locale routing middleware
│   ├── next.config.ts              # Next.js config
│   ├── tailwind.config.ts          # Tailwind config
│   ├── tsconfig.json               # TypeScript config
│   └── .env.local.example          # Environment template
│
├── 📖 Documentation
│   ├── README.md                   # Full documentation
│   ├── QUICKSTART.md               # Setup guide
│   ├── PROJECT_SUMMARY.md          # This summary
│   └── STRUCTURE.md                # This file
│
└── 📦 Other
    ├── package.json                # Dependencies
    ├── .gitignore                  # Git ignore rules
    └── public/                     # Static assets (icons, images)
```

## How Routing Works

### URL Structure
```
https://sciwave.com/es              → Spanish home page
https://sciwave.com/es/articles/123 → Spanish article #123
https://sciwave.com/pt              → Portuguese home page
https://sciwave.com/pt/articles/123 → Portuguese article #123 (same content)
```

### File → URL Mapping
```
app/[locale]/page.tsx                    → /es or /pt
app/[locale]/articles/[id]/page.tsx      → /es/articles/123
app/[locale]/auth/login/page.tsx         → /es/auth/login
```

## Component Hierarchy

```
RootLayout (app/layout.tsx)
└── LocaleLayout (app/[locale]/layout.tsx)
    ├── Navbar (always visible)
    └── Page Content
        ├── HomePage (article grid)
        │   └── ArticleCard (multiple)
        │
        ├── ArticlePage (detail view)
        │
        └── LoginPage (auth form)
```

## Data Flow

### Fetching Articles
```
User visits /es
    ↓
HomePage component loads
    ↓
Calls getResources('es') from lib/api.ts
    ↓
Fetches from backend: GET /es/resources
    ↓
Receives array of Resource objects
    ↓
Maps to ArticleCard components
    ↓
Renders grid on screen
```

### Language Switching
```
User clicks PT button in Navbar
    ↓
switchLanguage() function
    ↓
Router navigates to /pt (same page, new locale)
    ↓
middleware.ts intercepts
    ↓
Loads pt.json translations
    ↓
Page re-renders with Portuguese UI
    ↓
API calls now use /pt/resources endpoint
```

### Authentication Flow
```
User enters email/password at /es/auth/login
    ↓
handleLogin() in LoginPage
    ↓
supabase.auth.signInWithPassword()
    ↓
Supabase validates credentials
    ↓
Success → session stored in browser
    ↓
Redirect to /es (home page)
    ↓
Navbar detects session, shows "Cerrar sesión"
```

## Key Concepts

### 1. `[locale]` Folder
- **Square brackets** = dynamic route segment
- Matches `/es` and `/pt`
- Middleware ensures only valid locales

### 2. Translation Keys
```typescript
// In component:
const t = useTranslations('nav');
return <button>{t('login')}</button>;

// In messages/es.json:
{ "nav": { "login": "Iniciar sesión" } }

// In messages/pt.json:
{ "nav": { "login": "Entrar" } }
```

### 3. API Client Pattern
```typescript
// lib/api.ts exports typed functions:
export async function getResources(langCode: string): Promise<Resource[]>

// Components use them:
import { getResources } from '@/lib/api';
const articles = await getResources('es');
```

### 4. Client Components
- All interactive components use `'use client'` directive
- Needed for hooks (useState, useEffect, etc.)
- Navbar, pages with forms, anything with click handlers

## Environment Variables

```bash
# .env.local (you create this)
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...
NEXT_PUBLIC_API_URL=http://localhost:3001

# Prefix "NEXT_PUBLIC_" makes them available in browser
```

## Styling System

### Tailwind Classes (inline)
```tsx
<div className="bg-blue-600 text-white px-4 py-2 rounded-lg">
  // Ocean blue background, white text, padding, rounded corners
</div>
```

### Global Styles (globals.css)
```css
/* Custom utilities for text truncation */
.line-clamp-3 { /* Shows max 3 lines, then "..." */ }
```

### Responsive Design
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
  // 1 column mobile, 2 tablet, 3 desktop
</div>
```

## TypeScript Types

### Main Interfaces (lib/api.ts)
```typescript
interface Resource {
  id: string;
  title: string;
  content: string;
  category: { id: string; name: string };
  language: { id: string; code: string; name: string };
  status: string;
}

interface Category {
  id: string;
  name: string;
}
```

Components import these:
```typescript
import type { Resource } from '@/lib/api';
```

## Build Process

### Development
```bash
npm run dev
    ↓
Next.js starts on port 3000
    ↓
Hot reload enabled
    ↓
TypeScript errors shown in terminal
```

### Production
```bash
npm run build
    ↓
TypeScript compilation
    ↓
Optimized bundles created
    ↓
Static pages pre-rendered
    ↓
Output in .next/ folder
```

## Common Patterns

### Protected Content (example for future)
```typescript
'use client';
import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function ProtectedPage() {
  const router = useRouter();
  
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) router.push('/es/auth/login');
    });
  }, [router]);
  
  return <div>Protected content</div>;
}
```

### Loading States
```typescript
const [loading, setLoading] = useState(true);

{loading ? (
  <div className="spinner" />
) : (
  <div>Content</div>
)}
```

### Error Handling
```typescript
try {
  const data = await getResources(locale);
  setArticles(data);
} catch (error) {
  console.error('Failed to fetch:', error);
  // Show error message to user
}
```

---

**Tip**: Start reading from `app/[locale]/page.tsx` to see how everything connects!
