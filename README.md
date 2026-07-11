# Project Orbit

Project Orbit is a production-ready foundation for an AI browser extension built with React 19, TypeScript, Vite, Tailwind CSS, and Chrome Extension Manifest V3.

## V0.3 scope

Project Orbit V0.3 focuses on AI page summaries while still avoiding authentication, payments, and backend services. The extension can:

- Detect the active browser tab.
- Read the current webpage title and URL.
- Extract visible page content from the active tab using Manifest V3-compatible scripting.
- Send extracted content to a reusable AI service layer.
- Display a concise summary, 5 key points, and action items.
- Use Google Gemini 2.5 Flash for AI page summaries.
- Show a friendly setup error when no Gemini API key is configured.
- Copy and regenerate summaries from the popup.
- Show placeholder responses for Ask Page, Rewrite Selection, and Settings.

## Tech stack

- React 19
- TypeScript
- Vite
- Tailwind CSS
- Chrome Extension Manifest V3
- Chrome Side Panel API
- Content Script
- Background Service Worker
- ESLint
- Prettier

## Project structure

```text
project-orbit/
├── public/manifest.json              # Chrome Extension MV3 manifest
├── src/
│   ├── app/                           # Popup React entrypoint
│   ├── background/                    # MV3 service worker
│   ├── components/                    # Reusable UI components
│   ├── content/                       # Webpage content script
│   ├── features/                      # Feature-specific modules
│   ├── hooks/                         # Reusable React hooks
│   ├── pages/                         # Extension pages
│   ├── panel/                         # Chrome side panel entrypoint
│   ├── services/ai/                   # AI provider abstraction and Gemini provider
│   ├── styles/                        # Tailwind/global CSS
│   ├── types/                         # Shared TypeScript and ambient runtime types
│   └── utils/                         # Shared utilities
├── index.html                         # Popup HTML shell
├── sidepanel.html                     # Side panel HTML shell
└── vite.config.ts                     # Vite extension build config
```

## Getting started

### Prerequisites

- Node.js 20 or newer
- npm 10 or newer
- Google Chrome with Manifest V3 support

### Install dependencies

```bash
npm install
```

### Run checks

```bash
npm run lint
npm run format
npm run build
```

### Build the extension

```bash
npm run build
```

The production extension bundle is written to `dist/`.

### Load in Chrome

1. Open Chrome and navigate to `chrome://extensions`.
2. Enable **Developer mode**.
3. Click **Load unpacked**.
4. Select the generated `dist/` directory.
5. Pin Project Orbit and open the popup from the toolbar.
6. Navigate to a webpage and click **Summarize**.

## Gemini API setup

Project Orbit uses the official Google GenAI JavaScript SDK (`@google/genai`) and the `gemini-2.5-flash` model for page summaries. The API key is read from a Vite environment variable at build time and is never hard-coded in source.

1. Create a Gemini API key in Google AI Studio.
2. Create a local `.env` file that is not committed:

   ```bash
   VITE_GEMINI_API_KEY=your-gemini-api-key
   ```

3. Rebuild the extension:

   ```bash
   npm run build
   ```

4. Reload the unpacked `dist/` extension in Chrome.

If `VITE_GEMINI_API_KEY` is missing, the popup keeps its loading/error flow intact and shows a friendly setup message instead of calling Gemini.

> Security note: Vite embeds `VITE_*` variables into the client bundle. This satisfies local V0.3 setup, but production deployments should route Gemini calls through a secured service or enterprise-managed configuration before distributing the extension widely.

To switch providers later, create another class that implements the `AiProvider` interface from `src/services/ai/types.ts` and update `src/services/ai/aiService.ts` to instantiate that provider.

## Development notes

- `src/features/tabs/currentTab.ts` owns active tab detection.
- `src/features/page/extractPageContent.ts` owns visible page text extraction.
- `src/services/ai/aiService.ts` owns summary generation orchestration and Gemini API key validation.
- `src/pages/Popup.tsx` composes the V0.3 user experience.
- `src/background/service-worker.ts` provides the MV3 background service worker foundation.
- `src/content/index.ts` is the initial content script bridge for future page-aware features.
- `sidepanel.html` and `src/panel/main.tsx` provide a Side Panel API-ready entrypoint.

## Roadmap boundaries

The following remain explicitly out of scope for V0.3:

- Authentication
- Mock AI responses
- Payments
- Backend APIs
- User data synchronization

## Build verification notes

This repository keeps Chrome and lightweight module declarations in `src/types/` so TypeScript can validate the extension source before third-party packages are installed. A full production bundle still requires `npm install` followed by `npm run build`, which invokes Vite to emit the Chrome-loadable `dist/` directory.

If dependency installation fails with a registry or proxy error, verify the source with:

```bash
tsc --noEmit
npm run lint
npm run format
```

Then rerun `npm install` and `npm run build` in an environment with npm registry access.
