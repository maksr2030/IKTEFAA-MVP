const FEATURE_ACCEPTANCE_CASES = [
  { testId: "FAT-001", featureId: 1, route: "commerce", query: "1", expectedText: "السلة الذكية", expectedEnglish: "Smart Basket" },
  { testId: "FAT-002", featureId: 2, route: "commerce", query: "2", expectedText: "المزاد العكسي الذكي", expectedEnglish: "Smart Reverse Auction™" },
  { testId: "FAT-003", featureId: 3, route: "finance", query: "3", expectedText: "التقارير المحاسبية المؤتمتة والقابلة للطباعة", expectedEnglish: "Automated & Printable Accounting Reports™" },
  { testId: "FAT-004", featureId: 4, route: "governance", query: "4", expectedText: "محرك الهوية الرقمية الآمنة", expectedEnglish: "Secure Digital Identity Engine™" },
  { testId: "FAT-005", featureId: 5, route: "impact", query: "5", expectedText: "نظام المزادات الخيرية الموجّهة", expectedEnglish: "Charity-Oriented Auctions™" },
  { testId: "FAT-006", featureId: 6, route: "analytics", query: "6", expectedText: "نظام الذكاء الاصطناعي للتنبؤ بالطلب", expectedEnglish: "AI Demand Forecasting Engine™" },
  { testId: "FAT-007", featureId: 7, route: "supply-chain", query: "7", expectedText: "تتبّع سلسلة الإمداد وإثبات المنشأ", expectedEnglish: "Supply Chain Traceability & Proof-of-Origin™" },
  { testId: "FAT-008", featureId: 8, route: "commerce", query: "8", expectedText: "نظام التوصية الذكي للمستهلكين", expectedEnglish: "Smart Consumer Recommendation Engine™" },
  { testId: "FAT-009", featureId: 10, route: "impact", query: "10", expectedText: "مؤشرات الأداء الاجتماعية والاقتصادية اللحظية", expectedEnglish: "Real-Time Socio-Economic Impact Indicators™" },
  { testId: "FAT-010", featureId: 11, route: "governance", query: "11", expectedText: "أمن ما بعد الكم وإدارة المفاتيح المؤسسية", expectedEnglish: "Post-Quantum Security & Enterprise Key Management™" },
  { testId: "FAT-011", featureId: 12, route: "governance", query: "12", expectedText: "التكامل مع الأنظمة الحكومية والامتثال التنظيمي", expectedEnglish: "Government Integration & Regulatory Compliance™" },
  { testId: "FAT-012", featureId: 26, route: "supply-chain", query: "26", expectedText: "نظام تتبع الأغذية من المزرعة إلى المستهلك", expectedEnglish: "Farm-to-Fork Food Security Tracker™" },
  { testId: "FAT-013", featureId: 27, route: "supply-chain", query: "27", expectedText: "منصة مراقبة جودة الأغذية الذكية", expectedEnglish: "Smart Food Quality Monitoring Platform™" },
  { testId: "FAT-014", featureId: 65, route: "commerce", query: "65", expectedText: "سوق الغذاء حسب الطلب اللحظي", expectedEnglish: "Real-Time On-Demand Food Market™" },
  { testId: "FAT-015", featureId: 67, route: "supply-chain", query: "67", expectedText: "برنامج الموردين الاستراتيجي", expectedEnglish: "Strategic Supplier Program" },
  { testId: "FAT-016", featureId: 68, route: "governance", query: "68", expectedText: "منسّق نموذج الابتكار الأخلاقي المتكامل", expectedEnglish: "Integrated Ethical Innovation Model Orchestrator – IEIM Orchestrator™" },
  { testId: "FAT-017", featureId: 69, route: "supply-chain", query: "69", expectedText: "محرك التوريد الأخلاقي والشهادات", expectedEnglish: "Ethical Sourcing & Certification Engine™" },
  { testId: "FAT-018", featureId: 73, route: "governance", query: "73", expectedText: "سجل الامتثال الشرعي والتدقيق", expectedEnglish: "Shari’ah Compliance Ledger & Audit™" },
  { testId: "FAT-019", featureId: 78, route: "merchant", query: "78", expectedText: "لوحة العمليات التجارية اللحظية", expectedEnglish: "Real-Time Merchant Operations Hub™" },
  { testId: "FAT-020", featureId: 95, route: "governance", query: "95", expectedText: "مصنّف المعاملات الشرعي اللحظي وحارس الربا", expectedEnglish: "Real-Time Shari’ah Transaction Classifier & Riba Blocker™" },
  { testId: "FAT-021", featureId: 100, route: "contracts", query: "100", expectedText: "منسّق الشروط والعقود القابل للبرمجة المتوافق شرعياً", expectedEnglish: "Shari’ah-Compliant Programmable Terms & Contract Orchestrator™" },
  { testId: "FAT-022", featureId: 101, route: "governance", query: "101", expectedText: "جواز مخاطر المدفوعات الشرعي القابل للتحقق", expectedEnglish: "Unified Shari’ah Payment Identity Graph & Risk Passport™" },
  { testId: "FAT-023", featureId: 102, route: "governance", query: "102", expectedText: "الحارس الشرعي الآلي للمعاملات", expectedEnglish: "Automated Shari’ah Transaction Guardian™" }
];

const FEATURE_ACCEPTANCE_IDS = new Set(FEATURE_ACCEPTANCE_CASES.map((testCase) => testCase.featureId));

if (typeof module !== "undefined") {
  module.exports = { FEATURE_ACCEPTANCE_CASES, FEATURE_ACCEPTANCE_IDS };
}
