const passport = require('passport');
const User = require('../models/user');
const Post = require('../models/post');

const { MAPBOX_TOKEN } = process.env;

module.exports = {
  async landingPage(req, res, next) {
    const posts = await Post.find({});
    res.render('index', { posts, MAPBOX_TOKEN, title: 'Surf Shop - Home' });
  },

  async postRegister(req, res, next) {
    const { username, password, email, image } = req.body;

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
  },
};
