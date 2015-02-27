// Node Dependencies
var mongoose    = require("mongoose"),
	bcrypt      = require("bcrypt-nodejs");

// Schema
var UserSchema = new mongoose.Schema({
	email: String,
	password: String
});


// Exported methods
UserSchema.methods.toJSON = function(){
	var user = this.toObject();
	delete user.password;
	return user;
};

UserSchema.methods.comparePasswords = function(password, callback){
	bcrypt.compare(password, this.password, callback);
};



// Model Methods
UserSchema.pre('save', function(next){
	var user = this;

	if(!user.isModified('password')) return next;

	bcrypt.genSalt(10, function(err, salt){
		if(err) return next(err);

		bcrypt.hash(user.password, salt, null, function(err, hash){
			if(err) return next(err);

			user.password = hash;
			next();
		});
	});

});


// Module
module.exports = mongoose.model('User', UserSchema);