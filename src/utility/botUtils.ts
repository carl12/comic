
import { Permissions } from 'discord.js';
import { Client } from 'discord.js-commando';
import config from '../../config.json' with { type: "json" };

const client = new Client({
  commandPrefix: config.commandPrefix,
  owner: config.owner,
  invite: config.invite,
});

function hasPerms(message) {
  const guildMember = message.guild.member(message.author);
  return guildMember.hasPermission(Permissions.FLAGS.ADMINISTRATOR);
}

export {
  hasPerms,
  client
};