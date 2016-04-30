var User = require('../models/user');
var Sticker = require('../models/sticker');
var config = require('../../config');

var secretKey = config.secretKey;

module.exports = function(app, express){
	var api = express.Router();
	api.post('/signup', function(req, res){
		var user = new User({
			username: req.body.username,
			password: req.body.password
		});
		user.save(function(err){
			if (err){
				console.log(err);
				res.send(err);
				return;
			}  else {
				res.json({
					success: true,
					message: "User has been created!"
				});
			}
		});
	});
	api.post('login', function(req, res){
		User.findOne({
			username: req.body.username
		}).select('username password').exec(function(err, user) {
			if(err) throw err;

			if (!user){
				res.send({ message: "User doesn't exist"});
			} else {
				var validPassword = user.comparePassword(req.body.password);

				if (!validPassword){
					res.send({ message: "Invalid Password "})
				} else {
					res.json({
						success: true,
						message: "Successfully login!"
					});
				}
			}
		});
	});
	return api;
}