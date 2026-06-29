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

## `projects.json` reference (project cards + project pages)
- File: `src/_data/projects.json`
- Each object in the array represents one project used by:
  - `src/portfolio.njk` (portfolio cards)
  - `src/projects/project-page.njk` (generated project pages)

### Common project fields
- `slug` (string): used for project page routes (`/projects/<slug>/`)
- `title` (string): project title shown on cards and project page
- `image` (string): default image path (used on portfolio cards and as fallback on project page)
- `alt` (string): image alt text
- `description` (string): short summary used in portfolio + project page header
- `tags` (array of strings): badge tags
- `currentlyBuilding` (boolean, optional): if `true`, project appears in the “Currently building” section
- `links` (array, optional): CTA buttons shown on portfolio/project page
  - `label` (string)
  - `url` (string)
  - `newTab` (boolean, optional; portfolio respects this)

### Date field (single source of truth)
- `date` (object): used for sorting and display formatting (`Mon. Year`, `Mon. Year - Mon. Year`, `Mon. Year - Present`)
- Keep `dates` (string) if you want a human-readable reference while editing, but the site now uses `date`

Supported `date` shapes:

Single month:
```json
"date": {
  "start": { "month": 1, "year": 2025 }
}
```

Range:
```json
"date": {
  "start": { "month": 5, "year": 2025 },
  "end": { "month": 6, "year": 2025 }
}
```

Ongoing:
```json
"date": {
  "start": { "month": 9, "year": 2025 },
  "present": true
}
```

Year-only (supported):
```json
"date": {
  "start": { "year": 2023 }
}
```

### `projectPage` object
- `projectPage.enabled` (boolean): controls whether the “Project Page” button appears and whether the page renders full content vs “not available yet”
- `projectPage.url` (string, optional/legacy): may still exist in data, but generated pages use `slug`
- `projectPage.images` (array, optional): top-of-page image gallery shown before the project details/sections
- `projectPage.videos` (array, optional): top-of-page video embeds/files shown before the project details/sections
- `projectPage.sections` (array, optional): content blocks rendered in order on the project page

### `projectPage.images` item format (top-level gallery)
- Each item can be either:
  - a string image path, or
  - an object with:
    - `src` (string) (also accepts `url` or `image`)
    - `alt` (string, optional)
    - `caption` (string, optional)

Example:
```json
"images": [
  { "src": "/images/project-1.jpg", "alt": "Front view", "caption": "Prototype front view" },
  { "src": "/images/project-2.jpg", "caption": "Bench test setup" }
]
```

### `projectPage.videos` item format (top-level videos)
- Each item should usually be an object.
- Supported formats:
  - Embedded video (YouTube/Vimeo/etc.) via `embed` (or `iframeSrc`)
  - Native hosted video via `src` (or `video` / `url`)

Fields:
- `embed` or `iframeSrc` (string, optional): iframe URL
- `src` / `video` / `url` (string, optional): video file URL/path
- `type` (string, optional): MIME type for native video (example: `video/mp4`)
- `poster` (string, optional): poster image for native video
- `title` (string, optional): iframe title
- `caption` (string, optional)

Example (embed + file):
```json
"videos": [
  {
    "embed": "https://www.youtube.com/embed/VIDEO_ID",
    "title": "Demo video",
    "caption": "System demo"
  },
  {
    "src": "/videos/bench-test.mp4",
    "type": "video/mp4",
    "poster": "/images/bench-test-poster.jpg",
    "caption": "Bench test recording"
  }
]
```

### Allowed `projectPage.sections` types
- `text`
- `bullets`
- `keyValue`
- `gallery`
- `video`

All section types may include:
- `title` (string, optional): rendered as a section heading

#### `text` section
```json
{
  "type": "text",
  "title": "Project Overview",
  "body": [
    "First paragraph...",
    "Second paragraph..."
  ]
}
```

Fields:
- `body` (string or array of strings): a single paragraph or multiple paragraphs rendered in order

Single-paragraph form is still supported:
```json
{
  "type": "text",
  "title": "Project Overview",
  "body": "Short paragraph..."
}
```

#### `bullets` section
```json
{
  "type": "bullets",
  "title": "What I Did",
  "items": ["Item one", "Item two"]
}
```

Fields:
- `items` (array of strings)

#### `keyValue` section
```json
{
  "type": "keyValue",
  "title": "System Architecture",
  "items": [
    { "label": "MCU", "value": "STM32" },
    { "label": "Bus", "value": "SPI" }
  ]
}
```

Fields:
- `items` (array of objects)
  - `label` (string)
  - `value` (string)

#### `gallery` section
```json
{
  "type": "gallery",
  "title": "Build Photos",
  "images": [
    { "src": "/images/photo1.jpg", "caption": "Rev A board" },
    { "src": "/images/photo2.jpg", "caption": "Testing setup" }
  ]
}
```

Fields:
- `images` (array)
  - same item format as `projectPage.images` (string path or object with `src`/`alt`/`caption`)

#### `video` section
Supports either a single video directly on the section or a list via `videos`.

Single video (embed):
```json
{
  "type": "video",
  "title": "Demo",
  "embed": "https://www.youtube.com/embed/VIDEO_ID",
  "caption": "End-to-end demo"
}
```

Multiple videos:
```json
{
  "type": "video",
  "title": "Test Videos",
  "videos": [
    { "embed": "https://www.youtube.com/embed/VIDEO_ID_1", "caption": "Outdoor test" },
    { "src": "/videos/test-2.mp4", "type": "video/mp4", "caption": "Lab test" }
  ]
}
```

Fields:
- Single video mode:
  - `embed` or `iframeSrc` (string), or `src` / `video` / `url` (string)
  - `mimeType` or `fileType` (string, optional) for native video
  - `poster` (string, optional)
  - `caption` (string, optional)
- Multi-video mode:
  - `videos` (array): same item format as `projectPage.videos`

### Notes / behavior
- Project pages are generated for every project via `src/projects/project-page.njk`, but if `projectPage.enabled` is false the page shows a “not available yet” message.
- Portfolio ordering is reverse chronological based on `date.start`.
- Portfolio cards use a responsive grid (3 columns desktop, then 2, then 1) and keep automatic card height sizing.
- Images have a ratio of around 1.78 or I think 1280/720? Should be double checked but thats what my screenshot measurements told me
