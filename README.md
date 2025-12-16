# Luke Trusheim's Personal Website
Static site built with Eleventy and deployed to GitHub Pages at https://luketrusheim.com.

## Prerequisites
- Node.js 20+ and npm (matches the GitHub Actions workflow)

## Setup
```bash
npm install
```

## Local development
```bash
npm run dev
```
- Serves and watches the site locally (default: http://localhost:8080).
- Source files live in `src/`; Eleventy outputs the built site to `_site/`.

## Build
```bash
npm run build          # production build for the custom domain
```
- `_site/` is generated output and should not be committed.

## Deployment
- Pushes to `main` trigger `.github/workflows/deploy.yml`, which runs the build and deploys `_site/` to GitHub Pages.
- The `CNAME` file keeps the custom domain configuration intact.

## Project structure
- `src/` contains pages (`*.njk`), data (`_data/projects.json`), includes (`_includes/`), and assets/images copied through to the build.
