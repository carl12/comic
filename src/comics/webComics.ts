const { MessageEmbed } = require('discord.js');
const { addComicInfo: AddComicInfo, getSavedComicAll: GetComicInfoAll } = require('../database.ts');

const ChannelateComic = require('./channelate.ts');
const CyanideComic = require('./cyanide.ts');
const ExoComic = require('./exo.ts');
const LizComic = require('./lizclimo.ts');
const PeanutsComic = require('./peanuts.ts');
const SarahScribblesComic = require('./sarahscribbles.ts');
const SMBCComic = require('./smbc.ts');
const SwordsComic = require('./swords.ts');
const WhiteNoiseComic = require('./whitenoise.ts');
const WildelifeComic = require('./wildelife.ts');
const XKCDComic = require('./xkcd.ts');

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
  getComicImageUrl,
  getWebcomic,
  registerComics,
  webComicList,
};