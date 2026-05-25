import { AppError } from "../error/index.js";

export class Result<T, E = Error> {
  private constructor(
    private readonly ok: boolean,
    private readonly value?: T,
    private readonly error?: E,
  ) {}

  static ok<T, E = Error>(value: T): Result<T, E> {
    return new Result<T, E>(true, value);
  }

  static err<T, E = Error>(error: E): Result<T, E> {
    return new Result<T, E>(false, undefined, error);
  }

  isOk(): this is Result<T, never> {
    return this.ok;
  }

  isErr(): this is Result<never, E> {
    return !this.ok;
  }

  unwrap(): T {
    if (this.ok) return this.value!;
    if (this.error instanceof AppError) throw this.error;
    throw this.error;
  }

  unwrapOr(defaultValue: T): T {
    return this.ok ? this.value! : defaultValue;
  }
}
