const SCENARIO_REFERENCE_BY_DOMAIN = {
  commerce: "السيناريو 1: السلة من الطلب إلى التسليم",
  finance: "مسار نطاق المالية: التقارير المحاسبية الآلية",
  stores: "السيناريو 1: حجز المخزون وإعادة التوريد",
  "supply-chain": "السيناريو 3: التوريد وإثبات المنشأ",
  logistics: "السيناريو 1: توزيع المسار وإثبات التسليم",
  merchant: "السيناريو 2: تاجر جديد إلى قبول موثّق",
  payments: "السيناريو 4: معاملة شرعية مع حارس وقواعد",
  impact: "السيناريو 5: تبرع ووقف قابلان للتتبع",
  analytics: "السيناريو 6: استباق أزمة غذائية",
  governance: "السيناريو 4: معاملة شرعية مع حارس وقواعد"
};

const EVIDENCE_PROFILES = {
  demonstrated: {
    implementationEvidence: "browser-rendered-simulation",
    implementationEvidenceLabel: "محاكاة داخل المتصفح ببيانات اصطناعية",
    verificationStatus: "verified-browser-demonstration",
    verificationLabel: "متحقق كمسار عرض قابل لإعادة التشغيل",
    testReference: "tests/feature-acceptance.test.cjs: browser search rendering acceptance; tests/registry.test.cjs: registry status",
    nextEvidence: "تنفيذ قابل للفحص، بيانات اختبار قابلة لإعادة التشغيل، وتحقق مستقل من السلوك والأمن والأداء",
    claimBoundary: "لا يثبت إنتاجاً أو تكاملاً حياً أو إيراداً"
  },
  architecture: {
    implementationEvidence: "feature-register-and-architecture",
    implementationEvidenceLabel: "سجل ميزة ومعمارية معلنة فقط",
    verificationStatus: "not-implemented-in-public-mvp",
    verificationLabel: "غير منفذ في النسخة العامة الحالية",
    testReference: "tests/registry.test.cjs: registry inclusion only; feature acceptance test absent",
    nextEvidence: "خدمة منفذة، عقد واجهة، اختبار قبول، وسجل تشغيل أو نتيجة إثبات قيمة",
    claimBoundary: "لا يثبت قابلية تشغيل أو تكاملاً أو أداءً تجارياً"
  },
  reserved: {
    implementationEvidence: "historical-registry-lineage",
    implementationEvidenceLabel: "سجل تاريخي محجوز أو مدمج",
    verificationStatus: "excluded-from-defined-feature-coverage",
    verificationLabel: "مستبعد من عدّاد الميزات المعرفة",
    testReference: "tests/registry.test.cjs: reserved and deduplication assertions",
    nextEvidence: "لا يوجد؛ يبقى السجل محفوظاً للتدقيق ولا يعاد تقديمه كميزة مستقلة",
    claimBoundary: "لا يجوز استخدامه لإثبات ميزة منفذة"
  }
};

let sourceFeatures;
let sourceRegistryStats;

if (typeof module !== "undefined" && module.exports) {
  const registry = require("./features.js");
  sourceFeatures = registry.FEATURES;
  sourceRegistryStats = registry.REGISTRY_STATS;
} else {
  sourceFeatures = FEATURES;
  sourceRegistryStats = REGISTRY_STATS;
}

function buildEvidenceRow(feature) {
  const profile = EVIDENCE_PROFILES[feature.status];
  const isReserved = feature.status === "reserved";
  const domainPath = feature.domainLabel || feature.domain;

  return {
    featureId: feature.id,
    legacyIds: feature.legacyIds,
    ar: feature.ar,
    en: feature.en,
    domain: feature.domain,
    domainLabel: domainPath,
    registryStatus: feature.status,
    displayPath: isReserved
      ? `السجل الموحد ← السجل #${feature.id}`
      : feature.status === "demonstrated"
        ? `لوحة القيادة ← ${domainPath} ← الميزات المرتبطة ← السجل #${feature.id}`
        : `المعمارية العامة ← ${domainPath} ← السجل الموحد #${feature.id}`,
    scenarioReference: isReserved
      ? "لا يوجد؛ السجل محجوز أو مدمج"
      : feature.status === "demonstrated"
        ? (SCENARIO_REFERENCE_BY_DOMAIN[feature.domain] || "مسار النطاق التشغيلي")
        : "لا يوجد مسار محاكاة خاص في النسخة العامة",
    implementationEvidence: profile.implementationEvidence,
    implementationEvidenceLabel: profile.implementationEvidenceLabel,
    testReference: profile.testReference,
    featureAcceptanceTestStatus: feature.status === "demonstrated" ? "created" : "not-created",
    verificationStatus: profile.verificationStatus,
    verificationLabel: profile.verificationLabel,
    liveIntegrationEvidence: false,
    revenueEvidence: false,
    acquisitionValuationSupport: false,
    nextEvidence: profile.nextEvidence,
    claimBoundary: profile.claimBoundary
  };
}

const EVIDENCE_MATRIX = sourceFeatures.map(buildEvidenceRow);

const EVIDENCE_MATRIX_STATS = {
  matrixVersion: "1.0.0",
  sourceHistoricalRecords: sourceRegistryStats.historicalRecords,
  sourceCanonicalRecords: sourceRegistryStats.canonicalRecords,
  definedFeatureRows: EVIDENCE_MATRIX.filter((row) => row.registryStatus !== "reserved").length,
  demonstratedRows: EVIDENCE_MATRIX.filter((row) => row.registryStatus === "demonstrated").length,
  architectureRows: EVIDENCE_MATRIX.filter((row) => row.registryStatus === "architecture").length,
  reservedRows: EVIDENCE_MATRIX.filter((row) => row.registryStatus === "reserved").length,
  featureSpecificAcceptanceTests: EVIDENCE_MATRIX.filter((row) => row.featureAcceptanceTestStatus === "created").length,
  liveIntegrationEvidenceRows: EVIDENCE_MATRIX.filter((row) => row.liveIntegrationEvidence).length,
  revenueEvidenceRows: EVIDENCE_MATRIX.filter((row) => row.revenueEvidence).length,
  acquisitionValuationSupportRows: EVIDENCE_MATRIX.filter((row) => row.acquisitionValuationSupport).length
};

if (typeof module !== "undefined") {
  module.exports = {
    SCENARIO_REFERENCE_BY_DOMAIN,
    EVIDENCE_PROFILES,
    buildEvidenceRow,
    EVIDENCE_MATRIX,
    EVIDENCE_MATRIX_STATS
  };
}
