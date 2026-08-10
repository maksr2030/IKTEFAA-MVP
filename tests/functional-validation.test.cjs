"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { FEATURES } = require("../features.js");
const {
  FUNCTIONAL_VALIDATION_CASES,
  runFunctionalValidation,
  buildEvidenceLedger,
  verifyEvidenceLedger,
  digest
} = require("../functional-validation.js");

const root = path.resolve(__dirname, "..");

test("functional validation covers the first six demonstrated registry features", () => {
  assert.deepEqual(
    FUNCTIONAL_VALIDATION_CASES.map((testCase) => testCase.featureId),
    [1, 2, 3, 4, 5, 6]
  );
  for (const testCase of FUNCTIONAL_VALIDATION_CASES) {
    const feature = FEATURES.find((candidate) => candidate.id === testCase.featureId);
    assert.ok(feature, `${testCase.testId}: registry feature is missing`);
    assert.equal(feature.status, "demonstrated");
    assert.equal(testCase.featureAr, feature.ar);
    assert.equal(testCase.featureEn, feature.en);
  }
});

test("normal, safety, missing-input, replay, and sensitivity controls pass for F01-F06", () => {
  const validation = runFunctionalValidation();
  assert.equal(validation.totalFeatures, 6);
  assert.equal(validation.passedFeatures, 6);
  assert.equal(validation.failedFeatures, 0);
  assert.equal(validation.scenarioCount, 30);
  assert.equal(validation.passedScenarios, 30);
  for (const result of validation.results) {
    assert.equal(result.status, "PASS", result.testId);
    assert.equal(result.scenarios.normal.status, "PASS");
    assert.equal(result.scenarios.safety.status, "PASS");
    assert.equal(result.scenarios.missing.status, "PASS");
    assert.equal(result.scenarios.replay.status, "PASS");
    assert.equal(result.scenarios.sensitivity.status, "PASS");
  }
});

test("forecast validation includes a synthetic temporal holdout and deterministic output", () => {
  const validation = runFunctionalValidation();
  const forecast = validation.results.find((result) => result.featureId === 6);
  assert.deepEqual(forecast.scenarios.normal.output.forecast, [130, 130]);
  assert.equal(forecast.scenarios.normal.output.validationBoundary, "synthetic-temporal-holdout");
  assert.equal(forecast.scenarios.normal.output.backtest.length, 3);
  assert.equal(forecast.scenarios.replay.outputDigest, forecast.scenarios.normal.outputDigest);
});

test("functional evidence ledger is chained and tamper-evident", () => {
  const validation = runFunctionalValidation();
  const ledger = buildEvidenceLedger(validation);
  assert.equal(ledger.length, 30);
  assert.equal(verifyEvidenceLedger(ledger), true);
  const tampered = ledger.map((entry) => ({ ...entry }));
  tampered[4].status = "FAIL";
  assert.equal(verifyEvidenceLedger(tampered), false);
});

test("generated functional artifacts exist and preserve the claim boundary", () => {
  const report = fs.readFileSync(path.join(root, "FUNCTIONAL_VALIDATION_REPORT.md"), "utf8");
  const validationArtifact = JSON.parse(fs.readFileSync(path.join(root, "functional-validation.json"), "utf8"));
  const manifest = JSON.parse(fs.readFileSync(path.join(root, "functional-hash-manifest.sha256.json"), "utf8"));
  assert.equal(validationArtifact.validation.passedFeatures, 6);
  assert.equal(validationArtifact.ledgerSummary.chainVerified, true);
  assert.match(report, /لا تثبت التكاملات الحية/);
  assert.equal(manifest.runId, validationArtifact.validation.runId);
  assert.equal(typeof manifest.manifestDigest, "string");
  assert.equal(digest(validationArtifact.validation.results[0].scenarios.normal.output) , validationArtifact.validation.results[0].scenarios.normal.outputDigest);
});
