const { Command } = require('discord.js-commando');
const { GetWebcomic } = require('../../comics/comics');
const { SubscribeComic, GetGuildComicChannel, GetGuildInfo } = require('../../database');
const config = require('../../../config.json');
const { client } = require('../../utility/botUtils');
const { GetComicEmbed, GetComic } = require('../../comics/comics');

module.exports = class SubscribeCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'subscribe',
      group: 'comics',
      memberName: 'subscribe',
      description: 'Subscribes to the specified comic.',
      guildOnly: true,
      args: [
        {
          key: 'webcomic_id',
          prompt: 'Please type the webcomic you would like to subscribe to. See https://github.com/carl12/comic#supported-webcomics for a list of IDs',
          type: 'string',
        },
      ],
    });
  }

  async run(message, { webcomic_id }) {
    const comicId = webcomic_id.split(' ')[0];
    const webcomic = GetWebcomic(comicId);
    if (!webcomic) {
      message.reply(`Sorry, there is no comic with the id ${comicId}`);
      return;
    }
    const res = await SubscribeComic(message.guild.id, comicId);
    if (!res.ok) {
      message.reply('Something went wrong.');
      return;
    }
    message.reply(`Subscribed to ${webcomic.getInfo().name}`);
    console.log(`Added subscription for ${webcomic_id}`);
    const { comic_channel } = await GetGuildInfo(message.guild.id);
    console.log(message.guild.id, comic_channel);
    if (!comic_channel) {
      message.reply('Please set a channel id for comics subscriptions');
      return;
    }
    const latestComic = await GetComic(webcomic.getInfo().id, 'latest');
    const embed = await GetComicEmbed(webcomic.getInfo().id, latestComic.id);
    const channel = await client.channels.fetch(comic_channel);
    channel.send(`New ${webcomic.getInfo().name} comic!`);
    channel.send(embed);
    console.log(`Posted preview for webcomic ${webcomic_id}`);
  }
};