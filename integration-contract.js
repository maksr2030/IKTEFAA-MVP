const INTEGRATION_CONTRACT_VERSION = "1.0";

const REQUIRED_ORDER_FIELDS = ["externalOrderId", "status", "currency", "totalMinor"];

function assertString(value, field) {
  if (typeof value !== "string" || value.trim() === "") {
    throw new TypeError(`${field} must be a non-empty string`);
  }
}

function assertNonNegativeInteger(value, field) {
  if (!Number.isInteger(value) || value < 0) {
    throw new TypeError(`${field} must be a non-negative integer`);
  }
}

function normalizeExternalOrder(payload, provider) {
  assertString(provider, "provider");
  if (!payload || typeof payload !== "object") {
    throw new TypeError("payload must be an object");
  }

  const normalized = {
    contractVersion: INTEGRATION_CONTRACT_VERSION,
    provider,
    externalOrderId: String(payload.externalOrderId || "").trim(),
    status: String(payload.status || "").trim().toLowerCase(),
    currency: String(payload.currency || "").trim().toUpperCase(),
    totalMinor: payload.totalMinor,
    receivedAt: payload.receivedAt || null,
    evidence: {
      source: "synthetic-reference-adapter",
      liveConnection: false
    }
  };

  REQUIRED_ORDER_FIELDS.forEach((field) => {
    if (field === "totalMinor") return;
    assertString(normalized[field], field);
  });
  assertNonNegativeInteger(normalized.totalMinor, "totalMinor");
  return normalized;
}

function verifyIntegrationResponse(response) {
  if (!response || response.contractVersion !== INTEGRATION_CONTRACT_VERSION) return false;
  return REQUIRED_ORDER_FIELDS.every((field) => Object.prototype.hasOwnProperty.call(response, field));
}

if (typeof module !== "undefined") {
  module.exports = {
    INTEGRATION_CONTRACT_VERSION,
    REQUIRED_ORDER_FIELDS,
    normalizeExternalOrder,
    verifyIntegrationResponse
  };
}
