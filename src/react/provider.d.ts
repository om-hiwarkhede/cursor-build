/// <reference types="react" />

import * as React from "react";
import type { CursorBuildOptions } from "../index.js";

export type SwarmApi = {
  start: (overrides?: CursorBuildOptions) => void;
  stop: (reveal?: boolean) => void;
  replay: () => void;
  toggle: () => void;
  /** True while the swarm is rebuilding the page. */
  active: boolean;
};

export interface SwarmProviderProps extends CursorBuildOptions {
  children?: React.ReactNode;
  /** Start the swarm automatically after mount. Default: true */
  autoStart?: boolean;
  /** Delay in ms before autoStart fires. Default: 800 */
  startDelay?: number;
  /** Called when the swarm starts. */
  onActiveChange?: (active: boolean) => void;
}

/** Wrap your application to enable the swarm rebuild experience. */
export declare function SwarmProvider(props: SwarmProviderProps): React.FunctionComponentElement<SwarmProviderProps>;

/** Access the swarm inside <SwarmProvider>. */
export declare function useSwarm(): SwarmApi;

/** A button wired to swarm.toggle(). Renders nothing during SSR. */
export interface SwarmTriggerProps {
  label?: string;
  labelActive?: string;
  className?: string;
  style?: React.CSSProperties;
}

export declare function SwarmTrigger(props: SwarmTriggerProps): React.ReactElement | null;

export declare const _default: typeof SwarmProvider;
