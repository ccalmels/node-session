const express = require('express');
const session = require('express-session');
const uuid = require('uuid/v4');
const file_store = require('session-file-store')(session);
const body_parser = require('body-parser');

const app = express();

app.use(body_parser.urlencoded({ extended: false }));
app.use(body_parser.json());

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

// login routes
app.get('/login', function(req, res) {
    console.log('/login function ' + req.sessionID);
    res.send(`This is the login page!`);
});

app.post('/login', function(req, res) {
    console.log('/login post');
    console.log(req.body);
    res.send('posted on the login page');
});

app.listen(3000, function() {
    console.log('Listening on localhost:3000')
});
