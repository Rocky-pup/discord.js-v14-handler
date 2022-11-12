const config = require(`${process.cwd()}/config/config.json`)
const { ActivityType } = require('discord.js');
const moment = require("moment")
module.exports = async (client) => {
    client.webhook(false, "Ready", "Now bot is ready for work")
    client.logger("READY")
    change_status(client);
    //loop through the status per each 15 seconds
    setInterval(()=>{
      change_status(client);
    }, 15e3);
}
var state = false;
async function change_status(client){
  if(!state){
    for(id of client.cluster.ids.map(s => s.id)){
        client.user.setPresence({
            activities: [{ name: `${config.status.text2}`
            .replace("{created}", moment(client.user.createdTimestamp).format("DD/MM/YYYY"))
            .replace("{createdime}", moment(client.user.createdTimestamp).format("HH:mm:ss"))
            .replace("{name}", client.user.username)
            .replace("{tag}", client.user.tag)
            , type: ActivityType[config.status.activity2] }],
            status: config.status.status,
          });
    }
  } else {
    for(id of client.cluster.ids.map(s => s.id)){
        client.user.setPresence({
            activities: [{ name: `${config.status.text}`
            .replace("{created}", moment(client.user.createdTimestamp).format("DD/MM/YYYY"))
            .replace("{createdime}", moment(client.user.createdTimestamp).format("HH:mm:ss"))
            .replace("{name}", client.user.username)
            .replace("{tag}", client.user.tag)
            , type: ActivityType[config.status.activity1] }],
            status: config.status.status,
          });
    }
    
  }
  state = !state;
}