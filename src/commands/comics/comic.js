const { Command } = require('discord.js-commando');
const { GetComicEmbed } = require('../../comics/comics');

module.exports = class ComicCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'comic',
      aliases: ['fetch'],
      group: 'comics',
      memberName: 'comic',
      description: 'Retreives the specified comic.',
      args: [
        {
          key: 'webcomic_id',
          prompt: 'Please type the webcomic you would like to fetch. See https://github.com/carl12/comic#supported-webcomics for a list of IDs',
          type: 'string',
        },
        {
          key: 'comic_id',
          prompt: 'Please type the id of the specific comic you would like to fetch. The form of this various from webcomic to webcomic. Use \'latest\' to retrieve the latest comic.',
          type: 'string',
        },
      ],
    });
  }

  run(message, { webcomic_id, comic_id }) {
    GetComicEmbed(webcomic_id, comic_id).then(embed => {
      if (!embed) {
        message.channel.send(`Comic with id ${webcomic_id} not found`);
      }
      message.embed(embed);
      console.log(`Posted ${webcomic_id} with id ${comic_id}`);
    }).catch(err => {
      message.channel.send(`Error fetching comic with id ${webcomic_id}`);
    });
  }
};