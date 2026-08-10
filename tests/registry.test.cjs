const test = require("node:test");
const assert = require("node:assert/strict");
const {
  FEATURE_ROWS_RAW,
  FEATURE_ROWS,
  FEATURES,
  FEATURE_ALIASES,
  REGISTRY_STATS
} = require("../features.js");

test("historical registry is complete and canonical registry is deduplicated", () => {
  assert.equal(FEATURE_ROWS_RAW.length, 103);
  assert.equal(REGISTRY_STATS.canonicalRecords, 100);
  assert.equal(REGISTRY_STATS.definedFeatures, 95);
  assert.equal(REGISTRY_STATS.reservedRecords, 5);
  assert.equal(REGISTRY_STATS.mergedRecords, 3);
  assert.deepEqual(FEATURE_ALIASES, { 44: 41, 45: 37, 46: 38 });
  assert.equal(new Set(FEATURE_ROWS.map(([id]) => id)).size, FEATURE_ROWS.length);
  assert.equal(new Set(FEATURES.map((feature) => feature.id)).size, FEATURES.length);
});

test("merged records retain audit lineage", () => {
  assert.deepEqual(FEATURES.find((feature) => feature.id === 37).legacyIds, [37, 45]);
  assert.deepEqual(FEATURES.find((feature) => feature.id === 38).legacyIds, [38, 46]);
  assert.deepEqual(FEATURES.find((feature) => feature.id === 41).legacyIds, [41, 44]);
});

test("every canonical record has a declared evidence class", () => {
  for (const feature of FEATURES) {
    assert.ok(["demonstrated", "architecture", "reserved"].includes(feature.status));
    assert.ok(feature.evidenceClass);
  }
  assert.equal(REGISTRY_STATS.demonstratedFeatures, 23);
  assert.equal(REGISTRY_STATS.architectureFeatures, 72);
});
