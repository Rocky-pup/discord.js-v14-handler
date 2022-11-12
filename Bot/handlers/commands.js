const { WebhookClient, EmbedBuilder, Collection, SlashCommandBuilder } = require("discord.js")
const config = require(`${process.cwd()}/config/config.json`)
const fs = require("fs")
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord.js');
const { readdirSync, lstatSync } = require("fs");
const rest = new REST({ version: '10' }).setToken(config.token);

module.exports = async (client) => {
  var commands = [];
  var restrictedcommands = [];

  var commandFiles = fs.readdirSync(`${process.cwd()}/commands`)
  for (const file of commandFiles) {
    var command = require(`${process.cwd()}/commands/${file}`);
    if (!command.config.enabled) continue;
    client.slashCommands.set(command.options.name, command)
    if (command.config?.owner) {
      restrictedcommands.push(command.options)
      continue;
    }
    commands.push(command.options);
  }
  if (client.commands.size > 0) {
    await push();
  }

  		(async () => {
			try {

				await rest.put(
					Routes.applicationCommands(client.config.botid),
					{ body: commands },
				);				
				client.commands = client.slashCommands.filter((c) => c.options.name);
			} catch (error) {
				console.error(error);
			}
		})();
  config.adminguilds.forEach(async (guild) => {
    try {
      await rest.put(
        Routes.applicationGuildCommands(client.config.botid, guild),
        { body: restrictedcommands },
      );			
    } catch (error) {
      console.error(error);
    }
  });

  async function push(){
    const commands = readdirSync(`./commands/`).filter((file) => file.endsWith(".js"));
    for (let file of commands) {
    var command = require(`${process.cwd()}/commands/${file}`);
    try{
      await client.machine.broadcastEval(async (c, ctx) => {
      let thecmd = ctx;
      if(thecmd){
        try {
        delete require.cache[require.resolve(`${process.cwd()}/commands/${thecmd.options.name}`)] // usage !reload <name>
        const pull = require(`${process.cwd()}/commands/${thecmd.options.name}`)
        c.slashCommands.set(thecmd.options.name, pull)
        return { success: true, error: false };
        } catch (e) {
        console.error(e)
        return { success: false, error: e };
        }
      }
      require(`${process.cwd()}/bot`).slashCommandsRegister()
      return true;
      }, { context: command })
      
    }catch(e){
      console.error(e)
    }
    }
  }
}