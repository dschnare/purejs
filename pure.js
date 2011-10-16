// Author: Darren Schnare
// Keywords: javascript,constructor,inheritence,mixin,override,pure,type,testing
// License: MIT ( http://www.opensource.org/licenses/mit-license.php )
// Repo: https://gist.github.com/1245150

var pure = (function() {
    var pure, mixin, isString, isBoolean, isNumber, isFunction, isArray, isObject, isDefined, isUndefined, Object, Array, String, Boolean, Number;

    Object =({}).constructor;
    Array = ([]).constructor;
    String = ("").constructor;
    Boolean = (true).constructor;
    Number = (4).constructor;

    return {
        isString: isString = function(o) {
            return typeof o === "string" || o instanceof String;
        },
        isBoolean: isBoolean = function(o) {
            return typeof o === "boolean" || o instanceof Boolean;
        },
        isNumber: isNumber = function(o) {
            return typeof o === "number" || o instanceof Number;
        },
        isFunction: isFunction = function(o) {
            return typeof o === "function";
        },
        isArray: isArray = function(o) {
            return o instanceof Array || ({}).toString.call(o) === "[object Array]" || (isDefined(o) && isNumber(o.length) && isFunction(o.push));
        },
        isObject: isObject = function(o) {
            return o && typeof o === "object" && !isArray(o);
        },
        isDefined: isDefined = function(o) {
            return o !== null && o !== undefined;
        },
        isUndefined: isUndefined = function(o) {
            return o === undefined || o === null;
        },
        typeOf: function(o) {
            if (o === null) return "null";
            if (isArray(o)) return "array";
            return typeof o;
        },
        // mixin(...)
        mixin: mixin = function() {
            var i, len = arguments.length, key, arg, o = arguments[0];

            if (len === 0) return undefined;
            if (o === null || o === undefined) o = {};

            for (i = 1; i < len; i++) {
                arg = arguments[i];

                if (arg === null || arg === undefined) continue;

                for (key in arg) {
                    if (arg.hasOwnProperty(key)) o[key] = arg[key];
                }
            }

            return o;
        },
        // override(...)
        override: function() {
            var member, i, len = arguments.length, key, arg, o = arguments[0];

            if (len === 0) return undefined;
            if (o === null || o === undefined) o = {};

            for (i = 1; i < len; i++) {
                arg = arguments[i];

                if (arg === null || arg === undefined) continue;

                for (key in arg) {
                    member = arg[key];

                    if (isFunction(member) && isFunction(o[key])) {
                        o[key] = (function(fn, baseFn) {
                            return function() {
                                var r;

                                if (arguments.length) {
                                    r = fn.apply(this, arguments);
                                    baseFn.apply(this, arguments);
                                } else {
                                    r = fn.call(this);
                                    baseFn.call(this);
                                }

                                return r;
                            };
                        }(member, o[key]));
                    } else {
                        o[key] = member;
                    }
                }
            }

            return o;
        },
        // Determines if an object adheres to a given interface.
        // The interface can be an actual object instance to test against or
        // a key-value pair of properties whose values are a string equal to the typeof
        // expression that the property should adhere to. If the value is equal to '*'
        // then the property can be any type.
        //
        // Performs a typeof test on each property in the interface and the object.
        // If all pass then the object is said to adhere to the interface and returns true,
        // otherwise returns false.
        //
        // If the object and the interface are null or undefined then they are tested
        // for strict equality. If the object and the interfce are strictly equal then
        // returns true, otherwise returns false.
        //
        // adheresTo(o, interfce)
        adheresTo: function(o, interfce) {
            var key, typeofo, typeofi;

            if ((isObject(o) || isFunction(o) || isArray(o)) &&
                (isObject(interfce) || isFunction(interfce) || isArray(interfce))) {
                for (key in interfce) {
                    // Property can be any type, but must exist.
                    if (interfce[key] === "*") {
                        if (key in o) continue;
                        return false;
                    }

                    if (typeof o[key] !== typeof interfce[key] &&
                        typeof o[key] !== (interfce[key] + "")) return false;
                }

                return true;
            }

            typeofo = o === null ? "null" : typeof o;
            typeofi = interfce === null ? "null" : typeof interfce;

            return typeofo === typeofi;
        },
        constructor: {
            // Creates a new constructor with an optional base prototype
            // and an optional constructor name. The name is useful for
            // tracing objects during debugging.
            //
            // All properties from 'members' will be copied to the newly created
            // constructor's prototype.
            //
            // All constructors created are safeguarded against improper use of
            // the 'new' operator, so any constructor can be called with or
            // without the 'new' operator.
            //
            // If the property 'init' exists on the prototype and is a function
            // it will be called with the arguments received from the constructor.
            //
            // WARNING: Properties defined in the init() method are not inherited on the prototype
            // so they cannot be overridden on the prototype, but instead must be overridden or
            // overwritten on the instance.
            //
            // WARNING: Just because a constructor is based on Function.prototype does not
            // mean the objects it instantiates can be called as functions. The instantiated
            // objects are just that, objects.
            //
            // Example:
            // var MyNewFuncType = constructor.create(Function.prototype, { ... });
            // var newFunc = new MyNewFuncType();
            // // All these methods will throw an error when called.
            // newFunc();
            // newFunc.call();
            // newFunc.apply();
            // newFunc.bind()
            // // However, according to 'instanceof' newFunc is a 'Function'.
            // console.log(newFunc instanceof Function) // Yes it is, but we can't treat it like one!
            //
            // WARNING: Due to a limitation of the JavaScript language, when attempting to
            // use an object created from a constructor based off of Array.prototype as the
            // arguments to Function.prototype.apply, an error will be thrown.
            // To circumvent this you must provide a converter to the native array type.
            //
            // Example:
            // var List = constructor.create(Array.prototype, { ... list methods ... });
            // var myList = new List(1, 2, 3);
            // // This will throw an error.
            // //console.log.apply(console, myList);
            // // Must convert to a native array first
            // consoel.log.apply(console, myList.toArray());
            // // However, our list is an Array
            // conole.log(myList instanceof Array) // Yep.
            //
            // create(members)
            // create(members, name)
            // create(base, members)
            // create(base, members, name)
            //
            // Where base can be an object or a constructor, although objects are preferred.
            create: (function() {
                var CREATION_SCRIPT, create;

                CREATION_SCRIPT = "var F = function() {};\n" +
                    "F.prototype = o;\n" +
                    "return new F();\n";

                create = Object.create || function(o) {
                    var F = function() {};
                    F.prototype = o;
                    return new F();
                };

                return function(base, members, name) {
                    var prototype, ctr, hasInit, createInstance;

                    if (arguments.length === 1) {
                        members = base;
                        base = {};
                    } else if (arguments.length === 2) {
                        if (isString(arguments[1])) {
                            name = members;
                            members = base;
                            base = {};
                        }
                    } else if (arguments.length === 3) {
                        name += "";
                    }

                    // Set a default name if none was specified.
                    name = name || "UnamedConstructor";

                    // If base is a function then we assume it's a constructor
                    // so we read its prototype property.
                    //
                    // NOTE: This is allowed due to many programmer's familiarity
                    // with classical models and how classical inheritence is
                    // facilitated. However, this is not the preferred approach.
                    if (isFunction(base)) {
                        base = base.prototype;
                    }

                    // Manage our prototype chain by extending the base
                    // prototype if we can, otherwise we mixin the properties from base.
                    try {
                        prototype = create(base);
                    } catch (error) {
                        if (isFunction(base.constructor) && base.constructor.prototype) {
                            prototype = create(base.constructor.prototype);
                        } else {
                            prototype = {};//mixin({}, base);
                        }
                    }

                    // Create a custom instance creator that uses our
                    // constructor's name to facilitate prettier debug tracing.
                    createInstance = (function() {
                        var s = CREATION_SCRIPT.replace(/F\b/g, name);
                        return new Function("o", s);
                    }());

                    ctr = function() {
                        // Create a new instance inheriting from our prototype.
                        var o = createInstance(prototype);

                        // Ensure we have the proper constructor history.
                        o.constructor = ctr;

                        // If we have an init() method then we call it with
                        // the arguments we received from the constructor.
                        if (hasInit) {
                            if (arguments.length) {
                                o.init.apply(o, arguments);
                            } else {
                                o.init();
                            }
                        }

                        return o;
                    };
                    // Saveguard our constructor code from inspection and
                    // use the constructor name.
                    ctr.toString = function() {
                        return "function " + name + " () { [native code] }";
                    };
                    // Easy accessor to retrieve the constructor name.
                    // (typically used for reflection purposes)
                    ctr.getName = function() {
                        return name;
                    };

                    // Mixin all properties from members onto our prototype.
                    mixin(prototype, members);

                    hasInit = isFunction(prototype.init);

                    // Assign our prototype and
                    // return our constructor
                    ctr.prototype = prototype;
                    return ctr;
                };
            }())
        }
    };
}());