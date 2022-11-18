const { Shard } = require('discord-cross-hosting');
const Cluster = require('discord-hybrid-sharding');
const { Client, GatewayIntentBits, Partials, ActivityType } = require('discord.js');
const colors = require('colors')
const config = require(`${process.cwd()}/config/config.json`)
const fs = require('fs')
const { delay } = require(`${process.cwd()}/handlers/func`)

const client = new Client({
    allowedMentions: {
        parse: ["roles", "users"],
        repliedUser: false,
    },
    partials: [
        Partials.Message, // for message
        Partials.Channel, // for text channel
        Partials.GuildMember, // for guild member
        Partials.Reaction, // for message reaction
        Partials.GuildScheduledEvent, // for guild events
        Partials.User, // for discord user
        Partials.ThreadMember, // for thread member
    ],
    intents: [
        GatewayIntentBits.Guilds, // for guild related things
        GatewayIntentBits.GuildMembers, // for guild members related things
        GatewayIntentBits.GuildBans, // for manage guild bans
        GatewayIntentBits.GuildEmojisAndStickers, // for manage emojis and stickers
        GatewayIntentBits.GuildIntegrations, // for discord Integrations
        GatewayIntentBits.GuildWebhooks, // for discord webhooks
        GatewayIntentBits.GuildInvites, // for guild invite managing
        GatewayIntentBits.GuildVoiceStates, // for voice related things
        GatewayIntentBits.GuildPresences, // for user presence things
        GatewayIntentBits.GuildMessages, // for guild messages things
        GatewayIntentBits.GuildMessageReactions, // for message reactions things
        //GatewayIntentBits.GuildMessageTyping, // for message typing things
        GatewayIntentBits.DirectMessages, // for dm messages
        GatewayIntentBits.DirectMessageReactions, // for dm message reaction
        //GatewayIntentBits.DirectMessageTyping, // for dm message typinh
        GatewayIntentBits.MessageContent, // enable if you need message content things
    ],
    presence: {
        activities: [{name: `Loading Shards or Shard is died...`, type: ActivityType.Custom}],
        status: "dnd"
    },
    shards: Cluster.data.SHARD_LIST, // An Array of Shard list, which will get spawned
    shardCount: Cluster.data.TOTAL_SHARDS, // The Number of Total Shards
});

async function startup(){
    // handlers
    var handlers = fs.readdirSync(`${process.cwd()}/handlers`)
    var required = ["func.js"]
    await require(`${process.cwd()}/handlers/func`)
    var something = ["clientvars.js", "database.js"].forEach(async (handler, index) => {
        required.push(`${handler}`)
        handler = handler.split(".js").join("")
        await delay(500*index)
        await require(`${process.cwd()}/handlers/${handler}`)(client)
    });
    await delay(client.ws.ping*2)
    for (var handler of handlers.filter(file => file.endsWith(".js")).filter(file => !required.includes(file))){
        required.push(`${handler}`)
        handler = handler.split(".js").join("")
        await require(`${process.cwd()}/handlers/${handler}`)(client)
    }

    // Client events
    const allevents = [];
    try {
        let dateNow = Date.now();
        console.log(`${String("[x] :: ".magenta)}Now loading the Events ...`.brightGreen)
        const load_dir = (dir) => {
            const event_files = fs.readdirSync(`${process.cwd()}/events/${dir}`).filter((file) => file.endsWith(".js"));
            for (const file of event_files) {
                const event = require(`${process.cwd()}/events/${dir}/${file}`)
                let eventName = file.split(".")[0];
                if(eventName == "message") continue;
                allevents.push(eventName);
                client.on(eventName, event.bind(null, client));
            }
        }
        ["client", "guild"].forEach(e => load_dir(e));

        console.log(`[x] :: `.magenta + `LOADED THE ${allevents.length} EVENTS after: `.brightGreen + `${Date.now() - dateNow}ms`.green)
    } catch (e) {
        console.log(String(e.stack).grey.bgRed)
    }

    return true;
}
startup()

client.cluster = new Cluster.Client(client);

client.machine = new Shard(client.cluster); // Initialize Cluster

client.cluster.on('message', message => {
    if (!message._sRequest) return;
    if (message.guildId && !message.eval) {
        const guild = client.guilds.cache.get(message.guildId);
        const customGuild = {};
        customGuild.id = guild.id;
        customGuild.name = guild.name;
        customGuild.icon = guild.icon;
        customGuild.ownerId = guild.ownerId;
        customGuild.roles = [...guild.roles.cache.values()];
        customGuild.channels = [...guild.channels.cache.values()];
        message.reply({ data: customGuild });
    }
});

client.login(config.token);