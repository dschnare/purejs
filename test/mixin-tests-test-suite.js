var window;
window = window || {};

(function(pure, unit) {
    unit.makeTestSuite("Mixin Tests Test Suite", {
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

            unit.expect("o to have property 'stars'.", o.stars === this.b.stars);
            unit.expect("o to have property 'health'.", o.health === this.b.health);
            unit.dontExpect("o to have property 'name'.", o.name === this.a.name);
            unit.dontExpect("o to have property 'age'.", o.age === this.a.age);
        },
            destroyOwnPropertyTest: function() {
                delete this.a;
                delete this.b;
            }
    }).run();
}(window.pure, window.unit));