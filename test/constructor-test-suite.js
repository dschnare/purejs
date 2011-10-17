var window;
window = window || {};

var name = (function(pure, unit) {
    unit.makeTestSuite("Constructor Test Suite", {
        emptyConstructorTest: function() {
            var ctr = pure.constructor.create();
            var o = new ctr();
            var j = ctr();

            unit.expect("ctr to be a function.", typeof ctr === "function");
            unit.expect("o to be an instance of ctr.", o instanceof ctr);
            unit.expect("j to be an instance of ctr.", j instanceof ctr);
            if (typeof Object.prototype.isPrototypeOf === "function") {
                unit.expect("ctr.prototype is a prototype of o.", ctr.prototype.isPrototypeOf(o));
                unit.expect("ctr.prototype is a prototype of j.", ctr.prototype.isPrototypeOf(j));
            }
            if (typeof Object.getPrototypeOf === "function") {
                unit.expect("prototype of o is equal to ctr.prototype.", Object.getPrototypeOf(o) === ctr.prototype);
                unit.expect("prototype of j is equal to ctr.prototype.", Object.getPrototypeOf(j) === ctr.prototype);
            }

            unit.expect("ctr.getName() equal to 'UnnamedConstructor'.", ctr.getName() === "UnnamedConstructor");
        },
        simpleConstructorTest: function() {
            var ctr = pure.constructor.create("CTR");
            var o = new ctr();
            var j = ctr();

            unit.expect("ctr to be a function.", typeof ctr === "function");
            unit.expect("o to be an instance of ctr.", o instanceof ctr);
            unit.expect("j to be an instance of ctr.", j instanceof ctr);
            if (typeof Object.prototype.isPrototypeOf === "function") {
                unit.expect("ctr.prototype is a prototype of o.", ctr.prototype.isPrototypeOf(o));
                unit.expect("ctr.prototype is a prototype of j.", ctr.prototype.isPrototypeOf(j));
            }
            if (typeof Object.getPrototypeOf === "function") {
                unit.expect("prototype of o is equal to ctr.prototype.", Object.getPrototypeOf(o) === ctr.prototype);
                unit.expect("prototype of j is equal to ctr.prototype.", Object.getPrototypeOf(j) === ctr.prototype);
            }

            unit.expect("ctr.getName() equal to 'CTR'.", ctr.getName() === "CTR");
        },
        membersTest: function() {
            var initCalled = false;
            var ctr = pure.constructor.create({
                init: function() {
                    initCalled = true;
                },
                helloWorld: function() {
                    return "Hello World";
                }
            }, "CTR");
            var o = new ctr();
            var j = ctr();

            unit.expect("ctr to be a function.", typeof ctr === "function");
            unit.expect("o to be an instance of ctr.", o instanceof ctr);
            unit.expect("j to be an instance of ctr.", j instanceof ctr);
            if (typeof Object.prototype.isPrototypeOf === "function") {
                unit.expect("ctr.prototype is a prototype of o.", ctr.prototype.isPrototypeOf(o));
                unit.expect("ctr.prototype is a prototype of j.", ctr.prototype.isPrototypeOf(j));
            }
            if (typeof Object.getPrototypeOf === "function") {
                unit.expect("prototype of o is equal to ctr.prototype.", Object.getPrototypeOf(o) === ctr.prototype);
                unit.expect("prototype of j is equal to ctr.prototype.", Object.getPrototypeOf(j) === ctr.prototype);
            }

            unit.expect("ctr.getName() equal to 'CTR'.", ctr.getName() === "CTR");
            unit.expect("initCalled to be true.", initCalled);
            unit.expect("o.helloWorld() equal to 'Hello World'.", o.helloWorld() === "Hello World");
            unit.expect("o to adhere to ctr.prototype.", pure.adheresTo(o, ctr.prototype));
        },
        baseMembersTest: function() {
            var personInitCalled = false;
            var ninjaInitCalled = false;
            var Person = pure.constructor.create({
                init: function(name) {
                    this.name = name;
                    personInitCalled = true;
                },
                getName: function() {
                    return this.name;
                },
                helloWorld: function() {
                    return "Hello World";
                }
            }, "Person");
            var Ninja = pure.constructor.create(Person, {
                init: function(name) {
                    ninjaInitCalled = true;
                    Person.prototype.init.call(this, name);
                },
                getName: function() {
                    return Person.prototype.getName.call(this) + " is a Ninja!";
                }
            }, "Ninja");

            var ninja = Ninja("Darren");

            unit.expect("ninja to be an instance of Ninja.", ninja instanceof Ninja);
            unit.expect("ninja to be an instance of Person.", ninja instanceof Person);
            if (typeof Object.prototype.isPrototypeOf === "function") {
                unit.expect("Ninja.prototype is a prototype of ninja.", Ninja.prototype.isPrototypeOf(ninja));
                unit.expect("Person.prototype is a prototype of ninja.", Person.prototype.isPrototypeOf(ninja));
            }
            if (typeof Object.getPrototypeOf === "function") {
                unit.expect("prototype of ninja is equal to Ninja.prototype.", Object.getPrototypeOf(ninja) === Ninja.prototype);
                unit.dontExpect("prototype of ninja is equal to Person.prototype.", Object.getPrototypeOf(ninja) === Person.prototype);
            }

            unit.expect("ninja.getName() equal to 'Darren is a Ninja'.", ninja.getName() === "Darren is a Ninja!");
            unit.expect("Ninja.getName() equal to 'Ninja'.", Ninja.getName() === "Ninja");
            unit.expect("personInitCalled to be true.", personInitCalled);
            unit.expect("ninjaInitCalled to be true.", ninjaInitCalled);
            unit.expect("ninja.helloWorld() equal to 'Hello World'.", ninja.helloWorld() === "Hello World");
            unit.expect("ninja.helloWorld() equal to 'Hello World'.", ninja.helloWorld() === "Hello World");
            unit.expect("ninja to adhere to Ninja.prototype.", pure.adheresTo(ninja, Ninja.prototype));
            unit.expect("ninja to adhere to Person.prototype.", pure.adheresTo(ninja, Person.prototype));
        }
    }).run();
}(window.pure, window.unit));