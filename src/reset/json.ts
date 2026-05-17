declare global {
  interface JSON {
    parse(text: string, reviver?: (key: string, value: unknown) => unknown): unknown;
  }
}

export {};
