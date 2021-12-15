const BaseComic = require('./base');

const axios = require('axios');
const DOMParser = require('xmldom').DOMParser;
const xpath = require('xpath');
const cheerio = require('cheerio');

const siteUrl = 'https://www.exocomics.com/';

class ExoComic extends BaseComic {
  constructor() {
    super();
  }

  setDefaultInfo() {
    this.info = {};
    this.info.id = 'exo';
    this.info.name = 'Extra Ordinary';
    this.info.author = 'Li Chen';
    this.info.authorUrl = 'https://www.exocomics.com/';
  }

  // Returns a promise to a comic
  static getComicWithId(id) {
    const requestUrl = (id == 'latest') ? siteUrl : `${siteUrl}${id}`;
    return axios.get(requestUrl).then(function (response) {
      if (response.status != 200) {
        console.warn(`http status ${response.status} for ${requestUrl}`);
        return null;
      }

      const comic = new ExoComic();

      // Fetch comic data from response
      const doc = new DOMParser({ errorHandler: { warning: null } }).parseFromString(response.data);
      const select = xpath.useNamespaces({ 'html': 'http://www.w3.org/1999/xhtml' });
      const imageNode = select('//*[@class=\'image-style-main-comic\']', doc)[0];

      const $ = cheerio.load(response.data);
      const imageNode2 = $('.image-style-main-comic')[0];
      if (!imageNode2) {
          return null;
      }
      // Image url
      comic.imageUrl = imageNode2.attribs.src;

      // Comic id
      comic.id = imageNode2.attribs['alt'];

      // Comic title
      const title = imageNode2.attribs['title'];
      comic.name = title == '' ? comic.id : title;

      // Comic url
      comic.url = siteUrl + comic.id;

      return comic;
    });
  }

  static getInfo() {
    return new ExoComic().info;
  }
}

module.exports = ExoComic;