type Info = {
  id: string;
  name: string;
  author: string;
  authorUrl: string;
};

export default class BaseComic {
  public id = '';
  public name = '';
  public url = '';
  public imageUrl = '';
  public bonusUrl = '';
  public info = {
    id: 'Base',
    name: 'Base',
    author: 'John Doe',
    authorUrl: 'https://example.com',
  };
  constructor() {
    this.setDefaultInfo();
  }

  setDefaultInfo() {
    this.info = {
      id: 'Base',
      name: 'Base',
      author: 'John Doe',
      authorUrl: 'https://example.com',
    };
  }

  withId(id) {
    this.id = id;
    return this;
  }

  withImageUrl(url) {
    this.imageUrl = url;
    return this;
  }

  withName(name) {
    this.name = name;
    return this;
  }

  withUrl(url) {
    this.url = url;
    return this;
  }

  withBonusUrl(url) {
    this.bonusUrl = url;
    return this;
  }

  // Returns a promise to a comic
  static getComicWithId(id) {
    // This would usually fetch a comic

    return new Promise(function (resolve, reject) {
      try {
        if (id < 0) {
          throw Error('comic not found');
        }

        const comic = new BaseComic();
        comic.id = id;
        comic.name = 'Test';
        comic.url = 'https://example.com';
        comic.imageUrl = 'https://picsum.photos/600/400';
        comic.bonusUrl = '';

        resolve(comic);
      } catch (error) {
        reject(error);
      }
    });
  }

  static getInfo() {
    return new BaseComic().info;
  }
}

