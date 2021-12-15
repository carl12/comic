const BaseComic = require('./base');

const axios = require('axios');
const DOMParser = require('xmldom').DOMParser;
const xpath = require('xpath');

const siteUrl = 'http://www.white-noise-comic.com/';

class WhiteNoiseComic extends BaseComic {
  constructor() {
    super();
  }

  setDefaultInfo() {
    this.info = {};
    this.info.id = 'whitenoise';
    this.info.name = 'White Noise';
    this.info.author = 'Adrian Lee';
    this.info.authorUrl = 'http://www.white-noise-comic.com/';
  }

  // Returns a promise to a comic
  static getComicWithId(id) {
    const requestUrl = (id == 'latest') ? siteUrl : `${siteUrl}comic/${id}`;
    return axios.get(requestUrl).then(function (response) {
      if (response.status != 200) {
        console.warn(`http status ${response.status} for ${requestUrl}`);
        return null;
      }

      const comic = new WhiteNoiseComic();

      // Fetch comic data from response
      const doc = new DOMParser({ errorHandler: { warning: null } }).parseFromString(response.data);
      const select = xpath.useNamespaces({ 'html': 'http://www.w3.org/1999/xhtml' });
      const imageNode = select('//*[@id=\'cc-comic\']', doc)[0];

      // Image url
      comic.imageUrl = imageNode.getAttribute('src');

      // Comic id
      comic.id = imageNode.getAttribute('title');

      // Comic url
      comic.url = `${siteUrl}comic/${comic.id}`;

      const nameNode = select('//*[@class=\'cc-newsheader\']', doc)[0];

      // Comic id
      if (nameNode.firstChild) {
        comic.name = nameNode.firstChild.textContent;
      } else {
        comic.name = nameNode.textContent;
      }

      return comic;
    });
  }

  static getInfo() {
    return new WhiteNoiseComic().info;
  }
}

module.exports = WhiteNoiseComic;