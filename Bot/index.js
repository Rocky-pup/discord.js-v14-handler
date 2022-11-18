const { Client } = require('discord-cross-hosting');
const Cluster = require('discord-hybrid-sharding');
const colors = require("colors")

const client = new Client({
    agent: 'bot',
    host: 'localhost',
    port: 4444,
    authToken: 'RockyAuth',
    retries: 360,
    rollingRestarts: false,
});
//client.on('debug', console.log);
client.connect();

let { token } = require('../Bot/config/config.json');
const manager = new Cluster.Manager(`${__dirname}/bot.js`, {
    totalShards: 1,
    totalClusters: 1,
    token: token,
});
manager.on('clusterCreate', cluster => {console.log(`[x] ::`.magenta, `Launched Cluster ${cluster.id}`.green);});
//manager.on('debug', console.log);

// Request ShardData from the Bridge
client
    .requestShardData()
    .then(e => {
        if (!e) return;
        manager.totalShards = e.totalShards;
        manager.totalClusters = e.shardList.length;
        manager.shardList = e.shardList;
        manager.clusterList = e.clusterList;
        manager.spawn({ timeout: -1 });
    })
    .catch(e => console.log(e));

// Listen to the Manager Events
client.listen(manager);

client.on('bridgeMessage', message => {
    if (!message._sCustom) return; // If message is a Internal Message
    console.log(message);
});

client.on('bridgeRequest', message => {
    if (!message._sCustom && !message._sRequest) return; // If message is a Internal Message
    console.log(message);
});
