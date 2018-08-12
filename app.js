let http = require('http');
let fs = require('fs');
let urlParser = require('url').parse;
let nodeServer = require('node-static');
let fileServer = new nodeServer.Server('./static');
let formidable = require("formidable");
let request = require('request');
let ejs = require('ejs');

let server = http.createServer(requestHandler);
server.listen(3000);

function requestHandler(req, res) {
    let url = urlParser(req.url, true);
    switch (url.pathname) {
        case '/':
            sendStartPage(res);
            break;
        case '/translate':
            if (req.method === 'POST') {
                let form = new formidable.IncomingForm();
                form.parse(req, function(err, fields) {
                    let apiKey = 'trnsl.1.1.20160509T202610Z.debc35a9979d7f99.45cb2d4468c993f78dd8f9be935d109d07cc5123';
                    let url = `https://translate.yandex.net/api/v1.5/tr.json/translate?lang=en-ru&key=${apiKey}`;
                    let inputText = fields.text;
                    request({url: url, form: {text: inputText}}, function (error, response, body) {
                        let translateResponse = JSON.parse(body);
                        let outputText = translateResponse.text[0];
                        fs.readFile('./static/views/index.html', (err, data) => {
                            if (err) throw err;
                            let html = ejs.render(data.toString(), {
                                inputText: inputText,
                                outputText: outputText
                            });
                            res.end(html);
                        });
                    });
                });
            }
            if (req.method === 'GET') {
                sendStartPage(res);
            }
            break;
        default:
            fileServer.serve(req, res, function (err) {
                if (err && (err.status === 404)) {
                    fileServer.serveFile('/views/404.html', 404, {}, req, res);
                }
            });
    }
}

function sendStartPage(res) {
    fs.readFile('./static/views/index.html', (err, data) => {
        if (err) throw err;
        let html = ejs.render(data.toString(), {
            inputText: '',
            outputText: ''
        });
        res.end(html);
    });
}
