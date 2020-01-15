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
	const user = users[0];
	if (email === user.email && password === user.password) {
	    return done(null, user);
	}

	return done(null, false, { message: 'Invalid credentials.\n' });
    }));

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    const user = users[0].id === id ? users[0]: false;
    done(null, user);
});

const app = express();

app.set('view engine', 'pug');
app.use(body_parser.urlencoded({ extended: false }));
app.use(body_parser.json());

app.use(session({
    genid: function(req) {
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
    res.render('index');
});

app.post('/login',
	 passport.authenticate('local',
			       { successRedirect: '/authorized',
				 failureRedirect: '/' }));

app.all('/*', function(req, res, next) {
    if (req.isAuthenticated()) {
	next();
    } else {
	res.redirect('/');
    }
});

app.get('/authorized', function(req, res) {
    res.send('it is ok Mr. ' + req.user.email);
});

app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

app.listen(3000, function() {
    console.log('Listening on localhost:3000')
});
