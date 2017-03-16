# FastDataView.js
A fast DataView in javascript


### Why FastDataView is fast

It accesses the buffer with byte directly.


### Example

```js

// buffer is an instance of ArrayBuffer or NodeJS Buffer.
var dataview = new FastDataView(buffer);

```
Then user could use `dataview` as same as normal DataView object.


### Known Issue

FastDataView doesn't check the length of buffer in the data getter/setter.
