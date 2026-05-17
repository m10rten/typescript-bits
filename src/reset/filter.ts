declare global {
  interface Array<T> {
    filter<S extends T>(predicate: (value: T, index: number, array: T[]) => value is S, thisArg?: unknown): S[];
    filter(predicate: (value: T, index: number, array: T[]) => unknown, thisArg?: unknown): T[];
  }
}

export {};
