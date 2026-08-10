const app = document.getElementById("app");
const toast = document.getElementById("toast");
const pageTitle = document.getElementById("page-title");
const pageSubtitle = document.getElementById("page-subtitle");

const evidenceLabel = (status) => ({
  demonstrated: "محاكاة قابلة لإعادة التشغيل",
  architecture: "معمارية معلنة فقط",
  reserved: "محجوزة أو مدمجة"
}[status] || status);

const DOMAIN_CONFIG = {
  commerce: {
    title: "التجارة والأسواق",
    subtitle: "تجربة تجارة مترابطة من السلة إلى الطلب والتوصية والمزاد والسوق المتخصص.",
    icon: "▣",
    metrics: [["طلبات اليوم", "1,842", "+12.4%"], ["قيمة السلال", "286,400 ر.س", "+8.2%"], ["معدل التحويل", "7.8%", "+1.1 نقطة"]],
    actions: ["إنشاء سلة ذكية", "محاكاة مزاد عكسي", "تحليل الطلب"],
    rows: [["B-2048", "سلة تموين أسبوعية", "متجر جدة المركزي", "قيد التجهيز"], ["B-2047", "احتياج غذائي أساسي", "برنامج الأثر", "مكتمل"], ["B-2046", "طلب توريد مؤسسي", "تاجر موثّق", "تحتاج مراجعة"]]
  },
  finance: {
    title: "المحاسبة والمالية",
    subtitle: "تقارير محاسبية قابلة للمراجعة والطباعة ضمن حدود بيانات العرض الاصطناعية.",
    icon: "▤",
    metrics: [["تقارير معدة", "18", "بيانات محاكاة"], ["حركات مصنفة", "3,420", "ضمن النموذج"], ["حالات تحتاج مراجعة", "07", "مسار بشري"]],
    actions: ["إنشاء تقرير محاسبي", "مراجعة حركة مالية", "طباعة سجل العرض"],
    rows: [["AC-018", "تقرير دورة التوريد", "بيانات اصطناعية", "جاهز للمراجعة"], ["AC-017", "ملخص أثر اجتماعي", "سجل محاكاة", "قيد التدقيق"], ["AC-016", "تسوية نموذجية", "دون حركة مالية حقيقية", "للعرض فقط"]]
  },
  stores: {
    title: "المتاجر والمخزون",
    subtitle: "ربط المتاجر الفعلية بالمخزون، نقاط البيع، المستودعات، وإعادة التوريد الذكية.",
    icon: "▤",
    metrics: [["المتاجر النشطة", "28", "+3 هذا الشهر"], ["دقة المخزون", "96.4%", "+2.6%"], ["نقاط إعادة التوريد", "41", "مراقبة آلية"]],
    actions: ["عرض خريطة المخزون", "إطلاق إعادة توريد", "فتح سجل متجر"],
    rows: [["ST-001", "متجر جدة المركزي", "12,460 وحدة", "متاح"], ["ST-014", "متجر مكة الغذائي", "8,920 وحدة", "إعادة توريد"], ["WH-03", "مركز التوزيع الغربي", "64,830 وحدة", "مستقر"]]
  },
  "supply-chain": {
    title: "الإمداد والجودة",
    subtitle: "إثبات المنشأ، مراقبة الجودة، وربط الموردين وسلاسل الغذاء من المصدر إلى المستهلك.",
    icon: "⌁",
    metrics: [["شحنات متتبعة", "6,420", "منشأ موثّق"], ["فحوص الجودة", "98.1%", "مطابقة"], ["موردون نشطون", "186", "سجل ثقة"]],
    actions: ["تتبع شحنة", "فحص شهادة جودة", "إضافة مورد"],
    rows: [["SH-8841", "زيت نباتي", "مورد وطني", "منشأ موثّق"], ["SH-8840", "لحوم مبردة", "سلسلة تبريد", "فحص جارٍ"], ["SH-8839", "حبوب", "مستودع افتراضي", "تم التسليم"]]
  },
  logistics: {
    title: "اللوجستيات والأسطول",
    subtitle: "تنسيق التسليم، مسارات الأسطول، التوصيل المبرد، وسجل التنفيذ من مركز التوزيع إلى الوجهة.",
    icon: "⌖",
    metrics: [["مركبات متصلة", "74", "حالة محاكاة"], ["تسليمات اليوم", "1,206", "91% في الموعد ضمن النموذج"], ["الأسطول المبرد", "22", "مراقبة حرارة محاكاة"]],
    actions: ["توزيع المسارات", "فحص الأسطول", "تتبع التسليم"],
    rows: [["VH-021", "مسار جدة–مكة", "18 طلباً", "في الطريق"], ["VH-018", "مسار جدة الداخلي", "24 طلباً", "في الموعد"], ["VH-006", "سلسلة تبريد", "9 طلبات", "تحتاج متابعة"]]
  },
  merchant: {
    title: "شبكة التجار",
    subtitle: "هوية التاجر، سجل الثقة، الجدارة، القبول، العمليات، والولاء في طبقة موحدة.",
    icon: "♙",
    metrics: [["تجار موثّقون", "1,284", "+6.7%"], ["مؤشر الثقة", "91.8/100", "مستقر"], ["قبول الشبكة", "99.2%", "متعدد القنوات"]],
    actions: ["تسجيل تاجر", "مراجعة الثقة", "فتح مركز العمليات"],
    rows: [["MR-204", "مؤسسة غذاء المستقبل", "91/100", "موثّق"], ["MR-203", "مورد الأسرة", "88/100", "مراجعة دورية"], ["MR-202", "علامة التميز", "96/100", "شريك استراتيجي"]]
  },
  payments: {
    title: "المدفوعات والتسوية",
    subtitle: "محاكاة طبقة المحافظ والعقود والتسوية والضمان والتصنيف الشرعي وإدارة النزاعات.",
    icon: "▰",
    metrics: [["معاملات اليوم", "24,860", "مسجلة"], ["التسوية المعلّقة", "0.8%", "تحت الرقابة"], ["حالات الحظر الوقائي", "14", "مراجعة بشرية"]],
    actions: ["تصنيف معاملة", "محاكاة تسوية", "فتح سجل تدقيق"],
    rows: [["TX-89201", "بيع مؤجل", "محفظة تاجر", "مقبولة"], ["TX-89200", "مرابحة توريد", "عقد مبرمج", "تحتاج اعتماد"], ["TX-89199", "تبرع أثر", "بوابة موحدة", "مسوّاة"]]
  },
  impact: {
    title: "الأثر الاجتماعي",
    subtitle: "تحويل التجارة والموارد والغذاء إلى أثر قابل للقياس والتتبع والتوزيع العادل.",
    icon: "♧",
    metrics: [["مستفيدون نشطون", "42,680", "في النموذج"], ["سلال أثر موزعة", "8,420", "موثقة"], ["أثر قابل للقياس", "2.8 م ر.س", "قيمة تقديرية"]],
    actions: ["إنشاء حملة أثر", "تتبع تبرع", "عرض سجل الوقف"],
    rows: [["IM-5501", "سلال غذائية", "جدة", "موزعة"], ["IM-5500", "دعم أسرة", "مكة", "قيد التحقق"], ["IM-5499", "وقف غذائي", "المنطقة الغربية", "مستمر"]]
  },
  analytics: {
    title: "الذكاء والتحليلات",
    subtitle: "لوحات تنبؤية للطلب والأمن الغذائي والسلوك والأثر والتوأم الرقمي.",
    icon: "⌁",
    metrics: [["تنبؤات الطلب", "97.2%", "دقة النموذج"], ["مؤشر الأمن الغذائي", "78/100", "مراقبة"], ["تنبيهات استباقية", "32", "هذا اليوم"]],
    actions: ["تشغيل توقع الطلب", "فتح التوأم الرقمي", "تفسير تنبيه"],
    rows: [["AI-091", "الطلب على الأرز", "الأسبوع القادم", "ارتفاع متوقع"], ["AI-090", "مؤشر حي", "المنطقة الغربية", "مستقر"], ["AI-089", "خطر نفاد", "متجر مكة", "إجراء موصى به"]]
  },
  governance: {
    title: "الحوكمة والامتثال",
    subtitle: "هوية، دليل، قواعد، عقود، تدقيق، امتثال شرعي ورقابي، وقرار قابل للتفسير.",
    icon: "⌘",
    metrics: [["سجلات قابلة للتدقيق", "100%", "مترابطة"], ["قرارات تحتاج اعتماد", "17", "مسار بشري"], ["سلامة الدليل", "99.9%", "متحقق"]],
    actions: ["تشغيل حارس المعاملة", "فتح سجل الامتثال", "مراجعة قرار"],
    rows: [["EV-710", "هوية تاجر", "سجل قابل للتحقق", "مقبول"], ["EV-709", "عقد توريد", "شروط مبرمجة", "بانتظار اعتماد"], ["EV-708", "تسوية", "سلسلة دليل", "مغلقة"]]
  }
};

const state = {
  route: "overview",
  featurePage: 1,
  featureQuery: "",
  featureDomain: "all",
  evidencePage: 1,
  evidenceQuery: "",
  evidenceStatus: "all",
  events: [
    ["تم اعتماد شحنة SH-8841 مع إثبات المنشأ", "منذ 4 دقائق"],
    ["تمت مطابقة معاملة TX-89201 مع قواعد المسار", "منذ 11 دقيقة"],
    ["تم إنشاء توصية إعادة توريد لمتجر مكة", "منذ 18 دقيقة"],
    ["تم تحديث مؤشر الأمن الغذائي للمنطقة الغربية", "منذ 31 دقيقة"]
  ]
};

const esc = (value) => String(value).replace(/[&<>"']/g, (char) => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#039;"}[char]));

function showToast(message) {
  toast.textContent = message;
  toast.classList.remove("hidden");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.add("hidden"), 3200);
}

function setHeader(title, subtitle) {
  pageTitle.textContent = title;
  pageSubtitle.textContent = subtitle;
}

function renderKpis(items) {
  return `<div class="kpi-grid">${items.map(([label, value, note], index) => `<div class="card kpi ${index === 3 ? "warn" : ""}" data-evidence="synthetic"><span class="label">${esc(label)}</span><strong>${esc(value)}</strong><small>${esc(note)}</small><span class="data-badge">بيانات محاكاة</span></div>`).join("")}</div>`;
}

function renderOverview() {
  setHeader("لوحة القيادة التنفيذية", "طبقة تشغيل وتكامل محايدة لمنصات التجارة والأسواق والأنظمة المؤسسية");
  const modules = Object.entries(DOMAIN_CONFIG).map(([key, config]) => `<article class="card module"><div class="module-icon">${config.icon}</div><h4>${config.title}</h4><p>${config.subtitle}</p><button class="module-link" data-route="${key}">فتح نطاق التشغيل ←</button></article>`).join("");
  return `<section class="hero"><div><h3>اكتفاء 3.0: طبقة فوق أنظمة التجارة القائمة</h3><p>نسخة MVP عامة توضّح كيف يمكن لطبقة واحدة أن تربط التجارة، المتاجر، المخزون، الإمداد، اللوجستيات، الأسطول، التجار، المدفوعات، الحوكمة، والبرامج الاجتماعية فوق بيئات تجارة إلكترونية وتجارة متعددة القنوات قائمة، دون افتراض استبدال قنواتها أو أنظمتها.</p><div class="hero-badges"><span>محايدة تجاه المنصة</span><span>تجارة وأسواق</span><span>تكامل مؤسسي</span><span>بيانات محاكاة فقط</span></div></div><div class="hero-side"><div class="hero-metric"><strong>${REGISTRY_STATS.canonicalRecords}</strong><span>سجلات موحدة في السجل العام</span></div><div class="hero-metric"><strong>${REGISTRY_STATS.demonstratedFeatures}</strong><span>مسارات قابلة لإعادة التشغيل بالمحاكاة</span></div><div class="hero-metric"><strong>${REGISTRY_STATS.architectureFeatures}</strong><span>قدرات معمارية تحتاج تنفيذًا مستقلاً</span></div></div></section>
    <div class="section-head"><div><h3>المؤشرات التنفيذية التجريبية</h3><p>بيانات اصطناعية مخصصة لعرض مسار التشغيل، وليست بيانات فعلية.</p></div><div class="section-actions"><button class="ghost-btn" data-route="features">استعراض سجل الميزات</button></div></div>
    ${renderKpis([["إجمالي الطلبات", "12,486", "+14.8%"], ["قيمة المعاملات", "4.82 م ر.س", "+9.6%"], ["متاجر ومراكز متصلة", "28", "تشغيل مستمر"], ["تنبيهات تحتاج قراراً", "17", "مسار بشري"], ["مؤشر الأثر", "86.4/100", "+4.2 نقطة"]])}
    <div class="section-head"><div><h3>خريطة القدرات</h3><p>كل نطاق يفتح على شاشة تشغيلية مصغرة مرتبطة بسجل الميزات.</p></div></div>
    <div class="module-grid">${modules}</div>
    <div class="grid-2" style="margin-top:18px"><section class="card panel"><h4>توزيع حالة السجل</h4><p class="panel-subtitle">تصنيف تدقيقي يفرق بين ما يمكن إعادة تشغيله داخل المتصفح وما هو معمارية معلنة فقط.</p><div class="bar-list">${[["محاكاة قابلة لإعادة التشغيل", REGISTRY_STATS.demonstratedFeatures, "#15803d"], ["معمارية معلنة فقط", REGISTRY_STATS.architectureFeatures, "#1261a0"], ["محجوزة أو مدمجة", REGISTRY_STATS.reservedRecords, "#b7791f"]].map(([name, value, color]) => `<div class="bar-row"><div class="bar-meta"><span>${name}</span><span>${value}</span></div><div class="bar-track"><div class="bar-fill" style="width:${(value / REGISTRY_STATS.canonicalRecords) * 100}%;background:${color}"></div></div></div>`).join("")}</div></section><section class="card panel"><h4>آخر الأحداث في النموذج</h4><p class="panel-subtitle">سجل محاكاة محلي، وليس سجلاً تشغيلياً أو مالياً.</p><div class="activity-list">${state.events.map(([text, time]) => `<div class="activity"><i class="activity-dot"></i><div><strong>${text}</strong><small>${time}</small></div></div>`).join("")}</div></section></div>`;
}

function renderDomain(route) {
  const config = DOMAIN_CONFIG[route];
  setHeader(config.title, config.subtitle);
  const related = FEATURES.filter((feature) => feature.domain === route);
  const rows = config.rows.map(([id, item, source, status]) => `<tr><td class="feature-id">${id}</td><td>${item}</td><td>${source}</td><td><span class="tag ${status.includes("مراجعة") || status.includes("جارٍ") || status.includes("متابعة") ? "reserved" : "demo"}">${status}</span></td></tr>`).join("");
  return `<section class="hero"><div><h3>${config.title}</h3><p>${config.subtitle} هذه الشاشة تمثل طبقة تشغيلية مصغرة من المشروع الكامل، مع مؤشرات وحالات قابلة للفحص.</p><div class="hero-badges"><span>${related.length} سجل مرتبط</span><span>بيانات محاكاة</span><span>لا يوجد تكامل حي</span></div></div><div class="hero-side"><div class="hero-metric"><strong>${related.length}</strong><span>سجل في هذا النطاق</span></div><div class="hero-metric"><strong>${config.metrics[0][1]}</strong><span>${config.metrics[0][0]} محاكاة</span></div><div class="hero-metric"><strong>DEMO</strong><span>حالة العرض المحلي</span></div></div></section>
  <div class="section-head"><div><h3>مؤشرات النطاق</h3><p>جميع القيم التالية اصطناعية لأغراض العرض ولا تثبت أداءً إنتاجياً.</p></div></div>${renderKpis(config.metrics.concat([["قرارات قيد المراجعة", "17", "مسار محاكاة"], ["سلامة سجل الدليل", "99.9%", "مؤشر اصطناعي"]]))}
  <div class="grid-2" style="margin-top:18px"><section class="card panel"><h4>إجراءات التشغيل</h4><p class="panel-subtitle">كل إجراء يوضح نقطة يمكن تحويلها إلى خدمة أو واجهة تشغيل في النسخة الإنتاجية.</p><div class="scenario-grid" style="grid-template-columns:1fr">${config.actions.map((action, index) => `<button class="ghost-btn" data-action="${esc(action)}" style="text-align:right">${index + 1}. ${action} <span style="float:left;color:#1261a0">←</span></button>`).join("")}</div></section><section class="card panel"><h4>الميزات المرتبطة</h4><p class="panel-subtitle">روابط مباشرة إلى سجل الميزات العامة.</p><div class="bar-list">${related.slice(0, 7).map((feature) => `<div class="bar-row"><div class="bar-meta"><span>${feature.id}. ${feature.ar}</span><span>${evidenceLabel(feature.status)}</span></div><div class="bar-track"><div class="bar-fill" style="width:${feature.status === "demonstrated" ? 84 : 56}%"></div></div></div>`).join("")}</div><button class="primary-btn" data-route="features" style="margin-top:16px">عرض السجل الكامل</button></section></div>
  <section class="card page-card" style="margin-top:18px"><div class="section-head" style="margin-top:0"><div><h3>حالات تشغيل نموذجية</h3><p>السجل التالي يبين كيف يظهر النطاق في واجهة عمل مستثمر أو مشغل مؤسسي.</p></div></div><div style="overflow-x:auto"><table class="feature-table"><thead><tr><th>المعرف</th><th>الحالة أو الكيان</th><th>المصدر أو المسار</th><th>الحالة</th></tr></thead><tbody>${rows}</tbody></table></div></section>`;
}

function renderFeatures() {
  setHeader("سجل الميزات الموحد", "100 سجل موحد من 103 سجلات تاريخية، مع حفظ روابط الدمج للتدقيق");
  const query = state.featureQuery.trim().toLowerCase();
  const filtered = FEATURES.filter((feature) => {
    const matchesQuery = !query || `${feature.id} ${feature.ar} ${feature.en}`.toLowerCase().includes(query);
    const matchesDomain = state.featureDomain === "all" || feature.domain === state.featureDomain;
    return matchesQuery && matchesDomain;
  });
  const perPage = 15;
  const pages = Math.max(1, Math.ceil(filtered.length / perPage));
  state.featurePage = Math.min(state.featurePage, pages);
  const visible = filtered.slice((state.featurePage - 1) * perPage, state.featurePage * perPage);
  const body = visible.length ? visible.map((feature) => `<tr><td class="feature-id">${feature.id}</td><td class="feature-name"><b>${esc(feature.ar)}</b><span>${esc(feature.en)}</span>${feature.legacyIds.length > 1 ? `<small class="legacy-id">السجلات المدمجة: ${feature.legacyIds.join(", ")}</small>` : ""}</td><td><span class="tag">${esc(feature.domainLabel)}</span></td><td><span class="tag ${feature.status === "reserved" ? "reserved" : feature.status === "demonstrated" ? "demo" : ""}">${evidenceLabel(feature.status)}</span></td></tr>`).join("") : `<tr><td colspan="4"><div class="empty">لا توجد ميزات مطابقة للبحث الحالي.</div></td></tr>`;
  return `<section class="card page-card"><div class="notice"><strong>نطاق السجل:</strong> السجل التاريخي يحتوي على ${REGISTRY_STATS.historicalRecords} بنداً. بعد دمج ${REGISTRY_STATS.mergedRecords} سجلات مكررة أصبح العرض الموحد ${REGISTRY_STATS.canonicalRecords} سجلاً: ${REGISTRY_STATS.definedFeatures} ميزة معرفة و${REGISTRY_STATS.reservedRecords} سجلات محجوزة. وجود السجل لا يعني تنفيذه إنتاجياً.</div><div class="filter-row"><input id="feature-search" value="${esc(state.featureQuery)}" placeholder="ابحث برقم السجل أو الاسم العربي أو الإنجليزي"><select id="feature-domain"><option value="all">كل النطاقات</option>${Object.entries(DOMAIN_LABELS).map(([key, label]) => `<option value="${key}" ${state.featureDomain === key ? "selected" : ""}>${label}</option>`).join("")}</select><button class="ghost-btn" id="clear-feature-filter">مسح البحث</button></div><div style="overflow-x:auto"><table class="feature-table"><thead><tr><th>المعرف الموحد</th><th>الاسم</th><th>النطاق</th><th>دليل النسخة العامة</th></tr></thead><tbody>${body}</tbody></table></div><div class="pager"><span>عرض ${visible.length} من ${filtered.length} سجلاً موحداً</span><div class="pager-actions"><button class="ghost-btn" id="feature-prev" ${state.featurePage <= 1 ? "disabled" : ""}>السابق</button><span style="padding:9px 3px">${state.featurePage} / ${pages}</span><button class="ghost-btn" id="feature-next" ${state.featurePage >= pages ? "disabled" : ""}>التالي</button></div></div></section>`;
}

function renderEvidence() {
  setHeader("مصفوفة الإثبات", "ربط كل سجل بالمسار الظاهر، ومرجع الاختبار، والتحقق الوظيفي، وحدود الادعاء");
  const query = state.evidenceQuery.trim().toLowerCase();
  const filtered = EVIDENCE_MATRIX.filter((row) => {
    const matchesQuery = !query || `${row.featureId} ${row.ar} ${row.en} ${row.domainLabel}`.toLowerCase().includes(query);
    const matchesStatus = state.evidenceStatus === "all" || row.registryStatus === state.evidenceStatus;
    return matchesQuery && matchesStatus;
  });
  const perPage = 10;
  const pages = Math.max(1, Math.ceil(filtered.length / perPage));
  state.evidencePage = Math.min(state.evidencePage, pages);
  const visible = filtered.slice((state.evidencePage - 1) * perPage, state.evidencePage * perPage);
  const statusClass = (status) => status === "reserved" ? "reserved" : status === "demonstrated" ? "demo" : "";
  const functionalClass = (status) => status === "passed" ? "demo" : status === "not-applicable" ? "reserved" : "";
  const body = visible.length ? visible.map((row) => `<tr><td class="feature-id">${row.featureId}</td><td class="feature-name"><b>${esc(row.ar)}</b><span>${esc(row.en)}</span>${row.legacyIds.length > 1 ? `<small class="legacy-id">السجلات المدمجة: ${row.legacyIds.join(", ")}</small>` : ""}</td><td><span class="tag">${esc(row.domainLabel)}</span></td><td>${esc(row.displayPath)}<small class="legacy-id">${esc(row.scenarioReference)}</small></td><td><span class="tag ${statusClass(row.registryStatus)}">${esc(row.verificationLabel)}</span><small class="legacy-id">${esc(row.implementationEvidenceLabel)}</small></td><td><span class="tag">${esc(row.featureAcceptanceTestStatus === "not-created" ? "لم ينشأ بعد" : row.featureAcceptanceTestStatus)}</span><small class="legacy-id">${esc(row.testReference)}</small></td><td><span class="tag ${functionalClass(row.functionalValidationStatus)}">${esc(row.functionalValidationLabel)}</span><small class="legacy-id">${esc(row.functionalValidationReference)}</small></td><td>${esc(row.nextEvidence)}<small class="legacy-id">${esc(row.claimBoundary)}</small></td></tr>`).join("") : `<tr><td colspan="8"><div class="empty">لا توجد سجلات مطابقة للبحث الحالي.</div></td></tr>`;
  return `<section class="card page-card"><div class="notice"><strong>حدود المصفوفة:</strong> هذه الصفحة تثبت قابلية التتبع بين سجل الميزات ومسارات العرض والاختبارات. أضيفت اختبارات قبول خاصة بالميزات المعروضة، وأضيف تحقق وظيفي محلي للميزات F01 إلى F06 ببيانات اصطناعية حتمية. لا تحول هذه النتائج إلى إثبات تنفيذ إنتاجي، ولا توجد أدلة تكامل حي أو إيرادات أو صفوف تدعم تقييماً استحواذياً نهائياً.</div><div class="kpi-grid"><div class="card kpi"><span class="label">الميزات المعرفة</span><strong>${EVIDENCE_MATRIX_STATS.definedFeatureRows}</strong><small>من ${EVIDENCE_MATRIX_STATS.sourceCanonicalRecords} سجلاً موحداً</small><span class="data-badge">سجل قابل للتدقيق</span></div><div class="card kpi"><span class="label">محاكاة قابلة لإعادة التشغيل</span><strong>${EVIDENCE_MATRIX_STATS.demonstratedRows}</strong><small>بيانات اصطناعية فقط</small><span class="data-badge">دليل عرض</span></div><div class="card kpi"><span class="label">معمارية غير منفذة</span><strong>${EVIDENCE_MATRIX_STATS.architectureRows}</strong><small>تحتاج تنفيذاً مستقلاً</small><span class="data-badge">حد الادعاء</span></div><div class="card kpi warn"><span class="label">اختبارات قبول خاصة</span><strong>${EVIDENCE_MATRIX_STATS.featureSpecificAcceptanceTests}</strong><small>تغطية الميزات المعروضة</small><span class="data-badge">تحقق واجهة</span></div><div class="card kpi"><span class="label">تحقق وظيفي محلي</span><strong>${EVIDENCE_MATRIX_STATS.functionalValidationRows}</strong><small>F01 إلى F06</small><span class="data-badge">بيانات اصطناعية</span></div></div><div class="filter-row"><input id="evidence-search" value="${esc(state.evidenceQuery)}" placeholder="ابحث برقم السجل أو اسم الميزة"><select id="evidence-status"><option value="all">كل الحالات</option><option value="demonstrated" ${state.evidenceStatus === "demonstrated" ? "selected" : ""}>محاكاة قابلة لإعادة التشغيل</option><option value="architecture" ${state.evidenceStatus === "architecture" ? "selected" : ""}>معمارية معلنة فقط</option><option value="reserved" ${state.evidenceStatus === "reserved" ? "selected" : ""}>محجوزة أو مدمجة</option></select><button class="ghost-btn" id="clear-evidence-filter">مسح البحث</button></div><div style="overflow-x:auto"><table class="feature-table evidence-table"><thead><tr><th>المعرف</th><th>الميزة</th><th>النطاق</th><th>مسار العرض</th><th>نوع وحالة الدليل</th><th>اختبار القبول</th><th>التحقق الوظيفي</th><th>الدليل التالي وحد الادعاء</th></tr></thead><tbody>${body}</tbody></table></div><div class="pager"><span>عرض ${visible.length} من ${filtered.length} صفاً</span><div class="pager-actions"><button class="ghost-btn" id="evidence-prev" ${state.evidencePage <= 1 ? "disabled" : ""}>السابق</button><span style="padding:9px 3px">${state.evidencePage} / ${pages}</span><button class="ghost-btn" id="evidence-next" ${state.evidencePage >= pages ? "disabled" : ""}>التالي</button></div></div><p class="panel-subtitle" style="margin-top:16px">المصادر القابلة لإعادة التوليد: <code>evidence-matrix.js</code>، <code>functional-validation.js</code>، <code>FUNCTIONAL_VALIDATION_REPORT.md</code>، وملفات المصفوفة المولدة.</p></section>`;
}

const SCENARIOS = [
  ["سلة غذائية من الطلب إلى التسليم", "تجربة كاملة تربط السلة الذكية، المخزون، المستودع، الأسطول، التسليم، ومحفظة الأثر.", ["إنشاء السلة الذكية", "حجز المخزون وإعادة التوريد", "توزيع المسار على الأسطول", "إثبات التسليم وتسجيل الأثر"]],
  ["تاجر جديد إلى قبول موثّق", "مسار تأسيس تاجر يربط الهوية، الثقة، الجدارة، القبول، والعمليات.", ["إنشاء الهوية الرقمية", "تشغيل سجل الثقة", "حساب الجدارة التشغيلية", "إصدار حالة القبول"]],
  ["توريد غذائي بإثبات المنشأ", "سجل شحنة من المورد إلى المستودع ثم المتجر مع فحوص الجودة والتتبع.", ["اختيار المورد الاستراتيجي", "تسجيل المصدر والشهادة", "تتبع السلسلة المبردة", "مطابقة التسليم مع المخزون"]],
  ["معاملة شرعية مع حارس وقواعد", "محاكاة تصنيف معاملة وعقد وشروط وتسوية ضمن طبقة رقابة بشرية.", ["قراءة نوع العقد والشروط", "تصنيف المعاملة", "حظر المسار غير المقبول", "إحالة القرار إلى الاعتماد"]],
  ["تبرع ووقف قابلان للتتبع", "تحويل مساهمة إلى هدف أثر مع سجل توزيع وتدقيق وشفافية.", ["فتح حملة أثر", "توجيه المساهمة", "إثبات التوزيع", "إغلاق سجل الأثر"]],
  ["استباق أزمة غذائية", "ربط توقع الطلب، مؤشر الأمن الغذائي، التنبيه، وإعادة التوريد في قرار واحد.", ["تشغيل التنبؤ", "رصد مؤشر الأمن الغذائي", "تحديد نقطة الخطر", "إطلاق إجراء وقائي"]]
];

function renderScenarios() {
  setHeader("السيناريوهات التشغيلية", "مسارات عرض end-to-end تربط مكونات اكتفاء في قرارات قابلة للفحص");
  return `<section class="hero"><div><h3>من النموذج النظري إلى مسار قابل للعرض</h3><p>كل سيناريو يوضح كيف تتحرك البيانات والقرار والدليل بين أكثر من نطاق. زر التشغيل يضيف الأحداث إلى لوحة القيادة حتى يظهر أثر التنفيذ في النظام.</p></div><div class="hero-side"><div class="hero-metric"><strong>06</strong><span>سيناريوهات مكتملة للتجربة</span></div><div class="hero-metric"><strong>24</strong><span>خطوة تشغيلية مصغرة</span></div><div class="hero-metric"><strong>1</strong><span>سجل أحداث موحد</span></div></div></section><div class="section-head"><div><h3>مسارات العرض</h3><p>اختر مساراً ثم شغله لرؤية تسلسل التنفيذ.</p></div></div><div class="scenario-grid">${SCENARIOS.map((scenario, index) => `<article class="card scenario"><h4>${index + 1}. ${scenario[0]}</h4><p>${scenario[1]}</p><div class="steps">${scenario[2].map((step, stepIndex) => `<div class="step"><span class="step-number">${stepIndex + 1}</span><span>${step}</span></div>`).join("")}</div><button class="primary-btn" data-scenario="${index}">تشغيل هذا المسار</button></article>`).join("")}</div><section class="card panel" style="margin-top:18px"><h4>حدود المحاكاة</h4><p class="panel-subtitle">هذه المسارات لا ترسل طلبات خارجية ولا تنفذ عمليات مالية أو لوجستية حقيقية. هي طبقة عرض لتوضيح النموذج التشغيلي وبنية التكامل.</p></section>`;
}

function renderArchitecture() {
  setHeader("المعمارية العامة", "كيف تتصل طبقات اكتفاء التقنية ببيئات التجارة والأنظمة التشغيلية المتعددة");
  return `<section class="hero"><div><h3>معمارية واحدة فوق بيئات تجارة متعددة</h3><p>المنصة التقنية هي طبقة التحكم والهوية والبيانات والعقود والتحليلات. يمكن ربطها ببيئات التجارة الإلكترونية، الأسواق، التجزئة، الجملة، والتجارة متعددة القنوات، مع إبقاء الأنظمة القائمة والأصول التشغيلية قابلة للفصل والتكامل المنضبط.</p></div><div class="hero-side"><div class="hero-metric"><strong>10</strong><span>نطاقات تشغيلية</span></div><div class="hero-metric"><strong>4</strong><span>طبقات معمارية</span></div><div class="hero-metric"><strong>103</strong><span>ميزة في السجل</span></div></div></section><div class="grid-2" style="margin-top:18px"><section class="card panel"><h4>طبقات المنصة</h4><p class="panel-subtitle">حدود واضحة بين التجربة، التشغيل، التحكم، والتكامل.</p><div class="bar-list">${[["طبقة التجربة", "عميل، تاجر، متجر، سوق، مستودع، أسطول، مانح، حوكمة", 90], ["طبقة التشغيل", "تجارة، مخزون، إمداد، لوجستيات، مدفوعات، أثر، تحليلات", 84], ["طبقة التحكم", "هوية، دليل، عقود، قواعد شرعية، تدقيق، مخاطر، تعافٍ", 78], ["طبقة التكامل", "قنوات تجارة، مزودو دفع، خدمات حكومية، موردون، ناقلون، أنظمة مؤسسية", 52]].map(([name, text, value]) => `<div class="bar-row"><div class="bar-meta"><span>${name}</span><span>${value}%</span></div><div style="font-size:11px;color:#64748b;margin-bottom:5px">${text}</div><div class="bar-track"><div class="bar-fill" style="width:${value}%"></div></div></div>`).join("")}</div></section><section class="card panel"><h4>حدود المسؤولية في النسخة العامة</h4><p class="panel-subtitle">ما يظهر هنا هو نموذج قابل للفحص، لا ادعاء تشغيل مرخص.</p><div class="activity-list"><div class="activity"><i class="activity-dot"></i><div><strong>المحاكاة داخل المتصفح</strong><small>توضح القرار والتسلسل دون اتصال خارجي.</small></div></div><div class="activity"><i class="activity-dot"></i><div><strong>البيانات اصطناعية</strong><small>لا توجد بيانات مستخدمين أو تجار أو مدفوعات حقيقية.</small></div></div><div class="activity"><i class="activity-dot"></i><div><strong>الإنتاج يحتاج اعتماداً مستقلاً</strong><small>فحص تقني وقانوني وتنظيمي وشرعي وأمني قبل التشغيل.</small></div></div><div class="activity"><i class="activity-dot"></i><div><strong>الحقوق محفوظة</strong><small>الإتاحة العامة للقراءة والعرض لا تعني التنازل أو الترخيص.</small></div></div></div></section></div><section class="card panel" style="margin-top:18px"><h4>خريطة فصل الجانب التقني عن المشروع التشغيلي</h4><p class="panel-subtitle">هذا الفصل أساسي عند تقديم المشروع للشراكة أو الترخيص أو الاستحواذ.</p><div class="module-grid"><article class="card module"><div class="module-icon">A</div><h4>الجانب التقني</h4><p>المعمارية، البرمجيات، سجل الميزات، الهوية، البيانات، العقود، التحليلات، طبقات الدفع والحوكمة.</p></article><article class="card module"><div class="module-icon">B</div><h4>الأصول التشغيلية</h4><p>المتاجر، مراكز التخزين والتوزيع، الأسطول، المخزون، العاملون، الموردون، ومواقع الخدمة.</p></article><article class="card module"><div class="module-icon">C</div><h4>نموذج الإيراد</h4><p>التجارة، الخدمات، الاشتراكات، التكاملات، رسوم التشغيل، خدمات التجار، والأثر المؤسسي.</p></article><article class="card module"><div class="module-icon">D</div><h4>مسار التوسع</h4><p>نسخة تجريبية، تكاملات مؤسسية، تشغيل محدود، تحقق مستقل، ثم توسع منضبط.</p></article></div></section>`;
}

function updateNav() {
  document.querySelectorAll(".nav button").forEach((button) => {
    button.classList.toggle("active", button.dataset.route === state.route);
    const count = button.querySelector(".count");
    if (!count) return;
    if (DOMAIN_CONFIG[button.dataset.route]) {
      count.textContent = FEATURES.filter((feature) => feature.domain === button.dataset.route).length;
    } else if (button.dataset.route === "features") {
      count.textContent = REGISTRY_STATS.canonicalRecords;
    } else if (button.dataset.route === "evidence") {
      count.textContent = EVIDENCE_MATRIX_STATS.definedFeatureRows;
    }
  });
}

function render() {
  if (state.route === "overview") app.innerHTML = renderOverview();
  else if (state.route === "features") app.innerHTML = renderFeatures();
  else if (state.route === "evidence") app.innerHTML = renderEvidence();
  else if (state.route === "scenarios") app.innerHTML = renderScenarios();
  else if (state.route === "architecture") app.innerHTML = renderArchitecture();
  else app.innerHTML = renderDomain(state.route);
  app.innerHTML = app.innerHTML.replace(/<strong>103<\/strong><span>ميزة في السجل<\/span>/, `<strong>${REGISTRY_STATS.canonicalRecords}</strong><span>سجلات موحدة</span>`);
  updateNav();
  bindEvents();
}

function runScenario(index) {
  const scenario = SCENARIOS[index];
  scenario[2].forEach((step, stepIndex) => state.events.unshift([`${scenario[0]}: ${step}`, stepIndex === 0 ? "الآن" : `بعد ${stepIndex} خطوة`]));
  state.events = state.events.slice(0, 6);
  showToast(`تم تشغيل السيناريو: ${scenario[0]}`);
  state.route = "overview";
  render();
}

function bindEvents() {
  document.querySelectorAll("[data-route]").forEach((button) => button.addEventListener("click", () => {
    state.route = button.dataset.route;
    state.featurePage = 1;
    render();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }));
  document.querySelectorAll("[data-action]").forEach((button) => button.addEventListener("click", () => showToast(`تمت محاكاة الإجراء: ${button.dataset.action}`)));
  document.querySelectorAll("[data-scenario]").forEach((button) => button.addEventListener("click", () => runScenario(Number(button.dataset.scenario))));
  const search = document.getElementById("feature-search");
  if (search) search.addEventListener("input", (event) => { state.featureQuery = event.target.value; state.featurePage = 1; render(); document.getElementById("feature-search")?.focus(); });
  const domain = document.getElementById("feature-domain");
  if (domain) domain.addEventListener("change", (event) => { state.featureDomain = event.target.value; state.featurePage = 1; render(); });
  document.getElementById("clear-feature-filter")?.addEventListener("click", () => { state.featureQuery = ""; state.featureDomain = "all"; state.featurePage = 1; render(); });
  document.getElementById("feature-prev")?.addEventListener("click", () => { state.featurePage -= 1; render(); });
  document.getElementById("feature-next")?.addEventListener("click", () => { state.featurePage += 1; render(); });
  const evidenceSearch = document.getElementById("evidence-search");
  if (evidenceSearch) evidenceSearch.addEventListener("input", (event) => { state.evidenceQuery = event.target.value; state.evidencePage = 1; render(); document.getElementById("evidence-search")?.focus(); });
  const evidenceStatus = document.getElementById("evidence-status");
  if (evidenceStatus) evidenceStatus.addEventListener("change", (event) => { state.evidenceStatus = event.target.value; state.evidencePage = 1; render(); });
  document.getElementById("clear-evidence-filter")?.addEventListener("click", () => { state.evidenceQuery = ""; state.evidenceStatus = "all"; state.evidencePage = 1; render(); });
  document.getElementById("evidence-prev")?.addEventListener("click", () => { state.evidencePage -= 1; render(); });
  document.getElementById("evidence-next")?.addEventListener("click", () => { state.evidencePage += 1; render(); });
}

document.getElementById("run-demo").addEventListener("click", () => { state.route = "scenarios"; render(); showToast("اختر سيناريو لتشغيل مساره التشغيلي"); });
document.getElementById("demo-reset").addEventListener("click", () => { state.events = [["تمت إعادة النموذج إلى بيانات العرض الأساسية", "الآن"], ["تمت مطابقة معاملة TX-89201 مع قواعد المسار", "منذ 11 دقيقة"], ["تم إنشاء توصية إعادة توريد لمتجر مكة", "منذ 18 دقيقة"]]; state.route = "overview"; render(); showToast("تمت إعادة بيانات العرض"); });
render();
