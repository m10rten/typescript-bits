# Pipeline

A composable processing pipeline where each step transforms the value.

```ts
export type Step<T> = (value: T) => T | Promise<T>;

export interface Pipeline<T> {
  use(step: Step<T>): Pipeline<T>;
  execute(input: T): Promise<T>;
}
```

- **use** — appends a step to the pipeline; returns `this` for chaining.
- **execute** — runs the input through all steps in order.
