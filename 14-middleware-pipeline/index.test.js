const { Pipeline, compose, when, errorMiddleware } = require("./index");

describe("Pipeline", () => {
  describe("use", () => {
    test("should add middleware", () => {
      const pipeline = new Pipeline();
      const result = pipeline.use((ctx, next) => next());
      expect(result).toBe(pipeline); // Chainable
    });

    test("should be chainable", () => {
      const pipeline = new Pipeline();
      pipeline
        .use((ctx, next) => next())
        .use((ctx, next) => next())
        .use((ctx, next) => next());
      // Should not throw
    });
  });

  describe("run", () => {
    test("should execute middleware in order", async () => {
      const order = [];
      const pipeline = new Pipeline();

      pipeline.use((ctx, next) => {
        order.push(1);
        next();
        order.push(4);
      });

      pipeline.use((ctx, next) => {
        order.push(2);
        next();
        order.push(3);
      });

      await pipeline.run({});
      expect(order).toEqual([1, 2, 3, 4]);
    });

    test("should pass context to all middleware", async () => {
      const pipeline = new Pipeline();

      pipeline.use((ctx, next) => {
        ctx.a = 1;
        next();
      });

      pipeline.use((ctx, next) => {
        ctx.b = ctx.a + 1;
        next();
      });

      const ctx = {};
      await pipeline.run(ctx);
      expect(ctx).toEqual({ a: 1, b: 2 });
    });

    test("should stop chain if next is not called", async () => {
      const pipeline = new Pipeline();
      let reached = false;

      pipeline.use((ctx, next) => {
        ctx.stopped = true;
        // Not calling next()
      });

      pipeline.use((ctx, next) => {
        reached = true;
        next();
      });

      const ctx = {};
      await pipeline.run(ctx);
      expect(ctx.stopped).toBe(true);
      expect(reached).toBe(false);
    });

    test("should handle empty pipeline", async () => {
      const pipeline = new Pipeline();
      await pipeline.run({}); // Should not throw
    });
  });

  describe("async middleware", () => {
    test("should handle async middleware", async () => {
      const pipeline = new Pipeline();

      pipeline.use(async (ctx, next) => {
        ctx.start = Date.now();
        await next();
        ctx.duration = Date.now() - ctx.start;
      });

      pipeline.use(async (ctx, next) => {
        await new Promise((r) => setTimeout(r, 50));
        ctx.value = "async";
        await next();
      });

      const ctx = {};
      await pipeline.run(ctx);
      expect(ctx.value).toBe("async");
      expect(ctx.duration).toBeGreaterThanOrEqual(40);
    });

    test("should await next properly", async () => {
      const order = [];
      const pipeline = new Pipeline();

      pipeline.use(async (ctx, next) => {
        order.push("a-before");
        await next();
        order.push("a-after");
      });

      pipeline.use(async (ctx, next) => {
        order.push("b-before");
        await new Promise((r) => setTimeout(r, 10));
        await next();
        order.push("b-after");
      });

      await pipeline.run({});
      expect(order).toEqual(["a-before", "b-before", "b-after", "a-after"]);
    });
  });

  describe("real-world scenario", () => {
    test("should work like Express/Koa middleware", async () => {
      const pipeline = new Pipeline();
      const logs = [];

      // Logger middleware
      pipeline.use(async (ctx, next) => {
        logs.push(`${ctx.method} ${ctx.path}`);
        await next();
        logs.push(`Response: ${ctx.status}`);
      });

      // Auth middleware
      pipeline.use(async (ctx, next) => {
        if (!ctx.token) {
          ctx.status = 401;
          ctx.body = "Unauthorized";
          return;
        }
        await next();
      });

      // Handler
      pipeline.use((ctx, next) => {
        ctx.status = 200;
        ctx.body = "Success";
      });

      // Test authorized request
      const ctx1 = { method: "GET", path: "/api", token: "valid" };
      await pipeline.run(ctx1);
      expect(ctx1.status).toBe(200);
      expect(ctx1.body).toBe("Success");

      // Test unauthorized request
      logs.length = 0;
      const ctx2 = { method: "GET", path: "/api" };
      await pipeline.run(ctx2);
      expect(ctx2.status).toBe(401);
      expect(ctx2.body).toBe("Unauthorized");
    });
  });
});

describe("compose", () => {
  test("should compose middleware array", async () => {
    const middleware = [
      (ctx, next) => {
        ctx.order = (ctx.order || "") + "a";
        return next();
      },
      (ctx, next) => {
        ctx.order += "b";
        return next();
      },
      (ctx, next) => {
        ctx.order += "c";
      },
    ];

    const composed = compose(middleware);
    const ctx = {};
    await composed(ctx);
    expect(ctx.order).toBe("abc");
  });

  test("should handle empty array", async () => {
    const composed = compose([]);
    await composed({}); // Should not throw
  });
});

describe("when", () => {
  test("should run middleware when condition is true", async () => {
    const middleware = when(
      (ctx) => ctx.shouldRun,
      (ctx, next) => {
        ctx.ran = true;
        return next();
      },
    );

    const ctx = { shouldRun: true };
    await middleware(ctx, () => {});
    expect(ctx.ran).toBe(true);
  });

  test("should skip middleware when condition is false", async () => {
    const middleware = when(
      (ctx) => ctx.shouldRun,
      (ctx, next) => {
        ctx.ran = true;
        return next();
      },
    );

    const ctx = { shouldRun: false };
    await middleware(ctx, () => {});
    expect(ctx.ran).toBeUndefined();
  });
});

describe("errorMiddleware", () => {
  test("should catch errors in downstream middleware", async () => {
    let caughtError = null;
    const errorHandler = errorMiddleware((err, ctx) => {
      caughtError = err;
      ctx.error = true;
    });

    const ctx = {};
    await errorHandler(ctx, async () => {
      throw new Error("Test error");
    });

    expect(caughtError.message).toBe("Test error");
    expect(ctx.error).toBe(true);
  });

  test("should not interfere when no errors", async () => {
    let caughtError = null;
    const errorHandler = errorMiddleware((err) => {
      caughtError = err;
    });

    const ctx = {};
    await errorHandler(ctx, async () => {
      ctx.success = true;
    });

    expect(caughtError).toBeNull();
    expect(ctx.success).toBe(true);
  });
});
