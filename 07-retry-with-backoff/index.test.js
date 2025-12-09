const { retry, calculateDelay, applyJitter } = require("./index");

describe("retry", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe("basic functionality", () => {
    test("should return result on first success", async () => {
      const fn = jest.fn().mockResolvedValue("success");

      const promise = retry(fn);
      jest.runAllTimers();
      const result = await promise;

      expect(result).toBe("success");
      expect(fn).toHaveBeenCalledTimes(1);
    });

    test("should retry on failure", async () => {
      const fn = jest
        .fn()
        .mockRejectedValueOnce(new Error("fail1"))
        .mockResolvedValueOnce("success");

      const promise = retry(fn, { initialDelay: 100 });

      // First attempt fails
      await jest.advanceTimersByTimeAsync(0);

      // Wait for delay and second attempt
      await jest.advanceTimersByTimeAsync(100);

      const result = await promise;
      expect(result).toBe("success");
      expect(fn).toHaveBeenCalledTimes(2);
    });

    test("should throw after all retries exhausted", async () => {
      const error = new Error("persistent failure");
      const fn = jest.fn().mockRejectedValue(error);

      const promise = retry(fn, { maxRetries: 2, initialDelay: 100 });

      await jest.advanceTimersByTimeAsync(0); // attempt 1
      await jest.advanceTimersByTimeAsync(100); // attempt 2
      await jest.advanceTimersByTimeAsync(200); // attempt 3

      await expect(promise).rejects.toThrow("persistent failure");
      expect(fn).toHaveBeenCalledTimes(3); // initial + 2 retries
    });
  });

  describe("maxRetries option", () => {
    test("should respect maxRetries", async () => {
      const fn = jest.fn().mockRejectedValue(new Error("fail"));

      const promise = retry(fn, { maxRetries: 5, initialDelay: 10 });

      for (let i = 0; i < 10; i++) {
        await jest.advanceTimersByTimeAsync(100);
      }

      await expect(promise).rejects.toThrow();
      expect(fn).toHaveBeenCalledTimes(6); // initial + 5 retries
    });

    test("should handle maxRetries of 0", async () => {
      const fn = jest.fn().mockRejectedValue(new Error("fail"));

      const promise = retry(fn, { maxRetries: 0 });
      await jest.advanceTimersByTimeAsync(0);

      await expect(promise).rejects.toThrow();
      expect(fn).toHaveBeenCalledTimes(1);
    });
  });

  describe("retryIf option", () => {
    test("should retry when retryIf returns true", async () => {
      const fn = jest
        .fn()
        .mockRejectedValueOnce({ status: 500 })
        .mockResolvedValueOnce("success");

      const promise = retry(fn, {
        initialDelay: 100,
        retryIf: (error) => error.status >= 500,
      });

      await jest.advanceTimersByTimeAsync(100);
      const result = await promise;

      expect(result).toBe("success");
      expect(fn).toHaveBeenCalledTimes(2);
    });

    test("should not retry when retryIf returns false", async () => {
      const fn = jest.fn().mockRejectedValue({ status: 400 });

      const promise = retry(fn, {
        retryIf: (error) => error.status >= 500,
      });

      await jest.advanceTimersByTimeAsync(0);
      await expect(promise).rejects.toEqual({ status: 400 });
      expect(fn).toHaveBeenCalledTimes(1);
    });
  });

  describe("onRetry callback", () => {
    test("should call onRetry before each retry", async () => {
      const onRetry = jest.fn();
      const fn = jest
        .fn()
        .mockRejectedValueOnce(new Error("fail1"))
        .mockRejectedValueOnce(new Error("fail2"))
        .mockResolvedValueOnce("success");

      const promise = retry(fn, {
        maxRetries: 3,
        initialDelay: 100,
        onRetry,
      });

      await jest.advanceTimersByTimeAsync(0);
      await jest.advanceTimersByTimeAsync(100);
      await jest.advanceTimersByTimeAsync(200);

      await promise;

      expect(onRetry).toHaveBeenCalledTimes(2);
      expect(onRetry).toHaveBeenCalledWith(expect.any(Error), 1);
      expect(onRetry).toHaveBeenCalledWith(expect.any(Error), 2);
    });
  });
});

describe("calculateDelay", () => {
  test("fixed backoff returns same delay", () => {
    expect(calculateDelay("fixed", 1, 1000)).toBe(1000);
    expect(calculateDelay("fixed", 2, 1000)).toBe(1000);
    expect(calculateDelay("fixed", 3, 1000)).toBe(1000);
  });

  test("linear backoff increases linearly", () => {
    expect(calculateDelay("linear", 1, 1000)).toBe(1000);
    expect(calculateDelay("linear", 2, 1000)).toBe(2000);
    expect(calculateDelay("linear", 3, 1000)).toBe(3000);
  });

  test("exponential backoff doubles", () => {
    expect(calculateDelay("exponential", 1, 1000)).toBe(1000);
    expect(calculateDelay("exponential", 2, 1000)).toBe(2000);
    expect(calculateDelay("exponential", 3, 1000)).toBe(4000);
    expect(calculateDelay("exponential", 4, 1000)).toBe(8000);
  });
});

describe("applyJitter", () => {
  test("should add 0-25% jitter", () => {
    // Run multiple times to verify randomness
    const results = [];
    for (let i = 0; i < 100; i++) {
      results.push(applyJitter(1000));
    }

    const min = Math.min(...results);
    const max = Math.max(...results);

    expect(min).toBeGreaterThanOrEqual(1000);
    expect(max).toBeLessThanOrEqual(1250);
    // Check there's actual variation
    expect(max).toBeGreaterThan(min);
  });
});

describe("retry with backoff strategies", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test("should respect maxDelay cap", async () => {
    const delays = [];
    const fn = jest.fn().mockRejectedValue(new Error("fail"));

    const promise = retry(fn, {
      maxRetries: 5,
      initialDelay: 1000,
      maxDelay: 5000,
      backoff: "exponential",
    });

    // Track delays by advancing time
    // exponential would be: 1000, 2000, 4000, 8000, 16000
    // but capped at 5000: 1000, 2000, 4000, 5000, 5000

    for (let i = 0; i < 6; i++) {
      await jest.advanceTimersByTimeAsync(5000);
    }

    await expect(promise).rejects.toThrow();
  });
});
