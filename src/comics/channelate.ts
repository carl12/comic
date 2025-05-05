const BaseComic = require('./base.ts');

const axios = require('axios');
const xpath = require('xpath');
const cheerio = require('cheerio');
const siteUrl = 'https://www.channelate.com/';

class ChannelateComic extends BaseComic {
  constructor() {
    super();
  }

  setDefaultInfo() {
    this.info = {};
    this.info.id = 'channelate';
    this.info.name = 'Channelate';
    this.info.author = 'Ryan Hudson';
    this.info.authorUrl = 'https://www.channelate.com/';
  }

  // Returns a promise to a comic
  static async getComicWithId(id) {
    const requestUrl = (id == 'latest') ? siteUrl : `${siteUrl}comics/${id}`;
    const response = await axios.get(requestUrl);
    if (response.status != 200) {
      console.warn(`http status ${response.status} for ${requestUrl}`);
      return null;
    }
    const comic = new ChannelateComic();

    // Fetch comic data from response
    const $ = cheerio.load(response.data);
    const imageNode2 = $('#comic')[0];
    const titleNode2 = $('.post-title')[0];
    const bonusNode2 = $('#extrapanelbutton')[0];
    const comicUrl = titleNode2.childNodes[0].attribs?.href ?? requestUrl;
    return comic
      .withImageUrl(imageNode2.attribs.id)
      .withName(imageNode2.childNodes[1].childNodes[0].attribs.title)
      .withUrl(comicUrl)
      .withId(comicUrl.split('/').slice(-2)[0])
      .withBonusUrl(bonusNode2?.attribs.href);

  }

  static getInfo() {
    return new ChannelateComic().info;
  }
}

module.exports = ChannelateComic;