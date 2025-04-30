const config = require('../config.json');

const Database = require('../src/database');
const { client } = require('./utility/botUtils');

const path = require('path');

const { fetchComic, getComicEmbed, webComicList, registerComics, getComicImageUrl } = require('./comics/webComics');
const { getSavedComic, getGuildInfo, getGuildInfoAll, addGuildInfo, updateWebComicInfo, getGuildsSubscribedTo } = require('../src/database');

const newComicCheckInterval = 30 * 60 * 1000; // 30 minutes

Database.connectDatabse(config.connectUri).then(async () => {
  await client.login(config.token);
  await registerComics();
  await checkNewComics();
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
  const guildInfo = await getGuildInfo(guild.id);

  if (guildInfo === null) {
    addGuildInfo(guild.id);
  }
});

process.on('unhandledRejection', error => {
  console.error('Unhandled promise rejection:', error);
});
let errorCount = 0;
client.setInterval(checkNewComics, newComicCheckInterval);
async function checkNewComics() {
  const start = Date.now();
  for (const webComic of webComicList) {
    const webComicId = webComic.getInfo().id;

    const latestComic = await fetchComic(webComicId, 'latest');
    const latestSavedComic = await getSavedComic(webComicId);
    if (!latestComic) {
        console.warn(`Fetching latest comic for ${webComic.name} failed: ${latestComic}`);
        errorCount ++;
        if (errorCount > 10) {
          console.error('Too many errors, terminating...');
          process.exit();
        }
        continue;
    } else if (errorCount > 0) {
      errorCount --;
    }
    if (latestComic.id === latestSavedComic?.latest_id) {
      console.info(`Already have latest ${webComic.name} with id ${latestComic.id}`)
      continue;
    }

    const res = await updateWebComicInfo(webComicId, { latest_id: latestComic.id });

    if (res.ok !== 1) {
      throw (Error('failed to update latest comic'));
    }

    // Get all the guilds which are subscriebd to this comic
    const guilds = await getGuildsSubscribedTo(webComicId);
    const embed = await getComicEmbed(webComicId, 'latest');
    const imgUrl = await getComicImageUrl(webComicId, 'latest');

    let posted = 0;
    for (const guild of guilds) {
      if (guild.comic_channel == '') {
        continue;
      }
      // Send comic
      const channel = await client.channels.fetch(guild.comic_channel);
      channel.send(`New ${webComic.getInfo().name} comic!`);
      channel.send(embed);
      channel.send(imgUrl);
      posted ++;
    }
    console.log(`Posted ${posted} subscribe updates for ${webComic.getInfo().name} with id: ${latestComic.id}`);
  }
  console.info('Done updating latest comics. Took ' + ((Date.now() - start)/1000).toFixed(2) + ' secs.\nDate is ' + new Date());
}

// Checks to see if there are any guilds that don't have a corresponding entry in the guilds collection, and adds any that are missing
async function CheckNewGuilds() {
  const guildInfos = await getGuildInfoAll();

  client.guilds.cache.forEach(function (guild) {
    if (!guildInfos.some(e => guild.id = e.guild_id)) {
      // Add guild info
      addGuildInfo(guild.id);
    }
  });
}

// https://discordapp.com/oauth2/authorize?client_id=493303544477253640&scope=bot&permissions=536923136
