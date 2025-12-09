const {
  QueryBuilder,
  HTMLBuilder,
  ConfigBuilder,
  RequestBuilder,
} = require("./index");

describe("QueryBuilder", () => {
  test("should build simple select query", () => {
    const query = new QueryBuilder()
      .select("name", "email")
      .from("users")
      .build();

    expect(query).toBe("SELECT name, email FROM users");
  });

  test("should build query with where clause", () => {
    const query = new QueryBuilder()
      .select("*")
      .from("products")
      .where("price", ">", 100)
      .build();

    expect(query).toContain("WHERE price > 100");
  });

  test("should build query with multiple where clauses", () => {
    const query = new QueryBuilder()
      .select("*")
      .from("users")
      .where("age", ">", 18)
      .where("active", "=", true)
      .build();

    expect(query).toContain("age > 18");
    expect(query).toContain("AND");
    expect(query).toContain("active = true");
  });

  test("should build query with order by", () => {
    const query = new QueryBuilder()
      .select("name")
      .from("users")
      .orderBy("name", "ASC")
      .build();

    expect(query).toContain("ORDER BY name ASC");
  });

  test("should build query with limit", () => {
    const query = new QueryBuilder()
      .select("*")
      .from("posts")
      .limit(10)
      .build();

    expect(query).toContain("LIMIT 10");
  });

  test("should build complete query", () => {
    const query = new QueryBuilder()
      .select("id", "name", "email")
      .from("users")
      .where("active", "=", true)
      .orderBy("name", "DESC")
      .limit(5)
      .build();

    expect(query).toContain("SELECT id, name, email");
    expect(query).toContain("FROM users");
    expect(query).toContain("WHERE active = true");
    expect(query).toContain("ORDER BY name DESC");
    expect(query).toContain("LIMIT 5");
  });

  test("should support method chaining", () => {
    const builder = new QueryBuilder();
    expect(builder.select("a")).toBe(builder);
    expect(builder.from("t")).toBe(builder);
    expect(builder.where("x", "=", 1)).toBe(builder);
  });

  test("should reset state", () => {
    const builder = new QueryBuilder().select("a").from("b").reset();

    const query = builder.select("x").from("y").build();

    expect(query).not.toContain("a");
    expect(query).toContain("x");
  });
});

describe("HTMLBuilder", () => {
  test("should build simple element", () => {
    const html = new HTMLBuilder().tag("div").build();

    expect(html).toBe("<div></div>");
  });

  test("should build element with id", () => {
    const html = new HTMLBuilder().tag("div").id("container").build();

    expect(html).toContain('id="container"');
  });

  test("should build element with classes", () => {
    const html = new HTMLBuilder().tag("div").class("wrapper", "main").build();

    expect(html).toContain('class="wrapper main"');
  });

  test("should build element with attributes", () => {
    const html = new HTMLBuilder()
      .tag("input")
      .attr("type", "text")
      .attr("placeholder", "Enter name")
      .build();

    expect(html).toContain('type="text"');
    expect(html).toContain('placeholder="Enter name"');
  });

  test("should build element with content", () => {
    const html = new HTMLBuilder().tag("p").content("Hello World").build();

    expect(html).toBe("<p>Hello World</p>");
  });

  test("should build complete element", () => {
    const html = new HTMLBuilder()
      .tag("div")
      .id("main")
      .class("container", "dark")
      .attr("data-page", "home")
      .content("Welcome")
      .build();

    expect(html).toContain("<div");
    expect(html).toContain('id="main"');
    expect(html).toContain('class="container dark"');
    expect(html).toContain('data-page="home"');
    expect(html).toContain(">Welcome</div>");
  });

  test("should support method chaining", () => {
    const builder = new HTMLBuilder();
    expect(builder.tag("div")).toBe(builder);
    expect(builder.id("a")).toBe(builder);
    expect(builder.class("b")).toBe(builder);
  });
});

describe("ConfigBuilder", () => {
  test("should build config with environment", () => {
    const config = new ConfigBuilder().setEnvironment("production").build();

    expect(config.environment).toBe("production");
  });

  test("should build config with database", () => {
    const dbConfig = { host: "localhost", port: 5432 };
    const config = new ConfigBuilder().setDatabase(dbConfig).build();

    expect(config.database).toEqual(dbConfig);
  });

  test("should build config with features", () => {
    const config = new ConfigBuilder()
      .enableFeature("caching")
      .enableFeature("logging")
      .build();

    expect(config.features).toContain("caching");
    expect(config.features).toContain("logging");
  });

  test("should disable features", () => {
    const config = new ConfigBuilder()
      .enableFeature("caching")
      .enableFeature("logging")
      .disableFeature("logging")
      .build();

    expect(config.features).toContain("caching");
    expect(config.features).not.toContain("logging");
  });

  test("should build config with log level", () => {
    const config = new ConfigBuilder().setLogLevel("error").build();

    expect(config.logLevel).toBe("error");
  });

  test("should build complete config", () => {
    const config = new ConfigBuilder()
      .setEnvironment("production")
      .setDatabase({ host: "db.example.com" })
      .enableFeature("caching")
      .setLogLevel("warn")
      .build();

    expect(config.environment).toBe("production");
    expect(config.database.host).toBe("db.example.com");
    expect(config.features).toContain("caching");
    expect(config.logLevel).toBe("warn");
  });

  test("should return independent object on build", () => {
    const builder = new ConfigBuilder().setEnvironment("dev");
    const config1 = builder.build();
    const config2 = builder.build();

    config1.environment = "changed";
    expect(config2.environment).toBe("dev");
  });
});

describe("RequestBuilder", () => {
  test("should build GET request", () => {
    const request = new RequestBuilder("https://api.example.com")
      .method("GET")
      .path("/users")
      .build();

    expect(request.method).toBe("GET");
    expect(request.url).toContain("/users");
  });

  test("should build request with query params", () => {
    const request = new RequestBuilder("https://api.example.com")
      .path("/search")
      .query("q", "test")
      .query("page", "1")
      .build();

    expect(request.url).toContain("q=test");
    expect(request.url).toContain("page=1");
  });

  test("should build request with headers", () => {
    const request = new RequestBuilder()
      .header("Authorization", "Bearer token123")
      .header("Content-Type", "application/json")
      .build();

    expect(request.headers["Authorization"]).toBe("Bearer token123");
    expect(request.headers["Content-Type"]).toBe("application/json");
  });

  test("should build POST request with body", () => {
    const request = new RequestBuilder()
      .method("POST")
      .path("/users")
      .body({ name: "Alice", email: "alice@example.com" })
      .build();

    expect(request.method).toBe("POST");
    expect(request.body).toEqual({ name: "Alice", email: "alice@example.com" });
  });
});
