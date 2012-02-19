var filed, http, log, url;

http = require('http');

url = require('url');

filed = require('filed');

log = console.log;

module.exports = function(proj) {
  var server;
  if (proj == null) proj = '.';
  server = http.createServer(function(req, resp) {
    var pathname;
    pathname = url.parse(req.url).pathname;
    if (pathname === '/') pathname = '/index.html';
    return filed("" + proj + "/gen" + pathname).pipe(resp);
  });
  return server.listen(3000, function() {
    log('Listening on 3000...');
    return log('CTRL-C to exit..');
  });
};