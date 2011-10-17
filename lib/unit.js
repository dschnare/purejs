/**
 * <p>Represents an API for performing unit tests.</p>
 *
 * <p>The Unite API is organized into tests, test suites, and test harnesses. Tests are function
 * that accept no arguments and may use the assertion functions to make assertions or returns a
 * promise (created from the Promise API). If a test throws an error or smashes its promise
 * then the test is said to have failed. If a test throws no error or filfills its promise then
 * the test is said to have passed.</p>
 *
 * <p>Test suites are objects that consist of several tests. Each test suite has its methods enumerated
 * and only the methods with no formal arguments will be recognized as tests. Besides tests a suite can
 * have the following life cycle methods: Setup; called once before each test is executed with the test name,
 * Destroy; called once after each test has executed with the test name, SetupSuite; called once before
 * any test has executed, DestroySuite; called once after all tests have been executed. Note that the life-
 * cycle methods can be all lowercase, mixed camelcase, or even have '_' separating their words.</p>
 *
 * <p>Test harnesses are a set of test suites. Test harnesses are created by passing several objects
 * to create test suites with. When a test harness is executed, all test suites are executed in the
 * order they were specified.</p>
 */
var unit  = (function() {
    var utill, Array, Object, TEST_MESSAGE, console;

    Array = ([]).constructor;
    Object = ({}).constructor;
    TEST_MESSAGE = "{0} .......................................... {1} [{2}ms]";

    ///////////////////////
    // Utility Functions //
    ///////////////////////

    util = {
        string: {
            format: function(string /*, ... */) {
                var arg, i, a = arguments, len;

                string += '';
                a.shift();
                len = a.length;

                if (len === 2 && ({}).toString.call(a[1]) === "[object Array]") {
                    a = arguments[1];
                    len = a.length;
                }

                for (i = 1; i < len; i++) {
                    arg = a[i];
                    string = string.replace(new RegExp('\\{' + (i-1) + '\\}', 'g'), arg + '');
                }

                return string;
            }
        },
        fn: {
            bind: function(fn, context){
                var ap, concat, args, isPartial;

                isPartial = arguments.length > 1;

                // Strategy 1: just bind, not a partialApply
                if(!isPartial) {
                    return function() {
                        if (arguments.length) {
                            return fn.apply(context, arguments);
                        } else {
                            return fn.call(context); // faster in Firefox.
                        }
                    };
                } else {
                    // Strategy 2: partialApply
                    ap = Array.prototype,
                    args = ap.slice.call(arguments, 1);
                    concat = ap.concat;
                    return function() {
                        return fn.apply(context,
                            arguments.length === 0 ? args :
                            concat.apply(args, arguments));
                    };
                }
            }
        },
        promise: {
            isPromise: function(o) {
                function areFunctions(o/*, ... */) {
                    var i, args = arguments, len = args.length, func = "function";

                    for (i = 1; i < len; i++) {
                        if (typeof o[args[o]] !== func) return false;
                    }

                    return true;
                }

                return areFunctions(o, "smash", "fulfill", "fulfilled", "smashed", "fulfilledOrSmashed");
            },
            create: function() {
                var status, outcome, waiting = [], dreading = [], resolved = false;

                status = "unresolved";

                function vouch(deed, func) {
                    switch (status) {
                        case "unresolved":
                        case "pending":
                            (deed === "fulfilled" ? waiting : dreading).push(func);
                            break;
                        case deed:
                            func(outcome);
                            break;
                    }
                }

                function internalResolve(deed, value) {
                    var a, count, i;

                    resolved = true;

                    if (util.promise.isPromise(value)) {
                        status = "pending";

                        value
                        .fulfilled(function(out) {
                            internalResolve("fulfilled", out);
                        })
                        .smashed(function(msg) {
                            internalResolve("smashed", msg);
                        });
                    } else {
                        status = deed;
                        outcome = value;
                        a = status === "fulfilled" ? waiting : dreading;
                        count = a.length;

                        for (i = 0; i < count; i += 1) {
                            try {
                                a[i](outcome);
                            } catch (ignore) {}
                        }

                        waiting = null;
                        dreading = null;
                    }
                }

                function resolve(deed, value) {
                    if (resolved) {
                        throw new Error("promise.resolve::Promise has already been resolved:" + status);
                    }
                    internalResolve(deed, value);
                }

                return {
                    status: function() {
                        return status;
                    },
                    fulfilled:function(func) {
                        vouch("fulfilled", func);
                        return this;
                    },
                    smashed:function(func) {
                        vouch("smashed", func);
                        return this;
                    },
                    fulfilledOrSmashed:function(func) {
                        vouch("fulfilled", func);
                        vouch("smashed", func);
                        return this;
                    },
                    fulfill:function(value) {
                        resolve("fulfilled", value);
                    },
                    smash:function(message) {
                        resolve("smashed", message);
                    }
                };
            }
        }
    };

    ///////////////////
    // Debug Console //
    ///////////////////

    console = (function() {
        var console, div = document.createElement("div"), styles;

        div.style.height = "300px";
        div.style.border = "1px solid black";
        div.style.padding = "5px";
        div.style.marginBottom = "5px";
        div.style.overflow = "auto";
        div.style.margin = "10px";

        styles = {
            normal:{
                color:"black"
            },
            heading:{
                fontWeight:"bold",
                borderBottomStyle:"solid",
                borderBottomWidth:"1px",
                marginBottom:"10px",
                color:"black"
            },
            error:{
                fontWeight:"bold",
                color:"red"
            },
            fail:{
                fontWeight:"bold",
                color:"red"
            },
            success:{
                fontWeight:"bold",
                color:"green"
            },
            pass:{
                fontWeight:"bold",
                color:"green"
            }
        };

        function applyStyle(messageType, element) {
            var style = styles[messageType];
            if (typeof style === "string") {
                element.className += style;
            } else {
                for (var key in style) {
                    element.style[key] = style[key];
                }
            }
        }

        console = {
            /**
             * Sets the style of a message type.
             *
             * @symbol setStyle {Function}
             * @param messageType {String} The message type to style.
             * @param style {Object} The class name as a string or a style object.
             */
            setStyle:function(messageType, style) {
                if (style) {
                    if (typeof messageType === "string" || (style && typeof style === "object")) {
                        styles[messageType] = style;
                    }
                }
            },
            /**
             * Retrieves a style for the specified message type.
             *
             * @symbol getStyle {Function}
             * @param messageType {String} The message type to retrieve the style for.
             */
            getStyle:function(messageType) {
                return styles[messageType];
            },
            /**
             * Appends the specified child element to the debug console and applies the style
             * associated to the specified message type. If no style can be found then the "normal"
             * style is used.
             *
             * @symbol appendChild {Function}
             * @param child {HTMLElement} The document element to append to the console.
             * @param messageType {String} The message type to style the child with.
             */
            appendChild:function(child, messageType) {
                if (child && child.parentNode !== div) {
                    applyStyle(messageType, child);
                    div.appendChild(child);
                    if (!div.parentNode || div.parentNode instanceof document.constructor) {
                        var body = document.getElementsByTagName("body")[0];
                        if (body) {
                            body.appendChild(div);
                        }
                    }
                }
            },
            /**
             * Appends the specified text to the console styled with the specified style.
             * If no style can be found then the "normal" style is used.
             *
             * @symbol trace {Function}
             * @param text {String} The text to append to the console.
             * @param messageType {String} The message type to style the text with.
             */
            trace:function(text, messageType) {
                var element = document.createElement("div");
                element.appendChild(document.createTextNode(text));
                this.appendChild(element, messageType);
            },
            /**
             * Appends "normal" styled text to the console.
             *
             * @symbol normal {Function}
             * @param text {String} The text to append to the console.
             */
            normal:function(text) {
                this.trace(text, "normal");
            },
            /**
             * Appends "heading" styled text to the console.
             *
             * @symbol heading {Function}
             * @param text {String} The text to append to the console.
             */
            heading:function(text) {
                this.trace(text, "heading");
            },
            /**
             * Appends "error" styled text to the console.
             *
             * @symbol error {Function}
             * @param text {String} The text to append to the console.
             */
            error:function(text) {
                this.trace("ERROR: " + text, "error");
            },
            /**
             * Appends "fail" styled text to the console.
             *
             * @symbol error {Function}
             * @param text {String} The text to append to the console.
             */
            fail:function(text) {
                this.trace("FAIL: " + text, "fail");
            },
            /**
             * Appends "success" styled text to the console.
             *
             * @symbol success {Function}
             * @param text {String} The text to append to the console.
             */
            success:function(text) {
                this.trace("SUCCESS: " + text, "success");
            },
            /**
             * Appends "pass" styled text to the console.
             *
             * @symbol error {Function}
             * @param text {String} The text to append to the console.
             */
            pass:function(text) {
                this.trace("PASS: " + text, "pass");
            }
	    };

	    console.heading("Debug Console");

        return console;
    }());


	///////////////////////
	// Private Functions //
	///////////////////////

    function error(message) {
		throw new Error("Test failed: " + message);
	}

	function log(message, passed) {
		if (typeof unit.log === "function") {
			unit.log(message, passed);
		}
	};

	function tryCall(instance, methodNames) {
		if (instance) {
			var args = Array.prototype.slice.call(arguments, 2),
			len = methodNames.length, methodName;

			for (var i = 0; i < len; i++) {
				methodName = methodNames[i];

				if (typeof instance[methodName] === "function") {
					if (args.length === 0) {
						return instance[methodName]();
					}
					return instance[methodName].apply(instance, args);
				}
			}
		}
	}

	return {
        util: util,
		/**
		 * A function that will be called to log messages. This function can be assigned
		 * a user defined function or null. By default this function will look for the
		 * debug console from the DebugConsole API, and fallback to writing lines directly
		 * to the document. If both methods fail then this method does nothing.
		 *
		 * @param message {String} The message to have logged.
		 * @param passed {Object} True if this is "pass" log message, false if this is a "fail" log message, any other value if this is a "normal" log message.
		 */
		log: function(message, passed) {
            var s = "";

			try {
				if (passed === true) {
					console.pass(message);
				} else if (passed === false) {
					console.fail(message);
				} else {
					console.trace(message);
				}
			} catch (ignore) {
				if (passed === true) {
					s = "PASS: ";
				} else if (passed === false) {
					s = "FAIL: ";
				}
				try {
					document.writeln(s + message);
				} catch (ignore) {}
			}
		},
		/**
		 * Forcefully fail the currently exectuing test.
		 */
		fail: function(message) {
			throw new Error("Failure: " + message);
		},
        assert: function(value, message) {
            if (!value) {
                error(message || util.string.format("Expected '{0}' to be true.", value));
            }
        },
        expect: function(message, value) {
            if (!value) {
                error(message || util.string.format("Expected '{0}' to be true.", value));
            }
        },
        expectToThrow: function(message, fn) {
            try {
                fn();
                error(message || "Expected function to throw an error.");
            } catch (ignore) {}
        },
        dontExpect: function(message, value) {
            if (value) {
                error(message || util.string.format("Did not expect '{0}' to be true.", value));
            }
        },
        dontExpectToThrow: function(message, fn) {
            try {
                fn();
            } catch (ignore) {
                error(message || "Did not expect function to throw an error.");
            }
        },
		/**
		 * Makes a tes harness from a series of test suite objects.
		 *
		 * @symbol makeTestHarness {Function}
		 * @param name {String} The name of the test harness for logging purposes.
		 * @vparam {Object} List of objects to create test suites from.
		 * @return {TestHarness} The new test harness.
		 */
		makeTestHarness: function(name/*, name,vaulue, ... */) {
			var testSuites = [], suiteName, suiteInstance, args, i = 0, len, running = false;

            args = Array.prototype.slice.call(arguments, 1);
            len = args.length;

			function runNextSuite() {
				var testSuite = testSuites[i], promise;

                running = true;
                i += 1;

				// if the suite exists
				if (testSuite) {
					promise = testSuite.run();
                    promise.fulfilled(function() {
                        runNextSuite();
                    });
				// all test suites are done running
				// toggle the running flag for this harness
				} else {
					running = false;
				}
			}

			// ensure we have gotten an even number of arguments
			if (len === 0 || len % 2 !== 0) {
				throw new Error("unit.makeTestHarness::Expected a name and a list of name:instance pairs to create test suites from.");
			}

			// make the test suites
			for (i = 0; i < len; i += 2) {
				suiteName = args[i];
				suiteInstance = args[i + 1];
				testSuites.push(this.makeTestSuite(suiteName, suiteInstance));
			}

			/**
			 * Represents a test harness that will run a series of test suites.
			 */
			return {
				name: name,
				/**
				 * Runs the test harness and all test suites in the order they were specified.
				 */
				run: function() {
					if (!running) {
						log(name);
						log("");
						i = 0;
						runNextSuite();
					}
				}
			}
		},
		/**
		 * Makes a test suite from an object.
		 *
		 * @symbol makeTestSuite {Function}
		 * @param name {String} The name of the test suite for loggin purposes.
		 * @param instance {Object} The object to convert to a test suite.
		 * @return {TestSuite} The new test suite.
		 */
		makeTestSuite: function(name, instance) {
			var p, m, f, tests = [];

			// make the tests
			for (p in instance) {
				f = instance[p];

				if (typeof f === "function" && f.length === 0) {
					m = p.replace("_", "").toLowerCase();

					if (m !== "setupsuite" && m !== "setup" && m !== "destroy" && m !== "destroysuite") {
						tests.push(unit.makeTest(p, util.fn.bind(f, instance)));
					}
				}
			}

			return {
				name: name,
				/**
				 * Runs the test suite and all tests in the order they were enumerated.
				 *
				 * @return {PromiseObject} A promise if the Promise API has been loaded, undefined otherwise.
				 */
				run: function() {
					tryCall(instance, ["SetupSuite", "setupSuite", "setupsuite", "Setup_Suite", "setup_Suite", "setup_suite"]);

					log(name);

					var i = 0, t, len = tests.length, results, rootPromise;

                    results = {total:0, passed:0, failed:0};

					function runNextTest() {
						var test = tests[i], fail = false, promise;

                        t = t = (new Date()).getTime();
                        i += 1;

						// if the test exists
						if (test) {
							tryCall(instance, ["Setup", "setup"], test.name);

							promise = test.run();
                            promise.fulfilled(function(value) {
                                testComplete(" (Promise fulfilled with '" + value + "')", true);
                            });
                            promise.smashed(function(message) {
                                testComplete(message ? " (" + message + ")" : "", false);
                            });
						} else {
							log(util.string.format("PASSED: ?", results.passed));
							log(util.string.format("FAILED: ?", results.failed));
							log(util.string.format("TOTAL: ?", (results.passed + results.failed)));

						    rootPromise.fulfill();

							tryCall(instance, ["DestroySuite", "destroySuite", "destroysuite", "Destroy_Suite", "destroy_Suite", "destroy_suite"]);
						}
					}

                    function testComplete(message, passed) {
                        var msg;

                        tryCall(instance, ["Destroy", "destroy"], test.name);

                        if (passed) {
                            results.passed += 1;
                        } else {
                            results.failed += 1;
                        }

                        t = (new Date()).getTime() - t;
                        msg = TEST_MESSAGE + message;
                        log(util.string.format(msg, test.name, passed ? "PASS" : "FAIL", t), passed);

                        runNextTest();
                    }

				    rootPromise = util.promise.create();

					// run the first test
					runNextTest();

					return rootPromise;
				}
			};
		},
		/**
		 * Makes a test from a function.
		 *
		 * @symbol makeTest {Function}
		 * @param name {String} The name of the test.
		 * @param func {Function} The test function.
		 * @throws {Error} If func has more than 0 formal arguments.
		 * @return {Test} The new test.
		 */
		makeTest: function(name, func) {
			if (typeof name !== "string" || !(name instanceof String) || typeof func !== "function" || func.length !== 0) {
				throw new Error("unit.makeTest: Expected name, and a function that takes 0 arguments.");
			}

			return {
				name: name,
				/**
				 * Runs the test and rerturns a promise.
				 */
				run: function() {
					var promise, p, message = "", fail = false;

					// try to run the test
					try {
						p = func();
					} catch (error) {
						fail = true;

						if (!(error instanceof Error)) {
							message = "ERROR:" + error.message;

							if ("stack" in error) {
								message += "    STACK:"  + error.stack;
							}
						} else {
							message = error + "";
						}
					}

                    promise = util.promise.create();

                    if (util.promise.isPromise(p)) {
                        promise.fulfill(p);
                    } else {
                        if (fail) {
                            promise.smash(message);
                        } else {
                            promise.fulfill();
                        }
                    }

                    return promise;
				}
			};
		}
	};
}());