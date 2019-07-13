const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review');
const mongoosePaginate = require('mongoose-paginate');

const PostSchema = new Schema({
  title: String,
  price: String,
  description: String,
  images: [
    {
      url: String,
      public_id: String,
    }
  ],
  location: String,
  coordinates: Array,
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Review',
    },
  ],
  avgRating: { type: Number, default: 0 },
});

PostSchema.pre('remove', async function () {
  await Review.remove({ _id: { $in: this.reviews } });
});

PostSchema.methods.calculateAvgRating = async function () {
  let ratingsTotal = this.reviews.reduce((acc, review) => acc + review.rating, 0);
  this.avgRating = Math.round((ratingsTotal / this.reviews.length || 0) * 10) / 10;
  const floorRating = Math.floor(this.avgRating);
  await this.save();
  return floorRating;
};

PostSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Post', PostSchema);
