
import { CONFIG } from "./config.js";

export function calculateStatistics(results) {
  if (results.length === 0) {
    throw new Error("Cannot calculate statistics without results.");
  }

  const totalDurationMs = results.reduce(
    (total, result) => total + result.durationMs,
    0,
  );

  const totalBytes = results.reduce(
    (total, result) => total + result.bytesDownloaded,
    0,
  );

  return {
    successfulRequests: results.length,
    totalDurationMs,
    averageDurationMs: totalDurationMs / results.length,
    totalBytes,
    averageSpeedMiBPerSecond:
      totalDurationMs > 0
        ? (totalBytes / CONFIG.bytesPerMiB) /
          (totalDurationMs / 1000)
        : 0,
  };
}
