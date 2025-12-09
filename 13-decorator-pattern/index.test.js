const {
  withLogging,
  withTiming,
  withRetry,
  withMemoize,
  withValidation,
  withCache,
  compose,
  pipe,
  clearLogs,
  getLogs,
} = require("./index");

describe("withLogging", () => {
  beforeEach(() => clearLogs());

  test("should call original function and return result", () => {
    const add = (a, b) => a + b;
    const logged = withLogging(add);
    expect(logged(2, 3)).toBe(5);
  });

  test("should preserve this context", () => {
    const obj = {
      value: 10,
      getValue() {
        return this.value;
      },
    };
    obj.getValue = withLogging(obj.getValue);
    expect(obj.getValue()).toBe(10);
  });

  test("should handle functions with no arguments", () => {
    const fn = () => 42;
    const logged = withLogging(fn);
    expect(logged()).toBe(42);
  });
});

describe("withTiming", () => {
  test("should call original function and return result", () => {
    const fn = (x) => x * 2;
    const timed = withTiming(fn);
    expect(timed(5)).toBe(10);
  });

  test("should measure execution time", () => {
    const slow = () => {
      const start = Date.now();
      while (Date.now() - start < 50) {} // Busy wait 50ms
      return "done";
    };
    const timed = withTiming(slow);
    const result = timed();
    expect(result).toBe("done");
  });
});

describe("withRetry", () => {
  test("should return result on first success", () => {
    const fn = jest.fn().mockReturnValue("success");
    const retried = withRetry(fn, 3);
    expect(retried()).toBe("success");
    expect(fn).toHaveBeenCalledTimes(1);
  });

  test("should retry on failure", () => {
    const fn = jest
      .fn()
      .mockImplementationOnce(() => {
        throw new Error("fail1");
      })
      .mockImplementationOnce(() => {
        throw new Error("fail2");
      })
      .mockReturnValue("success");

    const retried = withRetry(fn, 3);
    expect(retried()).toBe("success");
    expect(fn).toHaveBeenCalledTimes(3);
  });

  test("should throw after max retries", () => {
    const fn = jest.fn().mockImplementation(() => {
      throw new Error("always fails");
    });

    const retried = withRetry(fn, 2);
    expect(() => retried()).toThrow("always fails");
    expect(fn).toHaveBeenCalledTimes(3); // initial + 2 retries
  });

  test("should pass arguments to function", () => {
    const fn = jest.fn((a, b) => a + b);
    const retried = withRetry(fn, 3);
    expect(retried(2, 3)).toBe(5);
    expect(fn).toHaveBeenCalledWith(2, 3);
  });
});

describe("withMemoize", () => {
  test("should cache results", () => {
    let callCount = 0;
    const expensive = (x) => {
      callCount++;
      return x * 2;
    };

    const memoized = withMemoize(expensive);

    expect(memoized(5)).toBe(10);
    expect(memoized(5)).toBe(10);
    expect(callCount).toBe(1);

    expect(memoized(10)).toBe(20);
    expect(callCount).toBe(2);
  });

  test("should handle multiple arguments", () => {
    let callCount = 0;
    const add = (a, b) => {
      callCount++;
      return a + b;
    };

    const memoized = withMemoize(add);

    expect(memoized(1, 2)).toBe(3);
    expect(memoized(1, 2)).toBe(3);
    expect(callCount).toBe(1);

    expect(memoized(2, 1)).toBe(3);
    expect(callCount).toBe(2); // Different args
  });
});

describe("withValidation", () => {
  test("should call function when validation passes", () => {
    const fn = (x) => x * 2;
    const validated = withValidation(fn, (x) => x > 0);
    expect(validated(5)).toBe(10);
  });

  test("should throw when validation fails", () => {
    const fn = (x) => x * 2;
    const validated = withValidation(fn, (x) => x > 0);
    expect(() => validated(-5)).toThrow();
  });

  test("should validate multiple arguments", () => {
    const divide = (a, b) => a / b;
    const validated = withValidation(divide, (a, b) => b !== 0);
    expect(validated(10, 2)).toBe(5);
    expect(() => validated(10, 0)).toThrow();
  });
});

describe("withCache", () => {
  test("should cache method results", () => {
    let callCount = 0;
    const api = {
      fetchUser(id) {
        callCount++;
        return { id, name: `User ${id}` };
      },
    };

    withCache(api, "fetchUser");

    expect(api.fetchUser(1)).toEqual({ id: 1, name: "User 1" });
    expect(api.fetchUser(1)).toEqual({ id: 1, name: "User 1" });
    expect(callCount).toBe(1);

    expect(api.fetchUser(2)).toEqual({ id: 2, name: "User 2" });
    expect(callCount).toBe(2);
  });

  test("should preserve this context", () => {
    const obj = {
      multiplier: 2,
      calculate(x) {
        return x * this.multiplier;
      },
    };

    withCache(obj, "calculate");

    expect(obj.calculate(5)).toBe(10);
    expect(obj.calculate(5)).toBe(10);
  });
});

describe("compose", () => {
  test("should compose decorators right-to-left", () => {
    const double = (fn) => (x) => fn(x) * 2;
    const addOne = (fn) => (x) => fn(x) + 1;

    const identity = (x) => x;
    const composed = compose(double, addOne)(identity);

    // (identity(5) + 1) * 2 = 12
    expect(composed(5)).toBe(12);
  });

  test("should work with single decorator", () => {
    const double = (fn) => (x) => fn(x) * 2;
    const identity = (x) => x;
    const composed = compose(double)(identity);
    expect(composed(5)).toBe(10);
  });

  test("should work with no decorators", () => {
    const identity = (x) => x;
    const composed = compose()(identity);
    expect(composed(5)).toBe(5);
  });
});

describe("pipe", () => {
  test("should pipe decorators left-to-right", () => {
    const double = (fn) => (x) => fn(x) * 2;
    const addOne = (fn) => (x) => fn(x) + 1;

    const identity = (x) => x;
    const piped = pipe(double, addOne)(identity);

    // ((identity(5) * 2) + 1) = 11
    expect(piped(5)).toBe(11);
  });
});

describe("decorator combinations", () => {
  test("should combine logging and memoization", () => {
    let callCount = 0;
    const expensive = (x) => {
      callCount++;
      return x * 2;
    };

    const enhanced = compose(withLogging, withMemoize)(expensive);

    enhanced(5);
    enhanced(5);
    expect(callCount).toBe(1);
  });
});
