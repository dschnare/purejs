var xsl = (function(window, document) {
    var cache = {};

    function createSimplePromise() {
        var status = "unresolved", response, complete = [], error = [];

        return {
            resolve: function(status, value) {
                response = value;
                status = status;

                var callbacks = status === "successful" ? complete : error;
                while (callbacks.length) {
                    callbacks.shift()(response);
                }
            },
            complete: function(fn) {
                if (typeof fn === "function") {
                    if (status !== "unresolved") {
                        fn(response);
                    } else {
                        complete.push(fn);
                    }
                }

                return this;
            },
            error: function(fn) {
                if (typeof fn === "function") {
                    if (status !== "unresolved") {
                        fn(response);
                    } else {
                        error.push(fn);
                    }
                }

                return this;
            },
            promise: function() {
                return {
                    complete: this.complete,
                    error: this.error
                };
            }
        };
    }

    function loadXml(url) {
        var promise;

        promise = createSimplePromise();

        if (url in cache) {
            promise.resolve("successful", cache[url]);
            return promise.promise();
        }

        try {
            xhttp = new XMLHttpRequest();
        } catch (error) {
            xhttp = new ActiveXObject("Microsoft.XMLHTTP");
        }

        xhttp.onreadystatechange = function() {
            if (xhttp.readyState === 4) {
                if (xhttp.status === 200 || xhttp.status === 304) {
                    promise.resolve("successful", cache[url] = xhttp.responseXML);
                } else {
                    promise.resolve("error", xhttp.status);
                }
            }
        };

        xhttp.open("GET", url, true);
        xhttp.setRequestHeader("Content-Type", "application/x-www-form-encoded");
        xhttp.send(null);

        return promise.promise();
    }

    function transformXml(xml, xsl, element) {
        // code for Mozilla, Firefox, Opera, etc.
        try {
            var xsltProcessor = new XSLTProcessor();
            xsltProcessor.importStylesheet(xsl);
            var resultDocument = xsltProcessor.transformToFragment(xml, document);

            while (element.hasChildNodes()) {
                element.removeChild(element.firstChild);
            }

            element.appendChild(resultDocument);
        // code for IE
        } catch (error) {
            var ex = xml.transformNode(xsl);
            element.innerHTML = ex;
        }
    }

    return {
        displayXml: function(xmlUrl, xslUrl, targetElement) {
            var promise;

            promise = createSimplePromise();

            loadXml(xmlUrl).complete(function(xml) {
                loadXml(xslUrl).complete(function(xsl) {
                    transformXml(xml, xsl, targetElement);
                    promise.resolve("successful", targetElement);
                }).error(function(status) {
                    promise.resolve("error", status);
                });
            }).error(function(status) {
                promise.resolve("error", status);
            });

            return promise.promise();
        }
    };
}(window, document));