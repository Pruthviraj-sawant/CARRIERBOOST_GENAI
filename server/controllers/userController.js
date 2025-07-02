const Profile = require('../config/Profile');

// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const updateData = req.body;

    const updatedProfile = await Profile.findOneAndUpdate(
      { userId },
      updateData,
      { new: true, upsert: true } // create profile if not exists
    );

    res.json(updatedProfile);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

// Get user profile

// GET user profile
// Get user profile
exports.getProfile = async (req, res) => {
  try {
    let profile = await Profile.findOne({ userId: req.user.id });

    // Auto-create empty profile if not exists
    if (!profile) {
      profile = await Profile.create({
        userId: req.user.id,
        firstName: '',
        lastName: '',
        bio: '',
        country: '',
        college: '',
        degree: '',
        branch: '',
        yearOfGraduation: '',
        leetcode: '',
        github: '',
        codeforces: '',
        codechef: '',
        hackerrank: '',
      });
    }

    res.status(200).json({
      firstName: profile.firstName,
      lastName: profile.lastName,
      bio: profile.bio,
      country: profile.country,
      college: profile.college,
      degree: profile.degree,
      branch: profile.branch,
      yearOfGraduation: profile.yearOfGraduation,
      leetcode: profile.leetcode,
      github: profile.github,
      codeforces: profile.codeforces,
      codechef: profile.codechef,
      hackerrank: profile.hackerrank,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};
