# Nalbaki Games

The studio website for **Nalbaki Games** at [nalbakigames.com](https://nalbakigames.com): an independent studio making
original browser games, and building games to order.

Plain HTML, CSS and a few lines of JS. No build step, no dependencies.

## Pages

| Path | File | What it is |
| --- | --- | --- |
| `/` | `index.html` | "One more round" hero with the games fanned on a saucer, featured Parking Lot, a chapter per game, the studio, house rules, hire |
| `/games` | `games.html` | Parking Lot, Last Commit Standing, Floor 42: real gameplay clips, how a round plays, play links |
| `/services` | `services.html` | Four fixed-price packages with scope; prices come from `pricing.js` |
| `/work` | `work.html` | Case studies; every number lists its source |
| `/about` | `about.html` | One-developer studio, how the work is done, the name |
| `/contact` | `contact.html` | `mailto:hello@nalbakigames.com` and what to put in a brief |
| `/press` | `press.html` | Fact sheet, descriptions, logos, colours, screenshots |
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

## Brand

The mark is the pear-shaped Azerbaijani tea glass standing on its *nəlbəki* (saucer), drawn as one flat shape; the
wordmark is "nalbaki" in Bricolage Grotesque with a small saucer as the dot of the i. Colours: tea red `#E5431F`,
ink `#16110E`, porcelain `#F4EFE6`. White text on tea red is below 4.5:1, so buttons on red use ink text.

- `assets/brand/`: SVG logo lockups (`-on-light`, `-on-dark`, `-mono-ink`, `-mono-porcelain`), wordmarks, the mark
  in red, ink and porcelain, the app tile, and a 512 px avatar PNG.
- `favicon.svg` (red tile, simplified glass without the rim line so it holds at 16 px), `assets/favicon-16.png`,
  `assets/favicon-32.png`, `apple-touch-icon.png`, `assets/icon-192.png`, `assets/icon-512.png`, `assets/og.jpg`.
- `docs/screens-redesign/brand-sheet.png` shows every version at size, including 16 and 32 px.

## Files

- `styles.css`: the whole design system (tokens at the top; each game has its own world: `.ch-pl`, `.ch-lcs`, `.ch-f42`).
- `site.js`: phone menu, header that steps aside on scroll, scroll reveals, pointer tilt, the home page's game fan,
  gameplay clips that play only while on screen (never with reduced motion or Save-Data), and prices.
- `assets/img/`: WebP posters and frames from the real games. `assets/video/`: 720p and 1280p clips, silent, 12 s.
- `assets/press/`: full-size screenshots and logo PNGs.
- `assets/fonts/bricolage-var.woff2`: Bricolage Grotesque variable latin subset, weight 400-800, width 75-100
  (SIL Open Font License 1.1).
- `docs/screens-redesign/`: desktop (1440 px) and phone (390 px) screenshots of every page. `docs/screens/` holds the
  previous design.
- `sitemap.xml`, `robots.txt`.
