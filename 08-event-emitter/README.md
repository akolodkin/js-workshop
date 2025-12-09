# Assignment 08: Event Emitter

## Difficulty: Medium

## Learning Objectives

- Implement the publish/subscribe (pub/sub) pattern
- Work with callbacks and event-driven programming
- Manage event listeners and memory
- Understand Node.js EventEmitter API

## The Problem

Event emitters allow decoupled communication between components. One part of code can emit events, and other parts can listen without direct coupling.

```javascript
const emitter = new EventEmitter();

// Subscribe
emitter.on("message", (data) => console.log(data));

// Publish
emitter.emit("message", "Hello!"); // Logs: Hello!
```

## Requirements

Create an `EventEmitter` class with these methods:

### `on(event, listener)`

Register a listener for an event.

- Returns `this` for chaining
- Multiple listeners per event allowed
- Same listener can be added multiple times

### `off(event, listener)`

Remove a specific listener.

- Returns `this` for chaining
- If listener not found, do nothing

### `emit(event, ...args)`

Trigger all listeners for an event.

- Pass all extra arguments to listeners
- Returns `true` if event had listeners, `false` otherwise
- Listeners called in order they were added

### `once(event, listener)`

Register a listener that fires only once.

- Automatically removed after first call
- Returns `this` for chaining

### `removeAllListeners(event?)`

Remove all listeners.

- If event provided, remove only that event's listeners
- If no event, remove all listeners for all events
- Returns `this`

### `listeners(event)`

Get array of listeners for an event.

- Returns empty array if no listeners

### `listenerCount(event)`

Get number of listeners for an event.

## Examples

```javascript
const emitter = new EventEmitter();

// Basic usage
emitter.on("data", (x) => console.log("Got:", x));
emitter.emit("data", 42); // Got: 42

// Multiple listeners
emitter.on("log", (msg) => console.log("Logger 1:", msg));
emitter.on("log", (msg) => console.log("Logger 2:", msg));
emitter.emit("log", "Hello");
// Logger 1: Hello
// Logger 2: Hello

// Once
emitter.once("init", () => console.log("Initialized"));
emitter.emit("init"); // Initialized
emitter.emit("init"); // (nothing)

// Chaining
emitter
  .on("a", () => {})
  .on("b", () => {})
  .emit("a");

// Remove listener
const handler = (x) => console.log(x);
emitter.on("event", handler);
emitter.off("event", handler);

// Multiple arguments
emitter.on("coords", (x, y, z) => console.log(x, y, z));
emitter.emit("coords", 1, 2, 3); // 1 2 3
```

## Hints

1. Use a `Map` or object to store events and their listeners
2. Each event maps to an array of listener functions
3. For `once`, wrap the listener to remove itself after execution
4. Be careful with `off` when removing wrapped `once` listeners

## Resources

- [Node.js EventEmitter](https://nodejs.org/api/events.html)
- [MDN: EventTarget](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget)
