Purejs
====================

Functions
---------------------

### pure.isString(o)
Determines if the specified object is a string literal or a String instance.

### pure.isBoolean(o)
Determines if the specified object is a boolean literal or a Boolean instance.

### pure.isNumber(o)
Determines if the specified object is a number literal or a Number instance.

### pure.isFunction(o)
Determines if the specified object is a function.

### pure.isArray(o)
Determines if the specified object is an array literal, an Array instance, or 'array-like' (i.e. has at least a numeric 'length' property, and a 'push' function)

### pure.isObject(o)
Determines if the specified object is an object. Will return false if the specified object is an array.

### pure.isDefined(o)
Determines if the specified object is null or undefined.

### pure.isUndefined(o)
Determines if the specified object is not null and not undefined.

### pure.typeOf(o)
Retrieves the typeof of the specified object. Returns 'null' if the object is null and returns 'array' if the object is an array. Otherwise returns value of typeof operation on object.

### pure.mixin(...)
Will copy all own-properties from every non-null, non-undefined object
in the argument list onto the first argument. If the first
argument is undefined or null then a new object is created.
Returns the first argument or the newly create object.

Note that properties with the same name will be overwritten.

### pure.override(...)
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
    // When calling o.sayHi() first b's version will be called,
    // then a's version will be called. The return value of the
    // o.sayHi() will be equal to the return value of b's version
    // because it's the 'overriding' function. Note that 'o' is
    // is referentially equal to 'a'.
    o.sayHi();

Note that properties with the same name will be overwritten,
but function properties with the same name will be overriden.

### pure.adheresTo(o, interfce)
Determines if an object adheres to a given interface.
The interface can be an actual object instance to test against or
a key-value pair of properties whose values are a string equal to the typeof
expression that the property should adhere to. If the value is equal to '*'
then the property can be any type.

Performs a typeof test on each property in the interface and the object.
If all pass then the object is said to adhere to the interface and returns true,
otherwise returns false.

If the object and the interface are null or undefined then they are tested
for strict equality. If the object and the interfce are strictly equal then
returns true, otherwise returns false.

**Example:**

    pure.adheresTo(o, Object.prototype); // true
    pure.adheresTo(o, {toString: "function"}); // true
    pure.adheresTo("", String.prototype); // true

### pure.constructor.create(members)
### pure.constructor.create(members, name)
### pure.constructor.create(base, members)
### pure.constructor.create(base, members, name)
Creates a new constructor with an optional base prototype
and an optional constructor name. The name is useful for
tracing objects during debugging.

Where base can be an object or a constructor, although objects are preferred.

All properties from 'members' will be copied to the newly created
constructor's prototype.

All constructors created are safeguarded against improper use of
the 'new' operator, so any constructor can be called with or
without the 'new' operator.

If the property 'init' exists on the prototype and is a function
it will be called with the arguments received from the constructor.

**WARNING:** Properties defined in the init() method are not inherited on the prototype
so they cannot be overridden on the prototype, but instead must be overridden or
overwritten on the instance.

**WARNING:** Just because a constructor has a prototype equal to Function.prototype does not
mean the objects it instantiates can be called as functions. The instantiated
objects are just objects.

**Example:**

    var MyNewFuncType = constructor.create(Function.prototype, { ... });
    var newFunc = new MyNewFuncType();
    // All these methods will throw an error when called.
    newFunc();
    newFunc.call();
    newFunc.apply();
    newFunc.bind()
    // However, according to 'instanceof' newFunc is a 'Function'.
    console.log(newFunc instanceof Function) Yes it is, but we can't treat it like one!

**WARNING:** Due to a limitation of the JavaScript language, when attempting to
use an object created from a constructor that has a prototype equal to Array.prototype as the
arguments to Function.prototype.apply, an error will be thrown.
To circumvent this you must provide a converter to the native array type or use the built-in
'valueOf()' method to convert the object to a native array.

**Example:**

    var List = constructor.create(Array.prototype, { ... list methods ... });
    var myList = new List(1, 2, 3);
    // This will throw an error.
    //console.log.apply(console, myList);
    // Must convert to a native array first.
    consoel.log.apply(console, myList.toArray());
    // However, our list is an Array.
    conole.log(myList instanceof Array && pure.isArray(myList)) // Yep.