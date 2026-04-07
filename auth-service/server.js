const http = require('http');

const server = http.createServer((req, res) => {
    if (req.url === '/health') {
        res.writeHead(200);
        res.end(JSON.stringify({ status: 'auth is up' }));
    } else if (req.url === '/verify') {
        // Simulating a token verification
        res.writeHead(200);
        res.end(JSON.stringify({ authorized: true, user: 'admin' }));
    } else {
        res.writeHead(404);
        res.end();
    }
});

server.listen(3000, () => {
    console.log('Auth service running on port 3000');
});