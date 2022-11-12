//Import Modules
const config = require(`${process.cwd()}/config/config.json`);
const Discord = require("discord.js");
const { EmbedBuilder, Permissions, InteractionType } = require("discord.js");
const colors = require("colors");
const { GuildDatabasing } = require(`${process.cwd()}/handlers/func`)
module.exports = async (client, interaction) => {
    if (!interaction.isChatInputCommand()) return;
    if (interaction?.guildId == null){
    const CategoryName = interaction?.commandName;
    let command = false;
    try {
        if (client.slashCommands.has("normal" + CategoryName)) {
        command = client.slashCommands.get("normal" + CategoryName);
        }
        if (client.slashCommands.has(CategoryName + interaction?.options.getSubcommand())) {
        command = client.slashCommands.get(CategoryName + interaction?.options.getSubcommand());
        }
    } catch {
        if (client.slashCommands.has("normal" + CategoryName)) {
        command = client.slashCommands.get("normal" + CategoryName);
        }
    }

    return command.execute(client, interaction, config.embed, "en", null)
    }
    const {
    member,
    channelId,
    guildId,
    applicationId,
    commandName,
    deferred,
    replied,
    ephemeral,
    options,
    id,
    createdTimestamp
    } = interaction;
    let guild = interaction.guild || member?.guild || client.guilds.cache.get(guildId);
    if(!client.guilds.cache.get(interaction.guild.id)) return;
    const CategoryName = interaction?.commandName;
    let command = false;
    try {
    if (client.slashCommands.has(CategoryName)) {
        command = client.slashCommands.get(CategoryName);
    }
    } catch {
    if (client.slashCommands.has(CategoryName)) {
        command = client.slashCommands.get(CategoryName);
    }
    }

    if (command) {
        console.log(`<|`.blue, `${command.options.name}${interaction?.options?._group ? ` ${interaction?.options?._group}`.green : ``}${interaction?.options?._subcommand ? ` ${interaction?.options?._subcommand}`.green : ``}`.green, `in`, `${guild?.name ? guild?.name : "DMS"}`.red, `|>`.blue)
        if (!client.cooldowns.has(command.options.name)) { 
            client.cooldowns.set(command.options.name, new Discord.Collection());
        }
        const now = Date.now(); 
        const timestamps = client.cooldowns.get(command.options.name); 
        const cooldownAmount = 7 * 1000; 
        if (timestamps.has(member.id)) { 
            const expirationTime = timestamps.get(member.id) + cooldownAmount; 
            if (now < expirationTime) { 
            const timeLeft = (expirationTime - now) / 1000; 
            not_allowed = true;
            return interaction?.reply({
                ephemeral: true,
                embeds: [new Discord.EmbedBuilder()
                .setColor(es.wrongcolor)
                .setTitle(handlemsg(client.la[ls].common.cooldown, {
                    time: timeLeft.toFixed(1),
                    commandname: command.options.name
                }))
                ]
            }); 
            }
        }
        timestamps.set(member.id, now); 
        setTimeout(() => timestamps.delete(member.id), cooldownAmount); 

        var GuildSettings = await client.database.settings.get(interaction.guild.id)
        var ls = GuildSettings?.language
        var es = GuildSettings?.embed
        if (!GuildSettings || !ls || !es) await GuildDatabasing(client, interaction.guild)
        GuildSettings = await client.database.settings.get(interaction.guild.id)
        ls = GuildSettings.language
        es = GuildSettings.embed

        command.execute(client, interaction, es, ls, GuildSettings)
        //command.execute(client, interaction, es, ls, GuildSettings)
    }
}