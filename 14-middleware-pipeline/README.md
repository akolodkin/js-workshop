# Assignment 14: Middleware Pipeline

## Difficulty: Hard

## Learning Objectives

- Understand the middleware pattern used in Express/Koa
- Implement a composable processing pipeline
- Work with next() continuation pattern
- Handle async middleware

## The Problem

Middleware is a pattern where requests pass through a chain of handlers. Each handler can:

- Process the request
- Modify the request/response
- Pass control to the next handler
- Short-circuit the chain

```javascript
const app = new Pipeline();

app.use((ctx, next) => {
  console.log("Start");
  next();
  console.log("End");
});

app.use((ctx, next) => {
  ctx.body = "Hello";
  next();
});

app.run({ body: "" });
// Output: Start, End
// ctx.body = 'Hello'
```

## Requirements

### Pipeline Class

Create a `Pipeline` class with:

#### `use(middleware)`

Add middleware to the pipeline. Middleware signature:

```javascript
function middleware(context, next) {
  // Do something before
  next(); // Call next middleware
  // Do something after
}
```

#### `run(context)`

Execute the pipeline with given context.

### Features

1. **Sequential Execution**: Middleware runs in order added
2. **Context Passing**: Same context object passed to all middleware
3. **Next Control**: `next()` calls the next middleware
4. **Short-circuit**: Not calling `next()` stops the chain
5. **Async Support**: Handle async middleware with `await next()`

## Examples

```javascript
const pipeline = new Pipeline();

// Logging middleware
pipeline.use((ctx, next) => {
  console.log(`Request: ${ctx.method} ${ctx.path}`);
  const start = Date.now();
  next();
  console.log(`Response time: ${Date.now() - start}ms`);
});

// Auth middleware
pipeline.use((ctx, next) => {
  if (!ctx.token) {
    ctx.status = 401;
    return; // Short-circuit, don't call next()
  }
  next();
});

// Handler
pipeline.use((ctx, next) => {
  ctx.body = { message: "Success" };
  ctx.status = 200;
});

// Run
const ctx = { method: "GET", path: "/api", token: "abc123" };
pipeline.run(ctx);
console.log(ctx.status); // 200
```

### Async Example

```javascript
const pipeline = new Pipeline();

pipeline.use(async (ctx, next) => {
  ctx.user = await fetchUser(ctx.userId);
  await next();
});

pipeline.use(async (ctx, next) => {
  ctx.posts = await fetchPosts(ctx.user.id);
  await next();
});

await pipeline.run({ userId: 1 });
```

## Hints

1. Store middleware in an array
2. Create a `dispatch(index)` function that calls middleware[index]
3. Pass `() => dispatch(index + 1)` as `next`
4. For async, return Promise from dispatch
5. Handle case when `next()` is called multiple times

## Koa-style Composition

```javascript
function compose(middleware) {
  return function (context) {
    function dispatch(i) {
      const fn = middleware[i];
      if (!fn) return Promise.resolve();
      return Promise.resolve(fn(context, () => dispatch(i + 1)));
    }
    return dispatch(0);
  };
}
```

## Resources

- [Koa Middleware](https://koajs.com/)
- [Express Middleware](https://expressjs.com/en/guide/using-middleware.html)
- [Understanding Koa's compose](https://github.com/koajs/compose)
