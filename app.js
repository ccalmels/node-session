const express = require('express');
const uuid = require('uuid/v4');

const app = express();

app.get('/', function(req, res) {
    const unique_id = uuid();
    res.send('Home page with id: ' + unique_id);
})

app.listen(3000, function() {
    console.log('Listening on localhost:3000')
})
