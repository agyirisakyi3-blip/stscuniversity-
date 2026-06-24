# STSC University

**School of Technology & Social Sciences — Kasoa-Nyanyano, Ghana**

Official website for STSC University, a premier private tertiary institution offering accredited 4-year bachelor's degree programmes in Engineering, Computing, Business, and the Humanities.

---

## Features

- **Responsive Design** — Mobile-first layout adapts to all screen sizes
- **Dark Mode** — Toggleable dark/light theme with local storage persistence
- **Live Countdown** — Real-time countdown to the next academic year deadline
- **Typewriter Effect** — Animated hero section headlines
- **Programme Filtering** — Filter degree programmes by school (Engineering, Computing, Business)
- **Programme Comparison** — Side-by-side comparison of up to 3 programmes
- **4-Year Curriculum Accordion** — Expandable course structure for each programme
- **Quick View Modals** — Popup programme summaries with fee and requirement details
- **Admissions Popup** — Timed promotional popup for applications
- **Image Lightbox** — Click-to-expand gallery and campus images
- **Parallax Scrolling** — Subtle scroll-based parallax on key sections
- **Counter Animation** — Animated statistics counters
- **FAQ Accordion** — Expandable frequently asked questions
- **Scroll Progress Bar** — Top-of-page reading progress indicator
- **Toast Notifications** — Success/error feedback for form submissions
- **i18n (English / Twi)** — Language toggle with JSON-based translations
- **Contact Form Validation** — Client-side validation with visual error states
- **Admission Fee Calculator** — Dynamic fee estimation based on programme and accommodation
- **Blog/News Section** — Dynamic content loaded from `posts.json`
- **Alumni Testimonials** — Auto-rotating testimonial carousel
- **Masonry Gallery** — Responsive image gallery layout
- **PWA Support** — Service worker (`sw.js`) and manifest for offline/progressive install
- **Schema.org Structured Data** — EducationalOrganization, WebSite, FAQPage, Course LD+JSON
- **SEO Optimized** — Open Graph, Twitter Cards, meta tags, canonical URL
- **Accessibility** — Skip links, ARIA labels, focus-visible styles, semantic HTML
- **Analytics Ready** — Plausible analytics integration

## Pages

| Page | Description |
|------|-------------|
| `index.html` | Home page — hero, programmes, curriculum, comparison, gallery, FAQ, contact form |
| `about.html` | University history, mission, leadership, accreditation |
| `admissions.html` | Entry requirements, fee calculator, application form, scholarships |
| `contact.html` | Contact form, campus map, department contacts |
| `blog.html` | News and blog posts loaded from `assets/data/posts.json` |
| `international.html` | International students information, India directorate |

## Tech Stack

- **HTML5** — semantic markup, ARIA accessibility
- **CSS3** — custom properties, flexbox, grid, animations, responsive breakpoints
- **Vanilla JavaScript (ES6+)** — no frameworks, ~1050 lines
- **JSON** — i18n translations, blog posts data
- **Service Worker API** — offline caching, PWA installability
- **Schema.org** — structured data for search engines

## Project Structure

```
├── index.html              # Home page
├── about.html              # About page
├── admissions.html         # Admissions page
├── contact.html            # Contact page
├── blog.html               # Blog page
├── international.html      # International students page
├── manifest.json           # PWA manifest
├── sw.js                   # Service worker
├── robots.txt              # Search engine crawler rules
├── sitemap.xml             # XML sitemap
├── assets/
│   ├── css/
│   │   └── style.css       # Global stylesheet
│   ├── js/
│   │   └── main.js         # All site JavaScript
│   ├── images/             # Images and icons
│   ├── lang/
│   │   ├── en.json         # English translations
│   │   └── tw.json         # Twi translations
│   └── data/
│       └── posts.json      # Blog/news posts data
```

## Development

No build tools or dependencies required. To run locally:

```bash
# Serve with any static file server, e.g.
npx serve .
# or
python -m http.server 8000
# or
npx live-server
```

Open `http://localhost:8000` in your browser.

## Language Support

Toggle between English (EN) and Twi (TW) using the language button in the top bar. Translations are stored in `assets/lang/en.json` and `assets/lang/tw.json`.

## PWA

The site is installable as a Progressive Web App. When visited on a supported browser, users can add it to their home screen for an app-like experience with offline access.

## Accreditation

STSC University programmes are accredited by the Ghana Tertiary Education Commission (GTEC).

## License

All rights reserved. STSC University.
