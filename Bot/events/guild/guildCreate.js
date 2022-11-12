//The Module
const { EmbedBuilder } = require("discord.js")
const config = require(`${process.cwd()}/config/config.json`)
module.exports = async (client, guild) => {
client.logger(`Joined a new Guild: ${guild.name} (${guild.id}) | Members: ${guild.memberCount} | Current-Average Members/Guild: ${Math.floor(client.guilds.cache.filter((e) => e.memberCount).reduce((a, g) => a + g.memberCount, 0) / client.guilds.cache.size)}`.brightGreen)
if (!guild || guild.available === false) return
let theowner = "NO OWNER DATA! ID: ";
await guild.fetchOwner().then(({
    user
}) => {
    theowner = user;
}).catch(() => {})
let embed = new EmbedBuilder()
.setColor("00FF00")
.setTitle(`<a:Join_vc:950885408290508821> Joined a New Server`)
.addFields([
    { name: "Guild Info", value: `>>> \`\`\`${guild.name} (${guild.id})\`\`\``, },
    { name: "Owner Info", value: `>>> \`\`\`${theowner ? `${theowner.tag} (${theowner.id})` : `${theowner} (${guild.ownerId})`}\`\`\``,  },
    { name: "Member Count", value: `>>> \`\`\`${guild.memberCount}\`\`\``, },
    { name: "Servers Bot is in", value: `>>> \`\`\`${client.guilds.cache.size}\`\`\``, },
    { name: "Leave Server:", value: `>>> \`\`\`/owner leaveserver ${guild.id}\`\`\``, },
])
.setThumbnail(guild.iconURL({dynamic: true}));
for (const owner of config.ownerIDS) {
    client.users.fetch(owner).then(user => {
    user.send({
        embeds: [embed]
    }).catch(() => {})
    }).catch(() => {});
}
}