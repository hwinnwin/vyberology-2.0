# Week 1 — Execution Sprint Board

## Purpose

Build the machinery. No adjudication drama, no F_total yet — just clean deterministic foundations.

**Sprint Goal**: A3, A4, A5 packages implemented with smoke tests passing.

---

## Prerequisites (from Week 0)

- [x] All roles assigned (B-01 through B-07)
- [x] Repo skeleton in place
- [x] manifest.example.yaml finalized
- [x] Kickoff complete

---

## Sprint Columns

| Column | Focus |
|--------|-------|
| Backlog | Queued for Week 1 |
| Ready | Unblocked, can start |
| In Progress | Active development |
| Review | PR open, needs review |
| Done | Merged and verified |

---

# Column 1 — BACKLOG

### 📋 W1-01 — A3 Package Setup

| Field | Value |
|-------|-------|
| Owner | B-01 (A3 Owner) |
| Path | `packages/a3/` |
| Deliverables | package.json, tsconfig.json, src/index.ts, tests/ |
| Status | 📋 Backlog |

---

### 📋 W1-02 — A4 Package Setup

| Field | Value |
|-------|-------|
| Owner | B-02 (A4 Owner) |
| Path | `packages/a4/` |
| Deliverables | package.json, tsconfig.json, src/index.ts, tests/ |
| Status | 📋 Backlog |

---

### 📋 W1-03 — Adjudicator Package Setup

| Field | Value |
|-------|-------|
| Owner | B-03 (A5 Owner) |
| Path | `packages/adjudicator/` |
| Deliverables | package.json, tsconfig.json, src/index.ts, tests/ |
| Status | 📋 Backlog |

---

### 📋 W1-04 — Define Codegen Interface (A3)

| Field | Value |
|-------|-------|
| Owner | B-01 (A3 Owner) |
| Output | `packages/a3/src/types.ts` |
| Contents | Input schema, Output schema, Error types |
| Depends On | W1-01 |
| Status | 📋 Backlog |

---

### 📋 W1-05 — Define Codegen Interface (A4)

| Field | Value |
|-------|-------|
| Owner | B-02 (A4 Owner) |
| Output | `packages/a4/src/types.ts` |
| Contents | Input schema, Output schema, Error types |
| Depends On | W1-02 |
| Note | Must be compatible with A3 interface for adjudication |
| Status | 📋 Backlog |

---

### 📋 W1-06 — Define Adjudicator Interface

| Field | Value |
|-------|-------|
| Owner | B-03 (A5 Owner) |
| Output | `packages/adjudicator/src/types.ts` |
| Contents | Comparison input, Verdict output, Diff format |
| Depends On | W1-03, W1-04, W1-05 |
| Status | 📋 Backlog |

---

# Column 2 — READY

### 🟩 W1-07 — Implement A3 Core Codegen

| Field | Value |
|-------|-------|
| Owner | B-01 (A3 Owner) |
| Output | `packages/a3/src/codegen.ts` |
| Requirements | Deterministic output, Manifest → Code |
| Tests | Unit tests for core transforms |
| Depends On | W1-04 |
| Status | 🟩 Ready |

---

### 🟩 W1-08 — Implement A4 Core Codegen

| Field | Value |
|-------|-------|
| Owner | B-02 (A4 Owner) |
| Output | `packages/a4/src/codegen.ts` |
| Requirements | Independent approach, Same manifest → Code |
| Tests | Unit tests for core transforms |
| Depends On | W1-05 |
| Status | 🟩 Ready |

---

### 🟩 W1-09 — Implement Adjudicator Core

| Field | Value |
|-------|-------|
| Owner | B-03 (A5 Owner) |
| Output | `packages/adjudicator/src/compare.ts` |
| Requirements | Semantic comparison, Diff generation |
| Tests | Property-based tests |
| Depends On | W1-06 |
| Status | 🟩 Ready |

---

### 🟩 W1-10 — Create Shared Test Fixtures

| Field | Value |
|-------|-------|
| Owner | B-03 (A5 Owner) |
| Output | `packages/adjudicator/fixtures/` |
| Contents | Sample manifests, Expected outputs, Edge cases |
| Status | 🟩 Ready |

---

# Column 3 — IN PROGRESS

### 🟧 W1-11 — A3 Smoke Test

| Field | Value |
|-------|-------|
| Owner | B-01 (A3 Owner) |
| Test | `packages/a3/tests/smoke.test.ts` |
| Criteria | manifest.example.yaml → valid output |
| Depends On | W1-07 |
| Status | 🟧 In Progress |

---

### 🟧 W1-12 — A4 Smoke Test

| Field | Value |
|-------|-------|
| Owner | B-02 (A4 Owner) |
| Test | `packages/a4/tests/smoke.test.ts` |
| Criteria | manifest.example.yaml → valid output |
| Depends On | W1-08 |
| Status | 🟧 In Progress |

---

### 🟧 W1-13 — Adjudicator Smoke Test

| Field | Value |
|-------|-------|
| Owner | B-03 (A5 Owner) |
| Test | `packages/adjudicator/tests/smoke.test.ts` |
| Criteria | A3 output + A4 output → verdict |
| Depends On | W1-09, W1-11, W1-12 |
| Status | 🟧 In Progress |

---

### 🟧 W1-14 — Wire CI for Package Tests

| Field | Value |
|-------|-------|
| Owner | B-05 (CI Owner) |
| Output | `.github/workflows/test-packages.yml` |
| Jobs | Test A3, Test A4, Test Adjudicator |
| Status | 🟧 In Progress |

---

# Column 4 — REVIEW

### 🟨 W1-15 — A3 Code Review

| Field | Value |
|-------|-------|
| Reviewer | B-02 or B-03 (cross-review) |
| PR | A3 implementation PR |
| Checklist | Types correct, Tests pass, Deterministic |
| Status | 🟨 Review |

---

### 🟨 W1-16 — A4 Code Review

| Field | Value |
|-------|-------|
| Reviewer | B-01 or B-03 (cross-review) |
| PR | A4 implementation PR |
| Checklist | Types correct, Tests pass, Independent approach |
| Status | 🟨 Review |

---

### 🟨 W1-17 — Adjudicator Code Review

| Field | Value |
|-------|-------|
| Reviewer | B-01 or B-02 (cross-review) |
| PR | Adjudicator implementation PR |
| Checklist | Semantic rules correct, Property tests pass |
| Status | 🟨 Review |

---

### 🟨 W1-18 — CI Pipeline Review

| Field | Value |
|-------|-------|
| Reviewer | B-04 (A7 Lead) |
| PR | CI workflow PR |
| Checklist | All packages tested, Artifacts generated |
| Status | 🟨 Review |

---

# Column 5 — DONE

### ✅ W1-D01 — Package Structure Complete

- [ ] `packages/a3/` initialized
- [ ] `packages/a4/` initialized
- [ ] `packages/adjudicator/` initialized
- [ ] All have package.json + tsconfig

---

### ✅ W1-D02 — Interfaces Defined

- [ ] A3 types defined
- [ ] A4 types defined
- [ ] Adjudicator types defined
- [ ] Interface compatibility verified

---

### ✅ W1-D03 — Core Implementation Complete

- [ ] A3 codegen working
- [ ] A4 codegen working
- [ ] Adjudicator comparison working

---

### ✅ W1-D04 — Smoke Tests Passing

- [ ] A3 smoke test green
- [ ] A4 smoke test green
- [ ] Adjudicator smoke test green

---

### ✅ W1-D05 — CI Pipeline Active

- [ ] Package tests run on push
- [ ] All tests passing
- [ ] Artifacts uploaded

---

# Week 1 Definition of Done

**Week 1 is complete when:**

1. All three packages (A3, A4, Adjudicator) have:
   - Defined interfaces
   - Core implementation
   - Passing smoke tests

2. CI pipeline runs all tests on push

3. Cross-reviews completed for all major PRs

4. No blocking issues for Week 2

---

## Week 1 Velocity Tracking

| Day | A3 Progress | A4 Progress | A5 Progress | CI Progress |
|-----|-------------|-------------|-------------|-------------|
| Mon | Setup | Setup | Setup | - |
| Tue | Interfaces | Interfaces | Interfaces | - |
| Wed | Core impl | Core impl | Core impl | Setup |
| Thu | Core impl | Core impl | Core impl | Wire tests |
| Fri | Smoke test | Smoke test | Smoke test | Review |
| Sat | Review | Review | Review | - |
| Sun | Buffer | Buffer | Buffer | Buffer |

---

## Blockers & Escalation

| Blocker Type | Escalate To | SLA |
|--------------|-------------|-----|
| Technical | Component Owner | 4 hours |
| Cross-component | A5 Owner (B-03) | 8 hours |
| Resource | Diamond Hands (B-07) | 24 hours |

---

## Week 1 → Week 2 Handoff

**Week 2 Focus**: Integration + First Adjudication Run

**Handoff Requirements**:
- [ ] All Week 1 Done items checked
- [ ] No critical bugs in packages
- [ ] A3 and A4 produce comparable output format
- [ ] Adjudicator can compare outputs

---

*Sprint Version: 1.0*
*Depends On: Week 0 completion*
