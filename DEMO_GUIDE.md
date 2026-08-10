# IKTEFAA 3.0 Public Demonstration Guide

## Purpose

This guide gives a reviewer a repeatable route through the public reference implementation. It is designed for technical, commercial, and acquisition reviewers who need to distinguish visible product structure from production evidence.

## Stable public route

After GitHub Pages is enabled and the deployment workflow completes, the expected public route is:

https://maksr2030.github.io/IKTEFAA-MVP/

The repository itself remains the source of record. A deployment URL is a presentation surface, not evidence of a live customer integration or production operation.

## Ten-minute review

1. Open the executive dashboard.
2. Confirm that the hero section reports the canonical registry count, demonstrated browser simulations, and architecture-only records.
3. Open each operating domain and inspect the synthetic-data badge on every indicator group.
4. Open the unified feature registry.
5. Open the evidence matrix and confirm that each canonical record has a display path, test reference, evidence class, verification status, and next required evidence.
6. Filter the matrix to `demonstrated` and confirm that 23 records are marked as browser simulations.
7. Filter the matrix to `architecture` and confirm that 72 records are marked as not implemented in the public MVP.
8. Search for record 37 and confirm that historical record 45 is shown as merged lineage.
9. Search for record 41 and confirm that historical record 44 is shown as merged lineage.
10. Open the scenario workspace and run one scenario.
11. Return to the executive dashboard and inspect the local simulation event trail.
12. Open the architecture workspace and review the production boundary.
13. Read `EVIDENCE_AND_DUE_DILIGENCE.md` before making any performance, integration, revenue, or acquisition statement.

## What the reviewer can verify directly

- The browser application loads from static files.
- The canonical registry is internally consistent.
- Duplicate historical records have explicit merge lineage.
- Scenarios produce a deterministic local event trail.
- The public interface labels synthetic data and does not claim a live connection.
- The evidence matrix is regenerated from the feature registry and exposes verification gaps instead of hiding them.
- Automated tests run locally and through GitHub Actions after the workflow is enabled.

## What this demonstration does not prove

- A live integration with Amazon, Alibaba, Noon, a payment provider, a government service, or any other company.
- Production throughput, availability, security, regulatory approval, or user acceptance.
- Revenue, customers, contracts, or return on investment.
- A final acquisition valuation.

Those claims require the evidence packages described in the evidence documents and must not be inferred from dashboard numbers.
