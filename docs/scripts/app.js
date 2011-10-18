var app = (function(xsl) {
    return {
        run: function() {
            xsl.displayXml("data/symbols.xml", "transform/symbols.xsl", document.getElementById("pane"));
        },
        loadSymbol: function(symbolName) {
            var xmlUrl = "data/" + symbolName.split(".").shift() + ".xml";
            var xslUrl = "transform/symbol.xsl";
            console.log(xmlUrl, xslUrl);
            xsl.displayXml(xmlUrl, xslUrl, document.getElementById("content"));

            //return false;
        }
    };
}(window.xsl));