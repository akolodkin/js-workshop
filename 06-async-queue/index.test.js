const { AsyncQueue } = require("./index");

// Helper function
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

describe("AsyncQueue", () => {
  describe("basic functionality", () => {
    test("should process tasks", async () => {
      const queue = new AsyncQueue();
      const result = await queue.add(async () => "done");
      expect(result).toBe("done");
    });

    test("should process multiple tasks", async () => {
      const queue = new AsyncQueue();
      const results = await Promise.all([
        queue.add(async () => 1),
        queue.add(async () => 2),
        queue.add(async () => 3),
      ]);
      expect(results).toEqual([1, 2, 3]);
    });

    test("should handle task errors", async () => {
      const queue = new AsyncQueue();
      await expect(
        queue.add(async () => {
          throw new Error("Task failed");
        }),
      ).rejects.toThrow("Task failed");
    });

    test("should continue after error", async () => {
      const queue = new AsyncQueue();

      const p1 = queue
        .add(async () => {
          throw new Error("fail");
        })
        .catch(() => "caught");

      const p2 = queue.add(async () => "success");

      const results = await Promise.all([p1, p2]);
      expect(results).toEqual(["caught", "success"]);
    });
  });

  describe("concurrency", () => {
    test("should default to concurrency of 1", async () => {
      const queue = new AsyncQueue();
      let concurrent = 0;
      let maxConcurrent = 0;

      const task = async () => {
        concurrent++;
        maxConcurrent = Math.max(maxConcurrent, concurrent);
        await delay(10);
        concurrent--;
      };

      await Promise.all([queue.add(task), queue.add(task), queue.add(task)]);

      expect(maxConcurrent).toBe(1);
    });

    test("should respect concurrency limit", async () => {
      const queue = new AsyncQueue({ concurrency: 2 });
      let concurrent = 0;
      let maxConcurrent = 0;

      const task = async () => {
        concurrent++;
        maxConcurrent = Math.max(maxConcurrent, concurrent);
        await delay(20);
        concurrent--;
      };

      await Promise.all([
        queue.add(task),
        queue.add(task),
        queue.add(task),
        queue.add(task),
      ]);

      expect(maxConcurrent).toBe(2);
    });

    test("should handle high concurrency", async () => {
      const queue = new AsyncQueue({ concurrency: 10 });
      let concurrent = 0;
      let maxConcurrent = 0;

      const task = async () => {
        concurrent++;
        maxConcurrent = Math.max(maxConcurrent, concurrent);
        await delay(10);
        concurrent--;
      };

      await Promise.all(
        Array(20)
          .fill(null)
          .map(() => queue.add(task)),
      );

      expect(maxConcurrent).toBe(10);
    });
  });

  describe("priority", () => {
    test("should process higher priority first", async () => {
      const queue = new AsyncQueue({ concurrency: 1 });
      const order = [];

      // Pause to queue up tasks
      queue.pause();

      queue.add(
        async () => {
          order.push("low");
        },
        { priority: 1 },
      );
      queue.add(
        async () => {
          order.push("high");
        },
        { priority: 10 },
      );
      queue.add(
        async () => {
          order.push("medium");
        },
        { priority: 5 },
      );

      queue.start();
      await delay(50);

      expect(order).toEqual(["high", "medium", "low"]);
    });
  });

  describe("pause and start", () => {
    test("should pause processing", async () => {
      const queue = new AsyncQueue({ concurrency: 1 });
      const order = [];

      await queue.add(async () => order.push("first"));

      queue.pause();
      queue.add(async () => order.push("paused"));

      await delay(50);
      expect(order).toEqual(["first"]);

      queue.start();
      await delay(50);
      expect(order).toEqual(["first", "paused"]);
    });

    test("should report paused state", () => {
      const queue = new AsyncQueue();
      expect(queue.isPaused).toBe(false);

      queue.pause();
      expect(queue.isPaused).toBe(true);

      queue.start();
      expect(queue.isPaused).toBe(false);
    });

    test("autoStart false should not start automatically", async () => {
      const queue = new AsyncQueue({ autoStart: false });
      const executed = [];

      queue.add(async () => executed.push("task"));

      await delay(50);
      expect(executed).toEqual([]);

      queue.start();
      await delay(50);
      expect(executed).toEqual(["task"]);
    });
  });

  describe("clear", () => {
    test("should clear pending tasks", async () => {
      const queue = new AsyncQueue({ concurrency: 1 });
      const executed = [];

      queue.pause();
      queue.add(async () => executed.push("1"));
      queue.add(async () => executed.push("2"));
      queue.add(async () => executed.push("3"));

      expect(queue.size).toBe(3);
      queue.clear();
      expect(queue.size).toBe(0);

      queue.start();
      await delay(50);
      expect(executed).toEqual([]);
    });
  });

  describe("size and pending", () => {
    test("should track queue size", () => {
      const queue = new AsyncQueue({ autoStart: false });

      expect(queue.size).toBe(0);

      queue.add(async () => {});
      expect(queue.size).toBe(1);

      queue.add(async () => {});
      expect(queue.size).toBe(2);
    });

    test("should track pending (running) tasks", async () => {
      const queue = new AsyncQueue({ concurrency: 2 });
      let pendingDuringTask = 0;

      queue.add(async () => {
        pendingDuringTask = queue.pending;
        await delay(50);
      });

      queue.add(async () => {
        await delay(50);
      });

      await delay(10);
      expect(queue.pending).toBe(2);

      await delay(100);
      expect(queue.pending).toBe(0);
    });
  });

  describe("onEmpty", () => {
    test("should call callback when queue becomes empty", async () => {
      const queue = new AsyncQueue({ concurrency: 1 });
      let emptyCalled = false;

      queue.onEmpty(() => {
        emptyCalled = true;
      });

      await queue.add(async () => "task");

      expect(emptyCalled).toBe(true);
    });

    test("should support multiple onEmpty callbacks", async () => {
      const queue = new AsyncQueue();
      const calls = [];

      queue.onEmpty(() => calls.push("callback1"));
      queue.onEmpty(() => calls.push("callback2"));

      await queue.add(async () => {});

      expect(calls).toEqual(["callback1", "callback2"]);
    });

    test("should call onEmpty after all tasks complete", async () => {
      const queue = new AsyncQueue({ concurrency: 2 });
      const events = [];

      queue.onEmpty(() => events.push("empty"));

      queue.add(async () => {
        await delay(20);
        events.push("task1");
      });

      queue.add(async () => {
        await delay(10);
        events.push("task2");
      });

      await delay(50);

      expect(events).toEqual(["task2", "task1", "empty"]);
    });
  });
});
