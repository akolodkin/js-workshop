# Assignment 17: Command Pattern

## Difficulty: Medium

## Learning Objectives

- Understand the Command behavioral pattern
- Implement undo/redo functionality
- Encapsulate operations as objects
- Build command history management

## The Problem

The Command pattern turns requests into standalone objects. This enables:

- Undo/redo operations
- Command queuing
- Logging and auditing
- Macro recording

```javascript
// Without command: direct calls, no undo
editor.insertText("Hello");
// Can't undo!

// With command: operations are reversible
const insertCmd = new InsertCommand(editor, "Hello");
commandManager.execute(insertCmd);
commandManager.undo(); // Reverses the insert
```

## Requirements

### Command Interface

Each command should have:

- `execute()` - Perform the action
- `undo()` - Reverse the action
- `description` (optional) - For logging/display

### CommandManager Class

```javascript
const manager = new CommandManager();

// Execute a command
manager.execute(command);

// Undo last command
manager.undo();

// Redo last undone command
manager.redo();

// Get history
manager.history; // Array of executed commands
manager.undoStack; // Commands that can be undone
manager.redoStack; // Commands that can be redone

// Check availability
manager.canUndo();
manager.canRedo();
```

### Example Commands

Implement for a simple calculator:

- `AddCommand(calculator, value)`
- `SubtractCommand(calculator, value)`
- `MultiplyCommand(calculator, value)`
- `DivideCommand(calculator, value)`

## Examples

```javascript
// Calculator with undo/redo
const calc = { value: 0 };
const manager = new CommandManager();

manager.execute(new AddCommand(calc, 10)); // value: 10
manager.execute(new MultiplyCommand(calc, 2)); // value: 20
manager.execute(new SubtractCommand(calc, 5)); // value: 15

manager.undo(); // value: 20
manager.undo(); // value: 10
manager.redo(); // value: 20

// Text editor commands
const editor = { text: "" };

manager.execute(new InsertCommand(editor, 0, "Hello"));
manager.execute(new InsertCommand(editor, 5, " World"));
// editor.text = 'Hello World'

manager.undo(); // editor.text = 'Hello'
manager.undo(); // editor.text = ''

// Macro (composite command)
const macro = new MacroCommand([
  new AddCommand(calc, 5),
  new MultiplyCommand(calc, 2),
  new AddCommand(calc, 10),
]);

manager.execute(macro); // All three at once
manager.undo(); // Reverses all three
```

## Hints

1. Commands store the receiver and parameters
2. `undo` needs enough info to reverse (save previous state)
3. After new execute, clear redo stack
4. MacroCommand stores array of commands, executes/undoes all

## Resources

- [Refactoring Guru: Command](https://refactoring.guru/design-patterns/command)
- [Game Programming Patterns: Command](https://gameprogrammingpatterns.com/command.html)
