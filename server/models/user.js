var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var Schema = mongoose.Schema;



var UserSchema = new Schema({
   username: { type: String, trim: true, required: 'Username is required', index: { unique: true}},
   password: { type: String, required: 'Password is required', select: false},
   score: { type: Number, default: 0 },
   mySticker: { type: Schema.Types.ObjectId, ref: "Sticker" },
   foundStickers: [{ type: Schema.Types.ObjectId, ref: "Sticker" }]
});

UserSchema.pre('save', function(next){
   
   var user = this;
   
   if(!user.isModified('password')) return next();
   
   bcrypt.hash(user.password, null, null, function(err, hash){
      if (err) return next(err);
      
      user.password = hash;
      next();
      
   });
   
});

UserSchema.methods.comparePassword = function(password) {
    var user = this;
    
    return bcrypt.compareSync(password, user.password);
}

module.exports = mongoose.model('User', UserSchema);