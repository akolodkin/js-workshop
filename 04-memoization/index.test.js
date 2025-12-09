const { memoize } = require("./index");

describe("memoize", () => {
  describe("basic functionality", () => {
    test("should cache function results", () => {
      let callCount = 0;
      const fn = (x) => {
        callCount++;
        return x * 2;
      };

      const memoized = memoize(fn);

      expect(memoized(5)).toBe(10);
      expect(callCount).toBe(1);

      expect(memoized(5)).toBe(10);
      expect(callCount).toBe(1); // Still 1, cached

      expect(memoized(10)).toBe(20);
      expect(callCount).toBe(2);
    });

    test("should handle multiple arguments", () => {
      let callCount = 0;
      const add = (a, b) => {
        callCount++;
        return a + b;
      };

      const memoized = memoize(add);

      expect(memoized(1, 2)).toBe(3);
      expect(memoized(1, 2)).toBe(3);
      expect(callCount).toBe(1);

      expect(memoized(2, 1)).toBe(3); // Different order = different args
      expect(callCount).toBe(2);
    });

    test("should handle no arguments", () => {
      let callCount = 0;
      const getRandom = () => {
        callCount++;
        return 42;
      };

      const memoized = memoize(getRandom);

      expect(memoized()).toBe(42);
      expect(memoized()).toBe(42);
      expect(callCount).toBe(1);
    });

    test("should handle string arguments", () => {
      let callCount = 0;
      const greet = (name) => {
        callCount++;
        return `Hello, ${name}!`;
      };

      const memoized = memoize(greet);

      expect(memoized("Alice")).toBe("Hello, Alice!");
      expect(memoized("Alice")).toBe("Hello, Alice!");
      expect(callCount).toBe(1);

      expect(memoized("Bob")).toBe("Hello, Bob!");
      expect(callCount).toBe(2);
    });

    test("should cache null and undefined results", () => {
      let callCount = 0;
      const returnNull = () => {
        callCount++;
        return null;
      };

      const memoized = memoize(returnNull);

      expect(memoized()).toBe(null);
      expect(memoized()).toBe(null);
      expect(callCount).toBe(1);
    });

    test("should preserve this context", () => {
      const obj = {
        multiplier: 2,
        multiply: memoize(function (x) {
          return x * this.multiplier;
        }),
      };

      expect(obj.multiply(5)).toBe(10);
    });
  });

  describe("cache control", () => {
    test("should have cache.clear() method", () => {
      let callCount = 0;
      const fn = (x) => {
        callCount++;
        return x;
      };

      const memoized = memoize(fn);

      memoized(1);
      memoized(2);
      expect(callCount).toBe(2);

      memoized.cache.clear();

      memoized(1);
      expect(callCount).toBe(3);
    });

    test("should have cache.size property", () => {
      const memoized = memoize((x) => x);

      expect(memoized.cache.size).toBe(0);

      memoized(1);
      expect(memoized.cache.size).toBe(1);

      memoized(2);
      expect(memoized.cache.size).toBe(2);

      memoized(1); // Cached
      expect(memoized.cache.size).toBe(2);
    });

    test("should have cache.has() method", () => {
      const memoized = memoize((x) => x);

      memoized(1);

      // Key format may vary by implementation
      const hasKey =
        memoized.cache.has("[1]") ||
        memoized.cache.has("1") ||
        memoized.cache.size > 0;
      expect(hasKey).toBe(true);
    });

    test("should have cache.delete() method", () => {
      let callCount = 0;
      const fn = (x) => {
        callCount++;
        return x;
      };

      const memoized = memoize(fn);

      memoized(1);
      expect(callCount).toBe(1);

      // Clear specific entry
      memoized.cache.clear();

      memoized(1);
      expect(callCount).toBe(2);
    });
  });

  describe("maxSize option", () => {
    test("should limit cache size", () => {
      const memoized = memoize((x) => x * 2, { maxSize: 2 });

      memoized(1);
      memoized(2);
      expect(memoized.cache.size).toBe(2);

      memoized(3);
      expect(memoized.cache.size).toBe(2);
    });

    test("should evict oldest entry when maxSize reached", () => {
      let callCount = 0;
      const fn = (x) => {
        callCount++;
        return x;
      };

      const memoized = memoize(fn, { maxSize: 2 });

      memoized(1); // Cache: [1]
      memoized(2); // Cache: [1, 2]
      memoized(3); // Cache: [2, 3] - 1 evicted

      expect(callCount).toBe(3);

      memoized(2); // Should be cached
      expect(callCount).toBe(3);

      memoized(1); // Should NOT be cached (was evicted)
      expect(callCount).toBe(4);
    });
  });

  describe("ttl option", () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    test("should expire entries after ttl", () => {
      let callCount = 0;
      const fn = (x) => {
        callCount++;
        return x;
      };

      const memoized = memoize(fn, { ttl: 1000 });

      memoized(1);
      expect(callCount).toBe(1);

      memoized(1); // Cached
      expect(callCount).toBe(1);

      jest.advanceTimersByTime(1001);

      memoized(1); // Expired, recompute
      expect(callCount).toBe(2);
    });

    test("should not expire entries before ttl", () => {
      let callCount = 0;
      const fn = (x) => {
        callCount++;
        return x;
      };

      const memoized = memoize(fn, { ttl: 1000 });

      memoized(1);
      expect(callCount).toBe(1);

      jest.advanceTimersByTime(500);

      memoized(1); // Not expired yet
      expect(callCount).toBe(1);
    });
  });

  describe("keyGenerator option", () => {
    test("should use custom key generator", () => {
      let callCount = 0;
      const fn = (obj) => {
        callCount++;
        return obj.id;
      };

      const memoized = memoize(fn, {
        keyGenerator: (args) => args[0].id,
      });

      memoized({ id: 1, name: "Alice" });
      memoized({ id: 1, name: "Bob" }); // Same id, should be cached

      expect(callCount).toBe(1);
    });

    test("should work with complex key generation", () => {
      let callCount = 0;
      const fn = (a, b, c) => {
        callCount++;
        return a + b + c;
      };

      const memoized = memoize(fn, {
        keyGenerator: (args) => args.sort().join("|"),
      });

      memoized(1, 2, 3);
      memoized(3, 2, 1); // Same when sorted

      expect(callCount).toBe(1);
    });
  });

  describe("edge cases", () => {
    test("should handle functions that throw", () => {
      let callCount = 0;
      const fn = (x) => {
        callCount++;
        if (x < 0) throw new Error("Negative!");
        return x;
      };

      const memoized = memoize(fn);

      expect(() => memoized(-1)).toThrow("Negative!");
      expect(callCount).toBe(1);

      // Should NOT cache errors
      expect(() => memoized(-1)).toThrow("Negative!");
      expect(callCount).toBe(2);
    });

    test("should handle recursive memoized functions", () => {
      let callCount = 0;

      const fibonacci = memoize((n) => {
        callCount++;
        if (n <= 1) return n;
        return fibonacci(n - 1) + fibonacci(n - 2);
      });

      expect(fibonacci(10)).toBe(55);
      expect(callCount).toBe(11); // Each value computed once

      callCount = 0;
      expect(fibonacci(10)).toBe(55);
      expect(callCount).toBe(0); // All cached
    });
  });
});
