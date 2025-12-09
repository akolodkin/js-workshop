# Assignment 09: Observable

## Difficulty: Hard

## Learning Objectives

- Understand reactive programming concepts
- Implement the Observer pattern
- Work with data streams and subscriptions
- Handle async data sequences

## The Problem

Observables represent data streams over time. Unlike Promises (single value), Observables can emit multiple values. This is the foundation of libraries like RxJS.

```javascript
// Promise: one value
const promise = fetch("/api/data");

// Observable: multiple values over time
const clicks = new Observable((observer) => {
  document.addEventListener("click", (e) => observer.next(e));
});
```

## Requirements

### Observable Class

Create an `Observable` class that:

```javascript
const observable = new Observable((subscriber) => {
  subscriber.next(1);
  subscriber.next(2);
  subscriber.next(3);
  subscriber.complete();
});
```

### Subscriber Methods

The subscriber object has:

- `next(value)` - Emit a value
- `error(err)` - Emit an error (stops the stream)
- `complete()` - Signal completion (stops the stream)

### subscribe(observer)

Subscribe to the observable:

```javascript
const subscription = observable.subscribe({
  next: (value) => console.log(value),
  error: (err) => console.error(err),
  complete: () => console.log("Done"),
});
```

Or with just a callback:

```javascript
observable.subscribe((value) => console.log(value));
```

Returns a subscription with `unsubscribe()` method.

### Operators (Bonus)

Implement as methods that return new Observables:

- `map(fn)` - Transform each value
- `filter(fn)` - Only emit values that pass predicate
- `take(n)` - Only emit first n values
- `skip(n)` - Skip first n values

## Examples

```javascript
// Basic observable
const numbers = new Observable((subscriber) => {
  subscriber.next(1);
  subscriber.next(2);
  subscriber.next(3);
  subscriber.complete();
});

numbers.subscribe({
  next: (x) => console.log(x),
  complete: () => console.log("Done"),
});
// 1, 2, 3, Done

// Async observable
const timer = new Observable((subscriber) => {
  let count = 0;
  const id = setInterval(() => {
    subscriber.next(count++);
    if (count > 3) {
      subscriber.complete();
      clearInterval(id);
    }
  }, 1000);

  // Cleanup function
  return () => clearInterval(id);
});

const sub = timer.subscribe((x) => console.log(x));
// Later: sub.unsubscribe();

// With operators
numbers
  .map((x) => x * 2)
  .filter((x) => x > 2)
  .subscribe((x) => console.log(x));
// 4, 6
```

## Hints

1. The Observable constructor takes a function that receives a subscriber
2. Store the subscriber function and call it on subscribe
3. The subscriber should stop accepting values after error/complete
4. The subscribe function can return a cleanup function
5. Operators return new Observables that transform the source

## Resources

- [RxJS Documentation](https://rxjs.dev/guide/observable)
- [ReactiveX Observable](http://reactivex.io/documentation/observable.html)
- [TC39 Observable Proposal](https://github.com/tc39/proposal-observable)
