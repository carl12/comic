const { MessageEmbed } = require('discord.js');
const { addComicInfo: AddComicInfo, getSavedComicAll: GetComicInfoAll } = require('../database');

const ChannelateComic = require('./channelate');
const CyanideComic = require('./cyanide');
const ExoComic = require('./exo');
const LizComic = require('./lizclimo');
const PeanutsComic = require('./peanuts');
const SarahScribblesComic = require('./sarahscribbles');
const SMBCComic = require('./smbc');
const SwordsComic = require('./swords');
const WhiteNoiseComic = require('./whitenoise');
const WildelifeComic = require('./wildelife');
const XKCDComic = require('./xkcd');

function fetchComic(webcomic_id, comic_id) {
  const comic = webComicList.find(comic => comic.getInfo().id === webcomic_id);
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

function getWebcomic(webcomic_id) {
  return webComicList.find(comic => comic.getInfo().id === webcomic_id);
}

async function registerComics() {
  const comicInfos = await GetComicInfoAll();

  webComicList.forEach(function(comic) {
    const id = comic.getInfo().id;
    if (!comicInfos.some(function(e) {
      return id === e.comic_id;
    })) {
      AddComicInfo(id);
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

module.exports = {
  fetchComic,
  getComicEmbed,
  getWebcomic,
  registerComics,
  webComicList,
};