# Vyberology 2.0

> Governance + Validation System for LUMEN OS

[![Compute Frequency](https://img.shields.io/badge/F__total-Calculate-blue)](#quick-start)
[![Thunder Strike](https://img.shields.io/badge/Validation-Thunder%20Strike-yellow)](#validation-process)
[![Diamond Hands](https://img.shields.io/badge/Authority-Diamond%20Hands-purple)](#decision-authority)

## Overview

Vyberology 2.0 is a frequency-driven governance framework that provides:

- **F_total Calculation** - Unified system health metric
- **Thunder Strike Validation** - Multi-level verification process
- **Diamond Hands Authority** - Clear decision-making framework
- **A7 Evidence Bundles** - Comprehensive audit trails

## Quick Start

```bash
# Clone and navigate
cd vyberology-2.0

# Copy manifest template
cp manifest.example.yaml manifest.yaml

# Run frequency calculation (demo mode)
python scripts/compute_f_total.py --demo

# Generate evidence bundle
python scripts/compute_f_total.py --demo -o evidence/A7-bundle
```

## Repository Structure

```
vyberology-2.0/
├── A3-governance/           # Governance documentation
├── A4-architecture/         # System architecture
├── A5-implementation/       # Implementation code
├── .github/
│   ├── ISSUE_TEMPLATE/      # Issue templates
│   └── workflows/           # CI/CD pipelines
├── evidence/
│   └── A7-bundle/           # Evidence bundles
├── scripts/
│   └── compute_f_total.py   # Frequency engine
├── templates/               # Validation templates
└── manifest.example.yaml    # Configuration template
```

## Key Concepts

### Frequency Bands

| Band | F_total | Status |
|------|---------|--------|
| CRITICAL | < 0.3 | Halt operations |
| LOW | 0.3 - 0.5 | Needs attention |
| NOMINAL | 0.5 - 0.7 | Normal |
| OPTIMAL | 0.7 - 0.9 | High performance |
| PEAK | >= 0.9 | Maximum coherence |

### Validation Levels

1. **Self-Assessment** (Level 1) - Owner self-review
2. **Peer Review** (Level 2) - Cross-functional review
3. **External Validation** (Level 3) - Independent verification
4. **Diamond Hands** (Level 4) - Final authority decision

### Role Assignments

| Code | Role | Responsibility |
|------|------|----------------|
| B-01 | A3 Owner | Governance Lead |
| B-02 | A4 Owner | Architecture Lead |
| B-03 | A5 Owner | Implementation Lead |
| B-04 | A7 Lead | Evidence/Validation |
| B-05 | CI Owner | Pipeline/Automation |
| B-06 | Thunder Strike | Validator Squad |
| B-07 | Diamond Hands | Decision Authority |

## Usage

### Calculate Frequency

```bash
# Demo mode
python scripts/compute_f_total.py --demo

# With configuration
python scripts/compute_f_total.py -m manifest.yaml

# JSON output
python scripts/compute_f_total.py --demo --json
```

### Policy Runtime

```bash
# Run policy demo
python A5-implementation/policy_runtime.py
```

### CI/CD

The workflow runs automatically:
- On push to main/develop
- Every 6 hours (scheduled)
- Manual trigger available

## Issue Templates

Create issues using templates:
- `[A3] Governance Task` - Governance work
- `[A4] Architecture Task` - Architecture work
- `[A5] Implementation Task` - Implementation work
- `[VALIDATE] Validation Request` - Thunder Strike review

## Configuration

Edit `manifest.yaml` to customize:
- Frequency thresholds
- Component weights
- Diamond Hands requirements
- Notification channels
- Role assignments

## Documentation

- [Governance Framework](A3-governance/GOVERNANCE.md)
- [System Architecture](A4-architecture/ARCHITECTURE.md)
- [Evidence Bundle Guide](evidence/A7-bundle/README.md)

## Validation Templates

- [Self-Assessment](templates/self-assessment.md)
- [External Validation](templates/external-validation.md)

---

## Contributing

1. Create issue using appropriate template
2. Implement changes
3. Run `compute_f_total.py` to verify frequency
4. Submit for Thunder Strike validation
5. Await Diamond Hands approval if required

## License

Part of LUMEN OS. See LICENSE for details.

---

*Vyberology 2.0 - Where governance meets frequency*
