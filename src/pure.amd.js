// Author: Darren Schnare
// Keywords: javascript,constructor,inheritence,mixin,override,pure,type,testing,amd
// License: MIT ( http://www.opensource.org/licenses/mit-license.php )
// Repo: https://github.com/dschnare/purejs

(function(define) {
    "use strict";

    var pure, mixin, isString, isBoolean, isNumber, isFunction, isArray,
        isObject, isDefined, isUndefined, Object, Array, String, Boolean, Number;

    Object =({}).constructor;
    Array = ([]).constructor;
    String = ("").constructor;
    Boolean = (true).constructor;
    Number = (4).constructor;

    define({
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

            if (len === 0) return {};
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

            if (len === 0) return {};
            if (o === null || o === undefined) o = {};

            for (i = 1; i < len; i++) {
                arg = arguments[i];

                if (arg === null || arg === undefined) continue;

                for (key in arg) {
                    member = arg[key];

                    if (!arg.hasOwnProperty(key)) continue;

                    if (isFunction(member) && isFunction(o[key])) {
                        o[key] = (function(fn, baseFn) {
                            return function() {
                                var r = undefined;

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
            // create()
            // create(name)
            // create(members)
            // create(members, name)
            // create(base, members)
            // create(base, members, name)
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
                    var prototype, ctr, createInstance;

                    if (arguments.length === 0) {
                        members = {};
                        base = {};
                    } else if (arguments.length === 1) {
                        if (typeof base === "string") {
                            name = base;
                            members = {};
                            base = {};
                        } else {
                            members = base;
                            base = {};
                        }
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
                    name = isString(name) && name.length ? name : "UnnamedConstructor";

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
                        if (isFunction(base.constructor) && isObject(base.constructor.prototype)) {
                            prototype = create(base.constructor.prototype);
                        } else {
                            prototype = mixin({}, base);
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
                        var o = createInstance(ctr.prototype);

                        // Ensure we have the proper constructor history.
                        o.constructor = ctr;

                        // Trigger the copy contructor if we received a single
                        // argument that is an instance of our constructor and
                        // the copy() method exists. Then return the object.
                        if (arguments.length === 1 &&
                            arguments[0] instanceof ctr &&
                            typeof o.copy === "function") {
                            o.copy(arguments[0]);
                            return o;
                        }

                        // If we have an init() method then we call it with
                        // the arguments we received from the constructor.
                        if (typeof o.init === "function") {
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

                    // Assign our prototype and
                    // return our constructor
                    ctr.prototype = prototype;
                    return ctr;
                };
            }())
        }
    });
}(window.define));