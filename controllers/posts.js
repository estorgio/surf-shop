const Post = require('../models/post');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const { MAPBOX_TOKEN } = process.env;
const geocodingClient = mbxGeocoding({
  accessToken: MAPBOX_TOKEN,
});
const cloudinary = require('cloudinary');
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

module.exports = {
  async postIndex(req, res, next) {
    const posts = await Post.paginate(
      {},
      {
        page: req.query.page || 1,
        limit: 10,
        sort: '-_id',
      },
    );
    posts.page = parseInt(posts.page, 10);
    posts.pages = parseInt(posts.pages, 10);
    res.render('posts/index', { posts, MAPBOX_TOKEN });
  },

  postNew(req, res, next) {
    res.render('posts/new');
  },

  async postCreate(req, res, next) {
    req.body.post.images = [];
    for (const file of req.files) {
      const image = await cloudinary.v2.uploader.upload(file.path);
      req.body.post.images.push({
        url: image.secure_url,
        public_id: image.public_id,
      });
    }
    const { body: match } = await geocodingClient
      .forwardGeocode({
        query: req.body.post.location,
        limit: 1,
      })
      .send();
    req.body.post.geometry = match.features[0].geometry;
    const post = await Post.create(req.body.post);
    post.properties.description = `<strong><a href="/posts/${post._id}">${
      post.title
    }</a></strong><p>${post.location}</p><p>${post.description.substring(
      0,
      20,
    )}...</p>`;
    await post.save();
    req.session.success = 'Post created successfully';
    res.redirect(`/posts/${post.id}`);
  },

  async postShow(req, res, next) {
    res.locals.MAPBOX_TOKEN = MAPBOX_TOKEN;
    const post = await Post.findById(req.params.id).populate({
      path: 'reviews',
      options: {
        sort: { _id: -1 },
      },
      populate: {
        path: 'author',
        model: 'User',
      },
    });
    const floorRating = await post.calculateAvgRating();
    // const floorRating = post.calculateAvgRating();
    res.render('posts/show', { post, floorRating });
  },

  async postEdit(req, res, next) {
    const post = await Post.findById(req.params.id);
    res.render('posts/edit', { post });
  },

  async postUpdate(req, res, next) {
    const { deleteImages } = req.body;
    const post = await Post.findById(req.params.id);
    if (deleteImages && deleteImages.length) {
      for (const public_id of deleteImages) {
        await cloudinary.v2.uploader.destroy(public_id);
        for (const image of post.images) {
          if (image.public_id === public_id) {
            const index = post.images.indexOf(image);
            post.images.splice(index, 1);
          }
        }
      }
    }

    if (req.files) {
      for (const file of req.files) {
        const image = await cloudinary.v2.uploader.upload(file.path);
        post.images.push({
          url: image.secure_url,
          public_id: image.public_id,
        });
      }
    }

    if (req.body.post.location !== post.location) {
      const { body: match } = await geocodingClient
        .forwardGeocode({
          query: req.body.post.location,
          limit: 1,
        })
        .send();
      post.geometry = match.features[0].geometry;
      post.location = req.body.post.location;
    }

    post.title = req.body.post.title;
    post.description = req.body.post.description;
    post.price = req.body.post.price;
    post.properties.description = `<strong><a href="/posts/${post._id}">${
      post.title
    }</a></strong><p>${post.location}</p><p>${post.description.substring(
      0,
      20,
    )}...</p>`;
    await post.save();

    res.redirect(`/posts/${post.id}`);
  },

  async postDestroy(req, res, next) {
    let post = await Post.findById(req.params.id);
    for (const image of post.images) {
      await cloudinary.v2.uploader.destroy(image.public_id);
    }
    await post.remove();
    req.session.success = 'Post deleted successfully';
    res.redirect('/posts');
  },
};
