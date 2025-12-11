[![npm version](https://img.shields.io/npm/v/@itrocks/real-viewport-height?logo=npm)](https://www.npmjs.org/package/@itrocks/real-viewport-height)
[![npm downloads](https://img.shields.io/npm/dm/@itrocks/real-viewport-height)](https://www.npmjs.org/package/@itrocks/real-viewport-height)
[![GitHub](https://img.shields.io/github/last-commit/itrocks-ts/real-viewport-height?color=2dba4e&label=commit&logo=github)](https://github.com/itrocks-ts/real-viewport-height)
[![issues](https://img.shields.io/github/issues/itrocks-ts/real-viewport-height)](https://github.com/itrocks-ts/real-viewport-height/issues)
[![discord](https://img.shields.io/discord/1314141024020467782?color=7289da&label=discord&logo=discord&logoColor=white)](https://25.re/ditr)

# real-viewport-height

Maintains a CSS variable --real-vh with the actual visible viewport height.

*This documentation was written by an artificial intelligence and may contain errors or approximations.
It has not yet been fully reviewed by a human. If anything seems unclear or incomplete,
please feel free to contact the author of this package.*

## Installation

```bash
npm i @itrocks/real-viewport-height
```

## Usage

`@itrocks/real-viewport-height` keeps a CSS custom property `--real-vh`
in sync with the *visible* browser viewport height in pixels.

This helps you work around mobile browser issues where `100vh` includes
the URL bar or on‑screen keyboard, which makes elements taller than the
actually visible area.

When the module is loaded in a browser environment, it:

- computes the current visible viewport height (using `window.visualViewport`
  when available, falling back to `window.innerHeight`),
- writes that value as a pixel string (for example `640px`) into the
  `--real-vh` CSS variable on `document.documentElement`,
- keeps this variable up to date when the viewport changes because of
  orientation changes, browser chrome appearance/disappearance, or the
  virtual keyboard.

You typically only need to import the module once at the entry point of
your front‑end code, then consume `--real-vh` from CSS.

### Minimal example

```ts
// main.ts (or any front-end entry file)
import '@itrocks/real-viewport-height'

// No further JavaScript is required: just use the CSS variable.
```

```css
/* Use the real visible viewport height for a full-screen container */
.app {
  height: var(--real-vh);
}
```

### Complete example with layout and keyboard handling

In a typical SPA or mobile‑focused web app, you may want your main
screen to always fit the visible viewport, even when the on‑screen
keyboard opens.

```ts
// src/main.ts
// Import for its side effects so that --real-vh is maintained
import '@itrocks/real-viewport-height'

// Your usual application bootstrap code follows
import { createRoot } from 'react-dom/client'
import { App }         from './App'

createRoot(document.getElementById('root')!).render(<App />)
```

```css
/* src/styles.css */

html,
body {
  margin: 0;
  padding: 0;
  height: 100%;
}

/* Main viewport‑filling container */
.app-root {
  /* Use the real, visible viewport height instead of 100vh */
  min-height: var(--real-vh);
  display: flex;
  flex-direction: column;
}

/* A header with fixed height */
.app-header {
  height: 56px;
  flex: 0 0 auto;
}

/* Content area that adapts when the virtual keyboard appears */
.app-content {
  flex: 1 1 auto;
  overflow: auto;
}

/* Optional: use a fraction of the viewport height */
.half-screen-panel {
  height: calc(var(--real-vh) * 0.5);
}
```

In this setup, the `.app-root` container always matches the visible
viewport height, and the content area scrolls naturally when the virtual
keyboard is shown.

## API

Although this package does not export named functions for you to call
directly, it exposes the following observable behavior and values.

### CSS custom property `--real-vh`

CSS variable defined on `document.documentElement` with the current
visible viewport height in pixels.

- **Location**: `document.documentElement.style.getPropertyValue('--real-vh')`
- **Type**: string (for example `'640px'`)

#### Usage in CSS

- Full‑screen container: `height: var(--real-vh);`
- Fraction of the viewport: `height: calc(var(--real-vh) * 0.5);`
- Offset for headers/footers: `min-height: calc(var(--real-vh) - 56px);`

The value updates automatically when:

- the page loads,
- the browser window is resized,
- the orientation changes,
- the tab visibility changes (for example when switching apps),
- the visual viewport resizes or scrolls (for example when the virtual
  keyboard is shown or hidden on mobile browsers that support
  `window.visualViewport`).

### Module side effects on import

Importing `@itrocks/real-viewport-height` in a browser environment has
the following side effects:

1. Schedules an initial computation of the viewport height:
   - if the document is still loading, it waits for `DOMContentLoaded`,
   - otherwise, it runs immediately.
2. Registers event listeners on `document`, `window`, and
   `window.visualViewport` (when available) to keep `--real-vh`
   synchronized with the actual visible viewport.

You do not need to manage these listeners yourself; just import the
module once in your front‑end entry point.

> **Note**
> The internal functions and variables used to implement this behavior
> (`realViewportHeight`, `realViewportHeightinit`, and
> `lastViewportHeight`) are not meant to be called or modified directly
> from user code. They are considered implementation details and may
> change in future versions.

## Typical use cases

- Build full‑screen layouts that behave correctly on mobile browsers
  where `100vh` includes the URL bar or navigation chrome.
- Ensure that main app containers, login screens, and dialogs always fit
  the *visible* viewport, even when the on‑screen keyboard is visible.
- Avoid content being cut off or overflowing behind the browser’s UI by
  basing heights and min‑heights on `--real-vh` instead of `100vh`.
- Implement bottom sheets, drawers, or side panels sized as a fraction
  of the real viewport height (for example `50%`, `80%`, etc.).
- Provide a more consistent experience across devices and browsers by
  centralizing viewport height handling in a single, reusable module.
