const { Permissions } = require('discord.js');
const { CommandoClient } = require('discord.js-commando');
const config = require('../../config.json');

const client = new CommandoClient({
  commandPrefix: config.commandPrefix,
  owner: config.owner,
  invite: config.invite,
});

function hasPerms(message) {
  const guildMember = message.guild.member(message.author);
  return guildMember.hasPermission(Permissions.FLAGS.ADMINISTRATOR);
}

module.exports = {
  hasPerms,
  client
};