const http = require('http'),
  httpProxy = require('http-proxy');

const proxy = httpProxy.createProxyServer({});

let enableCors = function(req, res) {
	if (req.headers['access-control-request-method']) {
		res.setHeader('access-control-allow-methods', req.headers['access-control-request-method']);
	}

	if (req.headers['access-control-request-headers']) {
		res.setHeader('access-control-allow-headers', req.headers['access-control-request-headers']);
	}

	if (req.headers.origin) {
		res.setHeader('access-control-allow-origin', req.headers.origin);
		res.setHeader('access-control-allow-credentials', 'true');
	}
};

proxy.on("proxyRes", function(proxyRes, req, res) {
	enableCors(req, res);
});
const server = http.createServer(function (request, res) {
  const {headers, method, url} = request;
  if (request.method === 'OPTIONS') {
    enableCors(request, res);
    res.writeHead(200);
    res.end();
    return;
  }
  console.log(method, url, headers);
  let body = [];
  request.on('error', (err) => {
    console.error(err);
  }).on('data', (chunk) => {
    console.log('data');
    body.push(chunk);
  }).on('end', () => {
    body = Buffer.concat(body).toString();
    console.log('body', body);
  });

  proxy.web(request, res, {
    changeOrigin: true,
    secure: true,
    cookieDomainRewrite: 'localhost',
    target: 'https://fairos.fairdatasociety.org'
  });
});

console.log("listening on port 5050")
server.listen(5050);