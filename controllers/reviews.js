const Post = require('../models/post');
const Review = require('../models/review');

module.exports = {
  async reviewCreate(req, res, next) {
    const post = await Post.findById(req.params.id)
      .populate('reviews');
    const haveReviewed = post.reviews.find(review => review.author.equals(req.user._id));

    if (haveReviewed) {
      req.session.error = 'Sorry, you can only post a review once';
      return res.redirect(`/posts/${post.id}/`);
    }

    req.body.review.author = req.user._id;
    const review = await Review.create(req.body.review);
    post.reviews.push(review);
    await post.save();
    req.session.success = 'Review created successfully';
    res.redirect(`/posts/${post.id}/`);
  },

  async reviewUpdate(req, res, next) {
    await Review
      .findByIdAndUpdate(req.params.review_id, req.body.review);
    req.session.success = 'Review updated successfully!';
    res.redirect(`/posts/${req.params.id}/`);
  },

  async reviewDestroy(req, res, next) {
    await Post.findByIdAndUpdate(req.params.id, {
      $pull: { reviews: req.params.review_id }
    });
    await Review.findByIdAndRemove(req.params.review_id);
    req.session.success = 'Review successfully deleted';
    res.redirect(`/posts/${req.params.id}/`);
  }
};
