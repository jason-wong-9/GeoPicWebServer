var User = require('../models/user');
var Sticker = require('../models/sticker');
var config = require('../../config');

var secretKey = config.secretKey;


function generateToken (user) {
	console.log(user.username);
	var token = user.username;
	return token;
}

// function getRandomInt(min, max) {
//     return Math.floor(Math.random() * (max - min + 1)) + min;
// }
function incrementScore(id, isFound){
	User.findOne({ _id: id }, function(err, user){
		if (err){
			res.send(err);
			return;
		} else {
			if (isFound){
				user.foundStickerScore += 1;
			} else {
				user.userStickerScore += 1;
			}
			user.save(function(err, updatedUser){
				console.log("user updated");
			});
		}
	});
}

module.exports = function(app, express){
	var api = express.Router();
	api.post('/signup', function(req, res){
		var user = new User({
			username: req.body.username,
			password: req.body.password,
			avatar: req.body.avatar
		});
		var token = generateToken(user);
		console.log(user);
		user.save(function(err){
			if (err){
				console.log(err);
				res.send(err);
				return;
			}  else {
				res.json({
					success: true,
					message: "User has been created!",
					token: token
				});
			}
		});
	});

	api.post('/login', function(req, res){
		User.findOne({
			username: req.body.username
		}).select('username password score').exec(function(err, user) {
			if(err) throw err;

			if (!user){
				res.send({ message: "User doesn't exist"});
			} else {
				var validPassword = user.comparePassword(req.body.password);

				if (!validPassword){
					res.send({ message: "Invalid Password "})
				} else {
					console.log(user);
					var token = generateToken(user);

					res.json({
						success: true,
						message: "Successfully login!", 
						token: token
					});
				}
			}
		});
	});

	api.use(function(req, res, next){
        console.log("Checking for token");
        var token = req.body.token || req.param('token') || req.headers['x-access-token'];
        console.log(token);
        // check if token exist
        if(token) {
            User.findOne({
            	username: token
            }).select('username password foundStickerScore userStickerScore').exec(function(err, user) {
            	if (err) throw err;
            	if (!user){
            		res.send({ message: "User doesn't exist" });
            	} else {
                    req.decoded = user;
            		next();
            	}
            })

        } else {
            res.status(403).send({ success: false, message: "No Token Provided" });
        }
    });

	api.get('/me', function(req, res){
		res.json(req.decoded);
	});
	api.post('/upload', function(req, res){
		//var riddles = ["Under a chair in Pauley Pavillion", "Under a table in Pauley Pavillion", "Somewhere close to the stairs in Pauley Pavillion"];
		//var index = getRandomInt(0, 2);
		var sticker = new Sticker({
			 link: req.body.link,
			 creator: req.decoded.id,
			 riddle: req.body.riddle
		});
		sticker.save(function(err, newSticker){
			if (err){
				res.send(err);
				return;
			} else {
				res.json({
					success: true,
					message: "My Sticker Uploaded"
				});
			}
		})
	});
	api.post('/connect', function(req, res){
		var currentUserId = req.decoded.id;
		var ownerTag = req.body.tagid;
		var success = true;
		console.log(ownerTag);
		Sticker.findOne({ 
			creator: ownerTag
		}, function(err, sticker){
			if (err){
				res.send(err);
			} else {
				console.log(sticker);
				if (!sticker.found){
					sticker.found = [];
				}

					

				if (sticker.found.indexOf(currentUserId) === -1){
					sticker.found.push(currentUserId);
					incrementScore(currentUserId, 1);
					incrementScore(ownerTag, 0);
					sticker.save(function(err){
						if (err){
							console.log(err);
						} else {
							res.json({
								success: true,
								message: "Added"
							});
						}
					});
				} else {
					res. json({
						success: false,
						message: "Already Added"
					})
				}
			}


	
		});
	});

	return api;
}