# pkgx.dev Visual Redesign Specification
## Direction: "Modern Premium" (Vercel/Linear-inspired)

Based on deep research of Vercel's Geist design system, Linear's dark mode patterns, crates.io, npm, and modern developer tool UIs in 2025-2026.

---

## 1. Design Philosophy

**"Premium Developer Tool"** - Clean, sophisticated, data-dense but breathing. Inspired by Vercel's precision and Linear's dark mode mastery. The site should feel like a premium developer tool, not a generic landing page.

Key principles:
- No pure black (#000) backgrounds - use brand-tinted near-blacks
- No pure white (#fff) text - use dimmed whites for readability
- Elevation via lighter surfaces, not shadows
- Subtle borders, generous spacing
- Micro-interactions that feel responsive but not distracting
- WCAG AAA contrast (7:1 minimum for text)

---

## 2. Color System

### Base Palette (Dark Mode Only - pkgx is dark-native)

```css
/* Backgrounds - Layered depth */
--bg-page: #0A0E14;           /* Page background - very dark navy-black */
--bg-surface: #0F1419;        /* Cards, containers - slightly lighter */
--bg-elevated: #161B22;       /* Elevated elements, dropdowns, modals */
--bg-hover: rgba(255,255,255,0.04);  /* Hover state overlay */
--bg-active: rgba(255,255,255,0.08); /* Active/pressed state */

/* Brand Colors */
--brand-primary: #4F6AFF;     /* Refined blue - slightly lighter than current #4156E1 for better contrast */
--brand-secondary: #F26212;   /* Keep the orange - it's distinctive */
--brand-accent: #74FAD1;      /* Teal accent - for success/positive states */

/* Text Hierarchy */
--text-primary: #E6EDF3;      /* Primary text - warm white, not harsh */
--text-secondary: #8B949E;    /* Secondary text - GitHub-style muted */
--text-tertiary: #6E7681;     /* Tertiary text - labels, timestamps */
--text-link: #4F6AFF;         /* Links - brand blue */
--text-on-accent: #0A0E14;   /* Text on colored backgrounds */

/* Borders */
--border-default: rgba(139,148,158,0.15);  /* Subtle, not harsh */
--border-hover: rgba(139,148,158,0.30);    /* Hover state */
--border-active: rgba(79,106,255,0.50);    /* Focus/active - brand tint */

/* Semantic */
--color-success: #3FB950;
--color-warning: #D29922;
--color-error: #F85149;
--color-info: #4F6AFF;

/* Category Colors (for package tags) */
--cat-node: #68D391;
--cat-python: #F7D046;
--cat-rust: #F97316;
--cat-go: #38BDF8;
--cat-ruby: #EF4444;
--cat-general: #8B949E;
```

### Gradient
```css
/* Hero gradient - more refined than current */
--gradient-hero: linear-gradient(135deg, #4F6AFF 0%, #F26212 50%, #E6EDF3 100%);
/* Card accent gradient (top border effect) */
--gradient-card-accent: linear-gradient(90deg, #4F6AFF, #74FAD1);
```

---

## 3. Typography System

### Font Stack
```css
/* Sans-serif: Inter - the standard for modern dev tools */
--font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
/* Monospace: JetBrains Mono - developer-loved */
--font-mono: 'JetBrains Mono', 'Fira Code', 'Cascadia Code', 'SF Mono', monospace;
/* Display: Keep shader for brand hero text */
--font-display: 'shader', 'Inter', sans-serif;
```

### Type Scale (Tailwind classes)
```
Hero:      text-5xl md:text-7xl font-display uppercase tracking-tight
H1:        text-3xl md:text-4xl font-sans font-semibold tracking-tight
H2:        text-xl md:text-2xl font-sans font-semibold
H3:        text-lg font-sans font-medium
Body:      text-sm md:text-base font-sans font-normal leading-relaxed
Small:     text-xs font-sans
Code:      text-sm font-mono
Label:     text-xs font-sans uppercase tracking-wider font-medium text-tertiary
```

### Import (add to index.html)
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
```

---

## 4. Component Specifications

### 4.1 Package Card (Highest Priority)

**Current problems:**
- Too cramped (p-1 on mobile)
- Image takes too much space relative to info
- No hover elevation effect
- Labels feel like afterthoughts
- No trust signals visible

**New design:**
```
┌─────────────────────────────┐
│ [Image area - 16:9 ratio]   │
│                    [badges] │
├─────────────────────────────┤
│ Package Name         ★ 12k │
│ Brief description that      │
│ wraps to two lines max...   │
│                             │
│ [node] [web] [maintained]   │
└─────────────────────────────┘
```

**Specifications:**
- Border radius: rounded-xl (12px)
- Border: 1px solid var(--border-default)
- Background: var(--bg-surface)
- Padding: p-4 (body area)
- Image: aspect-video (16:9) with rounded-t-xl
- Hover: translateY(-2px) + shadow-lg + border-color transition
- Transition: all 200ms ease
- Focus-visible: ring-2 ring-brand-primary ring-offset-2 ring-offset-bg-page
- Package name: font-mono text-base font-medium
- Description: text-sm text-secondary line-clamp-2
- Tags: tiny rounded-full pills with category colors
- Star count: inline with name, text-xs text-tertiary

### 4.2 Hero Section (Homepage)

**Current problems:**
- "We are Crafters of Fine" feels dated
- Product grid is too small and cramped
- No clear value proposition or CTA
- Missing search prominence

**New design:**
```
┌──────────────────────────────────────────┐
│                                          │
│     Open Source Infrastructure           │
│     for Every Developer                  │
│                                          │
│     The tools that power modern          │
│     package management                   │
│                                          │
│     [══════ Search packages... ═══════]  │
│                                          │
│     7,000+ packages  ·  Used by 50k+    │
│                                          │
└──────────────────────────────────────────┘
```

**Specifications:**
- Background: Subtle radial gradient from brand-primary at 5% opacity
- Hero title: font-display, text-gradient (keep the existing gradient, it's good)
- Subtitle: text-lg text-secondary, max-w-xl mx-auto
- Search: Large, centered, w-full max-w-2xl, py-3 px-5 text-base
- Stats row: flex gap-8, text-sm text-tertiary, with subtle dividers
- Bottom border: 1px gradient border (gradient-card-accent)

### 4.3 Product Cards (Homepage Grid)

**New design - larger, more visual:**
```
┌─────────────────────────────┐
│                             │
│  pkgx                       │
│  ─────                      │
│  Fast, small, package       │
│  runner.                    │
│                             │
│  [→ Learn more]             │
│                             │
└─────────────────────────────┘
```

**Specifications:**
- Grid: grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4
- Card height: uniform, min-h-[180px]
- Name: font-display text-2xl uppercase
- Description: text-sm text-secondary mt-2
- Hover: bg-hover overlay + subtle border glow
- Link arrow: opacity-0 -> opacity-100 on hover, transition
- A thin gradient top border (2px) for visual interest

### 4.4 Masthead/Navigation

**Improvements:**
- Add subtle bottom border
- Logo slightly larger
- Navigation items: better spacing, hover underline effect
- Search: always visible, larger on desktop
- Sticky on scroll with backdrop blur

**Specifications:**
- Height: h-16
- Position: sticky top-0 z-50
- Background: var(--bg-page)/80 + backdrop-blur-xl
- Border-bottom: 1px solid var(--border-default)
- Nav items: text-sm font-medium text-secondary hover:text-primary transition
- Active nav: text-primary with bottom indicator

### 4.5 Package Showcase (/pkgs)

**Improvements:**
- Better filter bar design
- Card grid: 3 columns on desktop (not 4 - too narrow)
- Add package count badge to header
- Better empty state
- Skeleton loaders that match card shape

**Specifications:**
- Filter bar: sticky below masthead, bg-surface, border-y
- Category pills: rounded-full with active glow effect
- Grid: grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4
- Cards: consistent height with flex-col layout
- Sort dropdown: styled to match design system

### 4.6 Search Component

**Improvements:**
- Larger input on desktop
- Command palette style dropdown (like Linear/Vercel)
- Better keyboard shortcut display
- Results with icons and better formatting

**Specifications:**
- Input: rounded-lg py-2.5 px-4 text-sm
- Shortcut badge: bg-elevated border rounded px-1.5 text-xs
- Dropdown: rounded-xl shadow-2xl border bg-elevated
- Results: hover:bg-hover, with project icon/letter avatar
- Selected state: bg-active with left accent border

### 4.7 Footer

- Keep current structure
- Slightly more compact
- Use new color tokens
- Add subtle top border

### 4.8 Package Detail Page

- Keep InstallSnippets, DependencyGraph, VersionHistory, QualityBadges
- Update colors to new tokens
- Better spacing between sections
- Add breadcrumb navigation

---

## 5. Spacing System

```
4px  (p-1)    - Inline spacing, between icons
8px  (p-2)    - Tight spacing, chip padding
12px (p-3)    - Standard internal padding
16px (p-4)    - Card body padding
24px (p-6)    - Section internal padding
32px (p-8)    - Between sections
48px (p-12)   - Major section gaps
64px (p-16)   - Hero padding
```

---

## 6. Shadow System

```css
--shadow-sm: 0 1px 2px rgba(0,0,0,0.3);
--shadow-md: 0 4px 12px rgba(0,0,0,0.3);
--shadow-lg: 0 8px 24px rgba(0,0,0,0.4);
--shadow-xl: 0 12px 48px rgba(0,0,0,0.5);
--shadow-glow: 0 0 24px rgba(79,106,255,0.15);
```

---

## 7. Animation Tokens

```css
--ease-default: cubic-bezier(0.4, 0, 0.2, 1);
--duration-fast: 150ms;
--duration-normal: 200ms;
--duration-slow: 300ms;
```

All transitions: `transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)]`

---

## 8. Files to Modify

1. **`index.html`** - Add Inter + JetBrains Mono font imports
2. **`src/assets/app.css`** - Complete rewrite with new design tokens
3. **`src/components/Masthead.tsx`** - Sticky header with blur
4. **`src/components/HeroTypography.tsx`** - Minor updates to text-gradient
5. **`src/components/Search.tsx`** - Command palette style
6. **`src/components/Footer.tsx`** - New color tokens
7. **`src/components/Stars.tsx`** - Read and update if needed
8. **`src/components/PackageCard/QualityBadges.tsx`** - New colors
9. **`src/pkgx.dev/HomeFeed.tsx`** - New hero + product grid
10. **`src/pkgx.dev/PackageShowcase.tsx`** - New grid + filter bar + cards
11. **`src/pkgx.dev/PackageListing.tsx`** - Update detail page colors
12. **`src/components/PackageDetail/InstallSnippets.tsx`** - New tokens
13. **`src/components/PackageDetail/DependencyGraph.tsx`** - New tokens
14. **`src/components/PackageDetail/VersionHistory.tsx`** - New tokens

---

## 9. Accessibility Requirements

- All interactive elements must have focus-visible styles
- Color contrast: minimum 7:1 for normal text (WCAG AAA)
- All images need alt text
- Keyboard navigation must work for search, filters, cards
- Screen reader: proper headings hierarchy, ARIA labels
- Touch targets: minimum 44x44px on mobile
- Reduced motion: respect prefers-reduced-motion

---

## 10. Performance Requirements

- No new heavy dependencies (Inter/JetBrains from Google Fonts CDN)
- Image lazy loading for package cards
- Skeleton loaders for all async content
- No layout shift (reserve space for images)
- Animations: GPU-accelerated (transform/opacity only)

---

## 11. Implementation Priority

1. Design tokens (app.css) - Foundation
2. Package Card redesign - Most visible component
3. Homepage Hero - First impression
4. Product Grid - Homepage engagement
5. Masthead - Navigation consistency
6. Search - Core functionality
7. Package Showcase filters - Usability
8. Detail page updates - Consistency
9. Footer - Polish
10. Micro-interactions - Delight

---

## 12. Quality Gate

Before shipping:
- Build succeeds with 0 errors
- Dev server shows all pages correctly
- All hover states work
- Search functions
- Cards navigate correctly
- Mobile responsive (375px+)
- No console errors
