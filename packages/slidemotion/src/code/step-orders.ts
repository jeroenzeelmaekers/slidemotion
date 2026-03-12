// ---------------------------------------------------------------------------
// Step order helpers for step-aware code components.
// ---------------------------------------------------------------------------

function assertPositiveIncreasing(orders: readonly number[], source: string) {
  for (let index = 0; index < orders.length; index++) {
    const order = orders[index];
    if (order === undefined || !Number.isInteger(order) || order < 1) {
      throw new Error(`${source} must contain positive integers`);
    }

    const previousOrder = orders[index - 1];
    if (previousOrder !== undefined && order <= previousOrder) {
      throw new Error(`${source} must be strictly increasing`);
    }
  }
}

function sameOrders(left: readonly number[], right: readonly number[]): boolean {
  if (left.length !== right.length) {
    return false;
  }

  for (let index = 0; index < left.length; index++) {
    if (left[index] !== right[index]) {
      return false;
    }
  }

  return true;
}

export function atSteps(...orders: number[]): readonly number[] {
  assertPositiveIncreasing(orders, "atSteps(...orders)");
  return orders;
}

export function stepOrders(...orders: number[]): readonly number[] {
  assertPositiveIncreasing(orders, "stepOrders(...orders)");
  return orders;
}

export function rangeStepOrders(start: number, count: number): readonly number[] {
  if (!Number.isInteger(start) || start < 1) {
    throw new Error("rangeStepOrders(start, count) start must be a positive integer");
  }

  if (!Number.isInteger(count) || count < 0) {
    throw new Error("rangeStepOrders(start, count) count must be a non-negative integer");
  }

  return Array.from({ length: count }, (_, index) => start + index);
}

export function resolveStepOrders(
  count: number,
  stepOffset: number | undefined,
  explicitStepOrders: readonly number[] | undefined,
  componentName: string,
): readonly number[] {
  if (count <= 0) {
    return [];
  }

  if (!explicitStepOrders) {
    const baseOrder = stepOffset ?? 1;
    return Array.from({ length: count }, (_, index) => baseOrder + index);
  }

  if (explicitStepOrders.length !== count) {
    throw new Error(
      `<${componentName}> stepOrders must have exactly ${count} entr${count === 1 ? "y" : "ies"}`,
    );
  }

  assertPositiveIncreasing(explicitStepOrders, `<${componentName}> stepOrders`);

  return explicitStepOrders;
}

export function resolveStepAliases(
  atStepsProp: readonly number[] | undefined,
  stepOrdersProp: readonly number[] | undefined,
  componentName: string,
): readonly number[] | undefined {
  if (!atStepsProp) {
    return stepOrdersProp;
  }

  if (!stepOrdersProp) {
    return atStepsProp;
  }

  if (!sameOrders(atStepsProp, stepOrdersProp)) {
    throw new Error(`<${componentName}> atSteps and stepOrders must match when both are provided`);
  }

  return atStepsProp;
}

export function countCompletedStepOrders(
  currentStep: number,
  orders: readonly number[],
): number {
  let completed = 0;
  for (const order of orders) {
    if (currentStep < order) {
      break;
    }
    completed++;
  }
  return completed;
}
