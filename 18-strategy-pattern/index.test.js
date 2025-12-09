const {
  SortContext,
  BubbleSort,
  QuickSort,
  MergeSort,
  PricingContext,
  RegularPricing,
  PercentageDiscount,
  FixedDiscount,
  BuyOneGetOneFree,
  TieredDiscount,
  ValidationContext,
  StrictValidation,
  LenientValidation,
  StrategyRegistry,
} = require("./index");

describe("Sorting Strategies", () => {
  const unsorted = [3, 1, 4, 1, 5, 9, 2, 6];
  const sorted = [1, 1, 2, 3, 4, 5, 6, 9];

  describe("SortContext", () => {
    test("should delegate to strategy", () => {
      const context = new SortContext(new QuickSort());
      expect(context.sort(unsorted)).toEqual(sorted);
    });

    test("should allow changing strategy", () => {
      const context = new SortContext(new BubbleSort());
      expect(context.sort([3, 1, 2])).toEqual([1, 2, 3]);

      context.setStrategy(new MergeSort());
      expect(context.sort([5, 2, 8])).toEqual([2, 5, 8]);
    });

    test("should not mutate original array", () => {
      const context = new SortContext(new QuickSort());
      const original = [3, 1, 2];
      context.sort(original);
      expect(original).toEqual([3, 1, 2]);
    });
  });

  describe("BubbleSort", () => {
    test("should sort array", () => {
      const sorter = new BubbleSort();
      expect(sorter.sort(unsorted)).toEqual(sorted);
    });

    test("should handle empty array", () => {
      const sorter = new BubbleSort();
      expect(sorter.sort([])).toEqual([]);
    });

    test("should handle single element", () => {
      const sorter = new BubbleSort();
      expect(sorter.sort([1])).toEqual([1]);
    });
  });

  describe("QuickSort", () => {
    test("should sort array", () => {
      const sorter = new QuickSort();
      expect(sorter.sort(unsorted)).toEqual(sorted);
    });
  });

  describe("MergeSort", () => {
    test("should sort array", () => {
      const sorter = new MergeSort();
      expect(sorter.sort(unsorted)).toEqual(sorted);
    });
  });
});

describe("Pricing Strategies", () => {
  const items = [
    { name: "Shirt", price: 50 },
    { name: "Pants", price: 80 },
    { name: "Shoes", price: 120 },
  ];

  describe("PricingContext", () => {
    test("should delegate to strategy", () => {
      const context = new PricingContext(new RegularPricing());
      expect(context.calculateTotal(items)).toBe(250);
    });

    test("should allow changing strategy", () => {
      const context = new PricingContext(new RegularPricing());
      expect(context.calculateTotal(items)).toBe(250);

      context.setStrategy(new PercentageDiscount(10));
      expect(context.calculateTotal(items)).toBe(225);
    });
  });

  describe("RegularPricing", () => {
    test("should sum all prices", () => {
      const strategy = new RegularPricing();
      expect(strategy.calculate(items)).toBe(250);
    });

    test("should handle empty items", () => {
      const strategy = new RegularPricing();
      expect(strategy.calculate([])).toBe(0);
    });
  });

  describe("PercentageDiscount", () => {
    test("should apply percentage discount", () => {
      const strategy = new PercentageDiscount(20);
      expect(strategy.calculate(items)).toBe(200); // 250 * 0.8
    });

    test("should handle 0% discount", () => {
      const strategy = new PercentageDiscount(0);
      expect(strategy.calculate(items)).toBe(250);
    });

    test("should handle 100% discount", () => {
      const strategy = new PercentageDiscount(100);
      expect(strategy.calculate(items)).toBe(0);
    });
  });

  describe("FixedDiscount", () => {
    test("should subtract fixed amount", () => {
      const strategy = new FixedDiscount(50);
      expect(strategy.calculate(items)).toBe(200);
    });

    test("should not go below 0", () => {
      const strategy = new FixedDiscount(300);
      expect(strategy.calculate(items)).toBe(0);
    });
  });

  describe("BuyOneGetOneFree", () => {
    test("should make every second item free", () => {
      const strategy = new BuyOneGetOneFree();
      // Sort by price: 120, 80, 50
      // Charge: 120, free, 50 = 170
      expect(strategy.calculate(items)).toBe(170);
    });

    test("should handle single item", () => {
      const strategy = new BuyOneGetOneFree();
      expect(strategy.calculate([{ price: 100 }])).toBe(100);
    });

    test("should handle two items", () => {
      const strategy = new BuyOneGetOneFree();
      // Charge higher, free lower
      expect(strategy.calculate([{ price: 50 }, { price: 100 }])).toBe(100);
    });
  });

  describe("TieredDiscount", () => {
    test("should apply tier based on total", () => {
      const strategy = new TieredDiscount([
        { threshold: 100, discount: 5 },
        { threshold: 200, discount: 10 },
        { threshold: 300, discount: 15 },
      ]);

      // Total is 250, falls in 200+ tier = 10% off
      expect(strategy.calculate(items)).toBe(225);
    });

    test("should apply highest applicable tier", () => {
      const strategy = new TieredDiscount([
        { threshold: 100, discount: 5 },
        { threshold: 200, discount: 10 },
      ]);

      const cheapItems = [{ price: 50 }];
      // Below all tiers = no discount
      expect(strategy.calculate(cheapItems)).toBe(50);
    });
  });
});

describe("Validation Strategies", () => {
  describe("ValidationContext", () => {
    test("should delegate to strategy", () => {
      const context = new ValidationContext(new StrictValidation());
      const result = context.validate({ name: "Test" });
      expect(result).toHaveProperty("valid");
      expect(result).toHaveProperty("errors");
    });

    test("should allow changing strategy", () => {
      const context = new ValidationContext(new StrictValidation());
      context.setStrategy(new LenientValidation());
      // Should use lenient validation now
      const result = context.validate({});
      expect(result.valid).toBe(true);
    });
  });

  describe("StrictValidation", () => {
    test("should require all fields", () => {
      const validator = new StrictValidation();
      const result = validator.validate({ name: "" });
      expect(result.valid).toBe(false);
    });

    test("should pass with all valid fields", () => {
      const validator = new StrictValidation();
      const result = validator.validate({
        name: "John",
        email: "john@example.com",
        age: 25,
      });
      expect(result.valid).toBe(true);
    });
  });

  describe("LenientValidation", () => {
    test("should allow missing optional fields", () => {
      const validator = new LenientValidation();
      const result = validator.validate({ name: "John" });
      expect(result.valid).toBe(true);
    });
  });
});

describe("StrategyRegistry", () => {
  test("should register and retrieve strategies", () => {
    const registry = new StrategyRegistry();
    const strategy = new RegularPricing();

    registry.register("regular", strategy);
    expect(registry.get("regular")).toBe(strategy);
  });

  test("should check if strategy exists", () => {
    const registry = new StrategyRegistry();
    registry.register("regular", new RegularPricing());

    expect(registry.has("regular")).toBe(true);
    expect(registry.has("unknown")).toBe(false);
  });

  test("should return null for unknown strategy", () => {
    const registry = new StrategyRegistry();
    expect(registry.get("unknown")).toBeNull();
  });
});
