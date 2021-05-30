const BaseComic = require('./base');
const cheerio = require('cheerio');
const axios = require('axios');

const siteUrl = 'https://sarahcandersen.com/';

class SarahScribblesComic extends BaseComic {
  constructor() {
    super();
  }

  setDefaultInfo() {
    this.info = {
      id: 'sarahsc',
      name: 'Sarah Scribbles',
      author: 'Sarah Candersen',
      authorUrl: 'https://sarahcandersen.com/',
    };
  }

  // Returns a promise to a comic
  static getComicWithId(num) {
    const requestUrl = (num == 'latest') ? siteUrl : `${siteUrl}page/${num}`;
    return axios.get(requestUrl) .then(response => {
      if (response.status != 200) {
        throw (`http status ${response.status} for ${requestUrl}`);
      }
      const $ = cheerio.load(response.data);
      const article = $('article')[0];
      const iframe = $('.photoset')[0];
      const img = $('article a img')[0];

      return new SarahScribblesComic()
        .withId(article.attribs.id.split('-')[1])
        .withImageUrl(iframe != null ? `https://64.media.tumblr.com/${iframe.attribs.src}` : img.attribs.src)
        .withName(img?.attribs?.alt ?? "Sarah Scribbles")
        .withUrl(requestUrl);
    });
  }

  static getInfo() {
    return new SarahScribblesComic().info;
  }
}

module.exports = SarahScribblesComic;