const {SlashCommandBuilder} = require("discord.js")
const Discord = require("discord.js")
module.exports = {
    options: 
        new SlashCommandBuilder()
        .setName('language')
        .setDescription("Change bot's language")
        .setDescriptionLocalizations(
            {"ru": "Поменять язык бота"}
        )
        .setNameLocalizations(
            {"ru": "язык"}
        )
        .setDefaultMemberPermissions("8")
        .addStringOption(option =>
            option  
            .setName('language')
            .setDescription("Which language you need?")
            .setDescriptionLocalizations(
            {"ru": "Какой язык вам нужен?"}
            )
            .setNameLocalizations(
            {"ru": "язык"}
            )
            .setRequired(true)
            .addChoices(
                { name: '🇺🇸 English', value: 'en', name_localizations: {
                ru: "🇺🇸 Английский"
                } },
                { name: '🇷🇺 Russian', value: 'ru', name_localizations: {
                ru: "🇷🇺 Русский"
                } },
                { name: 'RESET', value: 'reset', name_localizations: {
                ru: "СБРОС"
                } },
            )
        )
        .setDMPermission(false)
        .toJSON(),
    config: {
        enabled: true,
        owner: false
    },
    execute: async (client, interaction, es = client.config.embed, ls = "en", GuildSettings) => {
        if ([...interaction.member.roles.cache.values()] && !Array(interaction.guild.ownerId, client.config.ownerIDS).includes(interaction.user?.id) && !interaction.member?.permissions?.has([PermissionsBitField.Flags.Administrator])){
            interaction.reply({embeds : [new EmbedBuilder()
              .setColor(es.wrongcolor)
              .setFooter(client.getFooter(es))
              .setTitle(client.la[ls]["common"]["adminp"]["admin"])
            ]});
            setTimeout(async () => {
                if (interaction) await interaction.deleteReply()
            }, 10000);
            return;
          }
            
          let languages = {
            "en": "🇺🇸 English",
            "ru": "🇷🇺 Russian"
          }
      
          var lang = interaction.options.getString("language");
          if (lang == "reset") {
            await client.database.settings.set(interaction.guild.id+".language", "en");
            interaction.reply({embeds: [new Discord.EmbedBuilder()
              .setTitle(eval(client.la[ls]["cmds"]["language"]["variable2"]))
              .setColor(es.color)
              .setFooter(client.getFooter(es))]
            });
            setTimeout(async () => {
              if (interaction) await interaction.deleteReply()
            }, 10000);
            return;
          }
          await client.database.settings.set(interaction.guild.id+".language", lang);
          interaction.reply({embeds: [new Discord.EmbedBuilder()
              .setTitle(eval(client.la[ls]["cmds"]["language"]["variable1"]))
              .setColor(es.color)
              .setFooter(client.getFooter(es))]
          });
          return;
    }
}