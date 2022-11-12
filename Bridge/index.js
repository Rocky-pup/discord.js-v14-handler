const { Bridge } = require('discord-cross-hosting');
const config = require('../Bot/config/config.json');

const server = new Bridge({
    port: 4444, // The Port of the Server | Proxy Connection (Replit) needs Port 443
    authToken: 'RockyAuth', // The *Password* for connection
    totalShards: 1, // The Total Shards of the Bot or 'auto'
    totalMachines: 1, // The Total Machines, where the Clusters will run
    shardsPerCluster: 1, // The amount of Internal Shards, which are in one Cluster
    token: config.token, // Bot Token
});

server.on('debug', console.log);
server.start();
server.on('ready', url => {
    console.log('Server is ready' + url);
    setInterval(() => {
        server.broadcastEval('this.guilds.cache.size').then(console.log).catch(console.log);
    }, 10000);
});