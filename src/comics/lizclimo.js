const BaseComic = require('./base');
const { tumblrInfo } = require('../../config.json');
const axios = require('axios');
const DOMParser = require('xmldom').DOMParser;
const xpath = require('xpath');
var tumblr = require('tumblr.js');
const cheerio = require('cheerio');

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

    static getPost(posts, inputId) {
      if (inputId === 'latest') {
        return posts[0];
      } else if (Number(inputId) < 0 && Number(inputId) > -21) {
        return posts[-Number(inputId)];
      } else if (Number(inputId) > -21) {
        return null;
      } else {
        return posts.find(({ id }) => id === inputId);
      }
    }

    static async getLatestId(n) {
      const posts = await new Promise ((res, rej ) => client.blogPosts('lizclimo.tumblr.com', (err, data) =>
        err ? rej(err) : res(data.posts)
      ));
      return posts[n || 0].id;
    }

    // Returns a promise to a comic
    static getComicWithId(id) {
        return new Promise(async function(resolve, reject) {
            try {
                // const requestUrl = `${siteUrl}post/${parsedId}`;
                client.blogPosts('lizclimo.tumblr.com',  {type: 'photo' }, (err, data) => {
                  if (err) {
                    throw(`Error getting blog: ${err}`)
                  }

                  const comic = new LizComic();
                  const post = LizComic.getPost(data.posts, id);
                  if (!post) {
                    throw(`No post found matching for id ${id}`)
                  }
                  const firstPhotoUrl = post.photos[0].alt_sizes[1].url;
                  comic.imageUrl = firstPhotoUrl;
                  comic.name = post.summary;
                  comic.url = post.post_url;
                  comic.id = post.id;
                  // comic.bonusUrl = undefined;
                  resolve(comic);

                });
            } catch (error) {
                reject(error);
            }
        });
    }

    static getInfo() {
        return new LizComic().info;
    }
}

module.exports = LizComic;