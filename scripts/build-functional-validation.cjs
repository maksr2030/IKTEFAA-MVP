"use strict";

const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const {
  FUNCTIONAL_VALIDATION_CASES,
  runFunctionalValidation,
  buildEvidenceLedger,
  verifyEvidenceLedger,
  digest
} = require("../functional-validation.js");

const root = path.resolve(__dirname, "..");
const validation = runFunctionalValidation();
const ledger = buildEvidenceLedger(validation);
if (!verifyEvidenceLedger(ledger)) throw new Error("Functional evidence ledger failed chain verification");

const validationArtifact = {
  validation,
  caseDefinitions: FUNCTIONAL_VALIDATION_CASES.map(({ execute, ...definition }) => definition),
  ledgerSummary: {
    entries: ledger.length,
    chainVerified: true,
    firstEntryDigest: ledger[0]?.entryDigest || null,
    lastEntryDigest: ledger.at(-1)?.entryDigest || null
  }
};

const reportRows = validation.results.map((result) => {
  const scenarioStatus = Object.values(result.scenarios).map((scenario) => `${scenario.label}: ${scenario.status}`).join("; ");
  return `| ${result.testId} | ${result.featureId} | ${result.featureAr} | ${result.featureEn} | ${result.status} | ${scenarioStatus} |`;
}).join("\n");

const report = [
  "# IKTEFAA 3.0 Functional Validation and Evidence Hardening",
  "",
  "هذه الحزمة تحقق وظيفي محلي حتمي للميزات F01 إلى F06 في النسخة العامة من اكتفاء. جميع المدخلات اصطناعية ومثبتة داخل `functional-validation.js`.",
  "",
  "## Result",
  "",
  `- معرّف التشغيل: \`${validation.runId}\``,
  `- الميزات المختبرة: ${validation.totalFeatures}`,
  `- الميزات الناجحة: ${validation.passedFeatures}`,
  `- الميزات الفاشلة: ${validation.failedFeatures}`,
  `- السيناريوهات المنفذة: ${validation.scenarioCount}`,
  `- السيناريوهات الناجحة: ${validation.passedScenarios}`,
  "- الاتصالات الخارجية: صفر",
  "- تصنيف البيانات: اصطناعية",
  "- تحقق سلسلة سجل الأدلة: ناجح",
  "",
  "## Feature coverage",
  "",
  "| الاختبار | المعرّف | الميزة | الاسم الإنجليزي | الحالة | السيناريوهات |",
  "| --- | ---: | --- | --- | --- | --- |",
  reportRows,
  "",
  "## Validation controls",
  "",
  "تحتوي كل ميزة على اختبار مسار طبيعي، وبوابة أمان تتطلب HOLD عند وجود حالة غير مقبولة، واختبار مدخل ناقص، وإعادة تشغيل للتحقق من ثبات البصمة، واختبار حساسية يثبت أن تغيير المدخل يغير النتيجة.",
  "",
  "بالنسبة للتنبؤ بالطلب، يتضمن الاختبار تحققاً زمنياً اصطناعياً بطريقة متوسط متحرك واختباراً رجعياً داخلياً. هذه النتيجة لا تثبت دقة تشغيلية أو أداءً إنتاجياً أو ملاءمة تجارية.",
  "",
  "## Evidence files",
  "",
  "- `functional-validation.json`: تعريفات الحالات والنتائج والبصمات.",
  "- `functional-evidence-ledger.jsonl`: سجل أدلة متسلسل لكل سيناريو.",
  "- `functional-hash-manifest.sha256.json`: بصمات ملفات المخرجات.",
  "- `FUNCTIONAL_VALIDATION_REPORT.md`: التقرير القابل للقراءة.",
  "",
  "## Claim boundary",
  "",
  "تثبت هذه المرحلة سلوكاً محلياً حتمياً لمدخلات اصطناعية محددة فقط. لا تثبت التكاملات الحية، أو الأمن، أو الأداء، أو التوافر، أو الامتثال التنظيمي، أو الاعتماد الشرعي، أو الإيرادات، أو قيمة الاستحواذ، أو صلاحية الاستخدام في قرارات تشغيلية حقيقية.",
  "",
  "## Reproduction",
  "",
  "```bash",
  "node scripts/build-functional-validation.cjs",
  "node --test tests/functional-validation.test.cjs",
  "```",
  ""
].join("\n");

const artifacts = {
  "functional-validation.json": JSON.stringify(validationArtifact, null, 2) + "\n",
  "functional-evidence-ledger.jsonl": ledger.map((entry) => JSON.stringify(entry)).join("\n") + "\n",
  "FUNCTIONAL_VALIDATION_REPORT.md": report
};

for (const [relativePath, content] of Object.entries(artifacts)) {
  fs.writeFileSync(path.join(root, relativePath), content);
}

const hashManifest = {
  schemaVersion: "1.0.0",
  runId: validation.runId,
  files: Object.fromEntries(Object.keys(artifacts).map((relativePath) => [
    relativePath,
    crypto.createHash("sha256").update(artifacts[relativePath]).digest("hex")
  ])),
  manifestDigest: digest(Object.fromEntries(Object.keys(artifacts).map((relativePath) => [
    relativePath,
    crypto.createHash("sha256").update(artifacts[relativePath]).digest("hex")
  ])))
};
fs.writeFileSync(path.join(root, "functional-hash-manifest.sha256.json"), JSON.stringify(hashManifest, null, 2) + "\n");

console.log(JSON.stringify({
  generated: [...Object.keys(artifacts), "functional-hash-manifest.sha256.json"],
  summary: {
    runId: validation.runId,
    totalFeatures: validation.totalFeatures,
    passedFeatures: validation.passedFeatures,
    scenarioCount: validation.scenarioCount,
    passedScenarios: validation.passedScenarios,
    ledgerEntries: ledger.length,
    chainVerified: true
  }
}, null, 2));
