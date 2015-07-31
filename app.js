
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
var renderBrowser = function (params) {
    var file = __dirname + '/opensearch-template/' + params.browser + '-splunk.xml';
    var output = swig.renderFile(file, {
        host: params.host,
        port: paramas.port,
        https: paramas.https
    });

    callback(output);
}

var renderAndSave = function (params, callback) {
    renderBrowser(params, function(output) {
        var file = '';
        params.forEach( function (item) {
            // GUID?
            file = file + item + '-'
        });
        file = file + 'splunk.xml';
        var filepath = '/opensearch-generated/' + file;

        fs.writeFile(__dirname + '/opensearch-generated/' + file,
                    output,
                    function (err) {
                        if (err) throw err;
                        console.log(file + ' saved!');
                        callback(filepath);
                    }
        );
    });
}

var renderDisplay = function (filepath, javascriptAdd) {
    var output = swig.renderFile(__dirname + '/template/addsearchprovider.html', {
        filepath: filepath,
        javascriptAdd: javascriptAdd
    });

    return output;
}

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
       	renderAndSave(params, function (filepath) {
        	res.render('addsearchprovider', {filepath: filepath, javascriptAdd: true})
		});
    });
});

var server = app.listen(3000, function () {

});
