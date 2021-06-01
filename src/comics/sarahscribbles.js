const BaseComic = require('./base');
const cheerio = require('cheerio');
const axios = require('axios');
const https = require('https');

const siteUrl = 'https://sarahcandersen.com/';
const instance = axios.create({
  httpsAgent: new https.Agent({
    rejectUnauthorized: false
  })
});
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
  static async getComicWithId(num) {
    const requestUrl = (num == 'latest') ? siteUrl : `${siteUrl}page/${num}`;
    const response = await axios.get(requestUrl);
    if (response.status != 200) {
      throw (`http status ${response.status} for ${requestUrl}`);
    }
    const $ = cheerio.load(response.data);
    const article = $('article')[0];
    const iframe = $('.photoset')[1];
    const img = $('article a img')[0];

    let imgSrc = img?.attribs?.src;
    if (iframe != null) {
      const { data } = await instance.get(
        `https://tubmlr.com${iframe.attribs.src}`
      );
      imgSrc = cheerio.load(data)('img')[0].attribs.src;
    }
    return new SarahScribblesComic()
      .withId(article.attribs.id.split('-')[1])
      .withImageUrl(imgSrc)
      .withName(img?.attribs?.alt ?? "Sarah Scribbles")
      .withUrl(requestUrl);
  }

  static getInfo() {
    return new SarahScribblesComic().info;
  }
}

module.exports = SarahScribblesComic;