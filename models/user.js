const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { randomBytes, createHmac } = require('crypto'); 
const { createTokenForUser } = require('../middlewares/auth');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    address: { type: String },
    role: {
      type: String,
      enum: ['Admin', 'Developer', 'Tester', 'Manager'],
      default: 'Developer',
    },
    socialMedia: { type: String, default: '' },
    profilePicture: { type: String },
    skills: [String],
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Hide password
userSchema.pre('save', async function (next) {
  const user = this;

  if (!user.isModified('password')) return next(); 

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  next();
});

//  generate a token
userSchema.statics.matchPasswordAndGenerateToken = async function (
  email,
  password
) {
  const user = await this.findOne({ email });
  if (!user) throw Error('User Not Found');

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error('Incorrect Password');

  const token = createTokenForUser(user);
  return token;
};

const User = mongoose.model('User', userSchema);
module.exports = User;
