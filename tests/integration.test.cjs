const test = require("node:test");
const assert = require("node:assert/strict");
const {
  INTEGRATION_CONTRACT_VERSION,
  normalizeExternalOrder,
  verifyIntegrationResponse
} = require("../integration-contract.js");

test("reference integration adapter normalizes a provider-neutral order", () => {
  const result = normalizeExternalOrder({
    externalOrderId: "EXT-1001",
    status: "PAID",
    currency: "sar",
    totalMinor: 12500
  }, "reference-provider");

  assert.equal(result.contractVersion, INTEGRATION_CONTRACT_VERSION);
  assert.equal(result.status, "paid");
  assert.equal(result.currency, "SAR");
  assert.equal(result.totalMinor, 12500);
  assert.equal(result.evidence.liveConnection, false);
  assert.equal(verifyIntegrationResponse(result), true);
});

test("integration contract rejects incomplete or unsafe values", () => {
  assert.throws(() => normalizeExternalOrder({ externalOrderId: "EXT-1" }, "reference-provider"), /status/);
  assert.throws(() => normalizeExternalOrder({ externalOrderId: "EXT-1", status: "paid", currency: "SAR", totalMinor: -1 }, "reference-provider"), /totalMinor/);
  assert.equal(verifyIntegrationResponse({}), false);
});
