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
    if (webcomic) {
      const res = await SubscribeComic(message.guild.id, comicId);
      if (res.ok) {
        message.reply(`Subscribed to ${webcomic.getInfo().name}`);
        console.log(`Added subscription for ${webcomic_id}`);
        const { channel_id } = await GetGuildInfo(message.guild.id);
        console.log('1');
        const latestComic = await GetComic(webcomic.getInfo().id, 'latest');
        console.log('2');
        const embed = await GetComicEmbed(webcomic.getInfo().id, latestComic.id);
        console.log('3');
        const channel = await client.channels.fetch(channel_id);
        console.log('4');
        channel.send(`New ${webcomic.getInfo().name} comic!`);
        console.log('5');
        channel.send(embed);
        console.log(`Posted preview for webcomic ${webcomic_id}`);
      } else {
        message.reply('Something went wrong.');
      }
    } else {
      message.reply(`Sorry, there is no comic with the id ${comicId}`);
    }
  }
};