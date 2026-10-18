import { MEALDB_BASE_URL } from "@/constants";
import { AppError } from "./types";

interface RequestConfig {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  headers?: Record<string, string>;
  body?: unknown;
  timeout?: number;
  retries?: number;
}

const DEFAULT_TIMEOUT = 10000;
const DEFAULT_RETRIES = 3;
const RETRY_DELAY_BASE = 1000;

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchWithTimeout(
  url: string,
  options: RequestInit,
  timeout: number
): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    return response;
  } finally {
    clearTimeout(id);
  }
}

export async function apiClient<T>(
  endpoint: string,
  config: RequestConfig = {}
): Promise<T> {
  const {
    method = "GET",
    headers = {},
    body,
    timeout = DEFAULT_TIMEOUT,
    retries = DEFAULT_RETRIES,
  } = config;

  const url = `${MEALDB_BASE_URL}${endpoint}`;

  const requestOptions: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
  };

  if (body) {
    requestOptions.body = JSON.stringify(body);
  }

  let lastError: Error | null = null;

  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const response = await fetchWithTimeout(url, requestOptions, timeout);

      if (!response.ok) {
        throw new AppError(
          `API request failed: ${response.statusText}`,
          "API_ERROR",
          response.status
        );
      }

      const data = (await response.json()) as T;
      return data;
    } catch (error) {
      lastError = error as Error;

      if (error instanceof AppError && error.statusCode && error.statusCode < 500) {
        throw error;
      }

      if (attempt < retries - 1) {
        const delayMs = RETRY_DELAY_BASE * Math.pow(2, attempt);
        await sleep(delayMs);
      }
    }
  }

  if (lastError?.name === "AbortError") {
    throw new AppError("Request timed out", "TIMEOUT");
  }

  throw new AppError(
    lastError?.message || "Network request failed",
    "NETWORK_ERROR"
  );
}
