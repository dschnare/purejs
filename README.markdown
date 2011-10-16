Purejs
====================

Functions
---------------------

### function isString(o)
Determines if the specified object is a string literal or a String instance.

### function isBoolean(o)
Determines if the specified object is a boolean literal or a Boolean instance.

### function isNumber(o)
Determines if the specified object is a number literal or a Number instance.

### function isFunction(o)
Determines if the specified object is a function.

### function isArray(o)
Determines if the specified object is an array literal, an Array instance, or 'array-like' (i.e. has at least a numeric 'length' property, and a 'push' function)

### function isObject(o)
Determines if the specified object is an object. Will return false if the specified object is an array.

### function isDefined(o)
Determines if the specified object is null or undefined.

### function isUndefined(o)
Determines if the specified object is not null and not undefined.

### function typeOf(o)
Retrieves the typeof of the specified object. Returns 'null' if the object is null and returns 'array' if the object is an array. Otherwise returns value of typeof operation on object.

### function mixin(...)
Will copy all own-properties from every non-null, non-undefined object
in the argument list onto the first argument. If the first
argument is undefined or null then a new object is created.
Returns the first argument or the newly create object.

Note that properties with the same name will be overwritten.

### function override(...)
Will copy all properties from every non-null, non-undefined object
in the argument list onto the first argument. If the first
argument is undefined or null then a new object is created.
Returns the first argument or the newly create object.

When a property being copied is a function and a property
with the same name is a function on the object being copied
to, then the base version of the function will automatically
be called after the new, overridding version.

**Example:**

    var a = {sayHi:function(){...}};
    var b = {sayHi:function(){...}};
    var o = constructor.override(a, b);
    When calling o.sayHi() first b's version will be called,
    then a's version will be called. The return value of the
    o.sayHi() will be equal to the return value of b's version
    because it's the 'overriding' function. Note that 'o' is
    is referentially equal to 'a'.
    o.sayHi();

 Note that properties with the same name will be overwritten,
 but function properties with the same name will be overriden.