let http = require('http');
let fs = require('fs');
let urlParser = require('url').parse;
let nodeServer = require('node-static');
let fileServer = new nodeServer.Server('./static');


let server = http.createServer(requestHandler);
server.listen(3000);

function requestHandler(req, res) {
    let url = urlParser(req.url, true);
    switch (url.pathname) {
        case '/':
            fileServer.serveFile('/views/index.html', 200, {}, req, res);
            break;
        default:
            fileServer.serve(req, res, function (err) {
                if (err && (err.status === 404)) {
                    fileServer.serveFile('/views/404.html', 404, {}, req, res);
                }
            });
    }
}
