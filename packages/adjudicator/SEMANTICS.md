# Semantic Equivalence Rules

## A5 Adjudicator - SEMANTICS.md

**Owner**: B-03 (A5 Owner)
**Version**: 1.0.0
**Status**: Draft - Week 1

---

## Purpose

This document defines the rules for determining semantic equivalence between A3 and A4 codegen outputs. The adjudicator uses these rules to produce verdicts.

---

## Core Principles

### 1. Semantic vs. Syntactic Equivalence

**Semantic equivalence** means the outputs behave identically at runtime, regardless of syntactic differences.

**Syntactic equivalence** means the outputs are character-for-character identical.

The adjudicator prioritizes **semantic equivalence**.

---

## Equivalence Rules

### Rule 1: Whitespace Normalization

**Status**: Optional (configurable)

Differences in whitespace are considered semantically equivalent:

```typescript
// A3 output
export const foo = 1;

// A4 output
export const foo=1;

// Verdict: MATCH (semantically equivalent)
```

**Configuration**: `options.ignoreWhitespace: true`

---

### Rule 2: Comment Differences

**Status**: Optional (configurable)

Comments do not affect runtime behavior:

```typescript
// A3 output
// This is foo
export const foo = 1;

// A4 output
/* foo constant */
export const foo = 1;

// Verdict: MATCH (semantically equivalent)
```

**Configuration**: `options.ignoreComments: true`

---

### Rule 3: Import Order

**Status**: Relaxed mode only

Import order typically doesn't affect behavior:

```typescript
// A3 output
import { a } from './a';
import { b } from './b';

// A4 output
import { b } from './b';
import { a } from './a';

// Verdict: MATCH in relaxed mode, MISMATCH in strict mode
```

---

### Rule 4: Export Order

**Status**: Always equivalent

Named export order is semantically equivalent:

```typescript
// A3 output
export { foo, bar };

// A4 output
export { bar, foo };

// Verdict: MATCH
```

---

### Rule 5: String Quote Style

**Status**: Always equivalent

Quote style doesn't affect behavior:

```typescript
// A3 output
const s = "hello";

// A4 output
const s = 'hello';

// Verdict: MATCH
```

---

### Rule 6: Trailing Commas

**Status**: Always equivalent

Trailing commas are stylistic:

```typescript
// A3 output
const arr = [1, 2, 3];

// A4 output
const arr = [1, 2, 3,];

// Verdict: MATCH
```

---

### Rule 7: Object Property Order

**Status**: Relaxed mode only

Object property order can affect iteration:

```typescript
// A3 output
const obj = { a: 1, b: 2 };

// A4 output
const obj = { b: 2, a: 1 };

// Verdict: MATCH in relaxed mode (iteration order differs but usually irrelevant)
// Verdict: MISMATCH in strict mode
```

---

### Rule 8: Variable Naming (Internal)

**Status**: Never equivalent

Internal variable names must match:

```typescript
// A3 output
const result = compute();

// A4 output
const output = compute();

// Verdict: MISMATCH (different behavior if exported/referenced)
```

---

### Rule 9: Function Implementation

**Status**: Semantic comparison

Functions are equivalent if they produce the same output for same inputs:

```typescript
// A3 output
const double = (x: number) => x * 2;

// A4 output
const double = (x: number) => x + x;

// Verdict: MATCH (semantically equivalent)
```

**Note**: Property-based testing required to verify.

---

### Rule 10: Type Annotations

**Status**: Relaxed mode only

Type annotations don't affect runtime:

```typescript
// A3 output
const x: number = 1;

// A4 output
const x = 1;

// Verdict: MATCH in relaxed mode (TypeScript-specific)
```

---

## Verdict Classification

### MATCH

- Zero semantic differences
- All files present in both outputs
- Content is functionally equivalent

### PARTIAL_MATCH

- Some files match, some differ
- No critical differences
- May require manual review

### MISMATCH

- Critical semantic differences
- Missing or extra files
- Different runtime behavior

### ERROR

- Comparison could not complete
- Invalid input format
- Internal error

### INCONCLUSIVE

- Cannot determine equivalence
- Requires human judgment
- Complex semantic analysis needed

---

## Severity Classification

### Critical

- Missing or extra files
- Different exports
- Breaking changes

### Major

- Different function implementations
- Different type structures
- Non-trivial content changes

### Minor

- Whitespace differences
- Comment differences
- Style variations

### Info

- Metadata differences
- Timestamp variations
- Version differences

---

## Property-Based Testing

For complex semantic comparisons, use property-based testing:

```typescript
import fc from 'fast-check';

// Property: A3 and A4 produce same behavior for any valid input
fc.assert(
  fc.property(fc.jsonValue(), (input) => {
    const a3Result = a3Generate(input);
    const a4Result = a4Generate(input);
    return semanticallyEquivalent(a3Result, a4Result);
  })
);
```

---

## Configuration Modes

### Strict Mode

- All rules enforced strictly
- Minimal tolerance for differences
- Use for: production validation

### Relaxed Mode

- Allows stylistic differences
- Focuses on semantic behavior
- Use for: development, initial validation

---

## Future Enhancements

1. AST-based comparison
2. Runtime behavior testing
3. Type system analysis
4. Coverage-based equivalence

---

*Document Owner: B-03 (A5 Owner)*
*Last Updated: Week 1*
