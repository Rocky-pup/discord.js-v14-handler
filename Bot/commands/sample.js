const {SlashCommandBuilder} = require("discord.js")

module.exports = {
    options:                                    // use SlashCommandBuilder()
        new SlashCommandBuilder()
        .setName('sample')
        .setDescription("Something")
        .setDMPermission(false)
        .addSubcommandGroup(group =>
            group
            .setName("sample_group")
            .setDescription("Sample")
            .addSubcommand(subcommand =>
                subcommand
                .setName("sample_group_command")
                .setDescription("Sample")    
            )    
        )
        .addSubcommand(subcommand =>
            subcommand    
            .setName("sample_subcommand")
            .setDescription("Sample")  
            .addUserOption(option => 
                option
                .setName("sample_user_option")
                .setDescription("Sample")  
                .setRequired(true)
            )  
            .addStringOption(option => 
                option
                .setName("sample_string_option")
                .setDescription("string = text")  
            )  
        )
        .toJSON(),
    config: {
        enabled: true,  // is command enabled?
        owner: false    // is command need to be uploaded only for owner guilds (in config)
    },
    execute: async (client, interaction, es, ls = "en", GuildSettings) => {
        // command code

        switch (interaction.options.getSubcommandGroup()){
            case "sample_group": {
                interaction.reply("Any group command used")
            }
        }
        switch (interaction.options.getSubcommand()){
            case "sample_subcommand": {
                interaction.reply("Used sample subcommand")
            }break;
            case "sample_group_command": {
                interaction.reply("Used sample group command")
            }
        }
    }
}