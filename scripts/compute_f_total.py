#!/usr/bin/env python3
"""
compute_f_total.py - Vyberology 2.0 Frequency Calculation Engine

This script calculates the total system frequency (F_total) for LUMEN OS
governance validation. It aggregates metrics across all system components
and produces a unified frequency score for POC advancement decisions.

Thunder Strike validators use this output for multi-level verification.
Diamond Hands authority uses final scores for go/no-go decisions.
"""

import json
import yaml
import sys
from dataclasses import dataclass, field, asdict
from datetime import datetime, timezone
from pathlib import Path
from typing import Optional
from enum import Enum


class ValidationLevel(Enum):
    """Thunder Strike validation levels"""
    SELF = "self_assessment"
    PEER = "peer_review"
    EXTERNAL = "external_validation"
    DIAMOND = "diamond_hands_final"


class FrequencyBand(Enum):
    """System frequency classification bands"""
    CRITICAL = "critical"      # F < 0.3 - System unstable
    LOW = "low"                # 0.3 <= F < 0.5 - Needs attention
    NOMINAL = "nominal"        # 0.5 <= F < 0.7 - Operating normally
    OPTIMAL = "optimal"        # 0.7 <= F < 0.9 - High performance
    PEAK = "peak"              # F >= 0.9 - Maximum coherence


@dataclass
class ComponentMetrics:
    """Metrics for a single system component"""
    name: str
    coherence: float          # 0.0 - 1.0: Internal consistency
    alignment: float          # 0.0 - 1.0: Alignment with governance
    velocity: float           # 0.0 - 1.0: Progress rate
    stability: float          # 0.0 - 1.0: System stability
    evidence_score: float     # 0.0 - 1.0: Documentation completeness

    def compute_component_frequency(self) -> float:
        """Calculate weighted frequency for this component"""
        weights = {
            'coherence': 0.25,
            'alignment': 0.25,
            'velocity': 0.15,
            'stability': 0.20,
            'evidence_score': 0.15
        }
        return (
            self.coherence * weights['coherence'] +
            self.alignment * weights['alignment'] +
            self.velocity * weights['velocity'] +
            self.stability * weights['stability'] +
            self.evidence_score * weights['evidence_score']
        )


@dataclass
class ValidationResult:
    """Result from a validation pass"""
    level: ValidationLevel
    validator_id: str
    timestamp: str
    passed: bool
    score: float
    notes: str = ""

    def to_dict(self) -> dict:
        """Convert to dictionary with enum handling"""
        return {
            'level': self.level.value,
            'validator_id': self.validator_id,
            'timestamp': self.timestamp,
            'passed': self.passed,
            'score': self.score,
            'notes': self.notes
        }


@dataclass
class FrequencyReport:
    """Complete F_total calculation report"""
    timestamp: str
    version: str = "2.0.0"
    f_total: float = 0.0
    band: str = ""
    components: list = field(default_factory=list)
    validations: list = field(default_factory=list)
    ready_for_diamond_hands: bool = False
    recommendation: str = ""

    def to_dict(self) -> dict:
        return asdict(self)

    def to_json(self) -> str:
        return json.dumps(self.to_dict(), indent=2)

    def to_yaml(self) -> str:
        return yaml.dump(self.to_dict(), default_flow_style=False)


class FrequencyEngine:
    """
    Core frequency calculation engine for Vyberology 2.0

    Computes F_total from component metrics and validation passes.
    Outputs evidence bundles for A7 compliance.
    """

    def __init__(self, manifest_path: Optional[Path] = None):
        self.components: list[ComponentMetrics] = []
        self.validations: list[ValidationResult] = []
        self.manifest = self._load_manifest(manifest_path)

    def _load_manifest(self, path: Optional[Path]) -> dict:
        """Load configuration from manifest.yaml"""
        if path and path.exists():
            with open(path) as f:
                return yaml.safe_load(f)
        return self._default_manifest()

    def _default_manifest(self) -> dict:
        """Default configuration when no manifest provided"""
        return {
            'version': '2.0.0',
            'thresholds': {
                'critical': 0.3,
                'low': 0.5,
                'nominal': 0.7,
                'optimal': 0.9
            },
            'weights': {
                'A3_governance': 0.30,
                'A4_architecture': 0.25,
                'A5_implementation': 0.25,
                'validation': 0.20
            },
            'diamond_hands_threshold': 0.7,
            'required_validations': ['self', 'peer', 'external']
        }

    def add_component(self, component: ComponentMetrics) -> None:
        """Register a component for frequency calculation"""
        self.components.append(component)

    def add_validation(self, validation: ValidationResult) -> None:
        """Record a validation pass result"""
        self.validations.append(validation)

    def _classify_band(self, f_total: float) -> FrequencyBand:
        """Classify frequency into operational band"""
        thresholds = self.manifest['thresholds']
        if f_total < thresholds['critical']:
            return FrequencyBand.CRITICAL
        elif f_total < thresholds['low']:
            return FrequencyBand.LOW
        elif f_total < thresholds['nominal']:
            return FrequencyBand.NOMINAL
        elif f_total < thresholds['optimal']:
            return FrequencyBand.OPTIMAL
        else:
            return FrequencyBand.PEAK

    def _compute_validation_score(self) -> float:
        """Aggregate validation pass scores"""
        if not self.validations:
            return 0.0
        passed = [v for v in self.validations if v.passed]
        return len(passed) / len(self.validations)

    def _generate_recommendation(self, f_total: float, band: FrequencyBand) -> str:
        """Generate actionable recommendation based on frequency"""
        recommendations = {
            FrequencyBand.CRITICAL: "HALT: System requires immediate attention. Do not proceed with POC.",
            FrequencyBand.LOW: "CAUTION: Address deficiencies before Thunder Strike review.",
            FrequencyBand.NOMINAL: "PROCEED: System stable. Continue with validation pipeline.",
            FrequencyBand.OPTIMAL: "ADVANCE: Ready for Diamond Hands review.",
            FrequencyBand.PEAK: "EXECUTE: Maximum coherence achieved. Full speed ahead."
        }
        return recommendations[band]

    def compute_f_total(self) -> FrequencyReport:
        """
        Calculate total system frequency

        F_total = weighted_sum(component_frequencies) * validation_multiplier

        Returns a complete FrequencyReport for A7 evidence bundle.
        """
        timestamp = datetime.now(timezone.utc).isoformat()

        # Calculate component frequencies
        component_scores = []
        for comp in self.components:
            freq = comp.compute_component_frequency()
            component_scores.append({
                'name': comp.name,
                'frequency': round(freq, 4),
                'metrics': asdict(comp)
            })

        # Aggregate component frequencies
        if component_scores:
            raw_f_total = sum(c['frequency'] for c in component_scores) / len(component_scores)
        else:
            raw_f_total = 0.0

        # Apply validation multiplier
        validation_score = self._compute_validation_score()
        validation_multiplier = 0.8 + (0.2 * validation_score)  # Range: 0.8 - 1.0

        f_total = raw_f_total * validation_multiplier
        band = self._classify_band(f_total)

        # Check Diamond Hands readiness
        diamond_threshold = self.manifest['diamond_hands_threshold']
        ready_for_diamond = (
            f_total >= diamond_threshold and
            validation_score >= 0.8
        )

        # Build report
        report = FrequencyReport(
            timestamp=timestamp,
            f_total=round(f_total, 4),
            band=band.value,
            components=component_scores,
            validations=[v.to_dict() for v in self.validations],
            ready_for_diamond_hands=ready_for_diamond,
            recommendation=self._generate_recommendation(f_total, band)
        )

        return report

    def export_evidence_bundle(self, output_dir: Path) -> Path:
        """
        Export A7-compliant evidence bundle

        Creates timestamped evidence package for governance review.
        """
        report = self.compute_f_total()

        # Create timestamped bundle directory
        bundle_name = f"evidence_bundle_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
        bundle_path = output_dir / bundle_name
        bundle_path.mkdir(parents=True, exist_ok=True)

        # Write JSON report
        json_path = bundle_path / "frequency_report.json"
        with open(json_path, 'w') as f:
            f.write(report.to_json())

        # Write YAML report
        yaml_path = bundle_path / "frequency_report.yaml"
        with open(yaml_path, 'w') as f:
            f.write(report.to_yaml())

        # Write summary
        summary_path = bundle_path / "SUMMARY.md"
        with open(summary_path, 'w') as f:
            f.write(f"""# Vyberology 2.0 Evidence Bundle

## Frequency Report Summary

- **Timestamp**: {report.timestamp}
- **F_total**: {report.f_total}
- **Band**: {report.band.upper()}
- **Diamond Hands Ready**: {'Yes' if report.ready_for_diamond_hands else 'No'}

## Recommendation

{report.recommendation}

## Components Analyzed

| Component | Frequency |
|-----------|-----------|
""")
            for comp in report.components:
                f.write(f"| {comp['name']} | {comp['frequency']} |\n")

            f.write(f"""
## Validation Passes

Total: {len(report.validations)}
Passed: {len([v for v in report.validations if v.get('passed', False)])}

---
*Generated by compute_f_total.py v{report.version}*
""")

        print(f"Evidence bundle exported to: {bundle_path}")
        return bundle_path


def main():
    """CLI entry point for frequency calculation"""
    import argparse

    parser = argparse.ArgumentParser(
        description="Vyberology 2.0 Frequency Calculation Engine"
    )
    parser.add_argument(
        '--manifest', '-m',
        type=Path,
        help='Path to manifest.yaml configuration'
    )
    parser.add_argument(
        '--output', '-o',
        type=Path,
        default=Path('evidence/A7-bundle'),
        help='Output directory for evidence bundle'
    )
    parser.add_argument(
        '--demo',
        action='store_true',
        help='Run with demo data'
    )
    parser.add_argument(
        '--json',
        action='store_true',
        help='Output JSON to stdout'
    )

    args = parser.parse_args()

    engine = FrequencyEngine(args.manifest)

    if args.demo:
        # Demo components
        engine.add_component(ComponentMetrics(
            name="A3-Governance",
            coherence=0.85,
            alignment=0.90,
            velocity=0.75,
            stability=0.88,
            evidence_score=0.82
        ))
        engine.add_component(ComponentMetrics(
            name="A4-Architecture",
            coherence=0.78,
            alignment=0.85,
            velocity=0.70,
            stability=0.80,
            evidence_score=0.75
        ))
        engine.add_component(ComponentMetrics(
            name="A5-Implementation",
            coherence=0.72,
            alignment=0.80,
            velocity=0.85,
            stability=0.75,
            evidence_score=0.70
        ))

        # Demo validations
        engine.add_validation(ValidationResult(
            level=ValidationLevel.SELF,
            validator_id="self-check-001",
            timestamp=datetime.now(timezone.utc).isoformat(),
            passed=True,
            score=0.85,
            notes="Self-assessment complete"
        ))
        engine.add_validation(ValidationResult(
            level=ValidationLevel.PEER,
            validator_id="thunder-strike-alpha",
            timestamp=datetime.now(timezone.utc).isoformat(),
            passed=True,
            score=0.80,
            notes="Peer review passed"
        ))

    if args.json:
        report = engine.compute_f_total()
        print(report.to_json())
    else:
        bundle_path = engine.export_evidence_bundle(args.output)
        report = engine.compute_f_total()
        print(f"\n{'='*50}")
        print(f"  VYBEROLOGY 2.0 - FREQUENCY REPORT")
        print(f"{'='*50}")
        print(f"  F_total: {report.f_total}")
        print(f"  Band: {report.band.upper()}")
        print(f"  Diamond Hands Ready: {'YES' if report.ready_for_diamond_hands else 'NO'}")
        print(f"{'='*50}")
        print(f"  {report.recommendation}")
        print(f"{'='*50}\n")


if __name__ == "__main__":
    main()
