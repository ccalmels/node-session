const express = require('express');
const session = require('express-session');
const uuid = require('uuid/v4');
const file_store = require('session-file-store')(session);
const body_parser = require('body-parser');
const passport = require('passport');
const passport_local = require('passport-local').Strategy;

const users = [
    { id: '123', email: 'foo@bar.com', password: 'password' }
];

passport.use(new passport_local(
    { usernameField: 'email' },
    function(email, password, done) {
	console.log('in local strategy');

	const user = users[0];
	if (email === user.email && password === user.password) {
	    console.log('local strategy returns true');
	    return done(null, user);
	}
    }));

passport.serializeUser(function(user, done) {
    console.log('in serializeUser');
    done(null, user.id);
});

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

app.use(passport.initialize());
app.use(passport.session());

app.get('/', function(req, res) {
    res.send('Home page with id: ' + req.sessionID);
});

// login routes
app.get('/login', function(req, res) {
    console.log('/login function ' + req.sessionID);
    res.send(`This is the login page!`);
});

app.post('/login', function(req, res, next) {
    console.log('/login post');

    passport.authenticate('local', function(err, user, info) {
	console.log('in authenticate for '
		    + JSON.stringify(req.session.user)
		    + ' with '
		    + JSON.stringify(req.session.passport));
	req.login(user, function(err) {
	    console.log('in login for '
			+ JSON.stringify(req.user)
			+ ' with '
			+ JSON.stringify(req.session.passport));
	    return res.send('you are authenticated');
	})
    })(req, res, next);
});

app.listen(3000, function() {
    console.log('Listening on localhost:3000')
});
