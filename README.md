# cursor-build

**Swarm Rebuild-style website animations as an npm package.**

> Install the package, wrap your application with a provider, and watch a swarm of
> multiplayer-style cursors **bootstrap your own interface**: they capture the DOM,
> blank the page to a canvas, then visually reconstruct it — dragging out boxes,
> typing text with a blinking caret, drawing pen lines, snapping to rulers and
> alt-drag-duplicating repeated components.

No browser extension required. No build step required. Works in any app — plain
HTML, React, Vue, Svelte, Next.js, Remix, Astro, anything that runs in a browser.

## Install

```bash
npm install cursor-build
# or
pnpm add cursor-build
```

The package is plain ESM with zero runtime dependencies. React / Vue adapters are
included and only touch their framework as an optional peer dependency.

## Quick start — React

```jsx
import { SwarmProvider } from "cursor-build/react";

export default function App() {
  return (
    <SwarmProvider autoStart startDelay={800} sound>
      <MySite />
    </SwarmProvider>
  );
}
```

That's the whole integration. On mount, `<SwarmProvider>`:

1. Snapshots the rendered page into a blueprint (boxes, text runs, media, borders,
   repeated components).
2. Blanks the page behind an overlay canvas.
3. Spawns a swarm of cursors that **rebuild the UI live** — one cursor per element:
   crosshair-drawn rects, typed text, pen-tool lines, ruler guides, component duplicates.
4. Plays a generative "glass piano" note for every element that lands (press `M` to mute).
5. On completion, offers the real page back ("Go live" / `Esc`). On unmount it cleans up.

### Controlling the swarm from anywhere in the tree

```jsx
import { useSwarm } from "cursor-build/react";

function RebuildButton() {
  const swarm = useSwarm();
  return (
    <>
      <button onClick={swarm.replay}>Replay the build</button>
      <button onClick={() => swarm.stop(true)}>Scatter & reveal</button>
      <span>Swarm is {swarm.active ? "building…" : "idle"}</span>
    </>
  );
}
```

## Quick start — Vue 3

```js
import { useSwarm } from "cursor-build/vue";

export default {
  setup() {
    // starts on mount, stops on unmount
    const swarm = useSwarm();
    return { swarm };
  },
};
```

## Quick start — vanilla JS / any framework

```js
import { createSwarm } from "cursor-build";

const swarm = createSwarm({ sound: true, tour: true });

// Start the takeover
swarm.start();

// buttons / events
button.onclick = () => swarm.toggle();

// when the swarm finishes building
const swarm = createSwarm({
  onComplete: ({ agents, seconds, layers }) =>
    console.log(`Rebuilt by ${agents} agents in ${seconds}s (${layers} layers)`),
});
```

## API

### `createSwarm(options): SwarmController`

| Member | Description |
|---|---|
| `start(overrides?)` | Begin the takeover. Optional per-call option overrides. |
| `toggle()` | Start if idle, stop if running. |
| `stop(reveal = false)` | End it. `reveal = true` makes the cursors scatter while the real page fades back in. |
| `replay()` | Wipe and rebuild again from the top. |
| `isActive` | `true` while a swarm is running. |

Only one swarm can own the page at a time; starting a new one takes over cleanly.

### Options

| Option | Type | Default | Description |
|---|---|---|---|
| `sound` | `boolean` | `true` | Generative glass-piano soundtrack (synthesized, mute with `M`). |
| `tour` | `boolean` | `false`→`true` | Cinematic auto-scroll while the swarm builds below the fold. |
| `hud` | `boolean` | `false` | Show the built-in HUD control bar (agent dots, layer counter, progress, exit). Hidden by default so your own UI owns the screen — `Esc` exits, `M` mutes regardless. |
| `disperse` | `boolean` | `true` | After the rebuild completes, the cursors hold formation for a beat, then fly off-screen — the swarm removes itself. Set `false` to keep them flocking like the extension. |
| `skip` | `(el: Element) => boolean` | — | Exclude elements from the captured blueprint. |
| `onComplete` | `(r) => void` | — | Fires when everything has been rebuilt. |
| `onStop` | `(r) => void` | — | Fires after teardown. |

React-only props: `autoStart` (default `true`), `startDelay` (ms, default `800`),
`onActiveChange`.

Keyboard: `Esc` exits, `M` toggles sound. The HUD (agent dots, layer counter,
progress bar, Touring / speed / sound / Replay / Go live) is built in.

## Examples

Open the files directly in a browser (plain ESM, no bundler needed):

- [`examples/demo.html`](examples/demo.html) — vanilla landing page, rebuilds on load
- [`examples/react-demo.html`](examples/react-demo.html) — React provider + `useSwarm` via import maps

## How it works

The engine (ported and generalized from the [Swarm Rebuild extension](https://github.com/JoelBastoneLopez/swarm-rebuild)):

- **Capture** — walks the live DOM, cloning computed styles, `::before/::after` content,
  inline SVG forks, form states and media into an inert document, then derives a
  dependency-ordered set of build tasks.
- **Orchestration** — governed agents pick tasks by proximity, respect scroll
  frontiers, flock like boids when idle, and "leave" when their shift is over.
- **Rendering** — everything lives in a shadow-DOM overlay: placeholder boxes get
  styled in place, text reveals char-by-char behind a real caret, SVG paths are
  pen-plotted point by point.

## Credits

Built on the excellent [**Swarm Rebuild**](https://github.com/JoelBastoneLopez/swarm-rebuild)
browser extension by Dhvanil Patel & Joel Bastone Lopez. The npm package
generalizes the engine so any web app can ship the experience without an extension.

## License

MIT — see [LICENSE](LICENSE).
