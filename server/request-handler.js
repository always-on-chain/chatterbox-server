
var results = [];
var defaultCorsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10, // Seconds.
  // 'Content-Type': 'application/json'
};

var requestHandler = function(request, response) {

  console.log('Serving request type ' + request.method + ' for url ' + request.url);
  // The outgoing status.
  var body;
  var statusCode;
  var headers = defaultCorsHeaders;
  headers['Content-Type'] = 'application/json';

  
  if (request.method === 'GET') {
    statusCode = 200;
    
    var responseBody = {};
    responseBody.results = results;
    body = responseBody;
  }

  if (request.method === 'OPTIONS') {
    statusCode = 200;
    var responseBody = {};
    responseBody.results = null;
    body = responseBody;
  }
    
  if (request.url === '/classes/messages' || request.url === '/classes/room') {
    if (request.method === 'POST') {
      statusCode = 201;
      var body = '';
      
      request.on('data', (data) => {
        body += data.toString();
        console.log(body);
      });
      
      request.on('end', () => {
        results.push(JSON.parse(body));
      });
    }
  }

  if (request.url !== '/classes/messages') {
    statusCode = 404;
  }
  
  response.writeHead(statusCode, headers);

  response.end(JSON.stringify(body));
};


exports.requestHandler = requestHandler;