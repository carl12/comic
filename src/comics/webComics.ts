import { MessageEmbed } from 'discord.js';
import { addComicInfo, getSavedComicAll } from '../database.ts';

import ChannelateComic from './channelate.ts';
import CyanideComic from './cyanide.ts';
import ExoComic from './exo.ts';
import LizComic from './lizclimo.ts';
import PeanutsComic from './peanuts.ts';
import SarahScribblesComic from './sarahscribbles.ts';
import SMBCComic from './smbc.ts';
import SwordsComic from './swords.ts';
import WhiteNoiseComic from './whitenoise.ts';
import WildelifeComic from './wildelife.ts';
import XKCDComic from './xkcd.ts';

function fetchComic(webcomic_id, comic_id) {
  const comic = webComicList.find(c => c.getInfo().id === webcomic_id);
  if (comic) {
      return comic.getComicWithId(comic_id);
  }
  return Promise.resolve(null);
}

async function getComicEmbed(webcomic_id, comic_id) {
  const comic = await fetchComic(webcomic_id, comic_id);
  if (!comic) {
    return null;
  }
  const embed = new MessageEmbed()
    .setColor('aqua')
    .setTitle(comic.name)
    .setURL(comic.url)
    .setAuthor(comic.info.author, null, comic.info.authorUrl)
    .setImage(comic.imageUrl);

  if (comic.bonusUrl != '') {
    embed.addField('Bonus url', comic.bonusUrl);
  }

  return embed;
}

async function getComicImageUrl(webcomic_id, comic_id) {
  const comic = await fetchComic(webcomic_id, comic_id);
  return comic.imageUrl;
}

function getWebcomic(webcomic_id) {
  return webComicList.find(comic => comic.getInfo().id === webcomic_id);
}

async function registerComics() {
  const comicInfos = await getSavedComicAll();

  webComicList.forEach(function(comic) {
    const id = comic.getInfo().id;
    if (!comicInfos.some(function(e) {
      return id === e.comic_id;
    })) {
      addComicInfo(id);
    }
  });
}

const webComicList = [
  ChannelateComic,
  CyanideComic,
  ExoComic,
  LizComic,
  PeanutsComic,
  SMBCComic,
  SwordsComic,
  WhiteNoiseComic,
  WildelifeComic,
  XKCDComic,
  SarahScribblesComic,
];

export {
  fetchComic,
  getComicEmbed,
  getComicImageUrl,
  getWebcomic,
  registerComics,
  webComicList,
};