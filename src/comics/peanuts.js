const BaseComic = require('./base');
const cheerio = require('cheerio');
const axios = require('axios');

const siteUrl = 'https://www.gocomics.com/peanuts/';

class PeanutsComic extends BaseComic {
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
    return new Promise(function (resolve, reject) {
      try {
        const requestUrl = PeanutsComic.getUrl(rawId);

        axios.get(requestUrl)
          .then(function (response) {
            if (response.status != 200) {
              throw (`http status ${response.status}`);
            }
            const $ = cheerio.load(response.data);
            const node = $('.img-fluid')[1];

            const comic = new PeanutsComic();

            // Fetch comic data from response
            const data = response.data;
            comic
              .withId(node.attribs.alt)
              .withImageUrl(node.attribs.src)
              .withName("Peanuts")
              .withUrl(requestUrl);

            resolve(comic);
          }).catch(function (error) {
            reject(error);
          });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getInfo() {
    return new PeanutsComic().info;
  }
}

module.exports = PeanutsComic;