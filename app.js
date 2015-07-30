
var swig = require('swig');
var http = require('http');
var url = require('url');


var output = swig.renderFile('./opensearch-template/chrome-splunk.xml', {
        host: 'localhost',
        port: '8000'
});

console.log(output);
