
import { CONFIG } from "./config.js";

function toMiB(bytes) {
  return bytes / CONFIG.bytesPerMiB;
}

function formatSize(bytes) {
  return `${toMiB(bytes).toFixed(3)} MiB`;
}

function formatDuration(durationMs) {
  return `${durationMs.toFixed(2)} ms`;
}

export function printUsage() {
  console.error("Usage: npm run benchmark -- <URL>");
  console.error(
    "Example: npm run benchmark -- https://example.com/large-image.jpg",
  );
}

export function printHeader(url) {
  console.log(`Target: ${url.origin}`);
  console.log(
    `Running ${CONFIG.requestCount} sequential requests...\n`,
  );
}

export function printResult(result) {
  console.log(
    `#${String(result.index).padStart(2, "0")}  ` +
      `HTTP ${result.status}  ` +
      `${formatDuration(result.durationMs)}  ` +
      `${formatSize(result.bytesDownloaded)}`,
  );
}

export function printSummary(statistics) {
  console.log("\nSummary");
  console.log("-------");

  console.log(
    `Successful requests: ${statistics.successfulRequests}/${CONFIG.requestCount}`,
  );

  console.log(
    `Average request time: ${formatDuration(statistics.averageDurationMs)}`,
  );

  console.log(`Total downloaded: ${formatSize(statistics.totalBytes)}`);

  console.log(
    `Average download speed: ${statistics.averageSpeedMiBPerSecond.toFixed(3)} MiB/s`,
  );
}

export function printError(message) {
  console.error(`Error: ${message}`);
}
