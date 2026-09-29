# SCF Landing Page

This directory contains the Los Angeles Fair Workweek Schedule Change Form and its public landing page.

## Public URLs

- Landing page: `https://destructographic.com/rx/scf/`
- Form: `https://destructographic.com/rx/scf/scf.html`

## Files

- `index.html` — landing/instructions page
- `scf.html` — actual printable form; do not modify unless specifically requested
- `scf.css` — form stylesheet; do not modify unless specifically requested
- `mockup.png` — visual reference for landing page
- `assets/scf-render.png` — rendered form preview
- `assets/instructions-print-options-small.png` — reduced print-settings screenshot
- `assets/instructions-print-options.png` — full-size print-settings screenshot
- `assets/CVS_Health_logo.svg` — used by form; do not use on landing page

## Landing Page Requirements

Keep landing page extremely simple, lightweight, and dependency-free.

- dark background
- plain HTML/CSS only; no frameworks or JavaScript unless genuinely necessary
- create a separate stylesheet for `index.html`
- closely follow `mockup.png`
- page must remain within viewport width on mobile; no horizontal scrolling
- form preview links to `scf.html`
- provide a prominent text/button link to `scf.html`
- print screenshot thumbnail links directly to full-size screenshot
- do not display CVS Health branding on landing page
- use relative URLs for local assets/pages
- preserve existing `scf.html` and `scf.css`
