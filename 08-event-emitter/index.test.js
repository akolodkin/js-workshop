const { EventEmitter } = require("./index");

describe("EventEmitter", () => {
  let emitter;

  beforeEach(() => {
    emitter = new EventEmitter();
  });

  describe("on and emit", () => {
    test("should register and trigger listeners", () => {
      const callback = jest.fn();
      emitter.on("event", callback);
      emitter.emit("event");
      expect(callback).toHaveBeenCalledTimes(1);
    });

    test("should pass arguments to listeners", () => {
      const callback = jest.fn();
      emitter.on("event", callback);
      emitter.emit("event", "arg1", "arg2", 123);
      expect(callback).toHaveBeenCalledWith("arg1", "arg2", 123);
    });

    test("should support multiple listeners for same event", () => {
      const callback1 = jest.fn();
      const callback2 = jest.fn();
      emitter.on("event", callback1);
      emitter.on("event", callback2);
      emitter.emit("event");
      expect(callback1).toHaveBeenCalledTimes(1);
      expect(callback2).toHaveBeenCalledTimes(1);
    });

    test("should call listeners in registration order", () => {
      const order = [];
      emitter.on("event", () => order.push(1));
      emitter.on("event", () => order.push(2));
      emitter.on("event", () => order.push(3));
      emitter.emit("event");
      expect(order).toEqual([1, 2, 3]);
    });

    test("should allow same listener multiple times", () => {
      const callback = jest.fn();
      emitter.on("event", callback);
      emitter.on("event", callback);
      emitter.emit("event");
      expect(callback).toHaveBeenCalledTimes(2);
    });

    test("emit should return true if event has listeners", () => {
      emitter.on("event", () => {});
      expect(emitter.emit("event")).toBe(true);
    });

    test("emit should return false if event has no listeners", () => {
      expect(emitter.emit("nonexistent")).toBe(false);
    });

    test("on should return this for chaining", () => {
      const result = emitter.on("event", () => {});
      expect(result).toBe(emitter);
    });
  });

  describe("off", () => {
    test("should remove a specific listener", () => {
      const callback = jest.fn();
      emitter.on("event", callback);
      emitter.off("event", callback);
      emitter.emit("event");
      expect(callback).not.toHaveBeenCalled();
    });

    test("should only remove first instance of listener", () => {
      const callback = jest.fn();
      emitter.on("event", callback);
      emitter.on("event", callback);
      emitter.off("event", callback);
      emitter.emit("event");
      expect(callback).toHaveBeenCalledTimes(1);
    });

    test("should not affect other listeners", () => {
      const callback1 = jest.fn();
      const callback2 = jest.fn();
      emitter.on("event", callback1);
      emitter.on("event", callback2);
      emitter.off("event", callback1);
      emitter.emit("event");
      expect(callback1).not.toHaveBeenCalled();
      expect(callback2).toHaveBeenCalledTimes(1);
    });

    test("should do nothing if listener not found", () => {
      const callback = jest.fn();
      emitter.on("event", callback);
      emitter.off("event", () => {});
      emitter.emit("event");
      expect(callback).toHaveBeenCalledTimes(1);
    });

    test("should return this for chaining", () => {
      const result = emitter.off("event", () => {});
      expect(result).toBe(emitter);
    });
  });

  describe("once", () => {
    test("should only fire once", () => {
      const callback = jest.fn();
      emitter.once("event", callback);
      emitter.emit("event");
      emitter.emit("event");
      emitter.emit("event");
      expect(callback).toHaveBeenCalledTimes(1);
    });

    test("should pass arguments to listener", () => {
      const callback = jest.fn();
      emitter.once("event", callback);
      emitter.emit("event", "arg1", "arg2");
      expect(callback).toHaveBeenCalledWith("arg1", "arg2");
    });

    test("should return this for chaining", () => {
      const result = emitter.once("event", () => {});
      expect(result).toBe(emitter);
    });

    test("should be removable with off before firing", () => {
      const callback = jest.fn();
      emitter.once("event", callback);
      emitter.off("event", callback);
      emitter.emit("event");
      expect(callback).not.toHaveBeenCalled();
    });
  });

  describe("removeAllListeners", () => {
    test("should remove all listeners for specific event", () => {
      const callback1 = jest.fn();
      const callback2 = jest.fn();
      emitter.on("event1", callback1);
      emitter.on("event2", callback2);
      emitter.removeAllListeners("event1");
      emitter.emit("event1");
      emitter.emit("event2");
      expect(callback1).not.toHaveBeenCalled();
      expect(callback2).toHaveBeenCalledTimes(1);
    });

    test("should remove all listeners for all events when no arg", () => {
      const callback1 = jest.fn();
      const callback2 = jest.fn();
      emitter.on("event1", callback1);
      emitter.on("event2", callback2);
      emitter.removeAllListeners();
      emitter.emit("event1");
      emitter.emit("event2");
      expect(callback1).not.toHaveBeenCalled();
      expect(callback2).not.toHaveBeenCalled();
    });

    test("should return this for chaining", () => {
      const result = emitter.removeAllListeners();
      expect(result).toBe(emitter);
    });
  });

  describe("listeners", () => {
    test("should return array of listeners", () => {
      const fn1 = () => {};
      const fn2 = () => {};
      emitter.on("event", fn1);
      emitter.on("event", fn2);
      const listeners = emitter.listeners("event");
      expect(listeners).toContain(fn1);
      expect(listeners).toContain(fn2);
      expect(listeners.length).toBe(2);
    });

    test("should return empty array for non-existent event", () => {
      expect(emitter.listeners("nonexistent")).toEqual([]);
    });

    test("should return a copy, not the internal array", () => {
      emitter.on("event", () => {});
      const listeners = emitter.listeners("event");
      listeners.push(() => {});
      expect(emitter.listeners("event").length).toBe(1);
    });
  });

  describe("listenerCount", () => {
    test("should return number of listeners", () => {
      emitter.on("event", () => {});
      emitter.on("event", () => {});
      expect(emitter.listenerCount("event")).toBe(2);
    });

    test("should return 0 for non-existent event", () => {
      expect(emitter.listenerCount("nonexistent")).toBe(0);
    });
  });

  describe("edge cases", () => {
    test("should handle listener removing itself during emit", () => {
      const callback1 = jest.fn(() => {
        emitter.off("event", callback1);
      });
      const callback2 = jest.fn();

      emitter.on("event", callback1);
      emitter.on("event", callback2);
      emitter.emit("event");

      expect(callback1).toHaveBeenCalledTimes(1);
      expect(callback2).toHaveBeenCalledTimes(1);
    });

    test("should handle multiple events independently", () => {
      const callback1 = jest.fn();
      const callback2 = jest.fn();
      emitter.on("event1", callback1);
      emitter.on("event2", callback2);

      emitter.emit("event1");
      expect(callback1).toHaveBeenCalledTimes(1);
      expect(callback2).toHaveBeenCalledTimes(0);
    });
  });
});
