
var swig = require('swig');
var http = require('http');
var url = require('url');


var output = swig.renderFile('./opensearch-template/chrome-splunk.xml', {
        host: 'localhost',
        port: '8000'
});

console.log(output);


// TODO: Loop through all browsers and render open search provider xml
var testRendering = function () {

}

// TODO: Render, using browser to find template xml file
var renderBrowser = function (host, port, https, browser) {

}
