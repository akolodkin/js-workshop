# Assignment 18: Strategy Pattern

## Difficulty: Medium

## Learning Objectives

- Understand the Strategy behavioral pattern
- Implement interchangeable algorithms
- Use composition over inheritance
- Build flexible, extensible systems

## The Problem

The Strategy pattern allows selecting algorithms at runtime. Instead of hard-coding logic, you inject different strategies.

```javascript
// Without strategy: rigid if/else
function calculatePrice(items, discountType) {
  if (discountType === "percentage") {
    // ... percentage logic
  } else if (discountType === "fixed") {
    // ... fixed logic
  } else if (discountType === "bulk") {
    // ... bulk logic
  }
}

// With strategy: flexible and extensible
const pricing = new PricingContext(new PercentageDiscount(10));
pricing.calculate(items);

pricing.setStrategy(new BulkDiscount(5, 0.15));
pricing.calculate(items);
```

## Requirements

### Strategy Interface

Each strategy should have a method that performs the algorithm:

```javascript
class Strategy {
  execute(data) {
    /* implementation */
  }
}
```

### Context Class

The context holds a strategy and delegates to it:

```javascript
class Context {
  constructor(strategy) {
    this.strategy = strategy;
  }

  setStrategy(strategy) {
    this.strategy = strategy;
  }

  executeStrategy(data) {
    return this.strategy.execute(data);
  }
}
```

### Implement: Sorting Strategies

```javascript
class SortContext {
  constructor(strategy);
  setStrategy(strategy);
  sort(array);
}

// Strategies
class BubbleSort { sort(arr) { /* ... */ } }
class QuickSort { sort(arr) { /* ... */ } }
class MergeSort { sort(arr) { /* ... */ } }
```

### Implement: Pricing Strategies

```javascript
class PricingContext {
  constructor(strategy);
  setStrategy(strategy);
  calculateTotal(items);
}

// Strategies
class RegularPricing { calculate(items) { /* no discount */ } }
class PercentageDiscount { calculate(items) { /* % off */ } }
class FixedDiscount { calculate(items) { /* fixed amount off */ } }
class BuyOneGetOneFree { calculate(items) { /* BOGO */ } }
```

## Examples

```javascript
// Sorting
const sorter = new SortContext(new QuickSort());
sorter.sort([3, 1, 4, 1, 5]); // [1, 1, 3, 4, 5]

// Change strategy at runtime
sorter.setStrategy(new BubbleSort());
sorter.sort([5, 2, 8]); // [2, 5, 8]

// Pricing
const pricing = new PricingContext(new RegularPricing());
const items = [
  { name: "Shirt", price: 50 },
  { name: "Pants", price: 80 },
];

pricing.calculateTotal(items); // 130

pricing.setStrategy(new PercentageDiscount(20)); // 20% off
pricing.calculateTotal(items); // 104

pricing.setStrategy(new FixedDiscount(30)); // $30 off
pricing.calculateTotal(items); // 100

// Validation strategies
const validator = new ValidationContext(new StrictValidation());
validator.validate(data);

validator.setStrategy(new LenientValidation());
validator.validate(data);
```

## Hints

1. The context delegates all work to the strategy
2. Strategies can be swapped at any time
3. All strategies for a context share the same interface
4. Consider using a registry for strategy lookup by name

## Resources

- [Refactoring Guru: Strategy](https://refactoring.guru/design-patterns/strategy)
- [JavaScript Design Patterns](https://www.patterns.dev/posts/strategy-pattern)
