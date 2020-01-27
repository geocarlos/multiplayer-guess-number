const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) => {
    const page = fs.readFileSync(__dirname + '/index.html');
    res.end(page)
})

server.listen(3000, () => console.log('Server listening on port ', 3000));