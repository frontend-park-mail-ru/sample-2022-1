const http = require('http');
const fs = require('fs');

const SERVER_PORT = 3000;

const server = http.createServer((req, res) => {
    const {url} = req;
    console.log('request', url);

    const fileName = url === '/' ? '/index.html' : url;


    fs.readFile(`${__dirname}/..${fileName}`, (err, file) => {
        if (err) {
            console.log(`error`);
            res.write('404 not found');
            res.end();
            return;
        }


        res.write(file);
        res.end();
    });
});



server.listen(SERVER_PORT);
