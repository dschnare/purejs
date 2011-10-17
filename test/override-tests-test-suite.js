var window;
window = window || {};

(function(pure, unit) {
    unit.makeTestSuite("Override Tests Test Suite", {
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
            var o = pure.override({}, this.b);

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
            var o = pure.override(this.a, this.b);

            unit.expect("o.name to be equal to a.name.", o.name === this.a.name);
            unit.expect("o.age to be equal to 3500.", o.age === 3500);
        },
            destroyOverwritePropertyTest: function() {
                this.destroyOwnPropertyTest();
            },
        objectCreationTest: function() {
            var o = pure.override();
            unit.expect("o to be an object.", typeof o === "object");

            var j = pure.override(o, {age: 45});
            unit.expect("o to be the same object as j.", o === j);

            var k = pure.override(null, {age: 45});
            unit.expect("k.age to be equal to 45.", k.age === 45);
        },
        overrideTest: function() {
            var msg;

            var a = {
                hello: function() {
                    msg += "hello";
                },
                world: function() {
                    msg += "world";
                }
            };
            var o = pure.override({}, a, {
                hello: function() {
                    msg += " ";
                }
            });

            var msg = o.hello() + o.world();

            unit.expect("msg to be equal to ' helloworld'.", msg === "hello world");

            o = pure.override({
                hello: function() {
                    return "Hello ";
                }
            }, a);

            msg = o.hello() + o.world();

            unit.expect("msg to be equal to 'hello world'.", msg === "Hello world");
        }
    }).run();
}(window.pure, window.unit));