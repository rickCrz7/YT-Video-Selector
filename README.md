# YT Video Selector

A client-side video curation app for creating themed pages of YouTube videos. Paste YouTube links, organize them into pages, and present them in a clean, distraction-free grid.

## Features

### Video Management
- **Add videos by URL** - Paste any YouTube link (watch, shorts, embed, or just the video ID) and the app extracts the video automatically.
- **Auto-fetched titles** - If you don't provide a custom title, the app fetches the real video title from YouTube. Falls back to "Untitled video" if unavailable.
- **Inline title editing** - Double-click any video title (or click the pencil icon) to edit it in place.
- **Drag-to-reorder** - In edit mode, drag video cards by their handle to rearrange the order within a page.
- **Thumbnail toggle** - Show or hide thumbnails. With thumbnails off, videos display as compact titled cards.

### Pages
- **Multiple themed pages** - Create as many pages as you want to organize your video collections.
- **Inline page renaming** - Double-click a page name in the sidebar (or click the pencil icon) to rename it in place.
- **Always-available page creation** - The "+" button in the sidebar is available in both edit and present modes.

### Present Mode
- **Clean presentation view** - Toggle to present mode to hide all editing controls, showing only the page title and video grid. The title centers between the sidebar toggle and the edit button.
- **Default mode** - The app opens in present mode for a clean first impression.

### Display Options
- **Grid density** - Choose from 2 to 6 columns for the video grid.
- **Light/dark theme** - Switch between dark and light themes in the settings panel.
- **Font size** - Choose from four font sizes (Small, Medium, Large, Extra Large) in settings.
- **Sidebar toggle** - Show or hide the sidebar. Your preference is remembered across visits.

### Data & Privacy
- **100% local storage** - All data is stored in your browser's localStorage. No backend, no database, no server-side data collection.
- **Export/Import** - Export your entire collection (pages, videos, and settings) as a JSON file. Import to restore or transfer collections.
- **No accounts** - No authentication, no telemetry, no analytics.
- **Privacy-enhanced YouTube embeds** - Uses YouTube's `youtube-nocookie.com` domain to limit tracking.
- **Consent banner** - First-time visitors see a consent banner explaining local storage usage and third-party YouTube cookies.
- **Privacy Policy & Terms of Service** - Accessible in-app via the sidebar footer (desktop) or page footer (mobile).

## Tech Stack

- **Vue 3** with `<script setup>` SFCs
- **TypeScript** for type safety
- **Vite** for build tooling
- No backend dependencies - runs entirely in the browser

## Getting Started

```bash
pnpm install
pnpm dev
```

The dev server starts automatically. For production builds:

```bash
pnpm build
```

## Tests

```bash
pnpm test
pnpm exec playwright install chromium
pnpm test:e2e
```

Vitest covers collection ordering, YouTube URLs, and saved data. Playwright starts the Vite dev server and tests the collection workflow in Chromium.

## License

This project is open-source under the [MIT License](LICENSE).
