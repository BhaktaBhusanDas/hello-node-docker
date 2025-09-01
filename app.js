const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
    res.send('<h1>Hello world from dockerized Node.js App Version: 2.6(Updated the Docker file to install curl command.)</h1>');

});

app.listen(port, () => {
    console.log(`App listning at http:localhost:${port}`);
});