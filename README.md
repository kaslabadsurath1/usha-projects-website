# Usha Projects website (plain HTML, CSS, JavaScript)

No build step, no Node.js, no libraries. Open `index.html` in a browser, or upload this whole folder to any web host.

- `*.html`  one file per page (about-mission-vision.html, projects-in-progress.html, ...)
- `style.css`  all styling and animations
- `main.js`  menus, sliders, counters, gallery lightbox, contact form
- `images/`  all pictures

## Contact form emails
Open `main.js` and paste a free access key from https://web3forms.com into `FORM_KEY` (top of the file).
Leave it empty to keep the fallback that opens the visitor's email app.

## Editing
Text lives directly in each .html file. The header and footer are repeated in every page,
so a menu change must be made in all pages (search and replace works well).

## Domain
SEO tags (canonical, og:url, og:image), sitemap.xml and robots.txt use https://www.ushaprojects.com. If the live address differs, find-and-replace that text across all files.
