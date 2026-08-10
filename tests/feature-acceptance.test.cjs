const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { FEATURES, REGISTRY_STATS } = require("../features.js");
const { EVIDENCE_MATRIX } = require("../evidence-matrix.js");
const { FEATURE_ACCEPTANCE_CASES, FEATURE_ACCEPTANCE_IDS } = require("../feature-acceptance.js");

const root = path.resolve(__dirname, "..");
const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const escapeHtml = (value) => value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");

function createBrowserHarness() {
  const elements = new Map();
  const routes = [
    "overview", "commerce", "finance", "stores", "supply-chain", "logistics",
    "merchant", "payments", "impact", "analytics", "governance", "features",
    "evidence", "scenarios", "architecture"
  ];

  class FakeElement {
    constructor(id, dataset = {}) {
      this.id = id;
      this.dataset = dataset;
      this.listeners = new Map();
      this.textContent = "";
      this.value = "";
      this.disabled = false;
      this.innerHTML = "";
      this.count = { textContent: "" };
      this.classList = { toggle() {} };
    }

    addEventListener(type, listener) {
      this.listeners.set(type, listener);
    }

    dispatch(type, event = {}) {
      const listener = this.listeners.get(type);
      if (listener) listener({ ...event, target: event.target || this });
    }

    click() {
      this.dispatch("click", { target: this });
    }

    focus() {}

    querySelector(selector) {
      return selector === ".count" ? this.count : null;
    }
  }

  const app = new FakeElement("app");
  const toast = new FakeElement("toast");
  const pageTitle = new FakeElement("page-title");
  const pageSubtitle = new FakeElement("page-subtitle");
  const featureSearch = new FakeElement("feature-search");
  const featureDomain = new FakeElement("feature-domain");
  const evidenceSearch = new FakeElement("evidence-search");
  const evidenceStatus = new FakeElement("evidence-status");
  const runDemo = new FakeElement("run-demo");
  const demoReset = new FakeElement("demo-reset");
  const routeElements = routes.map((route) => new FakeElement(`route-${route}`, { route }));
  const byId = new Map([
    ["app", app], ["toast", toast], ["page-title", pageTitle], ["page-subtitle", pageSubtitle],
    ["feature-search", featureSearch], ["feature-domain", featureDomain],
    ["evidence-search", evidenceSearch], ["evidence-status", evidenceStatus],
    ["run-demo", runDemo], ["demo-reset", demoReset]
  ]);
  for (const element of routeElements) byId.set(element.id, element);

  const document = {
    getElementById(id) {
      if (!byId.has(id)) byId.set(id, new FakeElement(id));
      return byId.get(id);
    },
    querySelectorAll(selector) {
      if (selector === "[data-route]" || selector === ".nav button") return routeElements;
      return [];
    }
  };

  const context = vm.createContext({
    console,
    document,
    window: { scrollTo() {} },
    setTimeout,
    clearTimeout
  });
  for (const file of ["features.js", "evidence-matrix.js", "app.js"]) {
    vm.runInContext(fs.readFileSync(path.join(root, file), "utf8"), context, { filename: file });
  }

  return {
    app,
    routes: new Map(routeElements.map((element) => [element.dataset.route, element])),
    featureSearch,
    selectFeature(featureId, query = String(featureId)) {
      this.routes.get("features").click();
      featureSearch.dispatch("input", { target: { value: query } });
    }
  };
}

test("acceptance definitions cover exactly the 23 demonstrated registry features", () => {
  const demonstrated = FEATURES.filter((feature) => feature.status === "demonstrated");
  assert.equal(demonstrated.length, 23);
  assert.equal(FEATURE_ACCEPTANCE_CASES.length, 23);
  assert.equal(FEATURE_ACCEPTANCE_IDS.size, 23);
  assert.deepEqual(
    [...FEATURE_ACCEPTANCE_IDS].sort((a, b) => a - b),
    demonstrated.map((feature) => feature.id).sort((a, b) => a - b)
  );
});

test("each acceptance definition remains tied to its canonical record and evidence row", () => {
  for (const testCase of FEATURE_ACCEPTANCE_CASES) {
    const feature = FEATURES.find((candidate) => candidate.id === testCase.featureId);
    const row = EVIDENCE_MATRIX.find((candidate) => candidate.featureId === testCase.featureId);
    assert.ok(feature, `${testCase.testId}: canonical feature is missing`);
    assert.equal(feature.status, "demonstrated", `${testCase.testId}: feature is not demonstrated`);
    assert.equal(feature.domain, testCase.route, `${testCase.testId}: route does not match domain`);
    assert.ok(row, `${testCase.testId}: evidence row is missing`);
    assert.equal(row.featureAcceptanceTestStatus, "created", `${testCase.testId}: evidence status is stale`);
    assert.match(row.testReference, /feature-acceptance\.test\.cjs/);
    assert.equal(row.liveIntegrationEvidence, false);
    assert.equal(row.revenueEvidence, false);
    assert.equal(row.acquisitionValuationSupport, false);
  }
});

for (const testCase of FEATURE_ACCEPTANCE_CASES) {
  test(`${testCase.testId} renders feature ${testCase.featureId} through the public feature search`, () => {
    const harness = createBrowserHarness();
    harness.selectFeature(testCase.featureId, testCase.expectedText);
    assert.match(harness.app.innerHTML, new RegExp(escapeRegex(testCase.expectedText)));
    assert.match(harness.app.innerHTML, new RegExp(escapeRegex(escapeHtml(testCase.expectedEnglish))));
    assert.match(harness.app.innerHTML, /محاكاة قابلة لإعادة التشغيل/);
    assert.match(harness.app.innerHTML, /عرض 1 من 1 سجلاً موحداً/);
  });
}

test("acceptance execution keeps the public simulation boundary explicit", () => {
  const appSource = fs.readFileSync(path.join(root, "app.js"), "utf8");
  const indexSource = fs.readFileSync(path.join(root, "index.html"), "utf8");
  assert.match(appSource, /بيانات اصطناعية/);
  assert.match(appSource, /لا ترسل طلبات خارجية/);
  assert.match(indexSource, /البيانات المعروضة تجريبية/);
  assert.equal(REGISTRY_STATS.definedFeatures, 95);
});
