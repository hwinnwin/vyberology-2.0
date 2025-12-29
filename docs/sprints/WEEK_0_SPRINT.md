# Week 0 — Owner Sprint Board

## Purpose

Lock in owners, validators, decision authorities, and unblock the POC.

**Sprint Goal**: All roles assigned, repo ready, kickoff complete.

---

## Sprint Columns

| Column | Count | Status |
|--------|-------|--------|
| Backlog | 9 | Needs assignment |
| Ready | 5 | Owners assigned, waiting |
| In Progress | 5 | Active work |
| Review | 3 | Needs validation |
| Done | 5 | Completed |

---

# Column 1 — BACKLOG (Unassigned → needs selection)

> Tasks here have no owner yet. Goal: assign all within Week 0.

### 🔲 B-01 — Assign A3 Owner

| Field | Value |
|-------|-------|
| Role | Primary Codegen (Critical) |
| Requirements | Strong TS/Node, Deterministic codegen capability |
| Output | Owner assigned + acknowledgment logged |
| Status | 🔲 Unassigned |
| Assignee | TBD |

---

### 🔲 B-02 — Assign A4 Owner

| Field | Value |
|-------|-------|
| Role | Independent Dual Codegen (Critical) |
| Requirements | Architecture-level independence, Can build alternative pipeline |
| Output | Owner assigned |
| Status | 🔲 Unassigned |
| Assignee | TBD |

---

### 🔲 B-03 — Assign A5 Owner

| Field | Value |
|-------|-------|
| Role | Adjudicator (Critical) |
| Requirements | Testing expertise, Property-based testing |
| Output | Owner assigned |
| Status | 🔲 Unassigned |
| Assignee | TBD |

---

### 🔲 B-04 — Assign A7 Evidence Lead

| Field | Value |
|-------|-------|
| Role | Evidence bundling + reproducibility |
| Requirements | Strong scripting (Node/Python), Understand CI artifact flows |
| Output | Owner assigned |
| Status | 🔲 Unassigned |
| Assignee | TBD |

---

### 🔲 B-05 — Assign CI / compute_f_total Owner

| Field | Value |
|-------|-------|
| Role | Infrastructure lead for CI gating |
| Requirements | Familiarity with GitHub Actions, Ability to wire gates across repo |
| Output | Owner assigned |
| Status | 🔲 Unassigned |
| Assignee | TBD |

---

### 🔲 B-06 — Assign Validator Squad (Thunder Strike)

| Field | Value |
|-------|-------|
| Role | Phase-3 independent validation |
| Requirements | NO involvement in A3/A4/A5/A7 code |
| Output | At least 2 validators assigned |
| Status | 🔲 Unassigned |
| Assignee | TBD |

---

### 🔲 B-07 — Assign Decision Authority (Diamond Hands)

| Field | Value |
|-------|-------|
| Role | Final decision authority |
| Requirements | Usually 1 person, Approves GO / CONDITIONAL GO / NO-GO |
| Output | Name + availability confirmed |
| Status | 🔲 Unassigned |
| Assignee | TBD |

---

### 🔲 B-08 — Confirm POC Timeline

| Field | Value |
|-------|-------|
| Task | Finalize the 2-week plan |
| Actions | Lock calendars, Review dependencies |
| Output | Timeline confirmed |
| Status | 🔲 Pending |
| Owner | TBD |

---

### 🔲 B-09 — Finalize canonical manifest.example.yaml

| Field | Value |
|-------|-------|
| Task | Critical input for A3/A4 |
| Requirements | Must be stable & versioned |
| Output | Committed and hash recorded |
| Status | 🔲 Pending |
| Owner | TBD |

---

# Column 2 — READY (Owners assigned, waiting to start)

> Once you assign real humans → cards move here.

### 🟩 R-01 — Create repo skeleton for A3/A4/A5

| Field | Value |
|-------|-------|
| Path | `packages/a3/`, `packages/a4/`, `packages/adjudicator/` |
| Include | index.ts/js, test folder, smoke test stub |
| Status | 🟩 Ready |
| Owner | CI Owner (B-05) |

---

### 🟩 R-02 — Place compute_f_total.py in scripts/

| Field | Value |
|-------|-------|
| Actions | Confirm executable permissions, Add README usage, Add minimal gates.json |
| Status | ✅ Done (already in place) |
| Owner | CI Owner (B-05) |

---

### 🟩 R-03 — Add Issue Templates from previous output

| Field | Value |
|-------|-------|
| Path | `.github/ISSUE_TEMPLATE/` |
| Verify | Templates appear in GitHub UI |
| Status | ✅ Done (already in place) |
| Owner | CI Owner (B-05) |

---

### 🟩 R-04 — Add Self-Assessment & External Validation templates

| Field | Value |
|-------|-------|
| Path | `templates/self_assessment.md`, `templates/external_validation.md` |
| Status | ✅ Done (already in place) |
| Owner | A7 Lead (B-04) |

---

### 🟩 R-05 — Establish evidence/ directory

| Field | Value |
|-------|-------|
| Structure | `evidence/POC/`, `evidence/signed/` |
| Include | Placeholder README explaining structure |
| Status | 🟩 Ready |
| Owner | A7 Lead (B-04) |

---

# Column 3 — IN PROGRESS (Week 0 active work)

### 🟧 IP-01 — Create Role Matrix

| Field | Value |
|-------|-------|
| Output | `docs/roles/ROLE_MATRIX.md` |
| Contents | Owner, Validator, Decision Authority, Backup table |
| Status | ✅ Done |
| Owner | - |

---

### 🟧 IP-02 — Create POC Kanban (this board)

| Field | Value |
|-------|-------|
| Actions | Import tasks, Assign owners, Add timeline labels |
| Status | ✅ Done |
| Owner | - |

---

### 🟧 IP-03 — Lock POC communication channels

| Field | Value |
|-------|-------|
| Channels | #lumen-poc, #thunder-strike-validations |
| Requirement | Ensure validators are isolated |
| Status | 🟧 Pending setup |
| Owner | TBD |

---

### 🟧 IP-04 — Define semantic equivalence rules (A5)

| Field | Value |
|-------|-------|
| Output | `packages/adjudicator/SEMANTICS.md` |
| Owner | A5 Owner (B-03) |
| Status | 🟧 Pending |

---

### 🟧 IP-05 — Validate responsibilities & capacity

| Field | Value |
|-------|-------|
| Check | Each owner can commit 4–6 hours minimum over 2 weeks |
| Action | If not → reassign |
| Status | 🟧 Pending |
| Owner | Diamond Hands (B-07) |

---

# Column 4 — REVIEW (Requires validation)

### 🟨 RV-01 — Owner acknowledgments

| Field | Value |
|-------|-------|
| Requirement | Each owner comments "I accept" on their GitHub issue |
| Validation | Decision Authority signs off |
| Status | 🟨 Pending |

---

### 🟨 RV-02 — Validator independence check

| Field | Value |
|-------|-------|
| Confirm | Validators do NOT write code for A3/A4/A5 |
| Output | Sign: `validator independence = TRUE` |
| Status | 🟨 Pending |

---

### 🟨 RV-03 — Timeline approval

| Field | Value |
|-------|-------|
| Requirement | Decision authority confirms timeline realistic |
| Action | If not: adjust before Week 1 begins |
| Status | 🟨 Pending |

---

# Column 5 — DONE (Week 0 complete when all checked)

### ✅ D-01 — All critical roles assigned

- [ ] A3 Owner
- [ ] A4 Owner
- [ ] A5 Owner
- [ ] A7 Lead
- [ ] CI/F_total Owner
- [ ] Validators (2+)
- [ ] Decision Authority

---

### ✅ D-02 — Repo ready for Week 1

- [x] Directories created
- [x] Scripts in place
- [x] Templates available
- [x] Evidence directories structured

---

### ✅ D-03 — canonical manifest.example.yaml committed

- [x] File committed
- [ ] Hash recorded
- [ ] Version locked

---

### ✅ D-04 — Kickoff call complete

- [ ] Everyone aligned
- [ ] Questions resolved
- [ ] Owners know Week 1 deliverables

---

### ⏳ D-05 — Week 1 board generated

- [x] Week 1 sprint board created
- [ ] Tasks assigned to owners

---

# Optional but Recommended (Week 0+)

- [ ] Add CODEOWNERS file
- [ ] Add branch protection rules
- [ ] Add "evidence required" PR check
- [ ] Add POC SLA doc for validators

---

## Week 0 Summary

| Metric | Target | Current |
|--------|--------|---------|
| Roles Assigned | 7/7 | 0/7 |
| Repo Ready | 100% | 80% |
| Acknowledgments | 7/7 | 0/7 |
| Timeline Locked | Yes | No |

**Week 0 Status**: 🟧 In Progress

---

*Sprint Version: 1.0*
*Created: Week 0 Day 1*
