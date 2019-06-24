const passport = require('passport');
const User = require('../models/user');

module.exports = {
  async postRegister(req, res, next) {
    const {
      username,
      password,
      email,
      image
    } = req.body;

    const user = new User({
      username,
      email,
      image,
    });
    await User.register(user, password);
    res.redirect('/');
  },

  postLogin(req, res, next) {
    passport.authenticate('local', {
      successRedirect: '/',
      failureRedirect: '/login',
    })(req, res, next);
  },

  getLogout(req, res, next) {
    req.logout();
    res.redirect('/');
  }
};
