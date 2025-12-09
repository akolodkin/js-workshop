const { Observable } = require("./index");

describe("Observable", () => {
  describe("basic subscription", () => {
    test("should emit values to subscriber", () => {
      const values = [];
      const observable = new Observable((subscriber) => {
        subscriber.next(1);
        subscriber.next(2);
        subscriber.next(3);
      });

      observable.subscribe({
        next: (v) => values.push(v),
      });

      expect(values).toEqual([1, 2, 3]);
    });

    test("should accept function as shorthand for next", () => {
      const values = [];
      const observable = new Observable((subscriber) => {
        subscriber.next(1);
        subscriber.next(2);
      });

      observable.subscribe((v) => values.push(v));

      expect(values).toEqual([1, 2]);
    });

    test("should call complete handler", () => {
      let completed = false;
      const observable = new Observable((subscriber) => {
        subscriber.next(1);
        subscriber.complete();
      });

      observable.subscribe({
        next: () => {},
        complete: () => {
          completed = true;
        },
      });

      expect(completed).toBe(true);
    });

    test("should call error handler", () => {
      let errorReceived = null;
      const observable = new Observable((subscriber) => {
        subscriber.error(new Error("test error"));
      });

      observable.subscribe({
        next: () => {},
        error: (err) => {
          errorReceived = err;
        },
      });

      expect(errorReceived.message).toBe("test error");
    });

    test("should stop emitting after complete", () => {
      const values = [];
      const observable = new Observable((subscriber) => {
        subscriber.next(1);
        subscriber.complete();
        subscriber.next(2); // Should be ignored
      });

      observable.subscribe({
        next: (v) => values.push(v),
      });

      expect(values).toEqual([1]);
    });

    test("should stop emitting after error", () => {
      const values = [];
      const observable = new Observable((subscriber) => {
        subscriber.next(1);
        subscriber.error(new Error("test"));
        subscriber.next(2); // Should be ignored
      });

      observable.subscribe({
        next: (v) => values.push(v),
        error: () => {},
      });

      expect(values).toEqual([1]);
    });
  });

  describe("unsubscribe", () => {
    test("should return subscription with unsubscribe", () => {
      const observable = new Observable(() => {});
      const subscription = observable.subscribe(() => {});
      expect(typeof subscription.unsubscribe).toBe("function");
    });

    test("should stop receiving values after unsubscribe", () => {
      const values = [];
      let emit;

      const observable = new Observable((subscriber) => {
        emit = (v) => subscriber.next(v);
      });

      const subscription = observable.subscribe((v) => values.push(v));

      emit(1);
      subscription.unsubscribe();
      emit(2);

      expect(values).toEqual([1]);
    });

    test("should call cleanup function on unsubscribe", () => {
      let cleaned = false;
      const observable = new Observable(() => {
        return () => {
          cleaned = true;
        };
      });

      const subscription = observable.subscribe(() => {});
      subscription.unsubscribe();

      expect(cleaned).toBe(true);
    });
  });

  describe("map operator", () => {
    test("should transform values", () => {
      const values = [];
      const observable = new Observable((subscriber) => {
        subscriber.next(1);
        subscriber.next(2);
        subscriber.next(3);
        subscriber.complete();
      });

      observable.map((x) => x * 2).subscribe((v) => values.push(v));

      expect(values).toEqual([2, 4, 6]);
    });

    test("should chain multiple maps", () => {
      const values = [];
      const observable = new Observable((subscriber) => {
        subscriber.next(1);
        subscriber.complete();
      });

      observable
        .map((x) => x + 1)
        .map((x) => x * 2)
        .subscribe((v) => values.push(v));

      expect(values).toEqual([4]); // (1+1)*2
    });

    test("should propagate complete", () => {
      let completed = false;
      const observable = new Observable((subscriber) => {
        subscriber.next(1);
        subscriber.complete();
      });

      observable
        .map((x) => x * 2)
        .subscribe({
          next: () => {},
          complete: () => {
            completed = true;
          },
        });

      expect(completed).toBe(true);
    });
  });

  describe("filter operator", () => {
    test("should filter values", () => {
      const values = [];
      const observable = new Observable((subscriber) => {
        subscriber.next(1);
        subscriber.next(2);
        subscriber.next(3);
        subscriber.next(4);
        subscriber.complete();
      });

      observable.filter((x) => x % 2 === 0).subscribe((v) => values.push(v));

      expect(values).toEqual([2, 4]);
    });

    test("should work with map", () => {
      const values = [];
      const observable = new Observable((subscriber) => {
        subscriber.next(1);
        subscriber.next(2);
        subscriber.next(3);
        subscriber.complete();
      });

      observable
        .map((x) => x * 2)
        .filter((x) => x > 2)
        .subscribe((v) => values.push(v));

      expect(values).toEqual([4, 6]);
    });
  });

  describe("take operator", () => {
    test("should take only first n values", () => {
      const values = [];
      const observable = new Observable((subscriber) => {
        subscriber.next(1);
        subscriber.next(2);
        subscriber.next(3);
        subscriber.next(4);
        subscriber.next(5);
      });

      observable.take(3).subscribe((v) => values.push(v));

      expect(values).toEqual([1, 2, 3]);
    });

    test("should complete after taking n values", () => {
      let completed = false;
      const observable = new Observable((subscriber) => {
        subscriber.next(1);
        subscriber.next(2);
        subscriber.next(3);
      });

      observable.take(2).subscribe({
        next: () => {},
        complete: () => {
          completed = true;
        },
      });

      expect(completed).toBe(true);
    });
  });

  describe("skip operator", () => {
    test("should skip first n values", () => {
      const values = [];
      const observable = new Observable((subscriber) => {
        subscriber.next(1);
        subscriber.next(2);
        subscriber.next(3);
        subscriber.next(4);
        subscriber.next(5);
        subscriber.complete();
      });

      observable.skip(2).subscribe((v) => values.push(v));

      expect(values).toEqual([3, 4, 5]);
    });
  });

  describe("static methods", () => {
    test("Observable.from should emit array values", () => {
      const values = [];
      Observable.from([1, 2, 3]).subscribe((v) => values.push(v));
      expect(values).toEqual([1, 2, 3]);
    });

    test("Observable.from should complete after array", () => {
      let completed = false;
      Observable.from([1, 2]).subscribe({
        next: () => {},
        complete: () => {
          completed = true;
        },
      });
      expect(completed).toBe(true);
    });

    test("Observable.of should emit all arguments", () => {
      const values = [];
      Observable.of(1, 2, 3).subscribe((v) => values.push(v));
      expect(values).toEqual([1, 2, 3]);
    });
  });
});
