"use strict";

const crypto = require("node:crypto");

const VALIDATION_SCHEMA_VERSION = "1.0.0";
const VALIDATION_RUN_ID = "IKTEFAA-FVAL-2026-08-10-001";

function assertObject(value, field) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new TypeError(`${field} must be an object`);
  }
}

function assertArray(value, field, minimum = 1) {
  if (!Array.isArray(value) || value.length < minimum) {
    throw new TypeError(`${field} must contain at least ${minimum} item(s)`);
  }
}

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

function assertPositiveInteger(value, field) {
  if (!Number.isInteger(value) || value <= 0) {
    throw new TypeError(`${field} must be a positive integer`);
  }
}

function round(value, decimals = 4) {
  const factor = 10 ** decimals;
  return Math.round((value + Number.EPSILON) * factor) / factor;
}

function canonicalize(value) {
  if (Array.isArray(value)) return value.map(canonicalize);
  if (value && typeof value === "object") {
    return Object.keys(value).sort().reduce((result, key) => {
      result[key] = canonicalize(value[key]);
      return result;
    }, {});
  }
  return value;
}

function digest(value) {
  return crypto.createHash("sha256")
    .update(JSON.stringify(canonicalize(value)))
    .digest("hex");
}

function matchesExpected(actual, expected) {
  if (expected && typeof expected === "object" && !Array.isArray(expected)) {
    return Object.entries(expected).every(([key, value]) => matchesExpected(actual?.[key], value));
  }
  if (Array.isArray(expected)) {
    return Array.isArray(actual) && expected.length === actual.length && expected.every((value, index) => matchesExpected(actual[index], value));
  }
  return actual === expected;
}

function evaluateSmartBasket(input) {
  assertObject(input, "input");
  assertArray(input.items, "items");
  const lines = input.items.map((item, index) => {
    assertObject(item, `items[${index}]`);
    assertString(item.sku, `items[${index}].sku`);
    assertPositiveInteger(item.quantity, `items[${index}].quantity`);
    assertNonNegativeInteger(item.unitPriceMinor, `items[${index}].unitPriceMinor`);
    assertPositiveInteger(item.availableQuantity, `items[${index}].availableQuantity`);
    return {
      sku: item.sku,
      quantity: item.quantity,
      unitPriceMinor: item.unitPriceMinor,
      lineTotalMinor: item.quantity * item.unitPriceMinor,
      available: item.quantity <= item.availableQuantity
    };
  });

  const unavailable = lines.filter((line) => !line.available).map((line) => line.sku);
  const totalMinor = lines.reduce((sum, line) => sum + line.lineTotalMinor, 0);
  if (unavailable.length > 0) {
    return {
      status: "HOLD",
      reason: "inventory-insufficient",
      unavailableSkus: unavailable,
      totalMinor,
      itemCount: lines.length,
      unitCount: lines.reduce((sum, line) => sum + line.quantity, 0)
    };
  }

  return {
    status: "ACCEPTED",
    decision: "basket-ready",
    totalMinor,
    itemCount: lines.length,
    unitCount: lines.reduce((sum, line) => sum + line.quantity, 0),
    lines
  };
}

function evaluateReverseAuction(input) {
  assertObject(input, "input");
  assertPositiveInteger(input.demandQuantity, "demandQuantity");
  assertNonNegativeInteger(input.maximumUnitPriceMinor, "maximumUnitPriceMinor");
  assertArray(input.offers, "offers");
  const offers = input.offers.map((offer, index) => {
    assertObject(offer, `offers[${index}]`);
    assertString(offer.supplierId, `offers[${index}].supplierId`);
    assertPositiveInteger(offer.quantity, `offers[${index}].quantity`);
    assertNonNegativeInteger(offer.unitPriceMinor, `offers[${index}].unitPriceMinor`);
    return { ...offer };
  });
  const eligible = offers.filter((offer) => (
    offer.quantity >= input.demandQuantity && offer.unitPriceMinor <= input.maximumUnitPriceMinor
  ));
  if (eligible.length === 0) {
    return {
      status: "HOLD",
      reason: "no-eligible-offer",
      evaluatedOfferCount: offers.length
    };
  }
  eligible.sort((left, right) => left.unitPriceMinor - right.unitPriceMinor || left.supplierId.localeCompare(right.supplierId));
  const selected = eligible[0];
  return {
    status: "ACCEPTED",
    decision: "offer-selected",
    selectedSupplierId: selected.supplierId,
    selectedUnitPriceMinor: selected.unitPriceMinor,
    demandQuantity: input.demandQuantity,
    totalMinor: selected.unitPriceMinor * input.demandQuantity,
    eligibleOfferCount: eligible.length,
    evaluatedOfferCount: offers.length
  };
}

function evaluateAccountingReport(input) {
  assertObject(input, "input");
  assertArray(input.entries, "entries");
  const entries = input.entries.map((entry, index) => {
    assertObject(entry, `entries[${index}]`);
    assertString(entry.entryId, `entries[${index}].entryId`);
    assertString(entry.account, `entries[${index}].account`);
    assertNonNegativeInteger(entry.debitMinor, `entries[${index}].debitMinor`);
    assertNonNegativeInteger(entry.creditMinor, `entries[${index}].creditMinor`);
    if (entry.debitMinor > 0 && entry.creditMinor > 0) {
      throw new TypeError(`entries[${index}] cannot contain both debit and credit`);
    }
    if (entry.debitMinor === 0 && entry.creditMinor === 0) {
      throw new TypeError(`entries[${index}] must contain a debit or credit`);
    }
    return { ...entry };
  });
  const debitMinor = entries.reduce((sum, entry) => sum + entry.debitMinor, 0);
  const creditMinor = entries.reduce((sum, entry) => sum + entry.creditMinor, 0);
  if (debitMinor !== creditMinor) {
    return {
      status: "HOLD",
      reason: "unbalanced-ledger",
      debitMinor,
      creditMinor,
      balanced: false,
      rowCount: entries.length
    };
  }
  return {
    status: "ACCEPTED",
    decision: "report-ready-for-review",
    debitMinor,
    creditMinor,
    balanced: true,
    rowCount: entries.length,
    printableRows: entries.map((entry) => `${entry.entryId}|${entry.account}|${entry.debitMinor}|${entry.creditMinor}`)
  };
}

function evaluateDigitalIdentity(input) {
  assertObject(input, "input");
  assertString(input.subjectId, "subjectId");
  assertArray(input.evidence, "evidence", 2);
  const evidence = input.evidence.map((item, index) => {
    assertObject(item, `evidence[${index}]`);
    assertString(item.type, `evidence[${index}].type`);
    assertString(item.reference, `evidence[${index}].reference`);
    if (typeof item.verified !== "boolean") {
      throw new TypeError(`evidence[${index}].verified must be boolean`);
    }
    return { ...item };
  });
  const unverified = evidence.filter((item) => !item.verified).map((item) => item.type);
  if (unverified.length > 0) {
    return {
      status: "HOLD",
      reason: "unverified-evidence",
      subjectId: input.subjectId,
      evidenceCount: evidence.length,
      unverifiedEvidenceTypes: unverified
    };
  }
  return {
    status: "ACCEPTED",
    decision: "identity-evidence-complete",
    subjectId: input.subjectId,
    evidenceCount: evidence.length,
    evidenceDigest: digest(evidence),
    verificationMode: "synthetic-evidence-check"
  };
}

function evaluateCharityAuction(input) {
  assertObject(input, "input");
  assertString(input.lotId, "lotId");
  assertNonNegativeInteger(input.reservePriceMinor, "reservePriceMinor");
  assertArray(input.bids, "bids");
  const bids = input.bids.map((bid, index) => {
    assertObject(bid, `bids[${index}]`);
    assertString(bid.bidderId, `bids[${index}].bidderId`);
    assertNonNegativeInteger(bid.amountMinor, `bids[${index}].amountMinor`);
    if (typeof bid.donorConsent !== "boolean") {
      throw new TypeError(`bids[${index}].donorConsent must be boolean`);
    }
    return { ...bid };
  });
  const eligible = bids.filter((bid) => bid.donorConsent && bid.amountMinor >= input.reservePriceMinor);
  if (eligible.length === 0) {
    return {
      status: "HOLD",
      reason: "reserve-not-met",
      lotId: input.lotId,
      evaluatedBidCount: bids.length
    };
  }
  eligible.sort((left, right) => right.amountMinor - left.amountMinor || left.bidderId.localeCompare(right.bidderId));
  const winner = eligible[0];
  return {
    status: "ACCEPTED",
    decision: "charity-allocation-ready",
    lotId: input.lotId,
    winningBidderId: winner.bidderId,
    winningAmountMinor: winner.amountMinor,
    charityAllocationMinor: winner.amountMinor,
    eligibleBidCount: eligible.length,
    evaluatedBidCount: bids.length
  };
}

function evaluateDemandForecast(input) {
  assertObject(input, "input");
  assertArray(input.series, "series", 4);
  assertPositiveInteger(input.window, "window");
  assertPositiveInteger(input.horizon, "horizon");
  if (input.series.length <= input.window) {
    return { status: "HOLD", reason: "insufficient-history", seriesLength: input.series.length };
  }
  input.series.forEach((value, index) => assertNonNegativeInteger(value, `series[${index}]`));
  const mean = (values) => values.reduce((sum, value) => sum + value, 0) / values.length;
  const backtest = [];
  for (let index = input.window; index < input.series.length; index += 1) {
    const predicted = mean(input.series.slice(index - input.window, index));
    backtest.push({ index, predicted: round(predicted), actual: input.series[index], absoluteError: round(Math.abs(predicted - input.series[index])) });
  }
  const history = input.series.slice(-input.window);
  const forecast = [];
  for (let index = 0; index < input.horizon; index += 1) {
    const predicted = round(mean(history.slice(-input.window)));
    forecast.push(predicted);
    history.push(predicted);
  }
  const mae = backtest.length === 0
    ? null
    : round(backtest.reduce((sum, point) => sum + point.absoluteError, 0) / backtest.length);
  return {
    status: "ACCEPTED",
    decision: "forecast-ready-for-review",
    method: "simple-moving-average",
    window: input.window,
    horizon: input.horizon,
    forecast,
    backtest,
    meanAbsoluteError: mae,
    validationBoundary: "synthetic-temporal-holdout"
  };
}

const FUNCTIONAL_VALIDATION_CASES = [
  {
    testId: "FVT-001",
    featureId: 1,
    featureAr: "السلة الذكية",
    featureEn: "Smart Basket",
    operation: "evaluateSmartBasket",
    execute: evaluateSmartBasket,
    normalInput: {
      items: [
        { sku: "RICE-5", quantity: 2, unitPriceMinor: 1250, availableQuantity: 4 },
        { sku: "OIL-1", quantity: 1, unitPriceMinor: 1850, availableQuantity: 5 },
        { sku: "DATE-1", quantity: 3, unitPriceMinor: 900, availableQuantity: 3 }
      ]
    },
    normalExpected: { status: "ACCEPTED", decision: "basket-ready", totalMinor: 7050, unitCount: 6 },
    safetyInput: { items: [{ sku: "RICE-5", quantity: 5, unitPriceMinor: 1250, availableQuantity: 4 }] },
    safetyExpected: { status: "HOLD", reason: "inventory-insufficient" },
    sensitivityInput: { items: [{ sku: "RICE-5", quantity: 3, unitPriceMinor: 1250, availableQuantity: 4 }] },
    missingInput: {},
    missingError: /items/
  },
  {
    testId: "FVT-002",
    featureId: 2,
    featureAr: "المزاد العكسي الذكي",
    featureEn: "Smart Reverse Auction™",
    operation: "evaluateReverseAuction",
    execute: evaluateReverseAuction,
    normalInput: {
      demandQuantity: 100,
      maximumUnitPriceMinor: 1200,
      offers: [
        { supplierId: "SUP-A", quantity: 100, unitPriceMinor: 1100 },
        { supplierId: "SUP-B", quantity: 80, unitPriceMinor: 1050 },
        { supplierId: "SUP-C", quantity: 150, unitPriceMinor: 1150 }
      ]
    },
    normalExpected: { status: "ACCEPTED", decision: "offer-selected", selectedSupplierId: "SUP-A", totalMinor: 110000 },
    safetyInput: {
      demandQuantity: 100,
      maximumUnitPriceMinor: 1000,
      offers: [{ supplierId: "SUP-A", quantity: 100, unitPriceMinor: 1100 }]
    },
    safetyExpected: { status: "HOLD", reason: "no-eligible-offer" },
    sensitivityInput: {
      demandQuantity: 100,
      maximumUnitPriceMinor: 1000,
      offers: [
        { supplierId: "SUP-A", quantity: 100, unitPriceMinor: 950 },
        { supplierId: "SUP-B", quantity: 100, unitPriceMinor: 980 }
      ]
    },
    missingInput: { offers: [] },
    missingError: /demandQuantity/
  },
  {
    testId: "FVT-003",
    featureId: 3,
    featureAr: "التقارير المحاسبية المؤتمتة والقابلة للطباعة",
    featureEn: "Automated & Printable Accounting Reports™",
    operation: "evaluateAccountingReport",
    execute: evaluateAccountingReport,
    normalInput: {
      entries: [
        { entryId: "T-001", account: "inventory", debitMinor: 7050, creditMinor: 0 },
        { entryId: "T-001", account: "payable", debitMinor: 0, creditMinor: 7050 }
      ]
    },
    normalExpected: { status: "ACCEPTED", decision: "report-ready-for-review", balanced: true, debitMinor: 7050, creditMinor: 7050, rowCount: 2 },
    safetyInput: {
      entries: [
        { entryId: "T-001", account: "inventory", debitMinor: 7050, creditMinor: 0 },
        { entryId: "T-001", account: "payable", debitMinor: 0, creditMinor: 7000 }
      ]
    },
    safetyExpected: { status: "HOLD", reason: "unbalanced-ledger", balanced: false },
    sensitivityInput: {
      entries: [
        { entryId: "T-001", account: "inventory", debitMinor: 7050, creditMinor: 0 },
        { entryId: "T-001", account: "payable", debitMinor: 0, creditMinor: 7050 },
        { entryId: "T-002", account: "review", debitMinor: 1, creditMinor: 0 }
      ]
    },
    missingInput: {},
    missingError: /entries/
  },
  {
    testId: "FVT-004",
    featureId: 4,
    featureAr: "محرك الهوية الرقمية الآمنة",
    featureEn: "Secure Digital Identity Engine™",
    operation: "evaluateDigitalIdentity",
    execute: evaluateDigitalIdentity,
    normalInput: {
      subjectId: "merchant-demo-001",
      evidence: [
        { type: "registration", reference: "REG-001", verified: true },
        { type: "contact", reference: "CONTACT-001", verified: true }
      ]
    },
    normalExpected: { status: "ACCEPTED", decision: "identity-evidence-complete", evidenceCount: 2, verificationMode: "synthetic-evidence-check" },
    safetyInput: {
      subjectId: "merchant-demo-001",
      evidence: [
        { type: "registration", reference: "REG-001", verified: true },
        { type: "contact", reference: "CONTACT-001", verified: false }
      ]
    },
    safetyExpected: { status: "HOLD", reason: "unverified-evidence" },
    sensitivityInput: {
      subjectId: "merchant-demo-001",
      evidence: [
        { type: "registration", reference: "REG-001", verified: true },
        { type: "contact", reference: "CONTACT-001", verified: true },
        { type: "licence", reference: "LIC-001", verified: true }
      ]
    },
    missingInput: { subjectId: "merchant-demo-001" },
    missingError: /evidence/
  },
  {
    testId: "FVT-005",
    featureId: 5,
    featureAr: "نظام المزادات الخيرية الموجّهة",
    featureEn: "Charity-Oriented Auctions™",
    operation: "evaluateCharityAuction",
    execute: evaluateCharityAuction,
    normalInput: {
      lotId: "LOT-CHARITY-001",
      reservePriceMinor: 5000,
      bids: [
        { bidderId: "DONOR-2", amountMinor: 6500, donorConsent: true },
        { bidderId: "DONOR-1", amountMinor: 6500, donorConsent: true },
        { bidderId: "DONOR-3", amountMinor: 4000, donorConsent: true },
        { bidderId: "DONOR-4", amountMinor: 9000, donorConsent: false }
      ]
    },
    normalExpected: { status: "ACCEPTED", decision: "charity-allocation-ready", winningBidderId: "DONOR-1", winningAmountMinor: 6500, charityAllocationMinor: 6500 },
    safetyInput: {
      lotId: "LOT-CHARITY-001",
      reservePriceMinor: 10000,
      bids: [{ bidderId: "DONOR-1", amountMinor: 6500, donorConsent: true }]
    },
    safetyExpected: { status: "HOLD", reason: "reserve-not-met" },
    sensitivityInput: {
      lotId: "LOT-CHARITY-001",
      reservePriceMinor: 5000,
      bids: [{ bidderId: "DONOR-1", amountMinor: 7500, donorConsent: true }]
    },
    missingInput: { lotId: "LOT-CHARITY-001", bids: [] },
    missingError: /reservePriceMinor/
  },
  {
    testId: "FVT-006",
    featureId: 6,
    featureAr: "نظام الذكاء الاصطناعي للتنبؤ بالطلب",
    featureEn: "AI Demand Forecasting Engine™",
    operation: "evaluateDemandForecast",
    execute: evaluateDemandForecast,
    normalInput: { series: [100, 110, 120, 130, 120, 140], window: 3, horizon: 2 },
    normalExpected: { status: "ACCEPTED", decision: "forecast-ready-for-review", method: "simple-moving-average", forecast: [130, 130], horizon: 2, validationBoundary: "synthetic-temporal-holdout" },
    safetyInput: { series: [100, 110, 120, 130], window: 4, horizon: 2 },
    safetyExpected: { status: "HOLD", reason: "insufficient-history" },
    sensitivityInput: { series: [100, 110, 120, 130, 120, 200], window: 3, horizon: 2 },
    missingInput: { series: [100, 110, 120, 130], window: 3 },
    missingError: /horizon/
  }
];

function runScenario(testCase, label, input, expected, expectedError) {
  try {
    const output = testCase.execute(input);
    const pass = expected ? matchesExpected(output, expected) : false;
    return {
      label,
      status: pass ? "PASS" : "FAIL",
      output,
      outputDigest: digest(output),
      expected: expected || null,
      error: null
    };
  } catch (error) {
    const pass = Boolean(expectedError && expectedError.test(error.message));
    return {
      label,
      status: pass ? "PASS" : "FAIL",
      output: null,
      outputDigest: null,
      expected: null,
      error: error.message
    };
  }
}

function runFunctionalValidation() {
  const results = FUNCTIONAL_VALIDATION_CASES.map((testCase) => {
    const normal = runScenario(testCase, "normal", testCase.normalInput, testCase.normalExpected);
    const safety = runScenario(testCase, "safety-gate", testCase.safetyInput, testCase.safetyExpected);
    const missing = runScenario(testCase, "missing-input", testCase.missingInput, null, testCase.missingError);
    const replayOutput = testCase.execute(testCase.normalInput);
    const replay = {
      label: "replay",
      status: replayOutput && digest(replayOutput) === normal.outputDigest ? "PASS" : "FAIL",
      outputDigest: digest(replayOutput)
    };
    const sensitivityOutput = testCase.execute(testCase.sensitivityInput);
    const sensitivity = {
      label: "sensitivity",
      status: digest(sensitivityOutput) !== normal.outputDigest ? "PASS" : "FAIL",
      outputDigest: digest(sensitivityOutput)
    };
    const passed = [normal, safety, missing, replay, sensitivity].every((scenario) => scenario.status === "PASS");
    return {
      testId: testCase.testId,
      featureId: testCase.featureId,
      featureAr: testCase.featureAr,
      featureEn: testCase.featureEn,
      operation: testCase.operation,
      status: passed ? "PASS" : "FAIL",
      scenarios: { normal, safety, missing, replay, sensitivity },
      claimBoundary: "synthetic local functional validation; not production, security, regulatory, integration, revenue, or acquisition evidence"
    };
  });
  return {
    schemaVersion: VALIDATION_SCHEMA_VERSION,
    runId: VALIDATION_RUN_ID,
    featureIds: results.map((result) => result.featureId),
    totalFeatures: results.length,
    passedFeatures: results.filter((result) => result.status === "PASS").length,
    failedFeatures: results.filter((result) => result.status !== "PASS").length,
    scenarioCount: results.reduce((sum, result) => sum + Object.keys(result.scenarios).length, 0),
    passedScenarios: results.reduce((sum, result) => sum + Object.values(result.scenarios).filter((scenario) => scenario.status === "PASS").length, 0),
    results,
    reproducibility: {
      deterministicInputs: true,
      replayDigestChecked: true,
      externalConnections: false,
      dataClassification: "synthetic"
    }
  };
}

function buildEvidenceLedger(validation) {
  const entries = [];
  let previousDigest = null;
  for (const result of validation.results) {
    for (const scenario of Object.values(result.scenarios)) {
      const payload = {
        evidenceId: `${result.testId}-${scenario.label}`,
        runId: validation.runId,
        featureId: result.featureId,
        testId: result.testId,
        scenario: scenario.label,
        status: scenario.status,
        outputDigest: scenario.outputDigest,
        expected: scenario.expected,
        error: scenario.error,
        previousDigest
      };
      const entryDigest = digest(payload);
      const entry = { ...payload, entryDigest };
      entries.push(entry);
      previousDigest = entryDigest;
    }
  }
  return entries;
}

function verifyEvidenceLedger(entries) {
  let previousDigest = null;
  for (const entry of entries) {
    const { entryDigest, ...payload } = entry;
    if (entry.previousDigest !== previousDigest || digest(payload) !== entryDigest) return false;
    previousDigest = entryDigest;
  }
  return true;
}

module.exports = {
  VALIDATION_SCHEMA_VERSION,
  VALIDATION_RUN_ID,
  FUNCTIONAL_VALIDATION_CASES,
  evaluateSmartBasket,
  evaluateReverseAuction,
  evaluateAccountingReport,
  evaluateDigitalIdentity,
  evaluateCharityAuction,
  evaluateDemandForecast,
  canonicalize,
  digest,
  runFunctionalValidation,
  buildEvidenceLedger,
  verifyEvidenceLedger
};
