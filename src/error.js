import { CONFIG } from "./config.js";

export function formatError(error) {
  if (error.name === "TimeoutError") {
    return `Request timed out after ${CONFIG.requestTimeoutMs} ms`;
  }

  return error.message;
}
