#!/usr/bin/env python3
"""
policy_runtime.py - Vyberology 2.0 Policy Runtime Engine

Runtime stubs for policy enforcement within LUMEN OS.
These stubs provide hooks for governance policy validation
at runtime checkpoints.

Thunder Strike validators use these hooks for automated compliance checks.
"""

from abc import ABC, abstractmethod
from dataclasses import dataclass
from datetime import datetime, timezone
from enum import Enum
from typing import Any, Callable, Optional
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("vyberology.policy")


class PolicyDecision(Enum):
    """Policy evaluation outcomes"""
    ALLOW = "allow"
    DENY = "deny"
    DEFER = "defer"  # Requires human review
    AUDIT = "audit"  # Allow but flag for review


class PolicyCategory(Enum):
    """Categories of governance policies"""
    GOVERNANCE = "A3"
    ARCHITECTURE = "A4"
    IMPLEMENTATION = "A5"
    SECURITY = "security"
    COMPLIANCE = "compliance"
    OPERATIONAL = "operational"


@dataclass
class PolicyContext:
    """Context for policy evaluation"""
    actor: str
    action: str
    resource: str
    timestamp: str
    metadata: dict
    current_f_total: float = 0.0
    validation_level: str = "none"


@dataclass
class PolicyResult:
    """Result of policy evaluation"""
    decision: PolicyDecision
    policy_id: str
    reason: str
    evidence: dict
    requires_diamond_hands: bool = False


class Policy(ABC):
    """Base class for all Vyberology policies"""

    def __init__(self, policy_id: str, category: PolicyCategory):
        self.policy_id = policy_id
        self.category = category
        self.enabled = True

    @abstractmethod
    def evaluate(self, context: PolicyContext) -> PolicyResult:
        """Evaluate the policy against the given context"""
        pass

    def __repr__(self):
        return f"Policy({self.policy_id}, {self.category.value})"


# =============================================================================
# STUB POLICIES - Replace with actual implementations
# =============================================================================

class FrequencyThresholdPolicy(Policy):
    """
    Policy: System frequency must meet minimum threshold for operations

    Stub implementation - customize thresholds per your governance requirements.
    """

    def __init__(self, min_threshold: float = 0.5):
        super().__init__("POL-FREQ-001", PolicyCategory.OPERATIONAL)
        self.min_threshold = min_threshold

    def evaluate(self, context: PolicyContext) -> PolicyResult:
        if context.current_f_total >= self.min_threshold:
            return PolicyResult(
                decision=PolicyDecision.ALLOW,
                policy_id=self.policy_id,
                reason=f"Frequency {context.current_f_total} >= threshold {self.min_threshold}",
                evidence={"f_total": context.current_f_total, "threshold": self.min_threshold}
            )
        else:
            return PolicyResult(
                decision=PolicyDecision.DENY,
                policy_id=self.policy_id,
                reason=f"Frequency {context.current_f_total} below threshold {self.min_threshold}",
                evidence={"f_total": context.current_f_total, "threshold": self.min_threshold}
            )


class ValidationRequiredPolicy(Policy):
    """
    Policy: Certain actions require Thunder Strike validation

    Stub implementation - define which actions need validation.
    """

    ACTIONS_REQUIRING_VALIDATION = [
        "deploy_production",
        "modify_governance",
        "update_architecture",
        "diamond_hands_decision"
    ]

    def __init__(self):
        super().__init__("POL-VAL-001", PolicyCategory.GOVERNANCE)

    def evaluate(self, context: PolicyContext) -> PolicyResult:
        if context.action in self.ACTIONS_REQUIRING_VALIDATION:
            if context.validation_level in ["external", "diamond_hands"]:
                return PolicyResult(
                    decision=PolicyDecision.ALLOW,
                    policy_id=self.policy_id,
                    reason=f"Action '{context.action}' has required validation level",
                    evidence={"validation_level": context.validation_level}
                )
            else:
                return PolicyResult(
                    decision=PolicyDecision.DEFER,
                    policy_id=self.policy_id,
                    reason=f"Action '{context.action}' requires validation",
                    evidence={"required_level": "external", "current_level": context.validation_level},
                    requires_diamond_hands=True
                )
        return PolicyResult(
            decision=PolicyDecision.ALLOW,
            policy_id=self.policy_id,
            reason="Action does not require special validation",
            evidence={}
        )


class DiamondHandsApprovalPolicy(Policy):
    """
    Policy: Critical decisions require Diamond Hands authority approval

    Stub implementation - define critical decision criteria.
    """

    CRITICAL_RESOURCES = [
        "governance_policy",
        "system_architecture",
        "security_config",
        "poc_advancement"
    ]

    def __init__(self):
        super().__init__("POL-DH-001", PolicyCategory.GOVERNANCE)

    def evaluate(self, context: PolicyContext) -> PolicyResult:
        if context.resource in self.CRITICAL_RESOURCES:
            if context.metadata.get("diamond_hands_approved"):
                return PolicyResult(
                    decision=PolicyDecision.ALLOW,
                    policy_id=self.policy_id,
                    reason="Diamond Hands approval obtained",
                    evidence={"approver": context.metadata.get("approver")}
                )
            else:
                return PolicyResult(
                    decision=PolicyDecision.DENY,
                    policy_id=self.policy_id,
                    reason=f"Resource '{context.resource}' requires Diamond Hands approval",
                    evidence={"resource": context.resource},
                    requires_diamond_hands=True
                )
        return PolicyResult(
            decision=PolicyDecision.ALLOW,
            policy_id=self.policy_id,
            reason="Resource does not require Diamond Hands approval",
            evidence={}
        )


class EvidenceRequiredPolicy(Policy):
    """
    Policy: Operations must generate evidence for A7 bundle

    Stub implementation - ensure audit trail completeness.
    """

    def __init__(self):
        super().__init__("POL-EV-001", PolicyCategory.COMPLIANCE)

    def evaluate(self, context: PolicyContext) -> PolicyResult:
        # Stub: Always audit but allow
        return PolicyResult(
            decision=PolicyDecision.AUDIT,
            policy_id=self.policy_id,
            reason="Operation logged for A7 evidence bundle",
            evidence={
                "actor": context.actor,
                "action": context.action,
                "resource": context.resource,
                "timestamp": context.timestamp
            }
        )


# =============================================================================
# POLICY ENGINE
# =============================================================================

class PolicyEngine:
    """
    Runtime policy evaluation engine

    Evaluates contexts against registered policies and produces
    evidence-backed decisions for governance compliance.
    """

    def __init__(self):
        self.policies: list[Policy] = []
        self.hooks: dict[str, list[Callable]] = {
            "pre_evaluate": [],
            "post_evaluate": [],
            "on_deny": [],
            "on_diamond_hands_required": []
        }

    def register_policy(self, policy: Policy) -> None:
        """Register a policy for evaluation"""
        self.policies.append(policy)
        logger.info(f"Registered policy: {policy}")

    def register_hook(self, event: str, callback: Callable) -> None:
        """Register a hook for policy events"""
        if event in self.hooks:
            self.hooks[event].append(callback)

    def _run_hooks(self, event: str, *args, **kwargs) -> None:
        """Execute all hooks for an event"""
        for hook in self.hooks.get(event, []):
            try:
                hook(*args, **kwargs)
            except Exception as e:
                logger.error(f"Hook error ({event}): {e}")

    def evaluate(self, context: PolicyContext) -> list[PolicyResult]:
        """
        Evaluate all policies against the context

        Returns list of all policy results for audit trail.
        """
        self._run_hooks("pre_evaluate", context)

        results = []
        for policy in self.policies:
            if not policy.enabled:
                continue

            try:
                result = policy.evaluate(context)
                results.append(result)

                if result.decision == PolicyDecision.DENY:
                    self._run_hooks("on_deny", policy, context, result)

                if result.requires_diamond_hands:
                    self._run_hooks("on_diamond_hands_required", policy, context, result)

            except Exception as e:
                logger.error(f"Policy evaluation error ({policy.policy_id}): {e}")
                results.append(PolicyResult(
                    decision=PolicyDecision.DENY,
                    policy_id=policy.policy_id,
                    reason=f"Evaluation error: {e}",
                    evidence={"error": str(e)}
                ))

        self._run_hooks("post_evaluate", context, results)
        return results

    def check(self, context: PolicyContext) -> tuple[bool, list[PolicyResult]]:
        """
        Quick check if all policies pass

        Returns (allowed, results) tuple.
        """
        results = self.evaluate(context)
        denied = [r for r in results if r.decision == PolicyDecision.DENY]
        return (len(denied) == 0, results)


# =============================================================================
# CONVENIENCE FUNCTIONS
# =============================================================================

def create_default_engine() -> PolicyEngine:
    """Create a policy engine with default Vyberology policies"""
    engine = PolicyEngine()

    # Register default policies
    engine.register_policy(FrequencyThresholdPolicy(min_threshold=0.5))
    engine.register_policy(ValidationRequiredPolicy())
    engine.register_policy(DiamondHandsApprovalPolicy())
    engine.register_policy(EvidenceRequiredPolicy())

    return engine


def create_context(
    actor: str,
    action: str,
    resource: str,
    f_total: float = 0.0,
    validation_level: str = "none",
    **metadata
) -> PolicyContext:
    """Helper to create a policy context"""
    return PolicyContext(
        actor=actor,
        action=action,
        resource=resource,
        timestamp=datetime.now(timezone.utc).isoformat(),
        metadata=metadata,
        current_f_total=f_total,
        validation_level=validation_level
    )


# =============================================================================
# DEMO / CLI
# =============================================================================

def main():
    """Demo the policy runtime"""
    print("\n" + "=" * 50)
    print("  VYBEROLOGY 2.0 - POLICY RUNTIME DEMO")
    print("=" * 50 + "\n")

    # Create engine with default policies
    engine = create_default_engine()

    # Demo context 1: Normal operation
    print("Test 1: Normal operation with good frequency")
    ctx1 = create_context(
        actor="developer-001",
        action="update_code",
        resource="feature-branch",
        f_total=0.75,
        validation_level="peer"
    )
    allowed, results = engine.check(ctx1)
    print(f"  Allowed: {allowed}")
    for r in results:
        print(f"  - {r.policy_id}: {r.decision.value} ({r.reason})")

    # Demo context 2: Critical action without approval
    print("\nTest 2: Production deploy without Diamond Hands approval")
    ctx2 = create_context(
        actor="developer-001",
        action="deploy_production",
        resource="poc_advancement",
        f_total=0.80,
        validation_level="external"
    )
    allowed, results = engine.check(ctx2)
    print(f"  Allowed: {allowed}")
    for r in results:
        print(f"  - {r.policy_id}: {r.decision.value} ({r.reason})")

    # Demo context 3: With Diamond Hands approval
    print("\nTest 3: Production deploy WITH Diamond Hands approval")
    ctx3 = create_context(
        actor="developer-001",
        action="deploy_production",
        resource="poc_advancement",
        f_total=0.85,
        validation_level="diamond_hands",
        diamond_hands_approved=True,
        approver="diamond-authority-001"
    )
    allowed, results = engine.check(ctx3)
    print(f"  Allowed: {allowed}")
    for r in results:
        print(f"  - {r.policy_id}: {r.decision.value} ({r.reason})")

    print("\n" + "=" * 50 + "\n")


if __name__ == "__main__":
    main()
