import type { Ref } from "vue";
import type { CursorBuildOptions } from "../index.js";

export interface SwarmComposable {
  start: (overrides?: CursorBuildOptions) => void;
  stop: (reveal?: boolean) => void;
  replay: () => void;
  toggle: () => void;
  /** Reactive: true while the swarm is rebuilding the page. */
  active: Ref<boolean>;
}

/**
 * Starts the swarm when the component mounts and stops it on unmount.
 * Pass `autoStart: false` in options to control it manually.
 */
export declare function useSwarm(options?: CursorBuildOptions & { autoStart?: boolean }): SwarmComposable;

export declare const _default: typeof useSwarm;
