
var swig = require('swig');
var http = require('http');
var url = require('url');

var broswers = [ 'firefox', 'chrome', 'ie-7-8', 'ie-9-10-11', 'edge' ]

var output = swig.renderFile('./opensearch-template/chrome-splunk.xml', {
        host: 'localhost',
        port: '8000'
});

//console.log(output);


// TODO: Loop through all browsers and render open search provider xml
var testRendering = function () {
    broswers.forEach( function (browser) {
        console.log('----------------------' + browser + '----------------------');
        console.log(renderBrowser('localhost','8000', false, browser));
        renderAndSave('localhost','8000',false, browser);
    });

}

// TODO: Render, using browser to find template xml file
var renderBrowser = function (host, port, https, browser) {
    var file = './opensearch-template/' + browser + '-splunk.xml';
    var output = swig.renderFile(file, {
        host: host,
        port: port,
        https: https
    });

    return output;
}

var render = function (host, port, https) {
}
var renderAndSave = function (host, port, https, browser) {
    var output = renderBrowser(host, port, https, browser);
    var file = '';
    [host, port, https, browser].forEach( function (item) {
        file = filea + item + '-'
    });
    file = file + 'spunk.xml';
    console.log(file);
}


testRendering();
