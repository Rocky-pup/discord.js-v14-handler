const { WebhookClient, EmbedBuilder, Collection } = require("discord.js")
const config = require(`${process.cwd()}/config/config.json`)
const fs = require("fs")
const moment = require("moment")

module.exports = async (client) => {
    // config
    client.config = global = config

    //commands
    client.commands = new Collection();
    client.slashCommands = new Collection();
    client.cooldowns = new Collection();

    // languages
    client.la = {}
    var langs = fs.readdirSync(`${process.cwd()}/languages`)
    for (const lang of langs.filter(file => file.endsWith(".json"))) {
    client.la[`${lang.split(".json").join("")}`] = require(`${process.cwd()}/languages/${lang}`)
    }
    Object.freeze(client.la)

    // webhook
    const webhookClient = new WebhookClient({ url: `${client.config.webhook}` });

    client.webhook = async (type, title, description, color) => {
        const embed = new EmbedBuilder()
        .setTitle(`${title}`)
        .setColor(color || type ? client.config.embed.wrongcolor : client.config.embed.color)
        .setTimestamp();
        description ? embed.setDescription(`${description}`) : null

        await webhookClient.send({
            embeds: [embed],
        });
    }

    // logger
    client.logger = (data) => {
        let logstring = `${String("[x] ::".magenta)}`
        if (typeof data == "string") {
          console.log(logstring, data.split("\n").map(d => `${d}`.green).join(`\n${logstring} `))
        } else if (typeof data == "object") {
          console.log(logstring, JSON.stringify(data, null, 3).green)
        } else if (typeof data == "boolean") {
          console.log(logstring, String(data).cyan)
        } else {
          console.log(logstring, data)
        }
    };

    // easy footer
    client.getFooter = (es, stringurl = null) => { 
      //allow inputs: ({footericon, footerurl}) and (footericon, footerurl);
      let embedData = { };
      if(typeof es !== "object") {
        if (typeof es !== "string") embedData = { footertext: es.footertext, footericon: stringurl || es.footericon }
        else embedData = { footertext: es, footericon: stringurl };
      }
      else embedData = es;
  
      let text = embedData.footertext;
      let iconURL = stringurl? stringurl : embedData.footericon;
      if(!text || text.length < 1) text = `${client.user.username} | By: Rocky#7890`;
      if(!iconURL || iconURL.length < 1) iconURL = `${client.user.displayAvatarURL()}`;
      //Change the lengths
      iconURL = iconURL.trim();
      text = text.trim().substring(0, 2000);
      
      //verify the iconURL
      if(!iconURL.startsWith("https://") && !iconURL.startsWith("http://")) iconURL = client.user.displayAvatarURL();
      if(![".png", ".jpg", ".wpeg", ".webm", ".gif", ".webp"].some(d => iconURL.toLowerCase().endsWith(d))) iconURL = client.user.displayAvatarURL();
      //return the footerobject
      return { text, iconURL }
    }
  
    // easy author
    client.getAuthor = (authorname = null, authoricon = null, authorurl = null) => {
      //allow inputs: ({footericon, footerurl}) and (footericon, footerurl);
      let name = authorname;
      let iconURL = authoricon;
      let url = authorurl;
  
      if(!name || name.length < 1) name = `${client.user.username} | By: Rocky#7890`;
      if(!iconURL || iconURL.length < 1) iconURL = `${client.user.displayAvatarURL()}`;
      if(!url || url.length < 1) url = `https://dsc.gg/banditcamp`;
  
      //Change the lengths
      iconURL = iconURL.trim();
      name = `${name.trim().substring(0, 2048)}`
      
      //verify the iconURL
      if(!url.startsWith("https://") && !url.startsWith("http://")) url = `https://dsc.gg/banditcamp`;
      if(!iconURL.startsWith("https://") && !iconURL.startsWith("http://")) iconURL = client.user.displayAvatarURL();
      if(![".png", ".jpg", ".wpeg", ".webm", ".gif"].some(d => iconURL.toLowerCase().endsWith(d))) iconURL = client.user.displayAvatarURL();
      //return the footerobject
      return { name: name, iconURL: iconURL, url: url }
    }
}