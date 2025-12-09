# Assignment 03: Custom Bind

## Difficulty: Hard

## Learning Objectives

- Deep understanding of `this` keyword in JavaScript
- Learn how Function.prototype methods work internally
- Work with prototypes and function objects
- Handle both regular calls and constructor calls

## The Problem

The `bind()` method creates a new function with its `this` value bound to a specific object. Your task is to implement this functionality from scratch.

```javascript
const person = { name: "Alice" };
function greet(greeting) {
  return `${greeting}, ${this.name}!`;
}

const boundGreet = greet.bind(person);
boundGreet("Hello"); // "Hello, Alice!"
```

## Requirements

Implement `customBind(fn, context, ...boundArgs)` that:

1. **Returns a new function** that, when called, has its `this` set to `context`
2. **Supports partial application**: Pre-fill some arguments
3. **Preserves the original function's behavior**: Return value, arguments
4. **Works with constructors** (`new` keyword): When used with `new`, ignore bound `this`
5. **Handle edge cases**: No context, called on non-functions

## Examples

```javascript
// Basic binding
const obj = { x: 42 };
function getX() {
  return this.x;
}
const boundGetX = customBind(getX, obj);
boundGetX(); // 42

// Partial application
function add(a, b, c) {
  return a + b + c;
}
const add5 = customBind(add, null, 5);
add5(3, 2); // 10 (5 + 3 + 2)

const add5and3 = customBind(add, null, 5, 3);
add5and3(2); // 10 (5 + 3 + 2)

// Works with new
function Person(name) {
  this.name = name;
}
const BoundPerson = customBind(Person, { ignored: true });
const alice = new BoundPerson("Alice");
alice.name; // 'Alice'
alice instanceof Person; // true
```

## Advanced: Also Implement as Prototype Method

Optionally, add `customBind` to `Function.prototype`:

```javascript
Function.prototype.customBind = function (context, ...boundArgs) {
  // Your implementation
};

const bound = greet.customBind(person, "Hello");
```

## Hints

1. Use `Function.prototype.apply()` to set `this` and pass arguments
2. Concatenate bound args with runtime args: `[...boundArgs, ...runtimeArgs]`
3. To detect constructor calls, check if `this` is an instance of the bound function
4. Use `Object.create()` to set up proper prototype chain for constructor case

## Resources

- [MDN: Function.prototype.bind()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_objects/Function/bind)
- [MDN: this keyword](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)
- [MDN: new operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/new)
