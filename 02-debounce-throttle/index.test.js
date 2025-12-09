const { debounce, throttle } = require("./index");

// Helper to advance timers
jest.useFakeTimers();

describe("debounce", () => {
  beforeEach(() => {
    jest.clearAllTimers();
  });

  test("should delay function execution", () => {
    const fn = jest.fn();
    const debounced = debounce(fn, 100);

    debounced();
    expect(fn).not.toHaveBeenCalled();

    jest.advanceTimersByTime(100);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  test("should reset timer on subsequent calls", () => {
    const fn = jest.fn();
    const debounced = debounce(fn, 100);

    debounced();
    jest.advanceTimersByTime(50);
    debounced(); // Reset timer
    jest.advanceTimersByTime(50);
    expect(fn).not.toHaveBeenCalled();

    jest.advanceTimersByTime(50);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  test("should only execute once after rapid calls", () => {
    const fn = jest.fn();
    const debounced = debounce(fn, 100);

    debounced();
    debounced();
    debounced();
    debounced();
    debounced();

    jest.advanceTimersByTime(100);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  test("should pass arguments to the original function", () => {
    const fn = jest.fn();
    const debounced = debounce(fn, 100);

    debounced("arg1", "arg2", 123);
    jest.advanceTimersByTime(100);

    expect(fn).toHaveBeenCalledWith("arg1", "arg2", 123);
  });

  test("should use the latest arguments", () => {
    const fn = jest.fn();
    const debounced = debounce(fn, 100);

    debounced("first");
    debounced("second");
    debounced("third");

    jest.advanceTimersByTime(100);
    expect(fn).toHaveBeenCalledWith("third");
  });

  test("should preserve this context", () => {
    const fn = jest.fn(function () {
      return this.value;
    });
    const debounced = debounce(fn, 100);

    const obj = { value: 42, method: debounced };
    obj.method();

    jest.advanceTimersByTime(100);
    expect(fn.mock.instances[0]).toBe(obj);
  });

  test("should have a cancel method", () => {
    const fn = jest.fn();
    const debounced = debounce(fn, 100);

    debounced();
    debounced.cancel();
    jest.advanceTimersByTime(100);

    expect(fn).not.toHaveBeenCalled();
  });

  test("should allow new calls after cancel", () => {
    const fn = jest.fn();
    const debounced = debounce(fn, 100);

    debounced();
    debounced.cancel();
    debounced();
    jest.advanceTimersByTime(100);

    expect(fn).toHaveBeenCalledTimes(1);
  });
});

describe("throttle", () => {
  beforeEach(() => {
    jest.clearAllTimers();
  });

  test("should execute immediately on first call", () => {
    const fn = jest.fn();
    const throttled = throttle(fn, 100);

    throttled();
    expect(fn).toHaveBeenCalledTimes(1);
  });

  test("should ignore calls within the limit period", () => {
    const fn = jest.fn();
    const throttled = throttle(fn, 100);

    throttled();
    throttled();
    throttled();

    expect(fn).toHaveBeenCalledTimes(1);
  });

  test("should allow calls after the limit period", () => {
    const fn = jest.fn();
    const throttled = throttle(fn, 100);

    throttled();
    jest.advanceTimersByTime(100);
    throttled();

    expect(fn).toHaveBeenCalledTimes(2);
  });

  test("should execute at regular intervals during continuous calls", () => {
    const fn = jest.fn();
    const throttled = throttle(fn, 100);

    // Simulate continuous calls over 350ms
    throttled(); // t=0, executes
    jest.advanceTimersByTime(50);
    throttled(); // t=50, ignored
    jest.advanceTimersByTime(50);
    throttled(); // t=100, executes
    jest.advanceTimersByTime(50);
    throttled(); // t=150, ignored
    jest.advanceTimersByTime(50);
    throttled(); // t=200, executes
    jest.advanceTimersByTime(50);
    throttled(); // t=250, ignored

    expect(fn).toHaveBeenCalledTimes(3);
  });

  test("should pass arguments to the original function", () => {
    const fn = jest.fn();
    const throttled = throttle(fn, 100);

    throttled("arg1", "arg2", 123);
    expect(fn).toHaveBeenCalledWith("arg1", "arg2", 123);
  });

  test("should preserve this context", () => {
    const fn = jest.fn(function () {
      return this.value;
    });
    const throttled = throttle(fn, 100);

    const obj = { value: 42, method: throttled };
    obj.method();

    expect(fn.mock.instances[0]).toBe(obj);
  });

  test("should have a cancel method", () => {
    const fn = jest.fn();
    const throttled = throttle(fn, 100);

    throttled();
    throttled.cancel();

    // Should be able to call again immediately after cancel
    throttled();
    expect(fn).toHaveBeenCalledTimes(2);
  });

  test("should reset throttle state on cancel", () => {
    const fn = jest.fn();
    const throttled = throttle(fn, 100);

    throttled(); // First call
    jest.advanceTimersByTime(50);
    throttled.cancel();
    throttled(); // Should work immediately after cancel

    expect(fn).toHaveBeenCalledTimes(2);
  });
});
