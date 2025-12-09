# Assignment 06: Async Queue

## Difficulty: Hard

## Learning Objectives

- Manage concurrent async operations
- Implement queue data structures
- Handle task scheduling and concurrency limits
- Work with Promises and async control flow

## The Problem

When making many async requests (API calls, file operations), you often need to limit how many run concurrently to avoid overwhelming resources. An async queue lets you control this.

```javascript
// Without queue: 1000 requests at once!
urls.forEach((url) => fetch(url));

// With queue: only 5 at a time
const queue = new AsyncQueue({ concurrency: 5 });
urls.forEach((url) => queue.add(() => fetch(url)));
```

## Requirements

Create an `AsyncQueue` class with:

### Constructor Options

```javascript
const queue = new AsyncQueue({
  concurrency: 3, // Max concurrent tasks (default: 1)
  autoStart: true, // Start processing immediately (default: true)
});
```

### Methods

1. **`add(task, options)`** - Add a task to the queue
   - `task`: Function that returns a Promise
   - `options.priority`: Higher priority runs first (default: 0)
   - Returns: Promise that resolves when task completes

2. **`start()`** - Start processing the queue

3. **`pause()`** - Pause processing (current tasks continue)

4. **`clear()`** - Remove all pending tasks

5. **`onEmpty(callback)`** - Called when queue becomes empty

### Properties

- `size` - Number of pending tasks
- `pending` - Number of currently running tasks
- `isPaused` - Whether queue is paused

## Examples

```javascript
const queue = new AsyncQueue({ concurrency: 2 });

// Add tasks
const result1 = queue.add(async () => {
  await delay(100);
  return "task1";
});

const result2 = queue.add(async () => {
  await delay(50);
  return "task2";
});

// Priority: higher number = higher priority
queue.add(() => fetch("/low"), { priority: 1 });
queue.add(() => fetch("/high"), { priority: 10 }); // Runs first

// Wait for results
console.log(await result1); // 'task1'
console.log(await result2); // 'task2'

// Events
queue.onEmpty(() => console.log("All done!"));

// Control
queue.pause();
queue.add(() => fetch("/paused")); // Won't start yet
queue.start(); // Resumes processing

// Stats
console.log(queue.size); // Pending tasks
console.log(queue.pending); // Running tasks
```

## Hints

1. Use an array to store pending tasks
2. Track running count to enforce concurrency
3. When a task finishes, start the next one from the queue
4. For priority, sort the queue or use a priority queue structure
5. Each `add()` should return a new Promise with its own resolve/reject

## Resources

- [MDN: Async function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function)
- [JavaScript.info: Async iterators](https://javascript.info/async-iterators-generators)
