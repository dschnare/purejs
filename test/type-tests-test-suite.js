(function(pure, unit) {
    unit.makeTestSuite("Type Tests Test Suite", {
        isStringTest: function() {
            unit.expect("string literal to be a string.", pure.isString("some string literal"));
            unit.expect("string object to be a string.", pure.isString(new String("some string literal")));
            unit.dontExpect("number literal to be a string.", pure.isString(4));
            unit.dontExpect("number object to be a string.", pure.isString(new Number(4)));
            unit.dontExpect("array literal be a string.", pure.isString([1,2,3]));
        },
        isBooleanTest: function() {
            unit.expect("boolean literal to be a boolean.", pure.isBoolean(true));
            unit.expect("boolean object to be a boolean.", pure.isBoolean(false));
            unit.dontExpect("number literal to be a boolean.", pure.isBoolean(4));
            unit.dontExpect("number object to be a boolean.", pure.isBoolean(new Number(4)));
            unit.dontExpect("array literal be a boolean.", pure.isBoolean([1,2,3]));
            unit.dontExpect("string literal be a boolean.", pure.isBoolean("some string literal"));
        },
        isNumberTest: function() {
            unit.expect("number literal integer to be a number.", pure.isNumber(0));
            unit.expect("number literal float to be a number.", pure.isNumber(12.23));
            unit.expect("number literal exponent to be a number.", pure.isNumber(12e4));
            unit.expect("number object to be a number.", pure.isNumber(new Number(12.34)));
            unit.dontExpect("array literal be a number.", pure.isNumber([1,2,3]));
            unit.dontExpect("string literal be a number.", pure.isNumber("some string literal"));
            unit.dontExpect("string object be a number.", pure.isNumber(new String("some string literal")));
        },
        setupIsFunctionTest: function() {
            var f = function() {};
            f.prototype = Function.prototype;
            this.functionObject = new f();
        },
        isFunctionTest: function() {
            unit.expect("function literal to be a function.", pure.isFunction(function() {}));
            unit.expect("function property to be a function.", pure.isFunction(unit.makeTestSuite));
            unit.dontExpect("function object to be a function.", pure.isFunction(this.functionObject));
            unit.dontExpect("number literal to be a function.", pure.isFunction(10));
        },
        destroyIsFunctionTest: function(testName) {
            delete this.functionObject;
        }
    }).run();
}(pure, unit));