const { Manager } = require("erela.js")
module.exports = async (client) => {
    client.musicmanager = new Manager({
        position_update_interval: 100,
        nodes: client.config.nodes,
        shards: client.ws.totalShards || 1,
        clientName: client.user?.username,
        clientId: client.user?.id || client.id,
        // A send method to send data to the Discord WebSocket using your library.
        // Getting the shard for the guild and sending the data to the WebSocket.
        send(id, payload) {
            const shardId = bot.utils.calculateShardId(bot.gateway, BigInt(id));
            // somehow get the shard
            const shard = bot.gateway.shards.get(shardId);
            shard.send(payload);
            
            // if your rest is hosted seperately then just do your typical shard request(s)
        },
    });

    client.on("ready", () => {
        client.logger(client.ws.totalShards)
        client.musicManager.init(client.user.id, {
          shards: client.ws.totalShards,
          clientName: client.user.username,
          clientId: client.user.id, 
        });
    })

    client.on("raw", (data) => {
        switch(data.t) {
            case "VOICE_SERVER_UPDATE":
            case "VOICE_STATE_UPDATE":
                client.musicManager.updateVoiceState(data.d)
            break;
        }
    });  
}