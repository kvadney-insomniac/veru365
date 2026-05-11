# Veru365

Marketing website for [Veru365](https://veru365.com) — AI-powered financial assistants, white-labeled for wealth managers and financial firms.

**Live site:** https://kvadney-insomniac.github.io/veru365/

## Setup

Static HTML/CSS/JS site. No build step required.

To run locally:
```bash
python3 -m http.server 4242
```
Then open http://localhost:4242

## Structure

```
index.html          — Single-page site (Hero, Product, Waitlist, Team, Careers)
assets/             — Logo and brand images
css/style.css       — Brand tokens, layout, animations
js/main.js          — Nav, form handling, scroll animations
```

## Forms

Waitlist and career application forms use [Formspree](https://formspree.io). Replace the `REPLACE_WITH_YOUR_FORMSPREE_ID` placeholders in `index.html` with your actual Formspree endpoint IDs.

## Deployment

Deployed via GitHub Pages from the `main` branch.
