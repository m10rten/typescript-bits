declare global {
  interface SetConstructor {
    new <T = unknown>(values?: readonly T[]): Set<T>;
  }
  interface Set<T> {
    forEach(callbackfn: (value: T, value2: T, set: Set<T>) => void, thisArg?: unknown): void;
  }
}

export {};
