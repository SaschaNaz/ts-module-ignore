# ts-module-ignore
This receives a TypeScript module code and removes export keywords.

### Why remove `export`?
Standalone libraries that never `import`s anything still wants to `export` itself to be available both on web browsers and on module-based system e.g. Node.js. As browsers does not natively support module syntax yet as of April 2017, ts-module-ignore achives this by simply removing `export` keyword to target browsers.

### How to use?

Use ts-module-ignore on build tool e.g. Jake:

```js
import ignore = require("ts-build-ignore").ignore;

desc("browser")
task("browser", () => {
  let originalCode; // 1. get code by fs.readFile
  let ignored = ignore(originalCode); // 2.
  // 3. write ignored file
  // 4. call tsc
});
```

### Note
This does not read TypeScript syntax tree but simply remove any of `export` string that appear on the line start. You need to be careful when you use strings containing `export`:

```js
var foo = `
export this!
this export!
`;

// output will:
var foo = `
this!
this export!
`;
```
