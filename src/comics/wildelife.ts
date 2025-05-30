import BaseComic from './base.ts';

import axios from 'axios';
import { DOMParser } from 'xmldom';
import xpath from 'xpath';

const siteUrl = 'https://www.wildelifecomic.com/';

export default class WildelifeComic extends BaseComic {
  constructor() {
    super();
  }

  setDefaultInfo() {
    this.info = {};
    this.info.id = 'wildelife';
    this.info.name = 'Wildelife';
    this.info.author = 'Pascalle Lepas';
    this.info.authorUrl = 'https://www.wildelifecomic.com/';
  }

  // Returns a promise to a comic
  static getComicWithId(id) {
    const requestUrl = (id == 'latest') ? siteUrl : `${siteUrl}comic/${id}`;
    return axios.get(requestUrl).then(function (response) {
      if (response.status != 200) {
        console.warn(`http status ${response.status} for ${requestUrl}`);
        return null;
      }

      const comic = new WildelifeComic();

      // Fetch comic data from response
      const doc = new DOMParser({ errorHandler: { warning: null } }).parseFromString(response.data);
      const select = xpath.useNamespaces({ 'html': 'http://www.w3.org/1999/xhtml' });
      const imageNode = select('//*[@id=\'cc-comic\']', doc)[0];

      // Image url
      comic.imageUrl = imageNode.getAttribute('src');

      // Comic title
      comic.name = imageNode.getAttribute('title');

      const idNode = select('//*[@class=\'cc-newsheader\']', doc)[0];

      // Comic id
      if (idNode.firstChild) {
        comic.id = idNode.firstChild.textContent;
      } else {
        comic.id = idNode.textContent;
      }

      // Comic url
      comic.url = `${siteUrl}comic/${comic.id}`;

      // Comic id
      comic.id = comic.url.split('/').slice(-1)[0];


      return comic;
    });
  }

  static getInfo() {
    return new WildelifeComic().info;
  }
}
