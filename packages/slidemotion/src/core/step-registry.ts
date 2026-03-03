// ---------------------------------------------------------------------------
// Step Registry
// Tracks how many steps each slide has. Components (<Step>, <Code>, etc.)
// register their step counts on mount; the engine queries the registry to
// know when to advance to the next slide.
// ---------------------------------------------------------------------------

/**
 * Creates a step registry for managing step counts per slide.
 *
 * Each slide has a mutable set of registered step orders. The max step
 * for a slide is the highest order registered by any component within it.
 *
 * Components call `register(slideIndex, stepOrder)` on mount and
 * `unregister(slideIndex, stepOrder)` on unmount.
 */
export function createStepRegistry() {
  // slideIndex → Set of registered step orders
  const registry = new Map<number, Map<string, number>>();
  const listeners = new Set<() => void>();

  function getMaxStep(slideIndex: number): number {
    const entries = registry.get(slideIndex);
    if (!entries || entries.size === 0) return 0;
    let max = 0;
    for (const order of entries.values()) {
      if (order > max) max = order;
    }
    return max;
  }

  /**
   * Register a step within a slide.
   * @param slideIndex - The slide this step belongs to
   * @param id - Unique id for this registration (component instance)
   * @param order - The step order number
   */
  function register(slideIndex: number, id: string, order: number) {
    let entries = registry.get(slideIndex);
    if (!entries) {
      entries = new Map();
      registry.set(slideIndex, entries);
    }
    entries.set(id, order);
    notify();
  }

  /**
   * Unregister a step when its component unmounts.
   */
  function unregister(slideIndex: number, id: string) {
    const entries = registry.get(slideIndex);
    if (entries) {
      entries.delete(id);
      if (entries.size === 0) {
        registry.delete(slideIndex);
      }
    }
    notify();
  }

  function subscribe(listener: () => void): () => void {
    listeners.add(listener);
    return () => { listeners.delete(listener); };
  }

  function notify() {
    for (const listener of listeners) {
      listener();
    }
  }

  return {
    register,
    unregister,
    getMaxStep,
    subscribe,
  } as const;
}

export type StepRegistry = ReturnType<typeof createStepRegistry>;
