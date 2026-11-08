/**
 * Cursor Build — Vue 3 adapter
 *
 * import { useSwarm } from "cursor-build/vue";
 *
 * export default {
 *   setup() {
 *     const swarm = useSwarm();   // starts on mount, stops on unmount
 *     swarm.start.value();        // or bind swarm.active in your template
 *     return { swarm };
 *   },
 * };
 */

import { onMounted, onBeforeUnmount, ref, shallowReadonly } from "vue";
import { createSwarm } from "../index.js";

/**
 * Starts the swarm when the component mounts and stops it on unmount.
 *
 * @param {import("../core/runtime.js").CursorBuildOptions} [options]
 */
export function useSwarm(options = {}) {
  const swarm = typeof document !== "undefined" ? createSwarm(options) : null;
  const active = ref(false);

  const start = (overrides) => {
    if (!swarm) return;
    swarm.start(overrides);
    active.value = true;
  };
  const stop = (reveal = false) => {
    if (!swarm) return;
    swarm.stop(reveal);
    active.value = false;
  };
  const replay = () => {
    if (!swarm) return;
    swarm.replay();
    active.value = true;
  };
  const toggle = () => {
    if (!swarm) return;
    swarm.toggle();
    active.value = swarm.isActive;
  };

  if (typeof document !== "undefined") {
    onMounted(() => {
      if (options.autoStart !== false) start();
    });
    onBeforeUnmount(() => stop());
  }

  return shallowReadonly({ start, stop, replay, toggle, active });
}

export default useSwarm;
