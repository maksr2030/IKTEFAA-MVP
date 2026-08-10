const { performance } = require("node:perf_hooks");
const { FEATURES } = require("../features.js");

const iterations = 10000;
const started = performance.now();
let checksum = 0;

for (let index = 0; index < iterations; index += 1) {
  checksum += FEATURES
    .filter((feature) => feature.domain === "payments" || feature.domain === "commerce")
    .map((feature) => feature.en.length)
    .reduce((sum, length) => sum + length, 0);
}

const elapsedMs = performance.now() - started;
console.log(JSON.stringify({
  benchmark: "synthetic-registry-filter",
  iterations,
  records: FEATURES.length,
  elapsedMs: Number(elapsedMs.toFixed(3)),
  checksum,
  evidenceBoundary: "synthetic local benchmark; not production or business performance"
}, null, 2));
