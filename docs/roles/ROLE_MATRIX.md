# LUMEN — Role Matrix (Week 0 → POC → Production)

## Overview

This matrix defines all critical roles for the Vyberology 2.0 governance framework. Each role has clear responsibilities, requirements, and accountability chains.

---

## Role Categories

| Category | Description |
|----------|-------------|
| **Owner** | Primary responsibility for a component |
| **Validator** | Independent verification (Thunder Strike) |
| **Authority** | Final decision power (Diamond Hands) |
| **Backup** | Secondary coverage for critical roles |

---

## Critical Roles Matrix

| Code | Role | Category | Status | Assignee | Backup |
|------|------|----------|--------|----------|--------|
| B-01 | A3 Owner (Primary Codegen) | Owner | 🔲 Unassigned | TBD | TBD |
| B-02 | A4 Owner (Dual Codegen) | Owner | 🔲 Unassigned | TBD | TBD |
| B-03 | A5 Owner (Adjudicator) | Owner | 🔲 Unassigned | TBD | TBD |
| B-04 | A7 Evidence Lead | Owner | 🔲 Unassigned | TBD | TBD |
| B-05 | CI / compute_f_total Owner | Owner | 🔲 Unassigned | TBD | TBD |
| B-06 | Thunder Strike Squad | Validator | 🔲 Unassigned | TBD | TBD |
| B-07 | Diamond Hands Authority | Authority | 🔲 Unassigned | TBD | - |

---

## Role Definitions

### B-01: A3 Owner (Primary Codegen)

**Category**: Owner (Critical)

**Responsibilities**:
- Primary code generation pipeline
- Deterministic output guarantee
- A3 package maintenance

**Requirements**:
- Strong TypeScript/Node.js expertise
- Deterministic codegen capability
- Understanding of AST manipulation

**Outputs**:
- `packages/a3/` implementation
- Codegen pipeline documentation
- Test coverage > 90%

**Commitment**: 4-6 hours/week minimum

---

### B-02: A4 Owner (Dual Codegen)

**Category**: Owner (Critical)

**Responsibilities**:
- Independent alternative codegen pipeline
- Architecture-level separation from A3
- Cross-validation capability

**Requirements**:
- Architecture-level independence mindset
- Can build alternative pipeline without A3 influence
- Different approach/tooling than A3

**Outputs**:
- `packages/a4/` implementation
- Independence documentation
- Comparison test suite

**Commitment**: 4-6 hours/week minimum

---

### B-03: A5 Owner (Adjudicator)

**Category**: Owner (Critical)

**Responsibilities**:
- Semantic equivalence verification
- Property-based testing framework
- Adjudication rules definition

**Requirements**:
- Testing expertise (property-based, fuzzing)
- Understanding of semantic equivalence
- Neutral stance on A3 vs A4 approaches

**Outputs**:
- `packages/adjudicator/` implementation
- `SEMANTICS.md` specification
- Adjudication test suite

**Commitment**: 4-6 hours/week minimum

---

### B-04: A7 Evidence Lead

**Category**: Owner

**Responsibilities**:
- Evidence bundle generation
- Reproducibility verification
- Audit trail maintenance

**Requirements**:
- Strong scripting (Node/Python)
- CI artifact flow expertise
- Documentation rigor

**Outputs**:
- Evidence bundle automation
- Reproducibility scripts
- Audit documentation

**Commitment**: 3-4 hours/week minimum

---

### B-05: CI / compute_f_total Owner

**Category**: Owner

**Responsibilities**:
- CI pipeline infrastructure
- Frequency calculation automation
- Gate enforcement across repo

**Requirements**:
- GitHub Actions expertise
- Gate wiring capability
- Metrics collection experience

**Outputs**:
- CI workflow maintenance
- `compute_f_total.py` integration
- Gate configuration

**Commitment**: 3-4 hours/week minimum

---

### B-06: Thunder Strike Squad (Validators)

**Category**: Validator

**Responsibilities**:
- Phase-3 independent validation
- Multi-level verification
- Unbiased assessment

**Requirements**:
- **CRITICAL**: NO involvement in A3/A4/A5/A7 code
- Independent judgment capability
- Validation methodology expertise

**Minimum**: 2 validators assigned

**Outputs**:
- Validation reports
- Independence attestation
- Frequency verification

**Commitment**: 2-3 hours/week minimum (per validator)

---

### B-07: Diamond Hands Authority

**Category**: Authority

**Responsibilities**:
- Final GO / CONDITIONAL GO / NO-GO decisions
- POC advancement approval
- Critical escalation resolution

**Requirements**:
- Decision authority mandate
- Availability for critical decisions
- Stakeholder trust

**Outputs**:
- Decision records
- Approval signatures
- Escalation resolutions

**Commitment**: On-call + 1-2 hours/week

---

## Independence Requirements

### Validator Independence Matrix

| Validator | A3 Code | A4 Code | A5 Code | A7 Code | CI Code |
|-----------|---------|---------|---------|---------|---------|
| Thunder Strike 1 | ❌ | ❌ | ❌ | ❌ | ❌ |
| Thunder Strike 2 | ❌ | ❌ | ❌ | ❌ | ❌ |

**Legend**: ❌ = Must NOT contribute code

---

## Acknowledgment Protocol

Each owner must acknowledge their role by:

1. Commenting "I accept" on their assignment issue
2. Confirming capacity (hours/week)
3. Acknowledging responsibilities
4. Providing backup contact

### Acknowledgment Template

```markdown
## Role Acknowledgment

**Role**: [B-XX]
**Assignee**: [Name]
**Date**: [YYYY-MM-DD]

I acknowledge:
- [ ] I understand my responsibilities
- [ ] I can commit [X] hours/week
- [ ] I have reviewed the role requirements
- [ ] I accept this assignment

Signature: _______________
```

---

## Escalation Path

```
Issue Owner → Component Owner (B-01 to B-05)
                    ↓
           Thunder Strike (B-06)
                    ↓
           Diamond Hands (B-07)
                    ↓
              Resolution
```

---

## Role Assignment Status

### Week 0 Checklist

- [ ] B-01: A3 Owner assigned and acknowledged
- [ ] B-02: A4 Owner assigned and acknowledged
- [ ] B-03: A5 Owner assigned and acknowledged
- [ ] B-04: A7 Evidence Lead assigned and acknowledged
- [ ] B-05: CI Owner assigned and acknowledged
- [ ] B-06: Thunder Strike Squad (2+) assigned and acknowledged
- [ ] B-07: Diamond Hands Authority assigned and confirmed

### Completion Criteria

**Week 0 is complete when:**
- All critical roles (B-01 through B-07) are assigned
- All owners have acknowledged in writing
- Validator independence is verified
- Decision Authority availability is confirmed

---

## Communication Channels

| Channel | Purpose | Members |
|---------|---------|---------|
| #lumen-poc | General POC coordination | All |
| #thunder-strike-validations | Validator-only discussions | B-06 only |
| #diamond-hands-decisions | Authority escalations | B-07 + escalating party |

---

## Capacity Planning

| Role | Min Hours/Week | Ideal Hours/Week |
|------|----------------|------------------|
| B-01 (A3) | 4 | 6-8 |
| B-02 (A4) | 4 | 6-8 |
| B-03 (A5) | 4 | 6-8 |
| B-04 (A7) | 3 | 4-5 |
| B-05 (CI) | 3 | 4-5 |
| B-06 (Validators) | 2 each | 3-4 each |
| B-07 (Authority) | 1 + on-call | 2 + on-call |

**Total Team Capacity**: ~20-35 hours/week

---

*Document Version: 1.0*
*Last Updated: Week 0*
*Next Review: End of POC*
