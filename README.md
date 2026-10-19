# MS Leeds Studio & Bugalugs

A static, two-brand marketing website:

- **MS Leeds Studio** (core brand) — communication design, laser cutting and
  photography prints; showcase + enquiry (no live cart/checkout).
- **Bugalugs by MS Leeds Studio** (sub-brand, `/bugalugs/`) — luxury open-air photo
  printing booth servicing Western & South-West Queensland events, enquiry-only booking.

Built as plain HTML/CSS/JS — no build step, no framework. Open any `.html` file directly
or serve the folder with any static file server, e.g.:

```
python3 -m http.server 8000
```

## Structure

```
index.html          MS Leeds Studio landing page
studio.html         Services: Communication Design / Laser Cutting / Photography Prints
work.html           Portfolio (client-side discipline filter)
gallery.html         Print catalogue (client-side collection filter)
about.html            Studio story, process, philosophy
contact.html          Print enquiry form
bugalugs/
  index.html          Bugalugs landing
  experience.html      Setup, props, uniforms, trailer, prints & packaging
  gallery.html          Event photo gallery (client-side event-type filter)
  booking.html           Booking enquiry form + service area + practical notes
css/style.css         Shared design system (MS Leeds Studio palette/type)
css/bugalugs.css      Sub-brand palette/type overrides (loaded after style.css)
js/main.js            Mobile nav, enquiry forms, filters, first-visit studio chooser, footer year
```

## Brand system

Derived from the supplied Brand Bible (Edition 05) and Bugalugs brand guide:

- **MS Leeds Studio** — a blend of the "Paddock Archive" and "Collector's Cabinet"
  directions: charcoal/linen base, one rust accent, gold used only as a considered
  "foil" highlight. Headings in Playfair Display, tagline/signoffs in Allura, pull
  quotes in Cormorant Garamond italic, body in DM Sans.
- **Bugalugs** — Mulga / Wattle Charcoal / Bone / Dust / Weathered Brass / Gum Bark
  palette. Headings in Playfair Display, body in Work Sans (substituted for Neue Haas
  Grotesk, which isn't a free/licensable web font — swap in the licensed font's
  `@font-face`/Adobe Fonts embed in both `<link>` tags and the `--font-body` variable
  in `css/bugalugs.css` if you have a license).

Both load their fonts from Google Fonts via `<link>` tags in each page's `<head>`.

## Placeholder content — what to swap before launch

- **Photography.** Every image slot is a styled CSS gradient "frame" (`.frame` /
  `.frame.dark` in `css/style.css`) with an italic caption, standing in for real
  photography. Replace each `.frame` div's background with an `<img>` (the caption
  span can stay as an `<figcaption>` or be removed).
- **Work page projects** (`work.html`) are placeholder slots with generic titles —
  replace with real projects (image, title, client, discipline) before launch.
- **Prices, editions and enquiry copy** in `gallery.html` and `bugalugs/gallery.html`
  are indicative — confirm before publishing.
- **Forms** (`contact.html`, `bugalugs/booking.html`) submit to `action="#"` and only
  show a client-side success message — no data is actually sent anywhere yet. Wire
  each `<form>`'s `action` attribute to a form backend (Formspree, Netlify Forms,
  a serverless function, etc.) before launch.

## First-visit studio chooser

On a visitor's first page view (either brand) a panel slides in from the right
asking "Are you looking for MLS or Bugalugs by MLS?". Picking either option, or
closing it, is stored in the browser (`localStorage` key `mls-studio-choice`) so
it doesn't appear again. The "Switch studio" link in every footer reopens it.
To show it again while testing, clear site data or run
`localStorage.removeItem("mls-studio-choice")` in the browser console.

## Notes

- No shopping cart or payment integration — both brands are enquiry-first per the
  current scope. Add a cart/checkout (prints) or deposit-payment flow (bookings)
  as a separate follow-up if needed.
- Fully responsive; mobile nav is a full-screen slide-in panel (`js/main.js` +
  `.main-nav`/`.nav-toggle` in `css/style.css`).
