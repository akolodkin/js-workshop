const {
  CommandManager,
  AddCommand,
  SubtractCommand,
  MultiplyCommand,
  DivideCommand,
  MacroCommand,
  SetValueCommand,
} = require("./index");

describe("CommandManager", () => {
  let manager;

  beforeEach(() => {
    manager = new CommandManager();
  });

  describe("execute", () => {
    test("should execute command", () => {
      const calc = { value: 0 };
      manager.execute(new AddCommand(calc, 5));
      expect(calc.value).toBe(5);
    });

    test("should add to history", () => {
      const calc = { value: 0 };
      manager.execute(new AddCommand(calc, 5));
      expect(manager.history.length).toBe(1);
    });

    test("should clear redo stack on new execute", () => {
      const calc = { value: 0 };
      manager.execute(new AddCommand(calc, 5));
      manager.undo();
      expect(manager.canRedo()).toBe(true);

      manager.execute(new AddCommand(calc, 10));
      expect(manager.canRedo()).toBe(false);
    });
  });

  describe("undo", () => {
    test("should undo last command", () => {
      const calc = { value: 0 };
      manager.execute(new AddCommand(calc, 5));
      manager.undo();
      expect(calc.value).toBe(0);
    });

    test("should return true when undo performed", () => {
      const calc = { value: 0 };
      manager.execute(new AddCommand(calc, 5));
      expect(manager.undo()).toBe(true);
    });

    test("should return false when nothing to undo", () => {
      expect(manager.undo()).toBe(false);
    });

    test("should undo multiple commands in order", () => {
      const calc = { value: 0 };
      manager.execute(new AddCommand(calc, 5));
      manager.execute(new AddCommand(calc, 10));
      manager.execute(new AddCommand(calc, 3));

      expect(calc.value).toBe(18);
      manager.undo(); // -3
      expect(calc.value).toBe(15);
      manager.undo(); // -10
      expect(calc.value).toBe(5);
      manager.undo(); // -5
      expect(calc.value).toBe(0);
    });
  });

  describe("redo", () => {
    test("should redo undone command", () => {
      const calc = { value: 0 };
      manager.execute(new AddCommand(calc, 5));
      manager.undo();
      manager.redo();
      expect(calc.value).toBe(5);
    });

    test("should return true when redo performed", () => {
      const calc = { value: 0 };
      manager.execute(new AddCommand(calc, 5));
      manager.undo();
      expect(manager.redo()).toBe(true);
    });

    test("should return false when nothing to redo", () => {
      expect(manager.redo()).toBe(false);
    });

    test("should redo multiple commands", () => {
      const calc = { value: 0 };
      manager.execute(new AddCommand(calc, 5));
      manager.execute(new AddCommand(calc, 10));
      manager.undo();
      manager.undo();

      expect(calc.value).toBe(0);
      manager.redo();
      expect(calc.value).toBe(5);
      manager.redo();
      expect(calc.value).toBe(15);
    });
  });

  describe("canUndo and canRedo", () => {
    test("canUndo should return false initially", () => {
      expect(manager.canUndo()).toBe(false);
    });

    test("canUndo should return true after execute", () => {
      const calc = { value: 0 };
      manager.execute(new AddCommand(calc, 5));
      expect(manager.canUndo()).toBe(true);
    });

    test("canRedo should return false initially", () => {
      expect(manager.canRedo()).toBe(false);
    });

    test("canRedo should return true after undo", () => {
      const calc = { value: 0 };
      manager.execute(new AddCommand(calc, 5));
      manager.undo();
      expect(manager.canRedo()).toBe(true);
    });
  });

  describe("clear", () => {
    test("should clear all history", () => {
      const calc = { value: 0 };
      manager.execute(new AddCommand(calc, 5));
      manager.undo();
      manager.clear();

      expect(manager.canUndo()).toBe(false);
      expect(manager.canRedo()).toBe(false);
      expect(manager.history.length).toBe(0);
    });
  });
});

describe("Calculator Commands", () => {
  let calc;
  let manager;

  beforeEach(() => {
    calc = { value: 10 };
    manager = new CommandManager();
  });

  test("AddCommand should add value", () => {
    manager.execute(new AddCommand(calc, 5));
    expect(calc.value).toBe(15);

    manager.undo();
    expect(calc.value).toBe(10);
  });

  test("SubtractCommand should subtract value", () => {
    manager.execute(new SubtractCommand(calc, 3));
    expect(calc.value).toBe(7);

    manager.undo();
    expect(calc.value).toBe(10);
  });

  test("MultiplyCommand should multiply value", () => {
    manager.execute(new MultiplyCommand(calc, 2));
    expect(calc.value).toBe(20);

    manager.undo();
    expect(calc.value).toBe(10);
  });

  test("DivideCommand should divide value", () => {
    manager.execute(new DivideCommand(calc, 2));
    expect(calc.value).toBe(5);

    manager.undo();
    expect(calc.value).toBe(10);
  });

  test("SetValueCommand should set value", () => {
    manager.execute(new SetValueCommand(calc, 100));
    expect(calc.value).toBe(100);

    manager.undo();
    expect(calc.value).toBe(10);
  });
});

describe("MacroCommand", () => {
  test("should execute all commands", () => {
    const calc = { value: 0 };
    const macro = new MacroCommand([
      new AddCommand(calc, 10),
      new MultiplyCommand(calc, 2),
      new SubtractCommand(calc, 5),
    ]);

    macro.execute();
    expect(calc.value).toBe(15); // (0 + 10) * 2 - 5
  });

  test("should undo all commands in reverse", () => {
    const calc = { value: 0 };
    const manager = new CommandManager();
    const macro = new MacroCommand([
      new AddCommand(calc, 10),
      new MultiplyCommand(calc, 2),
      new SubtractCommand(calc, 5),
    ]);

    manager.execute(macro);
    expect(calc.value).toBe(15);

    manager.undo();
    expect(calc.value).toBe(0);
  });

  test("should support adding commands", () => {
    const calc = { value: 10 };
    const macro = new MacroCommand();
    macro.add(new AddCommand(calc, 5));
    macro.add(new MultiplyCommand(calc, 2));

    macro.execute();
    expect(calc.value).toBe(30); // (10 + 5) * 2
  });
});

describe("Complex scenarios", () => {
  test("should handle interleaved undo/redo", () => {
    const calc = { value: 0 };
    const manager = new CommandManager();

    manager.execute(new AddCommand(calc, 5));
    manager.execute(new MultiplyCommand(calc, 2));
    expect(calc.value).toBe(10);

    manager.undo();
    expect(calc.value).toBe(5);

    manager.execute(new AddCommand(calc, 3));
    expect(calc.value).toBe(8);

    expect(manager.canRedo()).toBe(false);
  });

  test("should maintain correct state through many operations", () => {
    const calc = { value: 100 };
    const manager = new CommandManager();

    // Series of operations
    manager.execute(new AddCommand(calc, 50)); // 150
    manager.execute(new MultiplyCommand(calc, 2)); // 300
    manager.execute(new SubtractCommand(calc, 100)); // 200
    manager.execute(new DivideCommand(calc, 4)); // 50

    expect(calc.value).toBe(50);

    // Undo all
    manager.undo(); // 200
    manager.undo(); // 300
    manager.undo(); // 150
    manager.undo(); // 100

    expect(calc.value).toBe(100);

    // Redo all
    manager.redo(); // 150
    manager.redo(); // 300
    manager.redo(); // 200
    manager.redo(); // 50

    expect(calc.value).toBe(50);
  });
});
