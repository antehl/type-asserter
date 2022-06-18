# type-asserter

Make assertions and perform checks for types and literal values

## Functions

There are two functions in this package: `isType` and `assertType`. Both work the same way, except `isType` returns a boolean, while `assertType` throws a descriptive error if the value does not match the assertion.

Syntax for `isType`:

```js
isType(value, type);
isType([value1, value2, ...], [type1, type2, ...]);
```

Syntax for `assertType`:

```js
assertType({ label: value }, type, inverted?);
assertType({ label1: value, label2, ... }, [type1, type2, ...], inverted?);
```

## Examples

### Simple assertions

Here's an example of a single type assertion:

```js
import { assertType } from "type-asserter";

const someText = "hello";
assertType({ someText }, String);
assertType({ someText }, Number); // TypeError: Invalid value 'hello' for {someText}, valid types being [ Number ].
```

Above you will see an error message thrown because the value of the variable `someType` isn't a number.

Inverting the assertion is also possible:

```js
import { assertType } from "type-asserter";

const someText = "hello";
assertType({ someText }, Number, true);
assertType({ someText }, String, true); // TypeError: Invalid value 'hello' for {someText}, non-valid types being [ String ].
```

The same goes for `isType`, but as said above, it returns a boolean. This function doesn't have an inversion option, since you're able to invert booleans yourself.

### Multiple assertions

With this package, it's possible to use multiple assertions in the same function. Let's look at an example:

```js
import { assertType } from "type-asserter";

const firstName = "Maximilian";
const middleName = "Maximian";
const lastName = "Maximus";
const age = 49;
assertType({ firstName, middleName, lastName, age }, String); // TypeError: Invalid value 49 for {age}, valid types being [ String ].
```

### Multiple types

Not only can you specify multiple assertions, but you can also specify multiple types. In addition, you can also use literal values in place of types, making combining the two possible, like this:

```js
import { assertType } from "type-asserter";

const optionalNumber1 = undefined;
const optionalNumber2 = 42;
assertType({ optionalNumber1, optionalNumber2 }, [Number, undefined]);
```

### Literal values

This also means you'll be able to check between multiple literal strings:

```js
import { assertType } from "type-asserter";

const fileType1 = "js";
const fileType2 = "tsx";
assertType({ fileType1, fileType2 }, ["js", "json", "txt", "yml"]); // TypeError: Invalid value 'tsx' for {fileType2}, valid types being [ 'js' | 'json' | 'txt' | 'yml' ].
```
