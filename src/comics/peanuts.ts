import BaseComic from './base.ts';
import cheerio from 'cheerio';
import axios from 'axios';

const siteUrl = 'https://www.gocomics.com/peanuts/';

export default class PeanutsComic extends BaseComic {
  constructor() {
    super();
  }

  setDefaultInfo() {
    this.info = {
      id: 'peanuts',
      name: 'Peanuts',
      author: 'Charles Shulz',
      authorUrl: 'https://www.gocomics.com/peanuts/',
    };
  }
  /**
   * Interprets rawId as either number ago (negative), date (with "/") else most recent
   * @param {*} rawId
   * @returns url: string
   */
  static getUrl(rawId) {
    // Gcloud is on utc, which messes up output date
    const d = new Date(new Date().toLocaleString("en-US", { timeZone: "America/Los_Angeles" }));
    if (Number(rawId) <= 0) {
      return  `${siteUrl}${PeanutsComic.makeSuffix(new Date(d.setDate(d.getDate() + Number(rawId))))}`
    } else if (rawId.split('/').length === 3) {
      return `${siteUrl}${rawId}`
    } else {
      return `${siteUrl}${PeanutsComic.makeSuffix(d)}`
    }
  }

  static makeSuffix(date) {
    return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`
  }

  // Returns a promise to a comic
  static getComicWithId(rawId) {
    const requestUrl = PeanutsComic.getUrl(rawId);
    return axios.get(requestUrl) .then(response => {
      if (response.status != 200) {
        console.warn(`http status ${response.status} for ${requestUrl}`);
        return null;
      }
      const $ = cheerio.load(response.data);
      const node = $('.img-fluid')[1];

      return new PeanutsComic()
        .withId(node?.attribs.alt)
        .withImageUrl(node?.attribs.src)
        .withName("Peanuts")
        .withUrl(requestUrl);
    });
  }

  static getInfo() {
    return new PeanutsComic().info;
  }
}
