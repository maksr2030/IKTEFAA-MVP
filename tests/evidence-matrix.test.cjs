const test = require("node:test");
const assert = require("node:assert/strict");
const { FEATURES, REGISTRY_STATS } = require("../features.js");
const { EVIDENCE_MATRIX, EVIDENCE_MATRIX_STATS } = require("../evidence-matrix.js");

test("evidence matrix covers every canonical registry record exactly once", () => {
  assert.equal(EVIDENCE_MATRIX.length, REGISTRY_STATS.canonicalRecords);
  assert.equal(new Set(EVIDENCE_MATRIX.map((row) => row.featureId)).size, EVIDENCE_MATRIX.length);
  assert.deepEqual(EVIDENCE_MATRIX.map((row) => row.featureId), FEATURES.map((feature) => feature.id));
});

test("evidence matrix preserves actual registry status and defined-feature count", () => {
  for (const [index, feature] of FEATURES.entries()) {
    const row = EVIDENCE_MATRIX[index];
    assert.equal(row.registryStatus, feature.status);
    assert.equal(row.domain, feature.domain);
    assert.equal(row.legacyIds.join(","), feature.legacyIds.join(","));
    assert.ok(row.displayPath);
    assert.ok(row.testReference);
    assert.ok(row.verificationStatus);
    assert.equal(row.liveIntegrationEvidence, false);
    assert.equal(row.revenueEvidence, false);
    assert.equal(row.acquisitionValuationSupport, false);
  }
  assert.equal(EVIDENCE_MATRIX_STATS.definedFeatureRows, 95);
  assert.equal(EVIDENCE_MATRIX_STATS.demonstratedRows, 23);
  assert.equal(EVIDENCE_MATRIX_STATS.architectureRows, 72);
  assert.equal(EVIDENCE_MATRIX_STATS.reservedRows, 5);
  assert.equal(EVIDENCE_MATRIX_STATS.functionalValidationRows, 6);
  assert.deepEqual(
    EVIDENCE_MATRIX.filter((row) => row.functionalValidationStatus === "passed").map((row) => row.featureId),
    [1, 2, 3, 4, 5, 6]
  );
});

test("matrix does not convert architecture or reserved records into implementation claims", () => {
  const architectureRows = EVIDENCE_MATRIX.filter((row) => row.registryStatus === "architecture");
  const reservedRows = EVIDENCE_MATRIX.filter((row) => row.registryStatus === "reserved");
  assert.ok(architectureRows.every((row) => row.verificationStatus === "not-implemented-in-public-mvp"));
  assert.ok(reservedRows.every((row) => row.verificationStatus === "excluded-from-defined-feature-coverage"));
  assert.equal(EVIDENCE_MATRIX_STATS.featureSpecificAcceptanceTests, 23);
  assert.ok(architectureRows.every((row) => row.functionalValidationStatus === "not-applicable"));
});
