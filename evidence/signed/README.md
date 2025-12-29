# Signed Evidence Directory

## Purpose

This directory stores cryptographically signed or formally attested evidence artifacts.

## Structure

```
signed/
├── README.md                   # This file
├── role-acknowledgments/       # Signed role acceptances
├── validation-attestations/    # Validator sign-offs
├── diamond-hands-decisions/    # Authority approvals
└── milestone-signoffs/         # Phase completion records
```

## Attestation Format

### Role Acknowledgment

```yaml
attestation:
  type: role_acknowledgment
  role_code: B-01
  role_name: A3 Owner
  assignee: [Name]
  date: YYYY-MM-DD
  statement: "I acknowledge and accept this role assignment"
  signature: [Digital signature or commit hash]
  witnesses:
    - [Witness 1]
    - [Witness 2]
```

### Validation Attestation

```yaml
attestation:
  type: validation
  level: external
  validator_id: [ID]
  subject: [Component/Bundle]
  date: YYYY-MM-DD
  verdict: VALIDATED
  statement: "I attest that this validation was conducted independently"
  signature: [Digital signature or commit hash]
```

### Diamond Hands Decision

```yaml
attestation:
  type: decision
  authority: diamond_hands
  decision_id: DH-YYYYMMDD-XXX
  date: YYYY-MM-DD
  subject: [POC Phase/Component]
  verdict: GO | CONDITIONAL_GO | NO_GO
  conditions: []
  statement: "I authorize this decision"
  signature: [Digital signature or commit hash]
```

## Verification

All signed evidence should be verifiable via:
1. Git commit hash
2. GitHub signed commits (if available)
3. Issue/PR references
4. Timestamp verification

## Chain of Custody

1. Evidence generated → POC directory
2. Validation complete → Signed directory
3. Attestation added → Commit with reference
4. Linked in A7 bundle

---

*Part of Vyberology 2.0 Evidence Framework*
