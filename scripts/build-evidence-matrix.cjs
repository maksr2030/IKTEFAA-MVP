const fs = require("node:fs");
const path = require("node:path");
const { EVIDENCE_MATRIX, EVIDENCE_MATRIX_STATS } = require("../evidence-matrix.js");

const root = path.resolve(__dirname, "..");

const csvEscape = (value) => {
  const text = Array.isArray(value) ? value.join("; ") : String(value ?? "");
  return `"${text.replaceAll('"', '""')}"`;
};

const csvColumns = [
  ["featureId", "المعرف"],
  ["legacyIds", "السجلات التاريخية"],
  ["ar", "الاسم العربي"],
  ["en", "الاسم الإنجليزي"],
  ["domainLabel", "النطاق"],
  ["registryStatus", "حالة السجل"],
  ["displayPath", "مسار العرض"],
  ["scenarioReference", "مرجع السيناريو"],
  ["implementationEvidenceLabel", "نوع دليل التنفيذ"],
  ["testReference", "مرجع الاختبار"],
  ["featureAcceptanceTestStatus", "اختبار القبول الخاص"],
  ["verificationLabel", "حالة التحقق"],
  ["liveIntegrationEvidence", "دليل تكامل حي"],
  ["revenueEvidence", "دليل إيراد"],
  ["acquisitionValuationSupport", "دعم تقييم الاستحواذ"],
  ["nextEvidence", "الدليل التالي المطلوب"],
  ["claimBoundary", "حد الادعاء"]
];

const csv = [
  csvColumns.map(([, label]) => csvEscape(label)).join(","),
  ...EVIDENCE_MATRIX.map((row) => csvColumns.map(([key]) => csvEscape(row[key])).join(","))
].join("\n") + "\n";

const markdownEscape = (value) => String(value ?? "").replaceAll("|", "\\|").replaceAll("\n", "<br>");
const markdownColumns = [
  ["featureId", "المعرف"],
  ["ar", "الميزة"],
  ["domainLabel", "النطاق"],
  ["registryStatus", "حالة السجل"],
  ["displayPath", "مسار العرض"],
  ["testReference", "مرجع الاختبار"],
  ["verificationLabel", "حالة التحقق"],
  ["nextEvidence", "الدليل التالي المطلوب"]
];

const markdown = [
  "# IKTEFAA 3.0 Evidence Matrix",
  "",
  "هذه المصفوفة مولدة آلياً من `features.js` بواسطة `scripts/build-evidence-matrix.cjs`. وجود صف في المصفوفة يثبت قابلية التتبع فقط، ولا يثبت التنفيذ الإنتاجي.",
  "",
  `- إصدار المصفوفة: ${EVIDENCE_MATRIX_STATS.matrixVersion}`,
  `- السجلات التاريخية المصدر: ${EVIDENCE_MATRIX_STATS.sourceHistoricalRecords}`,
  `- السجلات الموحدة: ${EVIDENCE_MATRIX_STATS.sourceCanonicalRecords}`,
  `- الميزات المعرفة: ${EVIDENCE_MATRIX_STATS.definedFeatureRows}`,
  `- محاكاة المتصفح القابلة لإعادة التشغيل: ${EVIDENCE_MATRIX_STATS.demonstratedRows}`,
  `- الميزات المعمارية غير المنفذة في النسخة العامة: ${EVIDENCE_MATRIX_STATS.architectureRows}`,
  `- السجلات المحجوزة أو المدمجة: ${EVIDENCE_MATRIX_STATS.reservedRows}`,
  `- اختبارات القبول الخاصة بالميزات: ${EVIDENCE_MATRIX_STATS.featureSpecificAcceptanceTests}`,
  `- أدلة التكامل الحي: ${EVIDENCE_MATRIX_STATS.liveIntegrationEvidenceRows}`,
  `- أدلة الإيرادات: ${EVIDENCE_MATRIX_STATS.revenueEvidenceRows}`,
  `- صفوف تدعم تقييماً استحواذياً نهائياً: ${EVIDENCE_MATRIX_STATS.acquisitionValuationSupportRows}`,
  "",
  "## Interpretation",
  "",
  "الحالة `demonstrated` تعني أن مسار العرض داخل المتصفح قابل لإعادة التشغيل ببيانات اصطناعية. الحالة `architecture` تعني أن السجل يصف قدرة معمارية ولم تُثبت كخدمة منفذة في هذه النسخة العامة. الحالة `reserved` تحفظ السجل التاريخي أو الدمج ولا تدخل في عدّاد الميزات المعرفة.",
  "",
  "لا تتضمن هذه المصفوفة دليلاً على تكامل حي مع شركة، أو إيراد فعلي، أو أداء إنتاجي، أو قيمة استحواذ نهائية. هذه الأدلة تحتاج حزم تحقق مستقلة ومصادر قابلة للمراجعة.",
  "",
  "## Feature-level matrix",
  "",
  `| ${markdownColumns.map(([, label]) => label).join(" | ")} |`,
  `| ${markdownColumns.map(() => "---").join(" | ")} |`,
  ...EVIDENCE_MATRIX.map((row) => `| ${markdownColumns.map(([key]) => markdownEscape(row[key])).join(" | ")} |`),
  "",
  "## Regeneration",
  "",
  "```bash",
  "node scripts/build-evidence-matrix.cjs",
  "```",
  ""
].join("\n");

fs.writeFileSync(path.join(root, "evidence-matrix.json"), JSON.stringify({ stats: EVIDENCE_MATRIX_STATS, rows: EVIDENCE_MATRIX }, null, 2) + "\n");
fs.writeFileSync(path.join(root, "EVIDENCE_MATRIX.csv"), csv);
fs.writeFileSync(path.join(root, "EVIDENCE_MATRIX.md"), markdown);

console.log(JSON.stringify({
  generated: ["evidence-matrix.json", "EVIDENCE_MATRIX.csv", "EVIDENCE_MATRIX.md"],
  stats: EVIDENCE_MATRIX_STATS
}, null, 2));
