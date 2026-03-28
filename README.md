<div align="center">

# [pater999.it](https://pater999.it)

Personal portfolio website for **Mattia Paternoster** — Senior Software Engineer.

</div>

## Tech Stack

- **Pure HTML + Vanilla JS** — no frameworks, no build step
- **Tailwind CSS** via CDN for utility styling
- **Custom CSS** for design tokens, animations and the hex grid
- Hosted on **GitHub Pages**

## Local Development

```bash
npx serve .
```

Then open `http://localhost:3000`.

## Structure

| File | Description |
|------|-------------|
| `index.html` | Main portfolio page |
| `university-projects.html` | Projects page (Personal + UNITN tabs) |
| `404.html` | Custom error page |
| `styles/custom.css` | Design system — tokens, animations, hex grid, terminal |
| `scripts/scripts.js` | All interactivity — constellation canvas, scroll reveal, grep typewriter, hex filter, metrics |
| `favicon.svg` | SVG monogram favicon |

## Sections

- **Hero** — name, discipline pillars (Backend · SRE · Platform · Frontend), live metrics
- **About** — bio, highlight cards
- **Experience** — timeline of work history
- **Skills** — interactive hex grid with category filter + terminal grep panel
- **Education** — academic background
- **Contact** — obfuscated email + social links

## Features

- Particle constellation canvas (pauses when tab is hidden)
- Glitch name animation
- Hex grid with clickable category filters (Backend / SRE / Platform / Frontend / Tools)
- Terminal grep typewriter reveal
- Dynamic years of experience (calculated from Jan 2020)
- Email anti-scraping via `data-user` / `data-domain` assembly on first interaction
- Scroll reveal via `IntersectionObserver`
- JSON-LD structured data, Open Graph and Twitter Card meta for SEO
