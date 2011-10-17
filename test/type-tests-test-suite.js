(function(pure, unit) {
    unit.makeTestSuite("Type Tests Test Suite", {
        isStringTest: function() {
            unit.expect("String literal to be a string.", pure.isString("some string literal"));
            unit.expect("String literal to be a string.", pure.isString(new String("some string literal")));
        }
    });
}(pure, unit));