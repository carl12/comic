const BaseComic = require('./base');
const { tumblrInfo } = require('../../config.json');
const axios = require('axios');
const DOMParser = require('xmldom').DOMParser;
const xpath = require('xpath');
var tumblr = require('tumblr.js');

var client = tumblr.createClient(tumblrInfo);


const siteUrl = 'https://lizclimo.tumblr.com/';

class LizComic extends BaseComic {
  constructor() {
    super();
  }

  setDefaultInfo() {
    this.info = {};
    this.info.id = 'lizclimo';
    this.info.name = 'Hi, I\'m Liz';
    this.info.author = 'Liz Climo';
    this.info.authorUrl = 'https://lizclimo.tumblr.com/';
  }

  addInfo({ imageUrl, name, url, id }) {
    this.imageUrl = imageUrl;
    this.name = name;
    this.url = url;
    this.id = id;
  }

  static async getLatestId(n) {
    const posts = await new Promise((res, rej) => client.blogPosts('lizclimo.tumblr.com', (err, data) =>
      err ? rej(err) : res(data.posts)
    ));
    return posts[n || 0].id;
  }

  static isAbsoluteId(id) {
    return !id === 'latest' && Number(id) <= 0;
  }

  // Returns a promise to a comic
  static getComicWithId(id) {
    // const requestUrl = `${siteUrl}post/${parsedId}`;
    const options = { type: 'photo', limit: 1 };
    if (LizComic.isAbsoluteId(id)) {
      options.id = id;
    } else {
      options.offset = -Number(id);
    }
    return new Promise(async function (resolve, reject) {
      client.blogPosts('lizclimo.tumblr.com', options, (err, data) => {
        if (err) {
          reject(`Error getting blog: ${err}`)
        }

        const comic = new LizComic();
        const post = data?.posts[0];
        if (!post) {
          throw (`No post found matching for id ${id}`)
        }
        const firstPhotoUrl = post.photos[0].alt_sizes[1].url;
        comic.addInfo({
          imageUrl: firstPhotoUrl,
          name: post.summary,
          url: post.post_url,
          id: post.id
        });
        // comic.bonusUrl = undefined;
        resolve(comic);
      });
    });
  }

  static getInfo() {
    return new LizComic().info;
  }
}

module.exports = LizComic;