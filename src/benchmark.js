import { performance } from "node:perf_hooks";
import { CONFIG } from "./config.js";

export function parseUrl(input) {
  let url;

  try {
    url = new URL(input);
  } catch {
    throw new Error("Invalid URL.");
  }

  if (!["http:", "https:"].includes(url.protocol)) {
    throw new Error("Only HTTP and HTTPS URLs are supported.");
  }

  return url;
}

async function downloadOnce(url) {
  const startedAt = performance.now();

  const response = await fetch(url, {
    signal: AbortSignal.timeout(CONFIG.requestTimeoutMs),
  });

  if (!response.ok) {
    const error = new Error(
      `HTTP ${response.status} ${response.statusText}`,
    );

    await response.body?.cancel().catch(() => {});

    throw error;
  }

  let bytesDownloaded = 0;

  if (response.body) {
    for await (const chunk of response.body) {
      bytesDownloaded += chunk.byteLength;
    }
  }

  return {
    status: response.status,
    durationMs: performance.now() - startedAt,
    bytesDownloaded,
  };
}

export async function runBenchmark(url, onResult) {
  const results = [];

  for (let index = 1; index <= CONFIG.requestCount; index += 1) {
    const result = await downloadOnce(url);

    const requestResult = {
      index,
      ...result,
    };

    results.push(requestResult);

    onResult?.(requestResult);
  }

  return results;
}
