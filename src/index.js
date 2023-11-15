const config = require('../config.json');

const Database = require('../src/database');
const { client } = require('./utility/botUtils');

const path = require('path');

const { GetComic, GetComicEmbed, ComicList, RegisterComics } = require('../src/comics/comics');
const { GetComicInfo, GetGuildInfo, GetGuildInfoAll, AddGuildInfo, ModifyComicInfo, GetGuildsSubscribedTo } = require('../src/database');

const newComicCheckInterval = 30 * 60 * 1000; // 30 minutes

Database.ConnectDatabse(config.connectUri).then(async () => {
  await client.login(config.token);
  await RegisterComics();
  await CheckNewComics();
});

client.registry
  .registerDefaultTypes()
  .registerGroups([
    ['comics', 'Comic commands'],
  ])
  .registerDefaultGroups()
  .registerDefaultCommands()
  .registerCommandsIn(path.join(__dirname, 'commands'));

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}! (${client.user.id})`);
  CheckNewGuilds();
});

client.on('guildCreate', async (guild) => {
  // Check if we already have info for this guild

  console.log('Joined guild ' + guild.id);
  const guildInfo = await GetGuildInfo(guild.id);

  if (guildInfo === null) {
    AddGuildInfo(guild.id);
  }
});

process.on('unhandledRejection', error => {
  console.error('Unhandled promise rejection:', error);
});
let errorCount = 0;
client.setInterval(CheckNewComics, newComicCheckInterval);
async function CheckNewComics() {
  const start = Date.now();
  for (const comic of ComicList) {
    const id = comic.getInfo().id;

    const latestComic = await GetComic(id, 'latest');
    const comicInfo = await GetComicInfo(id);
    if (!latestComic) {
        console.warn(`Fetching latest comic for ${comic.name} failed: ${latestComic}`);
        errorCount ++;
        if (errorCount > 10) {
          console.error('Too many errors, terminating...');
          process.exit();
        }
        continue;
    } else if (errorCount > 0) {
      errorCount --;
    }
    if (latestComic.id === comicInfo?.latest_id) {
      console.info(`Already have latest ${comic.name} with id ${latestComic.id}`)
      continue;
    }

    const res = await ModifyComicInfo(id, { latest_id: latestComic.id });

    if (res.ok !== 1) {
      throw (Error('failed to update latest comic'));
    }

    // Get all the guilds which are subscriebd to this comic
    const guilds = await GetGuildsSubscribedTo(id);
    const embed = await GetComicEmbed(id, 'latest');

    let posted = 0;
    for (const guild of guilds) {
      if (guild.comic_channel == '') {
        continue;
      }
      // Send comic
      const channel = await client.channels.fetch(guild.comic_channel);
      channel.send(`New ${comic.getInfo().name} comic!`);
      channel.send(embed);
      posted ++;
    }
    console.log(`Posted ${posted} subscribe updates for ${comic.getInfo().name} with id: ${latestComic.id}`);
  }
  console.info('Done updating latest comics. Took ' + ((Date.now() - start)/1000).toFixed(2) + ' secs.\nDate is ' + new Date());
}

// Checks to see if there are any guilds that don't have a corresponding entry in the guilds collection, and adds any that are missing
async function CheckNewGuilds() {
  const guildInfos = await GetGuildInfoAll();

  client.guilds.cache.forEach(function (guild) {
    if (!guildInfos.some(e => guild.id = e.guild_id)) {
      // Add guild info
      AddGuildInfo(guild.id);
    }
  });
}

// https://discordapp.com/oauth2/authorize?client_id=493303544477253640&scope=bot&permissions=536923136
