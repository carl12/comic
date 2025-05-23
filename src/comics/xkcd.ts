import BaseComic from './base.ts';

import axios from 'axios';

const siteUrl = 'https://xkcd.com/';

export default class XKCDComic extends BaseComic {
  constructor() {
    super();
  }

  setDefaultInfo() {
    this.info = {};
    this.info.id = 'xkcd';
    this.info.name = 'xkcd';
    this.info.author = 'xkcd';
    this.info.authorUrl = 'https://xkcd.com';
  }
  // Returns a promise to a comic
  static getComicWithId(id) {
    const requestUrl = (id == 'latest') ? `${siteUrl}info.0.json` : `${siteUrl}${id}/info.0.json`;
    return axios.get(requestUrl).then(function (response) {
      if (response.status != 200) {
        console.warn(`http status ${response.status} for ${requestUrl}`);
        return null;
      }

      const comic = new XKCDComic();

      // Fetch comic data from response
      const data = response.data;

      comic.id = data.num.toString();
      comic.imageUrl = data.img;
      comic.name = data.title;
      comic.url = `${siteUrl}${comic.id}`;

      return comic;
    });r
  }

  static getInfo() {
    return new XKCDComic().info;
  }
}
