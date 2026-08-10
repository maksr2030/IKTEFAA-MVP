# Evidence and Technical Due-Diligence Boundary

## Executive position

The public IKTEFAA 3.0 MVP is an inspectable reference implementation. It establishes a reproducible demonstration baseline, not a production deployment or a financial performance record.

The evidence model separates five claim types:

| Claim | Public baseline | Evidence still required |
| --- | --- | --- |
| Feature coverage | 100 canonical registry records derived from 103 historical records | Feature-level acceptance tests and implementation evidence for each claimed capability |
| Company integration | Provider-neutral reference contract only | Signed integration scope, authenticated test environment, contract tests, logs, and counterparty confirmation |
| Performance | Synthetic local benchmark only | Independent workload model, production-like dataset, latency and throughput results, resilience results, and reproducible reports |
| Revenue or business performance | No public evidence | Bank or accounting records, signed contracts, invoices, customer confirmations, and audit trail |
| Acquisition valuation | Conditional strategic hypothesis only | Legal ownership review, technical due diligence, commercial diligence, market evidence, risk adjustments, and definitive transaction documents |

## Feature evidence status

- Historical records: 103
- Canonical records after deduplication: 100
- Defined feature records: 95
- Demonstrated browser simulations: 23
- Architecture-only records: 72
- Reserved or merged records: 5

The phrase “103 features implemented” must not be used. The defensible public description is: “a public registry containing 100 canonical records derived from 103 historical entries, with 23 browser-simulation demonstrations and 72 architecture-only records.”

## Integration evidence standard

The public `integration-contract.js` file proves only that a provider-neutral payload can be normalized and validated against a versioned contract. It deliberately records `liveConnection: false`.

A company integration may be claimed only when the following are preserved:

1. Written authorization and named counterparty.
2. Versioned interface and data-contract specification.
3. Test-environment endpoint or approved fixture package.
4. Request and response evidence with sensitive fields redacted.
5. Contract-test results and failure handling.
6. Security, privacy, and access-control review.
7. Counterparty confirmation or signed acceptance record.

## Performance evidence standard

The included benchmark measures local registry filtering over synthetic data. It is a software regression signal only. It is not a claim about order throughput, payment performance, delivery performance, prediction accuracy, availability, or customer outcomes.

Production-grade performance evidence should include workload definition, dataset provenance, hardware and software versions, warm-up policy, percentile latency, throughput, error rate, concurrency, degradation behaviour, recovery results, and independent reproduction instructions.

## Revenue evidence standard

No revenue is claimed by the public repository. Any future revenue statement must identify the period, legal entity, revenue recognition basis, source documents, customer or contract relationship, and whether the figure is audited, management-reported, or projected.

## Acquisition valuation boundary

The public repository cannot by itself justify a final acquisition price. A defensible valuation must be based on identifiable and transferable rights, tested technical assets, verified commercial evidence, replacement cost, strategic value, risk allocation, and the scope of assets included in definitive agreements.

Any valuation document must state that it is not a binding offer, legal opinion, regulatory approval, or guarantee.
