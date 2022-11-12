module.exports = {
    delay,
    clearDBData,
    GuildDatabasing
}

async function clearDBData(client, key) {
}

async function GuildDatabasing(client, guild){
  await client.database.settings.ensure(guild.id, {
    language: "en",
    embed: {
      color: `${client.config.embed.color}`,
      wrongcolor: `${client.config.embed.wrongcolor}`,
      footertext: "Erry The Best",
      footericon: ""
    }
  })
}

async function delay(delayInms) {
    try {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(2);
        }, delayInms);
      });
    } catch (e) {
      console.error(e)
    }
}