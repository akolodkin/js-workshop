const {
  promiseAll,
  promiseRace,
  promiseAllSettled,
  promiseAny,
} = require("./index");

describe("promiseAll", () => {
  test("should resolve with array of results", async () => {
    const result = await promiseAll([
      Promise.resolve(1),
      Promise.resolve(2),
      Promise.resolve(3),
    ]);
    expect(result).toEqual([1, 2, 3]);
  });

  test("should maintain order regardless of completion order", async () => {
    const result = await promiseAll([
      new Promise((r) => setTimeout(() => r("slow"), 50)),
      Promise.resolve("fast"),
      new Promise((r) => setTimeout(() => r("medium"), 25)),
    ]);
    expect(result).toEqual(["slow", "fast", "medium"]);
  });

  test("should reject if any promise rejects", async () => {
    await expect(
      promiseAll([
        Promise.resolve(1),
        Promise.reject(new Error("fail")),
        Promise.resolve(3),
      ]),
    ).rejects.toThrow("fail");
  });

  test("should reject with first rejection", async () => {
    await expect(
      promiseAll([
        new Promise((_, rej) => setTimeout(() => rej(new Error("second")), 50)),
        Promise.reject(new Error("first")),
      ]),
    ).rejects.toThrow("first");
  });

  test("should handle empty array", async () => {
    const result = await promiseAll([]);
    expect(result).toEqual([]);
  });

  test("should handle non-promise values", async () => {
    const result = await promiseAll([1, "two", true, null]);
    expect(result).toEqual([1, "two", true, null]);
  });

  test("should handle mixed promises and values", async () => {
    const result = await promiseAll([
      Promise.resolve(1),
      2,
      Promise.resolve(3),
    ]);
    expect(result).toEqual([1, 2, 3]);
  });

  test("should handle single promise", async () => {
    const result = await promiseAll([Promise.resolve(42)]);
    expect(result).toEqual([42]);
  });
});

describe("promiseRace", () => {
  test("should resolve with first resolved promise", async () => {
    const result = await promiseRace([
      new Promise((r) => setTimeout(() => r("slow"), 100)),
      Promise.resolve("fast"),
    ]);
    expect(result).toBe("fast");
  });

  test("should reject with first rejected promise", async () => {
    await expect(
      promiseRace([
        new Promise((r) => setTimeout(() => r("slow"), 100)),
        Promise.reject(new Error("fast fail")),
      ]),
    ).rejects.toThrow("fast fail");
  });

  test("should resolve if resolve comes before reject", async () => {
    const result = await promiseRace([
      Promise.resolve("success"),
      new Promise((_, rej) =>
        setTimeout(() => rej(new Error("slow fail")), 50),
      ),
    ]);
    expect(result).toBe("success");
  });

  test("should handle non-promise values", async () => {
    const result = await promiseRace([
      42,
      new Promise((r) => setTimeout(() => r("slow"), 100)),
    ]);
    expect(result).toBe(42);
  });

  test("should handle single promise", async () => {
    const result = await promiseRace([Promise.resolve("only")]);
    expect(result).toBe("only");
  });

  test("empty array should return pending promise", async () => {
    let resolved = false;
    const promise = promiseRace([]);
    promise.then(() => {
      resolved = true;
    });

    await new Promise((r) => setTimeout(r, 50));
    expect(resolved).toBe(false);
  });
});

describe("promiseAllSettled", () => {
  test("should resolve with all results", async () => {
    const result = await promiseAllSettled([
      Promise.resolve(1),
      Promise.resolve(2),
    ]);
    expect(result).toEqual([
      { status: "fulfilled", value: 1 },
      { status: "fulfilled", value: 2 },
    ]);
  });

  test("should handle mix of resolved and rejected", async () => {
    const result = await promiseAllSettled([
      Promise.resolve("success"),
      Promise.reject("error"),
      Promise.resolve("another"),
    ]);
    expect(result).toEqual([
      { status: "fulfilled", value: "success" },
      { status: "rejected", reason: "error" },
      { status: "fulfilled", value: "another" },
    ]);
  });

  test("should never reject", async () => {
    const result = await promiseAllSettled([
      Promise.reject("error1"),
      Promise.reject("error2"),
    ]);
    expect(result).toEqual([
      { status: "rejected", reason: "error1" },
      { status: "rejected", reason: "error2" },
    ]);
  });

  test("should handle empty array", async () => {
    const result = await promiseAllSettled([]);
    expect(result).toEqual([]);
  });

  test("should handle non-promise values", async () => {
    const result = await promiseAllSettled([1, "two"]);
    expect(result).toEqual([
      { status: "fulfilled", value: 1 },
      { status: "fulfilled", value: "two" },
    ]);
  });

  test("should maintain order", async () => {
    const result = await promiseAllSettled([
      new Promise((r) => setTimeout(() => r("slow"), 50)),
      Promise.resolve("fast"),
      new Promise((_, rej) => setTimeout(() => rej("error"), 25)),
    ]);
    expect(result).toEqual([
      { status: "fulfilled", value: "slow" },
      { status: "fulfilled", value: "fast" },
      { status: "rejected", reason: "error" },
    ]);
  });
});

describe("promiseAny", () => {
  test("should resolve with first fulfilled promise", async () => {
    const result = await promiseAny([
      Promise.reject("fail1"),
      Promise.resolve("success"),
      Promise.reject("fail2"),
    ]);
    expect(result).toBe("success");
  });

  test("should ignore rejections if one fulfills", async () => {
    const result = await promiseAny([
      Promise.reject("fail"),
      new Promise((r) => setTimeout(() => r("delayed success"), 50)),
    ]);
    expect(result).toBe("delayed success");
  });

  test("should resolve with fastest fulfilled", async () => {
    const result = await promiseAny([
      new Promise((r) => setTimeout(() => r("slow"), 100)),
      new Promise((r) => setTimeout(() => r("fast"), 10)),
      new Promise((r) => setTimeout(() => r("medium"), 50)),
    ]);
    expect(result).toBe("fast");
  });

  test("should reject with AggregateError if all reject", async () => {
    try {
      await promiseAny([
        Promise.reject("error1"),
        Promise.reject("error2"),
        Promise.reject("error3"),
      ]);
      fail("Should have rejected");
    } catch (error) {
      expect(error).toBeInstanceOf(AggregateError);
      expect(error.errors).toEqual(["error1", "error2", "error3"]);
    }
  });

  test("should reject with AggregateError for empty array", async () => {
    try {
      await promiseAny([]);
      fail("Should have rejected");
    } catch (error) {
      expect(error).toBeInstanceOf(AggregateError);
    }
  });

  test("should handle non-promise values", async () => {
    const result = await promiseAny([
      Promise.reject("fail"),
      42,
      Promise.reject("fail2"),
    ]);
    expect(result).toBe(42);
  });

  test("should handle single resolved promise", async () => {
    const result = await promiseAny([Promise.resolve("only")]);
    expect(result).toBe("only");
  });

  test("should handle single rejected promise", async () => {
    try {
      await promiseAny([Promise.reject("only error")]);
      fail("Should have rejected");
    } catch (error) {
      expect(error).toBeInstanceOf(AggregateError);
      expect(error.errors).toEqual(["only error"]);
    }
  });
});
