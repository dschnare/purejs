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
var window, unit;
if (!window) window = {};

unit  = (function(window) {
    var utill, Array, Object, TEST_MESSAGE, console, AssertionError;

    Array = ([]).constructor;
    Object = ({}).constructor;
    TEST_MESSAGE = "{0} .......................................... [{1}ms]";

    ///////////////////////
    // Utility Functions //
    ///////////////////////

    util = {
        string: {
            format: function(string /*, ... */) {
                var arg, i, a,   len;

                string += '';
                a = Array.prototype.slice.call(arguments, 1);
                len = a.length;

                if (arguments.length === 2 && ({}).toString.call(a[1]) === "[object Array]") {
                    a = arguments[1];
                    len = a.length;
                }

                for (i = 0; i < len; i++) {
                    arg = a[i];
                    string = string.replace(new RegExp('\\{' + i + '\\}', 'g'), arg + '');
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

                    if (!o) return false;

                    for (i = 1; i < len; i++) {
                        if (typeof o[args[i]] !== func) return false;
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

        div.style.border = "1px solid black";
        div.style.padding = "5px";
        div.style.marginBottom = "5px";
        div.style.margin = "10px";

        styles = {
            normal: {
                color: "black"
            },
            heading: {
                fontWeight: "bold",
                borderBottomStyle: "solid",
                borderBottomWidth: "1px",
                marginBottom: "10px",
                marginTop: "10px",
                color: "black"
            },
            error: {
                fontWeight: "bold",
                color: "red"
            },
            fail: {
                fontWeight: "bold",
                color: "red"
            },
            success: {
                fontWeight: "bold",
                color: "green"
            },
            pass: {
                fontWeight: "bold",
                color: "green"
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
            show: function() {
                if (!div.parentNode) {
                    var body = document.getElementsByTagName("body")[0];

                    if (body) {
                        body.appendChild(div);
                    }
                }
            },
            hide: function() {
                if (div.parentNode) {
                    div.parentNode.removeChild(div);
                }
            },
            /**
             * Sets the style of a message type.
             *
             * @param messageType {String} The message type to style (normal|heading|error|fail|success|pass).
             * @param style {Object} The CSS class name as a string or a CSS style object.
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
             * @param child {HTMLElement} The document element to append to the console.
             * @param messageType {String} The message type to style the child with.
             */
            appendChild:function(child, messageType) {
                if (child && child.parentNode !== div) {
                    applyStyle(messageType, child);
                    div.appendChild(child);

                    this.show();
                }
            },
            /**
             * Appends the specified text to the console styled with the specified style.
             * If no style can be found then the "normal" style is used.
             *
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
             * @param text {String} The text to append to the console.
             */
            normal:function(text) {
                this.trace(text, "normal");
            },
            /**
             * Appends "heading" styled text to the console.
             *
             * @param text {String} The text to append to the console.
             */
            heading:function(text) {
                this.trace(text, "heading");
            },
            /**
             * Appends "error" styled text to the console.
             *
             * @param text {String} The text to append to the console.
             */
            error:function(text) {
                this.trace("ERROR: " + text, "error");
            },
            /**
             * Appends "fail" styled text to the console.
             *
             * @param text {String} The text to append to the console.
             */
            fail:function(text) {
                this.trace("FAIL: " + text, "fail");
            },
            /**
             * Appends "success" styled text to the console.
             *
             * @param text {String} The text to append to the console.
             */
            success:function(text) {
                this.trace("SUCCESS: " + text, "success");
            },
            /**
             * Appends "pass" styled text to the console.
             *
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

    function AssertionError(message) {
        if (!(this instanceof AssertionError)) {
            return new AssertionError(message);
        }

        this.message = message;
        this.toString = function() {
            return this.message;
        };
    }

    function error(message) {
		throw new AssertionError("Test failed: " + message);
	}

	function log(message, passed) {
		if (typeof unit.log === "function") {
			unit.log(message, passed);
		}
	}

    function setupSuite(suite) {
        if (typeof suite.setupSuite === "function") suite.setupSuite();
    }
    function setupTest(suite, testName) {
        var testName = "setup" + testName.charAt(0).toUpperCase() + testName.substring(1);
        if (typeof suite[testName] === "function") suite[testName]();
    }
    function destroyTest(suite, testName) {
        var testName = "destroy" + testName.charAt(0).toUpperCase() + testName.substring(1);
        if (typeof suite[testName] === "function") suite[testName]();
    }
    function destroySuite(suite) {
        if (typeof suite.destroySuite === "function") suite.destroySuite();
    }

	return {
        util: util,
        console: console,
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
					message += "PASS: ";
				} else if (passed === false) {
					message += "FAIL: ";
				}
				try {
					document.writeln(message);
				} catch (ignore) {}
			}

            if (window.console && typeof window.console.log === "function") {
                window.console.log(message);
            }
		},
		/**
		 * Forcefully fail the currently exectuing test.
		 */
		fail: function(message) {
			throw new AssertError("Fail: " + message);
		},
        expect: function(message, value) {
            if (!value) {
                error("Expected " + message || util.string.format("Expected '{0}' to be true.", value));
            }
        },
        expectToThrow: function(message, fn) {
            try {
                fn();
                error("Expected " + message || "Expected function to throw an error.");
            } catch (ignore) {}
        },
        dontExpect: function(message, value) {
            if (value) {
                error("Did not expect " + message || util.string.format("Did not expect '{0}' to be true.", value));
            }
        },
        dontExpectToThrow: function(message, fn) {
            try {
                fn();
            } catch (ignore) {
                error("Did not expect " + message || "Did not expect function to throw an error.");
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
                    m = p.toLowerCase();

					if (m.indexOf("setup") !== 0 && m.indexOf("destroy") !== 0) {
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
                    setupSuite(instance);

					console.heading(name);

					var test, i = 0, t, len = tests.length, results, rootPromise;

                    results = {total:0, passed:0, failed:0};

					function runNextTest() {
						var promise;

                        test = tests[i];
                        t = t = (new Date()).getTime();
                        i += 1;

						// if the test exists
						if (test) {
                            setupTest(instance, test.name);

							promise = test.run();
                            promise.fulfilled(function(value) {
                                testComplete();
                            });
                            promise.smashed(function(message) {
                                testComplete(message ? " (" + message + ")" : "");
                            });
						} else {
							log(util.string.format("PASSED: {0}", results.passed));
							log(util.string.format("FAILED: {0}", results.failed));
							log(util.string.format("TOTAL: {0}", (results.passed + results.failed)));

						    rootPromise.fulfill();

                            destroySuite(instance);
						}
					}

                    function testComplete(message) {
                        var msg;

                        t = (new Date()).getTime() - t;
                        msg = TEST_MESSAGE;

                        if (message) {
                            results.failed += 1;
                            msg += message;
                            log(util.string.format(msg, test.name, t), false);
                        } else {
                            results.passed += 1;
                            log(util.string.format(msg, test.name, t), true);
                        }

                        destroyTest(instance, test.name);

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
			if (!(typeof name === "string" || !(name instanceof String)) ||
                typeof func !== "function" || func.length !== 0) {
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

						if (error instanceof Error) {
							message = error.message;

							if (!(error instanceof AssertionError) && "stack" in error) {
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
}(window));