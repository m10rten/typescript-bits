declare global {
  interface Array<T> {
    map<U>(callbackfn: (value: T, index: number, array: T[]) => U, thisArg?: unknown): U[];
  }
}

export {};
