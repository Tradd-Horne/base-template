# Design System — Base Template

## Inspiration
Inspired by [buildermethods.com](https://buildermethods.com) — Brian Casel's modern creator/SaaS site. Clean, minimal, professional with light/dark mode support.

## Color Palette

### Light Mode
- Background: #FFFFFF
- Surface/Cards: #F7F7F8
- Border: #E5E5E7
- Text Primary: #1A1A2E
- Text Secondary: #6B7280
- Text Muted: #9CA3AF
- Accent: #6366F1 (Indigo)
- Accent Hover: #4F46E5
- Accent Light: #EEF2FF
- Success: #10B981
- CTA gradient: linear-gradient(135deg, #6366F1, #8B5CF6)

### Dark Mode
- Background: #0F0F1A
- Surface/Cards: #1A1A2E
- Border: #2D2D44
- Text Primary: #F1F1F4
- Text Secondary: #9CA3AF
- Text Muted: #6B7280
- Accent: #818CF8
- Accent Hover: #6366F1
- Accent Light: #1E1B4B

## Typography
- Primary Font: Inter (Google Fonts, weights: 300, 400, 500, 600, 700)
- Mono Font: JetBrains Mono (for code blocks)
- H1: clamp(2.5rem, 5vw, 3.5rem), weight 700, line-height 1.1
- H2: clamp(1.8rem, 3.5vw, 2.5rem), weight 600, line-height 1.2
- H3: clamp(1.3rem, 2.5vw, 1.5rem), weight 600, line-height 1.3
- Body: 1rem (16px), weight 400, line-height 1.7
- Small: 0.875rem, weight 400

## Layout
- Max content width: 1200px
- Section padding: clamp(4rem, 8vw, 8rem) vertical
- Content padding: clamp(1.5rem, 4vw, 3rem) horizontal
- Card border-radius: 12px
- Button border-radius: 8px
- Default gap: 2rem

## Components
- Cards: subtle shadow, rounded corners, hover lift effect
- Buttons: solid fill (accent), outline variant, ghost variant
- Nav: fixed, blur backdrop, auto-hide on scroll
- Dark mode: toggle in nav, respects system preference, persists to localStorage
