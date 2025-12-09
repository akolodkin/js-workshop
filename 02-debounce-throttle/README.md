# Assignment 02: Debounce & Throttle

## Difficulty: Medium

## Learning Objectives

- Understand closure-based function utilities
- Learn timing and execution control patterns
- Handle `this` context and arguments correctly
- Work with `setTimeout` and `clearTimeout`

## The Problem

When handling frequent events (scroll, resize, input), calling the handler on every event can cause performance issues. Two patterns help control execution frequency:

- **Debounce**: Delays execution until after a pause in events
- **Throttle**: Ensures execution happens at most once per time period

## Requirements

### Part 1: `debounce(fn, delay)`

Create a function that delays invoking `fn` until after `delay` milliseconds have elapsed since the last call.

```javascript
const debouncedSearch = debounce(search, 300);
// User types: "h" "e" "l" "l" "o" quickly
// search() is only called once, 300ms after "o"
```

Requirements:

- Returns a new function that wraps `fn`
- Calling the wrapper resets the delay timer
- Preserves `this` context and all arguments
- Returns a cancel method: `debouncedSearch.cancel()`

### Part 2: `throttle(fn, limit)`

Create a function that ensures `fn` is called at most once per `limit` milliseconds.

```javascript
const throttledScroll = throttle(onScroll, 100);
// User scrolls continuously for 500ms
// onScroll() is called at 0ms, 100ms, 200ms, 300ms, 400ms
```

Requirements:

- Returns a new function that wraps `fn`
- First call executes immediately
- Subsequent calls within `limit` are ignored
- Preserves `this` context and all arguments
- Returns a cancel method: `throttledScroll.cancel()`

## Examples

```javascript
// Debounce - search after user stops typing
const searchInput = document.getElementById("search");
const debouncedSearch = debounce((query) => {
  console.log("Searching for:", query);
}, 300);
searchInput.addEventListener("input", (e) => debouncedSearch(e.target.value));

// Throttle - update position at most every 100ms
const throttledUpdate = throttle((x, y) => {
  console.log("Position:", x, y);
}, 100);
document.addEventListener("mousemove", (e) =>
  throttledUpdate(e.clientX, e.clientY),
);

// Cancel pending execution
debouncedSearch.cancel();
throttledUpdate.cancel();
```

## Hints

1. Use closures to store the timer ID
2. Use `clearTimeout()` to cancel pending timeouts
3. Use `Function.prototype.apply()` to preserve context and arguments
4. Store the last call time for throttle

## Resources

- [MDN: setTimeout](https://developer.mozilla.org/en-US/docs/Web/API/setTimeout)
- [MDN: Closures](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures)
- [CSS-Tricks: Debouncing and Throttling](https://css-tricks.com/debouncing-throttling-explained-examples/)
