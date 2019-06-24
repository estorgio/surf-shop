const User = require('../models/user');

module.exports = {
  postRegister(req, res, next) {
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

    User.register(user, password, (err) => {
      if (err) {
        console.log('error while user register', err);
        return next(err);
      }
      console.log('user registered!');
      return res.redirect('/');
    });
  }
};
