# Nalbaki Games

The studio website for **Nalbaki Games** at [nalbakigames.com](https://nalbakigames.com): a solo studio making fast,
polished browser games, and building them to order.

Plain HTML, CSS and a few lines of JS. No build step, no dependencies.

## Pages

| Path | File | What it is |
| --- | --- | --- |
| `/` | `index.html` | Brand, positioning, measured numbers, games, services, contact |
| `/games` | `games.html` | Parking Lot, Last Commit Standing, Floor 42 with real gameplay clips and play links |
| `/services` | `services.html` | Four fixed-price packages with scope; prices come from `pricing.js` |
| `/work` | `work.html` | Case studies; every number lists its source |
| `/about` | `about.html` | Solo studio, how the work is done, the name |
| `/contact` | `contact.html` | `mailto:hello@nalbakigames.com` and what to put in a brief |
| `/press` | `press.html` | Fact sheet, short and long descriptions, logos, screenshots |
| (any) | `404.html` | Not found |

## Set the prices

Edit **`pricing.js`**. It is the only place prices live:

```js
playable: { price: null, days: 5, unit: 'per playable' },
```

`price: null` shows a dashed "Price TBD" badge; a number (e.g. `1200`) shows `$1,200 per playable`.
`days` is the delivery time shown on the card; the defaults are suggestions, confirm them.

## Run locally

```bash
npx serve .          # http://localhost:3000, clean URLs (/games serves games.html)
```

## Deploy (Vercel)

`vercel.json` turns on clean URLs, caches `/assets` for 30 days, adds basic security headers and redirects the old
`/donate.html` to `/`. Import the repo in Vercel as a static site (framework preset "Other", no build command, output
directory `.`), then add `nalbakigames.com` and `www.nalbakigames.com` under Settings > Domains.

## Files

- `styles.css`: the whole design system (tokens at the top).
- `site.js`: plays gameplay clips only while on screen (never with reduced motion or Save-Data) and fills prices.
- `assets/logo.svg`, `favicon.svg`, `apple-touch-icon.png`, `assets/icon-*.png`: the saucer mark.
- `assets/og.jpg`: 1200x630 share image.
- `assets/img/`: WebP posters and cards. `assets/video/`: 720p and 1280p clips, silent, 12 s.
- `assets/press/`: full-size screenshots, logo PNG, wordmarks.
- `assets/fonts/`: Bricolage Grotesque latin subset (SIL Open Font License 1.1).
- `docs/screens/`: desktop (1440 px) and phone (390 px) screenshots of every page.
- `sitemap.xml`, `robots.txt`.
