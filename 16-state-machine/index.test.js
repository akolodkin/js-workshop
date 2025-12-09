const { StateMachine, createMachine } = require("./index");

describe("StateMachine", () => {
  describe("basic functionality", () => {
    test("should start in initial state", () => {
      const machine = new StateMachine({
        initial: "idle",
        states: {
          idle: { on: { START: "running" } },
          running: {},
        },
      });

      expect(machine.state).toBe("idle");
    });

    test("should transition to new state", () => {
      const machine = new StateMachine({
        initial: "idle",
        states: {
          idle: { on: { START: "running" } },
          running: { on: { STOP: "idle" } },
        },
      });

      const result = machine.transition("START");
      expect(result).toBe(true);
      expect(machine.state).toBe("running");
    });

    test("should not transition on invalid event", () => {
      const machine = new StateMachine({
        initial: "idle",
        states: {
          idle: { on: { START: "running" } },
          running: {},
        },
      });

      const result = machine.transition("INVALID");
      expect(result).toBe(false);
      expect(machine.state).toBe("idle");
    });

    test("should handle multiple transitions", () => {
      const machine = new StateMachine({
        initial: "red",
        states: {
          red: { on: { NEXT: "green" } },
          green: { on: { NEXT: "yellow" } },
          yellow: { on: { NEXT: "red" } },
        },
      });

      machine.transition("NEXT");
      expect(machine.state).toBe("green");

      machine.transition("NEXT");
      expect(machine.state).toBe("yellow");

      machine.transition("NEXT");
      expect(machine.state).toBe("red");
    });
  });

  describe("can method", () => {
    test("should return true for valid transitions", () => {
      const machine = new StateMachine({
        initial: "idle",
        states: {
          idle: { on: { START: "running" } },
          running: {},
        },
      });

      expect(machine.can("START")).toBe(true);
    });

    test("should return false for invalid transitions", () => {
      const machine = new StateMachine({
        initial: "idle",
        states: {
          idle: { on: { START: "running" } },
          running: {},
        },
      });

      expect(machine.can("STOP")).toBe(false);
    });
  });

  describe("getAvailableTransitions", () => {
    test("should return available events", () => {
      const machine = new StateMachine({
        initial: "idle",
        states: {
          idle: { on: { START: "running", RESET: "idle" } },
          running: {},
        },
      });

      const transitions = machine.getAvailableTransitions();
      expect(transitions).toContain("START");
      expect(transitions).toContain("RESET");
    });

    test("should return empty array for final state", () => {
      const machine = new StateMachine({
        initial: "done",
        states: {
          done: {},
        },
      });

      expect(machine.getAvailableTransitions()).toEqual([]);
    });
  });

  describe("guards", () => {
    test("should block transition when guard returns false", () => {
      const machine = new StateMachine({
        initial: "cart",
        context: { items: [] },
        states: {
          cart: {
            on: {
              CHECKOUT: {
                target: "payment",
                guard: (ctx) => ctx.items.length > 0,
              },
            },
          },
          payment: {},
        },
      });

      const result = machine.transition("CHECKOUT");
      expect(result).toBe(false);
      expect(machine.state).toBe("cart");
    });

    test("should allow transition when guard returns true", () => {
      const machine = new StateMachine({
        initial: "cart",
        context: { items: ["item1"] },
        states: {
          cart: {
            on: {
              CHECKOUT: {
                target: "payment",
                guard: (ctx) => ctx.items.length > 0,
              },
            },
          },
          payment: {},
        },
      });

      const result = machine.transition("CHECKOUT");
      expect(result).toBe(true);
      expect(machine.state).toBe("payment");
    });
  });

  describe("actions", () => {
    test("should call action on transition", () => {
      const actionFn = jest.fn();
      const machine = new StateMachine({
        initial: "idle",
        context: { count: 0 },
        states: {
          idle: {
            on: {
              INCREMENT: {
                target: "idle",
                action: actionFn,
              },
            },
          },
        },
      });

      machine.transition("INCREMENT");
      expect(actionFn).toHaveBeenCalled();
    });

    test("should pass context to action", () => {
      const machine = new StateMachine({
        initial: "idle",
        context: { count: 0 },
        states: {
          idle: {
            on: {
              INCREMENT: {
                target: "idle",
                action: (ctx) => {
                  ctx.count++;
                },
              },
            },
          },
        },
      });

      machine.transition("INCREMENT");
      machine.transition("INCREMENT");
      expect(machine.getContext().count).toBe(2);
    });
  });

  describe("context", () => {
    test("should initialize with context", () => {
      const machine = new StateMachine({
        initial: "idle",
        context: { value: 42 },
        states: { idle: {} },
      });

      expect(machine.getContext().value).toBe(42);
    });

    test("should update context with object", () => {
      const machine = new StateMachine({
        initial: "idle",
        context: { a: 1, b: 2 },
        states: { idle: {} },
      });

      machine.updateContext({ b: 3, c: 4 });
      const ctx = machine.getContext();
      expect(ctx.a).toBe(1);
      expect(ctx.b).toBe(3);
      expect(ctx.c).toBe(4);
    });

    test("should update context with function", () => {
      const machine = new StateMachine({
        initial: "idle",
        context: { count: 5 },
        states: { idle: {} },
      });

      machine.updateContext((ctx) => ({ ...ctx, count: ctx.count * 2 }));
      expect(machine.getContext().count).toBe(10);
    });
  });

  describe("isFinal", () => {
    test("should return true for final state", () => {
      const machine = new StateMachine({
        initial: "complete",
        states: {
          active: { on: { FINISH: "complete" } },
          complete: {},
        },
      });

      expect(machine.isFinal()).toBe(true);
    });

    test("should return false for non-final state", () => {
      const machine = new StateMachine({
        initial: "active",
        states: {
          active: { on: { FINISH: "complete" } },
          complete: {},
        },
      });

      expect(machine.isFinal()).toBe(false);
    });
  });

  describe("reset", () => {
    test("should reset to initial state", () => {
      const machine = new StateMachine({
        initial: "idle",
        states: {
          idle: { on: { START: "running" } },
          running: {},
        },
      });

      machine.transition("START");
      expect(machine.state).toBe("running");

      machine.reset();
      expect(machine.state).toBe("idle");
    });

    test("should reset context if provided", () => {
      const machine = new StateMachine({
        initial: "idle",
        context: { count: 0 },
        states: { idle: {} },
      });

      machine.updateContext({ count: 10 });
      machine.reset({ count: 0 });
      expect(machine.getContext().count).toBe(0);
    });
  });

  describe("createMachine factory", () => {
    test("should create independent instances", () => {
      const factory = createMachine({
        initial: "idle",
        states: {
          idle: { on: { START: "running" } },
          running: {},
        },
      });

      const machine1 = factory();
      const machine2 = factory();

      machine1.transition("START");

      expect(machine1.state).toBe("running");
      expect(machine2.state).toBe("idle");
    });
  });
});

describe("Real-world: Order workflow", () => {
  test("should handle order lifecycle", () => {
    const orderMachine = new StateMachine({
      initial: "pending",
      context: { orderId: "123", items: ["item1"], paid: false },
      states: {
        pending: {
          on: {
            PAY: {
              target: "paid",
              action: (ctx) => {
                ctx.paid = true;
              },
            },
            CANCEL: "cancelled",
          },
        },
        paid: {
          on: {
            SHIP: "shipped",
          },
        },
        shipped: {
          on: {
            DELIVER: "delivered",
          },
        },
        delivered: {},
        cancelled: {},
      },
    });

    expect(orderMachine.state).toBe("pending");
    expect(orderMachine.can("SHIP")).toBe(false);

    orderMachine.transition("PAY");
    expect(orderMachine.state).toBe("paid");
    expect(orderMachine.getContext().paid).toBe(true);

    orderMachine.transition("SHIP");
    expect(orderMachine.state).toBe("shipped");

    orderMachine.transition("DELIVER");
    expect(orderMachine.state).toBe("delivered");
    expect(orderMachine.isFinal()).toBe(true);
  });
});
