const BaseComic = require('./base.ts');

const axios = require('axios');

const siteUrl = 'https://swordscomic.com/';

class SwordsComic extends BaseComic {
  constructor() {
    super();
  }

  setDefaultInfo() {
    this.info = {};
    this.info.id = 'swords';
    this.info.name = 'Swords';
    this.info.author = 'Matthew Wills';
    this.info.authorUrl = 'https://swordscomic.com/';
  }

  // Returns a promise to a comic
  static getComicWithId(id) {
    const requestUrl = (id == 'latest') ? siteUrl : `${siteUrl}comic/${id}`;
    return axios.get(requestUrl).then(function (response) {
      if (response.status != 200) {
        console.warn(`http status ${response.status} for ${requestUrl}`);
        return null;
      }
      const comic = new SwordsComic();

      // Data needs to be extracted from meta tags. for whatever reason this won't work with xmldom
      response.data.match(/<meta[^>]*>/g).forEach(element => {
        if (element.includes('og:title')) {
          // Extract title
          comic.name = element.split('"').slice(-2)[0];
        } else if (element.includes('og:image')) {
          // Extract image url
          comic.imageUrl = element.split('"').slice(-2)[0];
        } else if (element.includes('og:url')) {
          // Extract url and id
          comic.url = element.split('"').slice(-2)[0];
          comic.id = comic.url.split('/').slice(-2)[0];
        }
      });

      return comic;
    });
  }

  static getInfo() {
    return new SwordsComic().info;
  }
}

module.exports = SwordsComic;