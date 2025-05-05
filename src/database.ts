const MongoClient = require('mongodb').MongoClient;

const data = {
  client: undefined,
  db: undefined,
};

function addComicInfo(comicId) {
  if (data.db == undefined) {
    throw (Error('not connected to database'));
  }

  return data.db.collection('comics').insertOne({
    comic_id: comicId,
    latest_id: '',
  });
}

function addGuildInfo(guildId) {
  if (data.db == undefined) {
    throw (Error('not connected to database'));
  }

  return data.db.collection('guilds').insertOne({
    guild_id: guildId,
    comic_channel: '',
    subscribed_comics: [],
    prefix: ',',
  });
}

function clearCollection(name) {
  if (data.db == undefined) {
    throw (Error('not connected to database'));
  }

  return data.db.collection(name).deleteMany();
}

function connectDatabse(connectUri, db) {
  if (data.client != undefined) {
    throw (Error('database is already connected'));
  }

  data.client = new MongoClient(connectUri, { useNewUrlParser: true, useUnifiedTopology: true });
  return data.client.connect().then(() => data.db = data.client.db(db))
  .catch(err => {
    console.log('Failed to connect to Mongodb. Error:');
    console.log(err);
  });
}

function getSavedComic(comicId) {
  if (data.db == undefined) {
    throw (Error('not connected to database'));
  }

  return data.db.collection('comics').findOne({ 'comic_id': comicId });
}

function getSavedComicAll() {
  if (data.db == undefined) {
    throw (Error('not connected to database'));
  }

  return data.db.collection('comics').find().toArray();
}

function getGuildInfo(guildId) {
  if (data.db == undefined) {
    throw (Error('not connected to database'));
  }

  return data.db.collection('guilds').findOne({ 'guild_id': guildId });
}

function getGuildInfoAll() {
  if (data.db == undefined) {
    throw (Error('not connected to database'));
  }

  return data.db.collection('guilds').find().toArray();
}

function getGuildsSubscribedTo(comicId) {
  if (data.db == undefined) {
    throw (Error('not connected to database'));
  }

  return data.db.collection('guilds').find({ subscribed_comics: comicId }).toArray();
}

function getGuildComicChannel(guildId) {
  return data.db.collection('guilds').findOne({ guild_id: guildId }).then(
    entry => entry.comic_channel
  );
}

function isConnected() {
  return data.client.isConnected();
}

function updateWebComicInfo(comicId, props) {
  if (data.db == undefined) {
    throw (Error('not connected to database'));
  }

  return data.db.collection('comics').findOneAndUpdate({ 'comic_id': comicId }, { $set: props });
}

function modifyGuildInfo(guildId, props) {
  if (data.db == undefined) {
    throw (Error('not connected to database'));
  }

  return data.db.collection('guilds').findOneAndUpdate({ 'guild_id': guildId }, { $set: props });
}

function subscribeComic(guildId, comicId) {
  if (data.db == undefined) {
    throw (Error('not connected to database'));
  }

  return data.db.collection('guilds').findOneAndUpdate({ 'guild_id': guildId }, { $addToSet: { subscribed_comics: comicId } });
}

function unsubscribeComic(guildId, comicId) {
  if (data.db == undefined) {
    throw (Error('not connected to database'));
  }

  return data.db.collection('guilds').findOneAndUpdate({ 'guild_id': guildId }, { $pull: { subscribed_comics: comicId } });
}

module.exports = {
  addComicInfo,
  addGuildInfo,
  clearCollection,
  connectDatabse,
  getSavedComic,
  getSavedComicAll,
  getGuildComicChannel,
  getGuildInfo,
  getGuildInfoAll,
  getGuildsSubscribedTo,
  isConnected,
  updateWebComicInfo,
  modifyGuildInfo,
  subscribeComic,
  unsubscribeComic,
};