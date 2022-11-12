const {SlashCommandBuilder} = require("discord.js")

module.exports = {
    options: 
        new SlashCommandBuilder()
        .setName('ping')
        .setDescription("Bot's ping")
        .setDescriptionLocalizations(
          {"ru": "Пинг бота"}
        )
        .setNameLocalizations(
          {"ru": "пинг"}
          )
        .setDMPermission(true)
        .toJSON(),
    config: {
        enabled: true,
        owner: false
    },
    execute: async (client, interaction, es, ls = "en", GuildSettings) => {
        interaction.reply(eval(client.la[ls].cmds.ping.variable1))
    }
}