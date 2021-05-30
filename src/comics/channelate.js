const BaseComic = require('./base');

const axios = require('axios');
const DOMParser = require('xmldom').DOMParser;
const xpath = require('xpath');

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
  static getComicWithId(id) {
    const requestUrl = (id == 'latest') ? siteUrl : `${siteUrl}comics/${id}`;
    return axios.get(requestUrl).then(response => {
      if (response.status != 200) {
        throw (`http status ${response.status} for ${requestUrl}`);
      }
      const comic = new ChannelateComic();

      // Fetch comic data from response
      const doc = new DOMParser({ errorHandler: { warning: null } }).parseFromString(response.data);
      const select = xpath.useNamespaces({ 'html': 'http://www.w3.org/1999/xhtml' });
      const imageNode = select('//*[@id=\'comic\']/html:span/html:img', doc)[0];
      const titleNode = select('//html:h2[@class=\'post-title\']/html:a', doc)[0];
      const bonusNode = select('//html:div[@id=\'extrapanelbutton\']/html:a', doc);

      return comic
        .withImageUrl(imageNode.getAttribute('src'))
        .withName(imageNode.getAttribute('title'))
        .withUrl(titleNode.getAttribute('href'))
        .withId(comic.url.split('/').slice(-2)[0])
        .withBonusUrl(bonusNode[0]?.getAttribute('href'));
    });
  }

  static getInfo() {
    return new ChannelateComic().info;
  }
}

module.exports = ChannelateComic;