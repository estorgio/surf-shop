const faker = require('faker');
const Post = require('./models/post');

async function seedPosts() {
  await Post.remove({});

  for (const i of new Array(40)) {
    const post = {
      title: faker.lorem.word(),
      description: faker.lorem.text(),
      author: {
        '_id': '5d20b10621308a2cc0926eac',
        'username': 'john',
      }
    };

    await Post.create(post);
  }

  console.log('40 new posts created');
}

module.exports = seedPosts;
