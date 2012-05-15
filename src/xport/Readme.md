# Exporting

This module exports a function that can be used to export symbols for the Closure Compiler. Without an export function of some kind (or process for export), the Closure Compiler will rename variable names when compiled with `--compilation_level ADVANCED_OPTIMIZATIONS` turned on.

 Export a function on the `window` object.

	xport('myFunc', myFunction);

Export an object chain to the `window` object, where each link in the chain will have an object created automatically if none exists.

	xport('myNamespace.myFunc', myFunc);

This will produce the property `window.myNamespace.myFunc` equal to `myFunc`.

Export a function to another object.

	xport('myFunc', myFunc, myOtherScope);

This will produce the property `myOtherScope.myFunc` equal to `myFunc`.

# Module Export

This module also provides a mechanism to export a module using either AMD or CommonJS. If no module system
is present then will call the fallback callback. See the source for complete documentation.

With dependencies

    xport.module(['dep1', 'jquery', 'dep2'], moduleFn, function () {
        // This is our fallback
        xport('MODULE', moduleFn(DEP1, jQuery, DEP2));
    });

Without dependencies

    xport.module(moduleFn, function () {
        // This is our fallback
        xport('MODULE', moduleFn());
    });

Without dependencies

    xport.module(someObject, function () {
        // This is our fallback
        xport('MODULE', someObject);
    });