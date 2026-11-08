/**
 * Cursor Build — vanilla JavaScript API
 *
 * Brings Swarm Rebuild-style website animations into any web app:
 * install, call start(), and a swarm of cursors visually rebuilds the page.
 *
 * No bundler required — this is plain ESM. Framework adapters:
 *   - React:  import { SwarmProvider, useSwarm } from "cursor-build/react"
 *   - Vue:    import { useSwarm } from "cursor-build/vue"
 */

import { createCursorBuild } from "./core/runtime.js";

/** @typedef {import("./core/runtime.js").CursorBuildOptions} CursorBuildOptions */

// Only one swarm can own the page at a time. Starting a new one takes over.
let currentInstance = null;

/**
 * Create a swarm controller for the current page.
 *
 * @param {CursorBuildOptions} [options]
 * @returns {SwarmController}
 */
export function createSwarm(options = {}) {
  const controller = createCursorBuild(options);

  const controllerWithHooks = {
    start: (overrides) => {
      if (currentInstance && currentInstance !== controllerWithHooks) currentInstance.stop();
      currentInstance = controllerWithHooks;
      controller.start(overrides);
    },
    toggle: () => {
      if (controller.app) controllerWithHooks.stop();
      else controllerWithHooks.start();
    },
    stop: (reveal = false) => {
      if (currentInstance === controllerWithHooks) currentInstance = null;
      controller.stop(reveal);
    },
    replay: () => {
      if (controller.app) {
        controller.restart();
      } else {
        controllerWithHooks.start();
      }
    },
    get isActive() {
      return !!controller.app;
    },
    /** @internal */
    _controller: controller,
  };

  return controllerWithHooks;
}

/**
 * Tiny convenience wrapper: `const swarm = swarmify({ ... })`.
 */
export function swarmify(options = {}) {
  return createSwarm(options);
}

export class SwarmRebuild {
  /**
   * @param {CursorBuildOptions} [options]
   */
  constructor(options = {}) {
    this.controller = createSwarm(options);
  }
  start(overrides) {
    this.controller.start(overrides);
  }
  stop(reveal = false) {
    this.controller.stop(reveal);
  }
  replay() {
    this.controller.replay();
  }
  toggle() {
    this.controller.toggle();
  }
  get isActive() {
    return this.controller.isActive;
  }
}

export default createSwarm;
