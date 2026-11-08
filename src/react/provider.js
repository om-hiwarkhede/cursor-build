/**
 * Cursor Build — React adapter
 *
 * import { SwarmProvider, useSwarm } from "cursor-build/react";
 *
 * export default function App() {
 *   return (
 *     <SwarmProvider autoStart>
 *       <MySite />
 *     </SwarmProvider>
 *   );
 * }
 */

import React, { createContext, useContext, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createSwarm } from "../index.js";

const SwarmContext = createContext(null);

/**
 * Wrap your application with <SwarmProvider>. On mount, the provider captures
 * the current page DOM, wipes it to a blank canvas, and a swarm of animated
 * cursors rebuilds the interface piece by piece — drawing boxes, typing text,
 * assembling components. Once finished (or on unmount), the real page fades
 * back in.
 *
 * Props:
 *  - autoStart        start the swarm on mount (default true)
 *  - startDelay       ms to wait after mount before starting (default 800)
 *  - sound            enable the generative glass-piano soundtrack (default true)
 *  - tour             auto-scroll the page while the swarm builds (default true)
 *  - skip             (el) => boolean — exclude elements from the blueprint
 *  - onComplete       called when every element has been rebuilt
 *  - onStop           called when the swarm has fully exited
 */
export function SwarmProvider({
  children,
  autoStart = true,
  startDelay = 800,
  onActiveChange,
  ...options
}) {
  const swarmRef = useRef(null);
  if (swarmRef.current === null && typeof document !== "undefined") {
    swarmRef.current = createSwarm(options);
  }

  const [active, setActive] = useState(false);

  useEffect(() => {
    const swarm = swarmRef.current;
    if (!swarm) {
      // Server render: nothing to do. A client render will start the swarm.
      return undefined;
    }
    let timer;
    if (autoStart) {
      timer = setTimeout(() => swarm.start(), Math.max(0, startDelay));
    }
    const poll = setInterval(() => {
      setActive((prev) => (prev === swarm.isActive ? prev : swarm.isActive));
    }, 250);
    return () => {
      if (timer) clearTimeout(timer);
      clearInterval(poll);
      swarm.stop();
    };
    // Options are intentionally captured once; remount to change them.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (active && typeof onActiveChange === "function") onActiveChange(true);
  }, [active, onActiveChange]);

  const start = useCallback(() => {
    swarmRef.current && swarmRef.current.start();
  }, []);
  const stop = useCallback((reveal = false) => {
    swarmRef.current && swarmRef.current.stop(reveal);
  }, []);
  const replay = useCallback(() => {
    swarmRef.current && swarmRef.current.replay();
  }, []);
  const toggle = useCallback(() => {
    swarmRef.current && swarmRef.current.toggle();
  }, []);

  const value = useMemo(
    () => ({ start, stop, replay, toggle, active }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [start, stop, replay, toggle, active],
  );

  return React.createElement(SwarmContext.Provider, { value }, children);
}

/**
 * Access the swarm inside <SwarmProvider>.
 * Returns { start, stop, replay, toggle, active } — all stable callbacks.
 */
export function useSwarm() {
  return useContext(SwarmContext);
}

/**
 * Convenience button wired to the swarm. Renders nothing during SSR.
 *   <SwarmTrigger label="Rebuild this page" />
 */
export function SwarmTrigger({
  label = "Rebuild with the swarm",
  labelActive = "Stop the swarm",
  style,
  className,
}) {
  const swarm = useSwarm();
  if (!swarm) return null;
  return React.createElement(
    "button",
    {
      type: "button",
      className,
      style,
      onClick: swarm.toggle,
    },
    swarm.active ? labelActive : label,
  );
}

export default SwarmProvider;
