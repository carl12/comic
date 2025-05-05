const { Command } = require('discord.js-commando');
const { getWebcomic } = require('../../comics/webComics');
const { UnsubscribeComic } = require('../../database.ts');

export default class UnsubscribeCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'unsubscribe',
      group: 'comics',
      memberName: 'unsubscribe',
      description: 'Unsubscribes from the specified comic.',
      guildOnly: true,
      args: [
        {
          key: 'webcomic_id',
          prompt: 'Please type the webcomic you would like to unsubscribe from. See https://github.com/carl12/comic#supported-webcomics for a list of IDs',
          type: 'string',
        },
      ],
    });
  }

  async run(message, { webcomic_id }) {
    const webcomic = getWebcomic(webcomic_id);
    if (!webcomic) {
      return message.reply(`Sorry, there is no comic with the id ${webcomic_id}`);
    }
    const res = await UnsubscribeComic(message.guild.id, webcomic_id);
    if (!res.ok) {
      return message.reply('Something went wrong.');
    }
    message.reply(`Unsubscribed from ${webcomic.getInfo().name}`);
  }
};