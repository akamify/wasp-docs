# E-commerce Solution Documentation

A professional Meta-style documentation website built with Next.js, TypeScript, and Tailwind CSS for an E-commerce Solution Business.

## 🚀 Features

### Core Features
- **Static Site Generation** - Fast, SEO-friendly static pages
- **Markdown Support** - Write documentation in Markdown with full syntax highlighting
- **Responsive Design** - Mobile-first design that works on all devices
- **Dark/Light Mode** - Theme switching with system preference detection
- **Search Functionality** - Client-side instant search through all documentation
- **Feedback System** - User feedback stored in localStorage
- **Breadcrumbs** - Clear navigation path for users
- **Table of Contents** - Auto-generated TOC for each document

### Advanced Features
- **Keyboard Navigation** - Arrow keys to navigate search results
- **Copy Code** - One-click code copying with visual feedback
- **Scroll Spy** - Highlight current section in TOC
- **SEO Optimized** - Dynamic metadata, Open Graph, Twitter Cards
- **Performance Optimized** - Fast loading with minimal JavaScript

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom design system
- **Markdown**: react-markdown with remark-gfm and rehype-highlight
- **Icons**: Lucide React
- **Deployment**: Static export ready for Vercel/Netlify

## 📁 Project Structure

```
ecommerce-docs/
├── app/                          # Next.js app directory
│   ├── docs/                     # Documentation pages
│   │   ├── [slug]/              # Dynamic doc pages
│   │   ├── layout.tsx           # Docs layout
│   │   └── page.tsx            # Docs index
│   ├── globals.css              # Global styles
│   ├── highlight.css            # Code highlighting styles
│   ├── layout.tsx              # Root layout
│   └── page.tsx               # Homepage
├── components/                  # React components
│   ├── Navbar.tsx              # Top navigation
│   ├── Sidebar.tsx             # Documentation sidebar
│   ├── Footer.tsx              # Site footer
│   ├── SearchBar.tsx           # Search interface
│   └── Feedback.tsx            # Feedback component
├── data/                       # Documentation data
│   └── all-docs.ts            # All documentation content
├── lib/                        # Utility functions
│   ├── utils.ts                # Helper functions
│   └── getDocs.ts             # Doc retrieval functions
├── public/                     # Static assets
├── package.json                # Dependencies
├── next.config.js              # Next.js config
├── tailwind.config.ts          # Tailwind config
└── tsconfig.json              # TypeScript config
```

## 🚀 Getting Started

### Prerequisites

- Node.js 14+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd ecommerce-docs
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
npm run build
```

This creates a static export in the `out/` directory ready for deployment.

## 📝 Adding Documentation

### Adding New Documentation

1. Open `data/all-docs.ts`
2. Add a new document object to the array:

```typescript
{
  id: 'unique-id',
  title: 'Document Title',
  description: 'Brief description',
  category: 'Category Name',
  slug: 'url-slug',
  content: `# Markdown Content
  
Write your documentation in Markdown with full support for:
- **Bold** and *italic* text
- Code blocks with syntax highlighting
- Tables, lists, and links
- And much more!
`,
  keywords: ['keyword1', 'keyword2'],
  order: 1 // Optional: controls ordering within category
}
```

### Content Guidelines

- Use clear, descriptive titles
- Write comprehensive descriptions
- Include relevant keywords for search
- Organize into logical categories
- Use proper Markdown formatting
- Include code examples where helpful

## 🎨 Customization

### Theme Customization

Edit `tailwind.config.ts` to customize:
- Color scheme
- Typography
- Spacing
- Component styles

### Component Customization

All components are located in the `components/` directory:
- `Navbar.tsx` - Top navigation bar
- `Sidebar.tsx` - Documentation sidebar
- `Footer.tsx` - Site footer
- `SearchBar.tsx` - Search functionality
- `Feedback.tsx` - User feedback system

### Adding New Features

The project is structured for easy extension:
- Add new components to `components/`
- Create utility functions in `lib/`
- Extend data models in `data/`

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file for environment-specific settings:

```bash
# Optional: Add your own environment variables
NEXT_PUBLIC_SITE_URL=https://your-domain.com
NEXT_PUBLIC_GITHUB_URL=https://github.com/your-repo
```

### SEO Configuration

Update `app/layout.tsx` to customize:
- Site metadata
- Open Graph settings
- Twitter Card configuration
- Verification codes

## 📱 Responsive Design

The site is fully responsive with:
- Mobile-first approach
- Collapsible sidebar on mobile
- Touch-friendly navigation
- Optimized typography for all screen sizes

## 🔍 Search Features

The search system includes:
- Instant client-side search
- Search through titles, content, and keywords
- Keyboard navigation (↑↓ arrows, Enter to select)
- Search result highlighting
- Popular search suggestions

## 💾 Feedback System

Built-in feedback collection:
- "Was this helpful?" buttons
- localStorage persistence
- Thank you messages
- Vote tracking per document

## 🌙 Dark Mode

Features a complete dark mode implementation:
- System preference detection
- Manual toggle control
- Persistent theme selection
- Smooth transitions
- Optimized color schemes

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically on push

### Netlify

1. Run `npm run build`
2. Upload the `out/` directory
3. Configure custom domain if needed

### Static Hosting

The build output is pure static files suitable for any static hosting service.

## 📊 Performance

Optimizations included:
- Static site generation
- Minimal JavaScript
- Optimized images
- Efficient CSS
- Fast navigation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For questions or issues:
- Create an issue in the repository
- Check the documentation
- Review existing issues

---

Built with ❤️ using Next.js and Tailwind CSS
