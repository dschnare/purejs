Purejs
====================

[Base.js](http://code.google.com/p/base2/source/browse/trunk/src/base2/Base.js) and [Prototype.js](http://www.prototypejs.org/learn/class-inheritance) have their own, [John Resig](http://ejohn.org/blog/simple-javascript-inheritance/) has his own, everyone tends to turn a blind eye on Javascript's prototypal nature by rolling their own classical object model. What these and other approaches tend to have in common is that they require the programmer to make a choice about how they write their code, how they use their code and to think twice about interfacing with non-conforming code or even native "types" (i.e. constructors like String, Object, Date, Array, and Boolean).

I get it though, even the built-in mechanisms offer clunky support for writing prototypal driven code.

    var Base = function(name) {
      this.name = name + "";
    };
    // Having to address the prototype
    // directly to attach a property is just clunky.
    Base.prototype.toString = function() {
      return "Base:" + this.name;
    };

    var Person = function(name) {
      // No way to call our base constructor
      // so we have to re-implement it.
      this.name = name + "";
    };
    Person.prototype = new Base();
    Person.prototype.toString = function() {
      return "Person:" + Base.prototype.toString.call(this);
    };

    var person = new Person("Darren");
    // Alerts 'Person:Base:Darren'.
    alert(person.toString());

    // This is really bad since the 'this' object will be the window
    // and we will be overwriting global variables.
    // var person = Person("Darren");

I applaud their efforts at attempting to mitigate these issues, however I still wish they would have stayed true to the language a bit more and refrained from grafting a classical design pattern onto a prototypal language.

Here are the goals I had in mind when developing Purejs and how I think I achieved them:
+   Offer a more friendly way of using Javascript's prototype system without introducing new ideas.

    By now all developers are familiar with Crockford's Object.create to create new object instances by extend existing objects. Purejs follows a similar convention:

        var MyConstructor = pure.constructor.create({
            init: function() {
                // ... instance properties
            },
            // ... other prototypal properties/methods
        });

    Note that I didn't introduce any classical concepts to the language.

+   Must work with both the constructor and functional approach (i.e. constructor approach as in 'new Rect()' and the functional approach as in 'makeRect()').

        var Rect = pure.constructor.create({
            init: function(width, height) {
                this.width = width;
                this.height = height;
            },
            area: function() {
                return this.width * this.height;
            }
        });
        var makeRect = Rect;

        // later in code ...

        var rect = new Rect(10, 10);

        // a new programmer is introduced on the team
        // and prefers the functional pattern
        var rect = makeRect(10, 10);
        // this also works
        //var rect = Rect(10, 10);

        // this allows programmers to just think of the problem
        // domain, not the nuances of JavaScript and whether they
        // choose to go down the constructor paradigm
        // or functional paradigm.

+   Must maintain prototype chain such that the results of 'instanceof', 'isPrototypeOf' and 'getPrototypeOf' are predictable and the 'constructor' history is maintained.

        // From the pure.js file and the example it contains,
        // all the following statements resolve to true.

        log("person instanceof Base: " + (person instanceof Base));
        log("person instanceof Person: " + (person instanceof Person));
        log("Base.prototype.isPrototypeOf(person): " +
          Base.prototype.isPrototypeOf(person));
        log("Person.prototype.isPrototypeOf(person): " +
          Person.prototype.isPrototypeOf(person));
        if (typeof Object.getPrototypeOf === "function") {
            log("Object.getPrototypeOf(person) === Person.prototype: " +
              (Object.getPrototypeOf(person) === Person.prototype));
        }
        log("person.constructor === Person: " + (person.constructor === Person));

+   The syntax must be minimal, but comprehensible.

    This code is magnitudes easier to write and to comprehend than the typical
    approach to writing prototypal driven code.

        var MyConstructor = pure.constructor.create({ ... });

+   Must not add ANY overhead or use any ill advised techniques (i.e. no use of properties starting with '_' to mimic privacy, wrapping methods with outer functions, or rely on function decompiling).

    By inspecting the code of pure.constructor.create you'll notice that there is no overhead introduced by wrapping functions in outer functions, no weird property names assigned on constructors (i.e. no '_' or '$' or anything else), and there is no reliance on function decompiling say for optimization or any other capability.

+   Ideally, offer a technique to call base/super methods without introducing overhead.

    Depending on how you look at this one you might say Purejs fails this, but in my opinion I think this is one of Purejs' best features because it doesn't bother with introducing any overhead or making any decisions for the programmer about how to access base methods.

        var Base = pure.constructor.create();

        // Technique one:
        // compact, provides closure around base prototype,
        // lets programmer decide what to call 'base',
        // might not be easily comprehended by beginners
        var Person = (function(base) {
            return pure.constructor.create(base, {
                init: function() {
                    base.call(this, ...);
                    // ... continue
                }
            });
        }(Base.prototype));

        // Technique two:
        // very compact,
        // introduces slight overhead when accessing the prototype,
        // immediately clear what the base prototype is,
        // might be more familiar to classic programmers
        var Person = pure.constructor.create(Base, {
            init: function() {
                Base.prototype.call(this, ...);
                // ... continue
            }
        });

        // Your technique:
        // Will support any number of techniques for calling base members.

+   Ideally, help programmers to think in terms of prototypes.

    Since the criteria for this goal is subjective by nature, I leave it to you to be the judge.