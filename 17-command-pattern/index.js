/**
 * Command Pattern Implementation
 */

/**
 * Command Manager
 *
 * Manages command execution with undo/redo support.
 */
class CommandManager {
  constructor() {
    // TODO: Initialize stacks
    // this.undoStack = [];
    // this.redoStack = [];
  }

  /**
   * Execute a command
   * @param {Object} command - Command with execute() method
   */
  execute(command) {
    // TODO: Implement execute
    // Step 1: Call command.execute()
    // Step 2: Push to undo stack
    // Step 3: Clear redo stack (new action invalidates redo history)
  }

  /**
   * Undo the last command
   * @returns {boolean} Whether undo was performed
   */
  undo() {
    // TODO: Implement undo

    // Step 1: Check if undo stack is empty

    // Step 2: Pop command from undo stack

    // Step 3: Call command.undo()

    // Step 4: Push to redo stack

    // Step 5: Return true

    throw new Error("Not implemented");
  }

  /**
   * Redo the last undone command
   * @returns {boolean} Whether redo was performed
   */
  redo() {
    // TODO: Implement redo

    // Step 1: Check if redo stack is empty

    // Step 2: Pop command from redo stack

    // Step 3: Call command.execute()

    // Step 4: Push to undo stack

    // Step 5: Return true

    throw new Error("Not implemented");
  }

  /**
   * Check if undo is available
   * @returns {boolean}
   */
  canUndo() {
    // TODO: Return whether undo stack has items
    throw new Error("Not implemented");
  }

  /**
   * Check if redo is available
   * @returns {boolean}
   */
  canRedo() {
    // TODO: Return whether redo stack has items
    throw new Error("Not implemented");
  }

  /**
   * Get command history (executed commands)
   * @returns {Object[]}
   */
  get history() {
    // TODO: Return copy of undo stack
    throw new Error("Not implemented");
  }

  /**
   * Clear all history
   */
  clear() {
    // TODO: Clear both stacks
  }
}

/**
 * Add Command
 */
class AddCommand {
  constructor(calculator, value) {
    // TODO: Store calculator and value
    // this.calculator = calculator;
    // this.value = value;
    this.description = `Add ${value}`;
  }

  execute() {
    // TODO: Add value to calculator.value
  }

  undo() {
    // TODO: Subtract value from calculator.value
  }
}

/**
 * Subtract Command
 */
class SubtractCommand {
  constructor(calculator, value) {
    // TODO: Store calculator and value
    this.description = `Subtract ${value}`;
  }

  execute() {
    // TODO: Subtract value from calculator.value
  }

  undo() {
    // TODO: Add value to calculator.value
  }
}

/**
 * Multiply Command
 */
class MultiplyCommand {
  constructor(calculator, value) {
    // TODO: Store calculator, value, and previous value for undo
    this.description = `Multiply by ${value}`;
  }

  execute() {
    // TODO: Multiply calculator.value by value
    // Save previous value for undo
  }

  undo() {
    // TODO: Restore previous value
  }
}

/**
 * Divide Command
 */
class DivideCommand {
  constructor(calculator, value) {
    // TODO: Store calculator, value, and previous value for undo
    this.description = `Divide by ${value}`;
  }

  execute() {
    // TODO: Divide calculator.value by value
    // Save previous value for undo
  }

  undo() {
    // TODO: Restore previous value
  }
}

/**
 * Macro Command (Composite)
 *
 * Groups multiple commands into one.
 */
class MacroCommand {
  constructor(commands = []) {
    // TODO: Store commands array
    // this.commands = commands;
    this.description = "Macro";
  }

  /**
   * Add a command to the macro
   * @param {Object} command
   */
  add(command) {
    // TODO: Add command to array
  }

  execute() {
    // TODO: Execute all commands in order
  }

  undo() {
    // TODO: Undo all commands in reverse order
  }
}

/**
 * Set Value Command
 *
 * Sets calculator to specific value (useful for testing).
 */
class SetValueCommand {
  constructor(calculator, value) {
    // TODO: Store calculator, new value, and previous value
    this.description = `Set to ${value}`;
  }

  execute() {
    // TODO: Save previous, set new value
  }

  undo() {
    // TODO: Restore previous value
  }
}

module.exports = {
  CommandManager,
  AddCommand,
  SubtractCommand,
  MultiplyCommand,
  DivideCommand,
  MacroCommand,
  SetValueCommand,
};
