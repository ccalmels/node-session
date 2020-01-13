const express = require('express');
const session = require('express-session');
const uuid = require('uuid/v4');
const file_store = require('session-file-store')(session);

const app = express();

app.use(session({
    genid: function(req) {
	console.log('in genid with id: ' + req.sessionID);
	return uuid();
    },
    store: new file_store(),
    secret: 'some secret',
    resave: false,
    saveUninitialized: true
}));

app.get('/', function(req, res) {
    res.send('Home page with id: ' + req.sessionID);
});

app.listen(3000, function() {
    console.log('Listening on localhost:3000')
});
