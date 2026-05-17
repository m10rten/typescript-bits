declare global {
  interface ArrayConstructor {
    isArray(arg: unknown): arg is unknown[];
  }
  interface ArrayConstructor {
    new <T = unknown>(...items: T[]): T[];
  }
}

export {};
