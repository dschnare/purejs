'use strict';
var adheresTo, ck, create, isArray, isBoolean, isDefined, isFunction, isNumber, isObject, isPrimitive, isString, isUndefined, mixin, typeOf,
  __slice = [].slice,
  __hasProp = {}.hasOwnProperty;

ck = require('constructor-kit');

create = function(o) {
  var F;
  if (isPrimitive(o)) {
    o = new o.constructor(o);
  }
  F = (function() {
    function F() {
      this.constructor = F;
    }

    return F;

  })();
  F.prototype = o;
  return new F;
};

isString = function(o) {
  return typeof o === 'string' || o instanceof String;
};

isBoolean = function(o) {
  return typeof o === 'boolean' || o instanceof Boolean;
};

isNumber = function(o) {
  return typeof o === 'number' || o instanceof Number;
};

isFunction = function(o) {
  return typeof o === 'function';
};

isPrimitive = function(o) {
  return /string|number|boolean/.test(typeof o);
};

isDefined = function(o) {
  return o !== null && o !== void 0;
};

isUndefined = function(o) {
  return o === null || o === void 0;
};

isArray = function(o) {
  return o instanceof Array || Object.prototype.toString.call(o) === '[object Array]';
};

isObject = function(o) {
  return o === Object(o) && typeof o !== 'function';
};

typeOf = function(o) {
  if (o === null) {
    return 'null';
  }
  if (isArray(o)) {
    return 'array';
  }
  return typeof o;
};

mixin = function() {
  var k, o, obj, objs, v, _i, _len;
  o = arguments[0], objs = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
  if (o == null) {
    throw new Error('Expected at least one object as an argument.');
  }
  for (_i = 0, _len = objs.length; _i < _len; _i++) {
    obj = objs[_i];
    for (k in obj) {
      if (!__hasProp.call(obj, k)) continue;
      v = obj[k];
      if (isDefined(obj)) {
        o[k] = obj[k];
      }
    }
  }
  return o;
};

adheresTo = function(o, interfce) {
  var k, v;
  if ((isObject(o) || isFunction(o) || isArray(o)) && (isObject(interfce) || isFunction(interfce) || isArray(interfce))) {
    for (k in interfce) {
      if (!__hasProp.call(interfce, k)) continue;
      v = interfce[k];
      if (interfce[k] === '*') {
        if (o[k] === void 0) {
          return false;
        }
      } else {
        if (!(typeOf(o[k]) === typeOf(interfce[k]) || typeOf(o[k]) === interfce[k])) {
          return false;
        }
      }
    }
    return true;
  }
  return typeOf(o) === typeOf(interfce);
};

module.exports = {
  create: create,
  isString: isString,
  isBoolean: isBoolean,
  isNumber: isNumber,
  isFunction: isFunction,
  isPrimitive: isPrimitive,
  isDefined: isDefined,
  isUndefined: isUndefined,
  isArray: isArray,
  isObject: isObject,
  typeOf: typeOf,
  mixin: mixin,
  adheresTo: adheresTo,
  constructor: {
    create: ck.ck
  }
};
