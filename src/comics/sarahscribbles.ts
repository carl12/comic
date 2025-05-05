import BaseComic from './base.ts';
import cheerio from 'cheerio';
import axios from 'axios';
import https from 'https';

const siteUrl = 'https://sarahcandersen.com/';
const instance = axios.create({
  httpsAgent: new https.Agent({
    rejectUnauthorized: false
  })
});
export default class SarahScribblesComic extends BaseComic {
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
    // TODO: saved id is passed in as number, which results in blank comic being fetched.
    // URL uses /page/1 for most recent and ~/700 for oldest. The ids saved as comic ids are tumblr ids which are over 9 digits long
    const requestUrl = (num == 'latest') ? siteUrl : `${siteUrl}page/${num}`;
    const response = await axios.get(requestUrl);
    if (response.status != 200) {
      console.warn(`http status ${response.status} for ${requestUrl}`);
      return null;
    }
    const $ = cheerio.load(response.data);
    const article = $('article')[0];
    const iframe = $('.photoset')[1];
    const img = $('article img')[0];

    let imgSrc = img?.attribs?.src;
    if (iframe != null) {
      const { data } = await instance.get(
        `https://tubmlr.com${iframe.attribs.src}`
      );
      imgSrc = cheerio.load(data)('img')[0]?.attribs.src;
    }
    return new SarahScribblesComic()
      .withId(article?.attribs.id.split('-')[1])
      .withImageUrl(imgSrc)
      .withName(img?.attribs?.alt ?? "Sarah Scribbles")
      .withUrl(requestUrl);
  }

  static getInfo() {
    return new SarahScribblesComic().info;
  }
}
