// const mongoose = require('mongoose');

// const profileSchema = new mongoose.Schema({
//   userId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true,
//   },
//   firstName: String,
//   lastName: String,
//   bio: String,
//   country: String,

//   college: String,
//   degree: String,
//   branch: String,
//   yearOfGraduation: Number,

//   leetcode: String,
//   codeforces: String,
//   github: String,
//   codechef: String,
//   hackerrank: String,
// });

// const Profile = mongoose.model('Profile', profileSchema);
// module.exports = Profile;
const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  firstName: String,
  lastName: String,
  bio: String,
  country: String,
  college: String,
  degree: String,
  branch: String,
  yearOfGraduation: String,
  leetcode: String,
  github: String,
  codeforces: String,
  codechef: String,
  hackerrank: String,
});

module.exports = mongoose.model('Profile', profileSchema);
