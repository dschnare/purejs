(function(pure, unit) {
    unit.makeTestSuite("Mixin Test Suite", {
            setupOwnPropertyTest: function() {
                function create(o) {
                    function F() {}
                    F.prototype = o;
                    return new F();
                }

                this.a = {
                    name: "Ninja",
                    age: 300
                };

                this.b = create(this.a);
                this.b.stars = 800;
                this.b.health = 1000;
            },
        ownPropertyTest: function() {
            var o = pure.mixin({}, this.b);

            unit.expect("o.stars to be equal to b.stars.", o.stars === this.b.stars);
            unit.expect("o.health to equal to b.health.", o.health === this.b.health);
            unit.dontExpect("o.name to be equal to a.name.", o.name === this.a.name);
            unit.dontExpect("o.age to be equal to a.age.", o.age === this.a.age);
        },
            destroyOwnPropertyTest: function() {
                delete this.a;
                delete this.b;
            },
            setupOverwritePropertyTest: function() {
                this.setupOwnPropertyTest();
            },
        overwritePropertyTest: function() {
            this.b.age = 3500;
            var o = pure.mixin(this.a, this.b);

            unit.expect("o.name to be equal to a.name.", o.name === this.a.name);
            unit.expect("o.age to be equal to 3500.", o.age === 3500);
        },
            destroyOverwritePropertyTest: function() {
                this.destroyOwnPropertyTest();
            },
        objectCreationTest: function() {
            var o = pure.mixin();
            unit.expect("o to be an object.", typeof o === "object");

            var j = pure.mixin(o, {age: 45});
            unit.expect("o to be the same object as j.", o === j);

            var k = pure.mixin(null, {age: 45});
            unit.expect("k.age to be equal to 45.", k.age === 45);
        }
    }).run();
}(window.pure, window.unit));