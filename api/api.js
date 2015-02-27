
// Node dependencies
var express         = require("express"),
	bodyParser      = require("body-parser"),
	mongoose        = require("mongoose"),
	User            = require("./models/User.js"),
	jwt             = require("jwt-simple"),
	passport        = require("passport"),
	LocalStrategy   = require("passport-local");

// Node App declaration
var app = express();

// Passport configuration
//app
passport.serializeUser(function(user, done){
	done(null, user.id);
});



// Node app configuration
app
	.use(bodyParser.json())
	.use(function(req, res, next){
		res.header("Access-Control-Allow-Origin", "*");
		res.header("Access-Control-Allow-Method", "GET,PUT,POST,DELETE");
		res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");

		next();
	})
	.use(passport.initialize());

// Strategies


var strategyOptions = {
	usernameField: 'email'
};

var loginStrategy = new LocalStrategy(strategyOptions, function(email, password, done){


	var searchUser = {
		email: email
	};

	User.findOne(searchUser, function(err, user){

		if(err){
			return done(err);
		}

		if(!user){
			return done(null, false, { message: "Wrong email/password." })
		}

		user.comparePasswords(password, function(err, isMatch){
			if(err){
				return done(err);
			}

			if(!isMatch){
				return done(null, false, { message: "Wrong email/password." });
			}

			return done(null, user);
		});
	});

});


var registerStrategy = new LocalStrategy(strategyOptions, function(email, password, done){

	var searchUser = {
		email: email
	};

	User.findOne(searchUser, function(err, user) {

		if (err) {
			return done(err);
		}

		if (user) {
			return done(null, false, {message: "That email address is in use."})
		}

		var newUser = new User({
			email: email,
			password: password
		});

		newUser.save(function(err){
			done(null, newUser)
		});
	});
});

passport.use('local-register', registerStrategy);
passport.use('local-login', loginStrategy);


// REST POSTs
app.post('/register', passport.authenticate('local-register'), function(req, res){
	createSendToken(req.user, res);
});


app.post('/login', passport.authenticate('local-login'), function(req, res){
	createSendToken(req.user, res);
});


function createSendToken(user, res){

	var payload = {
		//iss: req.hostname,
		sub: user.id
	};

	var token = jwt.encode(payload, "tmpsecret");

	res.status(200).send({
		user: user.toJSON(),
		token: token
	});

}


var jobs = [
	'job1',
	'job2',
	'job3'
];

// REST GETs
app.get('/jobs', function(req, res){

	if(!req.headers.authorization){
		res.status('401').send({
			message: "You are not authorized!"
		});
	} else {
		var token = req.headers.authorization.split(' ')[1];
		var payload = jwt.decode(token, "tmpsecret");
		if(!payload.sub)
			res.status(401).send({message: "Authentication failed."});
	}












	res.json(jobs);
});

// Initialize DB
mongoose.connect("mongodb://localhost/psjwt");

//console.log(jwt.encode('hi', 'secret'));

var server = app.listen(3000, function(){
	console.log("App listening on " + server.address().port);
});