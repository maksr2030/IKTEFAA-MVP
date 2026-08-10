const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const root = path.resolve(__dirname, "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");

test("browser assets are syntactically valid", () => {
  for (const file of ["app.js", "features.js", "integration-contract.js"]) {
    const result = spawnSync(process.execPath, ["--check", path.join(root, file)], { encoding: "utf8" });
    assert.equal(result.status, 0, `${file}: ${result.stderr}`);
  }
});

test("public interface declares the simulation boundary", () => {
  const index = read("index.html");
  const app = read("app.js");
  assert.match(index, /البيانات المعروضة تجريبية/);
  assert.match(app, /بيانات محاكاة/);
  assert.match(app, /لا يوجد تكامل حي/);
  assert.doesNotMatch(app, /<strong>LIVE<\/strong>/);
});
