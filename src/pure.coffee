'use strict'

ck = require 'constructor-kit'

create = (o) ->
  # Convert the primitive to an object.
  o = new o.constructor o if isPrimitive o
  class F
    constructor: -> @constructor = F
  F:: = o
  return new F

isString = (o) -> typeof o is 'string' or o instanceof String
isBoolean = (o) -> typeof o is 'boolean' or o instanceof Boolean
isNumber = (o) -> typeof o is 'number' or o instanceof Number
isFunction = (o) -> typeof o is 'function'
isPrimitive = (o) -> /string|number|boolean/.test typeof o
isDefined = (o) -> o isnt null and o isnt undefined
isUndefined = (o) -> o is null or o is undefined
isArray = (o) ->
  o instanceof Array or Object.prototype.toString.call(o) is '[object Array]'
isObject = (o) -> o is Object(o) and typeof o isnt 'function'

typeOf = (o) ->
  return 'null' if o is null
  return 'array' if isArray o
  return typeof o

mixin = (o, objs...) ->
  throw new Error('Expected at least one object as an argument.') if not o?
  for obj in objs
    (o[k] = obj[k] if isDefined obj) for own k,v of obj
  return o

adheresTo = (o, interfce) ->
  if (isObject(o) or isFunction(o) or isArray(o)) and
      (isObject(interfce) or isFunction(interfce) or isArray(interfce))
    for own k,v of interfce
      # Property can be any type, but must exist.
      if interfce[k] is '*'
        return false if o[k] is undefined
      else
        return false unless typeOf(o[k]) is typeOf(interfce[k]) or
          typeOf(o[k]) is interfce[k]
    return true
  return typeOf(o) is typeOf(interfce)

module.exports =
  create: create
  isString: isString
  isBoolean: isBoolean
  isNumber: isNumber
  isFunction: isFunction
  isPrimitive: isPrimitive
  isDefined: isDefined
  isUndefined: isUndefined
  isArray: isArray
  isObject: isObject
  typeOf: typeOf
  mixin: mixin
  adheresTo: adheresTo
  constructor:
    create: ck