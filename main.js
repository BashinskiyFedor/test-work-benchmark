
import { parseUrl, runBenchmark } from "./src/benchmark.js";
import { calculateStatistics } from "./src/statistics.js";
import { formatError } from "./src/error.js";

import {
  printUsage,
  printHeader,
  printResult,
  printSummary,
  printError,
} from "./src/cli.js";

async function main() {
  const input = process.argv[2];

  if (!input) {
    printUsage();
    process.exitCode = 1;
    return;
  }

  let url;

  try {
    url = parseUrl(input);
  } catch (error) {
    printError(error.message);
    printUsage();
    process.exitCode = 1;
    return;
  }

  printHeader(url);

  try {
    const results = await runBenchmark(url, printResult);

    const statistics = calculateStatistics(results);

    printSummary(statistics);
  } catch (error) {
    printError(formatError(error));
    process.exitCode = 1;
  }
}

main().catch((error) => {
  printError(formatError(error));
  process.exitCode = 1;
});
