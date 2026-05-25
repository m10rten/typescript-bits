import { Result } from "../core/result/index.js";
import { sleep } from "../utils/index.js";

export const fetchData = async (url: string): Promise<Result<unknown>> => {
  const response = await fetch(url);
  if (!response.ok) return Result.err(new Error(`HTTP ${response.status}`));
  return Result.ok(await response.json());
};

export const fetchWithRetry = async (url: string, retries = 3): Promise<Result<unknown>> => {
  for (let i = 0; i < retries; i++) {
    const result = await fetchData(url);
    if (result.isOk()) return result;
    await sleep(1000 * (i + 1));
  }
  return Result.err(new Error(`Failed after ${retries} retries`));
};

export const fetchJson = async <T>(url: string): Promise<T> => {
  const result = await fetchData(url);
  return result.unwrap() as T;
};
