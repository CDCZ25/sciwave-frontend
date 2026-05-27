# SciWave Frontend 🌊

Frontend for SciWave - A repository of scientific articles translated into Spanish and Portuguese.

## Tech Stack

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **next-intl** - Internationalization (ES/PT)
- **Supabase** - Authentication
- **PostCSS** - CSS processing

## Features

- 🌐 **Bilingual**: Spanish (ES) and Portuguese (PT) interfaces
- 🔐 **Authentication**: Client-side Supabase auth
- 📚 **Article browsing**: Card grid with category filters
- 📖 **Article reading**: Clean, centered reading experience
- 🎨 **Ocean blue theme**: Modern, minimalist design
- 📱 **Responsive**: Works on mobile, tablet, and desktop

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Running instance of [sciwave-backend](https://github.com/Ray2752/sciwave-backend)
- Supabase project

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/sciwave-frontend.git
   cd sciwave-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Copy the example file:
   ```bash
   cp .env.local.example .env.local
   ```
   
   Edit `.env.local` and add your credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   NEXT_PUBLIC_API_URL=http://localhost:3001
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Visit [http://localhost:3000/es](http://localhost:3000/es) for Spanish or [http://localhost:3000/pt](http://localhost:3000/pt) for Portuguese.

## Project Structure

```
sciwave-frontend/
├── app/
│   ├── [locale]/              # Locale-based routing
│   │   ├── page.tsx           # Home page (article grid)
│   │   ├── articles/[id]/     # Article detail page
│   │   └── auth/login/        # Login page
│   ├── globals.css            # Global styles
│   └── layout.tsx             # Root layout
├── components/
│   ├── Navbar.tsx             # Navigation with language switcher
│   └── ArticleCard.tsx        # Article preview card
├── lib/
│   ├── api.ts                 # Backend API client
│   └── supabase.ts            # Supabase client
├── messages/
│   ├── es.json                # Spanish translations
│   └── pt.json                # Portuguese translations
├── i18n.ts                    # Internationalization config
└── middleware.ts              # Locale routing middleware
```

## API Integration

The frontend connects to the [sciwave-backend](https://github.com/Ray2752/sciwave-backend) API:

- `GET /:langCode/resources` - Fetch all articles
- `GET /:langCode/resources/:id` - Fetch single article
- `GET /:langCode/categories` - Fetch categories
- `POST /auth/login` - User authentication

## Pages

### Home (`/es` or `/pt`)
- Grid of article cards
- Sidebar with category filters
- Language switcher in navbar

### Article Detail (`/es/articles/:id` or `/pt/articles/:id`)
- Centered reading layout
- Category badge
- Back navigation

### Login (`/es/auth/login` or `/pt/auth/login`)
- Email/password form
- Supabase authentication

## Language Switching

The language switcher in the navbar:
1. Changes the UI language (buttons, labels, etc.)
2. Fetches articles in the new language from the API
3. Updates the URL (`/es` ↔ `/pt`)

When viewing an article, switching languages loads the same article in the new language (if it exists).

## Styling

- **Ocean blue** color scheme (`blue-600`, `blue-700`)
- **Modern minimalist** design
- **Card-based** layouts
- **Sticky navbar** for easy navigation
- **Responsive** grid (1 column mobile, 2 tablet, 3 desktop)

## Development

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## Contributing

This is a school project. Feel free to fork and experiment!

## License

MIT
