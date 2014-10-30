!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.Pure=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global) {
  'use strict';

  function ck(constructor, prototypeProperties, prototypeChain) {
    if (arguments.length === 1) {
      prototypeProperties = {};
    } else if (arguments.length === 2) {
      prototypeChain = prototypeProperties;
      prototypeProperties = {};
    }

    prototypeProperties = prototypeProperties || {};

    if (typeof prototypeChain === 'function') {
      constructor.prototype = ck.create(prototypeChain.prototype);
      ck.mixin(constructor.prototype, prototypeProperties);
    } else if (prototypeChain) {
      constructor.prototype = ck.create(prototypeChain);
      ck.mixin(constructor.prototype, prototypeProperties);
    } else {
      constructor.prototype = ck.mixin({}, prototypeProperties);
    }

    constructor.prototype.constructor = constructor;

    return constructor;
  }

  ck.create = Object.create || function (o) {
    function F() { this.constructor = F; }
    F.prototype = o;
    return new F();
  };

  ck.mixin = function (dest) {
    var k, obj, objs;

    objs = [].slice.call(arguments, 1);
    while (objs.length) {
      obj = objs.shift();

      for (k in obj) {
        if (obj.hasOwnProperty(k)) {
          dest[k] = obj[k];
        }
      }
    }

    return dest;
  };

  if (typeof exports === 'object' && exports) {
    exports.ck = ck;
    exports.constructorKit = ck;
  } else if (typeof define === 'function' && define.amd) {
    define([], function () {
      return {ck: ck, constructorKit: ck};
    });
  } else {
    global.ck = ck;
    global.constructorKit = ck;
  }
}(this));
},{}],2:[function(require,module,exports){
// Generated by CoffeeScript 1.8.0
'use strict';
var adheresTo, ck, create, isArray, isBoolean, isDefined, isFunction, isNumber, isObject, isPrimitive, isString, isUndefined, mixin, typeOf,
  __slice = [].slice;

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
    if (isDefined(obj)) {
      for (k in obj) {
        v = obj[k];
        if (obj.hasOwnProperty(k)) {
          o[k] = obj[k];
        }
      }
    }
  }
  return o;
};

adheresTo = function(o, interfce) {
  var k, v;
  if ((isObject(o) || isFunction(o) || isArray(o)) && (isObject(interfce) || isFunction(interfce) || isArray(interfce))) {
    for (k in interfce) {
      v = interfce[k];
      if (interfce.hasOwnProperty(k)) {
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

},{"constructor-kit":1}]},{},[2])(2)
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlc1xcYnJvd3NlcmlmeVxcbm9kZV9tb2R1bGVzXFxicm93c2VyLXBhY2tcXF9wcmVsdWRlLmpzIiwibm9kZV9tb2R1bGVzXFxjb25zdHJ1Y3Rvci1raXRcXGNvbnN0cnVjdG9yLWtpdC5qcyIsInB1cmUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiKGZ1bmN0aW9uIChnbG9iYWwpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIGZ1bmN0aW9uIGNrKGNvbnN0cnVjdG9yLCBwcm90b3R5cGVQcm9wZXJ0aWVzLCBwcm90b3R5cGVDaGFpbikge1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAxKSB7XG4gICAgICBwcm90b3R5cGVQcm9wZXJ0aWVzID0ge307XG4gICAgfSBlbHNlIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAyKSB7XG4gICAgICBwcm90b3R5cGVDaGFpbiA9IHByb3RvdHlwZVByb3BlcnRpZXM7XG4gICAgICBwcm90b3R5cGVQcm9wZXJ0aWVzID0ge307XG4gICAgfVxuXG4gICAgcHJvdG90eXBlUHJvcGVydGllcyA9IHByb3RvdHlwZVByb3BlcnRpZXMgfHwge307XG5cbiAgICBpZiAodHlwZW9mIHByb3RvdHlwZUNoYWluID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBjb25zdHJ1Y3Rvci5wcm90b3R5cGUgPSBjay5jcmVhdGUocHJvdG90eXBlQ2hhaW4ucHJvdG90eXBlKTtcbiAgICAgIGNrLm1peGluKGNvbnN0cnVjdG9yLnByb3RvdHlwZSwgcHJvdG90eXBlUHJvcGVydGllcyk7XG4gICAgfSBlbHNlIGlmIChwcm90b3R5cGVDaGFpbikge1xuICAgICAgY29uc3RydWN0b3IucHJvdG90eXBlID0gY2suY3JlYXRlKHByb3RvdHlwZUNoYWluKTtcbiAgICAgIGNrLm1peGluKGNvbnN0cnVjdG9yLnByb3RvdHlwZSwgcHJvdG90eXBlUHJvcGVydGllcyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0cnVjdG9yLnByb3RvdHlwZSA9IGNrLm1peGluKHt9LCBwcm90b3R5cGVQcm9wZXJ0aWVzKTtcbiAgICB9XG5cbiAgICBjb25zdHJ1Y3Rvci5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBjb25zdHJ1Y3RvcjtcblxuICAgIHJldHVybiBjb25zdHJ1Y3RvcjtcbiAgfVxuXG4gIGNrLmNyZWF0ZSA9IE9iamVjdC5jcmVhdGUgfHwgZnVuY3Rpb24gKG8pIHtcbiAgICBmdW5jdGlvbiBGKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gRjsgfVxuICAgIEYucHJvdG90eXBlID0gbztcbiAgICByZXR1cm4gbmV3IEYoKTtcbiAgfTtcblxuICBjay5taXhpbiA9IGZ1bmN0aW9uIChkZXN0KSB7XG4gICAgdmFyIGssIG9iaiwgb2JqcztcblxuICAgIG9ianMgPSBbXS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XG4gICAgd2hpbGUgKG9ianMubGVuZ3RoKSB7XG4gICAgICBvYmogPSBvYmpzLnNoaWZ0KCk7XG5cbiAgICAgIGZvciAoayBpbiBvYmopIHtcbiAgICAgICAgaWYgKG9iai5oYXNPd25Qcm9wZXJ0eShrKSkge1xuICAgICAgICAgIGRlc3Rba10gPSBvYmpba107XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gZGVzdDtcbiAgfTtcblxuICBpZiAodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIGV4cG9ydHMpIHtcbiAgICBleHBvcnRzLmNrID0gY2s7XG4gICAgZXhwb3J0cy5jb25zdHJ1Y3RvcktpdCA9IGNrO1xuICB9IGVsc2UgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xuICAgIGRlZmluZShbXSwgZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIHtjazogY2ssIGNvbnN0cnVjdG9yS2l0OiBja307XG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgZ2xvYmFsLmNrID0gY2s7XG4gICAgZ2xvYmFsLmNvbnN0cnVjdG9yS2l0ID0gY2s7XG4gIH1cbn0odGhpcykpOyIsIi8vIEdlbmVyYXRlZCBieSBDb2ZmZWVTY3JpcHQgMS44LjBcbid1c2Ugc3RyaWN0JztcbnZhciBhZGhlcmVzVG8sIGNrLCBjcmVhdGUsIGlzQXJyYXksIGlzQm9vbGVhbiwgaXNEZWZpbmVkLCBpc0Z1bmN0aW9uLCBpc051bWJlciwgaXNPYmplY3QsIGlzUHJpbWl0aXZlLCBpc1N0cmluZywgaXNVbmRlZmluZWQsIG1peGluLCB0eXBlT2YsXG4gIF9fc2xpY2UgPSBbXS5zbGljZTtcblxuY2sgPSByZXF1aXJlKCdjb25zdHJ1Y3Rvci1raXQnKTtcblxuY3JlYXRlID0gZnVuY3Rpb24obykge1xuICB2YXIgRjtcbiAgaWYgKGlzUHJpbWl0aXZlKG8pKSB7XG4gICAgbyA9IG5ldyBvLmNvbnN0cnVjdG9yKG8pO1xuICB9XG4gIEYgPSAoZnVuY3Rpb24oKSB7XG4gICAgZnVuY3Rpb24gRigpIHtcbiAgICAgIHRoaXMuY29uc3RydWN0b3IgPSBGO1xuICAgIH1cblxuICAgIHJldHVybiBGO1xuXG4gIH0pKCk7XG4gIEYucHJvdG90eXBlID0gbztcbiAgcmV0dXJuIG5ldyBGO1xufTtcblxuaXNTdHJpbmcgPSBmdW5jdGlvbihvKSB7XG4gIHJldHVybiB0eXBlb2YgbyA9PT0gJ3N0cmluZycgfHwgbyBpbnN0YW5jZW9mIFN0cmluZztcbn07XG5cbmlzQm9vbGVhbiA9IGZ1bmN0aW9uKG8pIHtcbiAgcmV0dXJuIHR5cGVvZiBvID09PSAnYm9vbGVhbicgfHwgbyBpbnN0YW5jZW9mIEJvb2xlYW47XG59O1xuXG5pc051bWJlciA9IGZ1bmN0aW9uKG8pIHtcbiAgcmV0dXJuIHR5cGVvZiBvID09PSAnbnVtYmVyJyB8fCBvIGluc3RhbmNlb2YgTnVtYmVyO1xufTtcblxuaXNGdW5jdGlvbiA9IGZ1bmN0aW9uKG8pIHtcbiAgcmV0dXJuIHR5cGVvZiBvID09PSAnZnVuY3Rpb24nO1xufTtcblxuaXNQcmltaXRpdmUgPSBmdW5jdGlvbihvKSB7XG4gIHJldHVybiAvc3RyaW5nfG51bWJlcnxib29sZWFuLy50ZXN0KHR5cGVvZiBvKTtcbn07XG5cbmlzRGVmaW5lZCA9IGZ1bmN0aW9uKG8pIHtcbiAgcmV0dXJuIG8gIT09IG51bGwgJiYgbyAhPT0gdm9pZCAwO1xufTtcblxuaXNVbmRlZmluZWQgPSBmdW5jdGlvbihvKSB7XG4gIHJldHVybiBvID09PSBudWxsIHx8IG8gPT09IHZvaWQgMDtcbn07XG5cbmlzQXJyYXkgPSBmdW5jdGlvbihvKSB7XG4gIHJldHVybiBvIGluc3RhbmNlb2YgQXJyYXkgfHwgT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG8pID09PSAnW29iamVjdCBBcnJheV0nO1xufTtcblxuaXNPYmplY3QgPSBmdW5jdGlvbihvKSB7XG4gIHJldHVybiBvID09PSBPYmplY3QobykgJiYgdHlwZW9mIG8gIT09ICdmdW5jdGlvbic7XG59O1xuXG50eXBlT2YgPSBmdW5jdGlvbihvKSB7XG4gIGlmIChvID09PSBudWxsKSB7XG4gICAgcmV0dXJuICdudWxsJztcbiAgfVxuICBpZiAoaXNBcnJheShvKSkge1xuICAgIHJldHVybiAnYXJyYXknO1xuICB9XG4gIHJldHVybiB0eXBlb2Ygbztcbn07XG5cbm1peGluID0gZnVuY3Rpb24oKSB7XG4gIHZhciBrLCBvLCBvYmosIG9ianMsIHYsIF9pLCBfbGVuO1xuICBvID0gYXJndW1lbnRzWzBdLCBvYmpzID0gMiA8PSBhcmd1bWVudHMubGVuZ3RoID8gX19zbGljZS5jYWxsKGFyZ3VtZW50cywgMSkgOiBbXTtcbiAgaWYgKG8gPT0gbnVsbCkge1xuICAgIHRocm93IG5ldyBFcnJvcignRXhwZWN0ZWQgYXQgbGVhc3Qgb25lIG9iamVjdCBhcyBhbiBhcmd1bWVudC4nKTtcbiAgfVxuICBmb3IgKF9pID0gMCwgX2xlbiA9IG9ianMubGVuZ3RoOyBfaSA8IF9sZW47IF9pKyspIHtcbiAgICBvYmogPSBvYmpzW19pXTtcbiAgICBpZiAoaXNEZWZpbmVkKG9iaikpIHtcbiAgICAgIGZvciAoayBpbiBvYmopIHtcbiAgICAgICAgdiA9IG9ialtrXTtcbiAgICAgICAgaWYgKG9iai5oYXNPd25Qcm9wZXJ0eShrKSkge1xuICAgICAgICAgIG9ba10gPSBvYmpba107XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIG87XG59O1xuXG5hZGhlcmVzVG8gPSBmdW5jdGlvbihvLCBpbnRlcmZjZSkge1xuICB2YXIgaywgdjtcbiAgaWYgKChpc09iamVjdChvKSB8fCBpc0Z1bmN0aW9uKG8pIHx8IGlzQXJyYXkobykpICYmIChpc09iamVjdChpbnRlcmZjZSkgfHwgaXNGdW5jdGlvbihpbnRlcmZjZSkgfHwgaXNBcnJheShpbnRlcmZjZSkpKSB7XG4gICAgZm9yIChrIGluIGludGVyZmNlKSB7XG4gICAgICB2ID0gaW50ZXJmY2Vba107XG4gICAgICBpZiAoaW50ZXJmY2UuaGFzT3duUHJvcGVydHkoaykpIHtcbiAgICAgICAgaWYgKGludGVyZmNlW2tdID09PSAnKicpIHtcbiAgICAgICAgICBpZiAob1trXSA9PT0gdm9pZCAwKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmICghKHR5cGVPZihvW2tdKSA9PT0gdHlwZU9mKGludGVyZmNlW2tdKSB8fCB0eXBlT2Yob1trXSkgPT09IGludGVyZmNlW2tdKSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICByZXR1cm4gdHlwZU9mKG8pID09PSB0eXBlT2YoaW50ZXJmY2UpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGNyZWF0ZTogY3JlYXRlLFxuICBpc1N0cmluZzogaXNTdHJpbmcsXG4gIGlzQm9vbGVhbjogaXNCb29sZWFuLFxuICBpc051bWJlcjogaXNOdW1iZXIsXG4gIGlzRnVuY3Rpb246IGlzRnVuY3Rpb24sXG4gIGlzUHJpbWl0aXZlOiBpc1ByaW1pdGl2ZSxcbiAgaXNEZWZpbmVkOiBpc0RlZmluZWQsXG4gIGlzVW5kZWZpbmVkOiBpc1VuZGVmaW5lZCxcbiAgaXNBcnJheTogaXNBcnJheSxcbiAgaXNPYmplY3Q6IGlzT2JqZWN0LFxuICB0eXBlT2Y6IHR5cGVPZixcbiAgbWl4aW46IG1peGluLFxuICBhZGhlcmVzVG86IGFkaGVyZXNUbyxcbiAgY29uc3RydWN0b3I6IHtcbiAgICBjcmVhdGU6IGNrLmNrXG4gIH1cbn07XG4iXX0=
