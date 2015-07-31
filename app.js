
var swig = require('swig');
var http = require('http');
var url = require('url');
var fs = require('fs');
var querystring = require('querystring');
var express = require('express');
var app = express();

app.engine('html', swig.renderFile);
app.set('view engine', 'html');
app.set('views', __dirname + '/template');

app.use('/opensearch-generated', express.static('opensearch-generated'));

var broswers = [ 'firefox', 'chrome', 'ie-7-8', 'ie-9-10-11', 'edge' ]


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

var renderAndSave = function (host, port, https, browser) {
    var output = renderBrowser(host, port, https, browser);
    var file = '';
    [host, port, https, browser].forEach( function (item) {
        file = file + item + '-'
    });
    file = file + 'spunk.xml';
    var filepath = './opensearch-generated/' + file;

    fs.writeFile('./opensearch-generated/' + file,
                renderBrowser(host, port, https, browser),
                function (err) {
                    if (err) throw err;
                    console.log(file + ' saved!');
                }
    );

    return filepath;
}


//testRendering();


var renderDisplay = function (filepath, javascriptAdd) {
    var output = swig.renderFile('./template/addsearchprovider.html', {
        filepath: filepath,
        javascriptAdd: javascriptAdd
    });

    return output;
}

var server = http.createServer(function (request, response) {

    var fullBody = '';

    request.on('data', function (data ) {
        fullBody += data.toString();
    });

    request.on('end', function() {
        console.log(fullBody);
        var params = querystring.parse(fullBody);
        var filepath = renderAndSave(params.host, params.port, params.https, params.browser);
        response.writeHeader(200, {"Content-Type": "text/html"});
        response.write(renderDisplay(filepath));
        response.end();
    });
    // var params = request.body;
    // var filepath = renderAndSave(params.host, params.port, params.https, params.browser);
    // TODO: return a response with a link to a page with the xml file in a link tag and/or window.external.addSearchProvider()
    // response.writeHeader(200, {"Content-Type": "text/html"});
    // response.write(renderDisplay(filepath));
    // response.end();
});

app.get('/', function (req, res) {
    console.log("test");
    res.render('index', {filepath: "test", javascriptAdd: false });
});

app.post('/post', function (req, res) {
    var fullBody = '';

    req.on('data', function (data ) {
        fullBody += data.toString();
    });

    req.on('end', function() {
        console.log(fullBody);
        var params = querystring.parse(fullBody);
        var filepath = renderAndSave(params.host, params.port, params.https, params.browser);
        res.render('addsearchprovider', {filepath: filepath, javascriptAdd: true})
    });
});

var server = app.listen(3000, function () {

});
