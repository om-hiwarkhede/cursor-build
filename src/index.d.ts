/**
 * Cursor Build — vanilla API types
 *
 * Adapted from the open-source Swarm Rebuild browser extension.
 */

export interface CursorBuildOptions {
  /** Play the generative "glass piano" soundtrack while the swarm builds. Default: true */
  sound?: boolean;
  /** Auto-scroll the page while the swarm builds. Default: true */
  tour?: boolean;
  /** Exclude elements from the captured blueprint. Receives every DOM element. */
  skip?: (el: Element) => boolean;
  /** Show the built-in HUD control bar (agent dots, progress, tone controls). Default: false. Esc exits, M toggles sound either way. */
  hud?: boolean;
  /** Send every cursor flying off-screen once the rebuild completes, instead of flocking forever. Default: true. */
  disperse?: boolean;
  /** Called once every element of the page has been rebuilt. */
  onComplete?: (result: { agents: number; seconds: number; layers: number }) => void;
  /** Called once the swarm has fully exited and the real page is revealed. */
  onStop?: (result: { reveal: boolean }) => void;
}

export interface SwarmController {
  /** Start the takeover. Optional per-call overrides merged into the constructor options. */
  start(overrides?: CursorBuildOptions): void;
  /** Stop the swarm. `reveal` (default false) makes the cursors scatter as the page fades back in. */
  stop(reveal?: boolean): void;
  /** Stop immediately and rebuild again from the top. */
  replay(): void;
  /** Start if idle, stop if running. */
  toggle(): void;
  /** Whether a swarm is currently running. */
  readonly isActive: boolean;
}

export interface CursorBuild {
  (options?: CursorBuildOptions): SwarmController;
}

/** Create a swarm controller for the current page. */
export declare function createSwarm(options?: CursorBuildOptions): SwarmController;

/** Alias of createSwarm. */
export declare function swarmify(options?: CursorBuildOptions): SwarmController;

/** OO wrapper around createSwarm. */
export declare class SwarmRebuild {
  constructor(options?: CursorBuildOptions);
  start(overrides?: CursorBuildOptions): void;
  stop(reveal?: boolean): void;
  replay(): void;
  toggle(): void;
  get isActive(): boolean;
}

export declare const _default: CursorBuild;
