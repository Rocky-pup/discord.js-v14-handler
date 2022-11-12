const config = require(`${process.cwd()}/config/config.json`);
const colors = require("colors");
const Josh = require('@joshdb/core');
const JoshMongo = require('@joshdb/mongo');

module.exports = async (client) => {
    return new Promise(async (res) => {

        let dateNow = Date.now();
        client.logger("Now loading the Database ...")
        client.webhook(false, "Now loading the Database ...")
        client.database = {}
        // when the db is ready
        client.database.settings = new Josh({
            name: "settings",
            provider: JoshMongo,
            providerOptions: {
              url: config.mongo,
              collection: "settings",
              dbName: "rocky_handler"
            },
        });
        client.database.settings.defer.then( async () => {
            client.logger("Database connected!")
            client.webhook(false, "Database connected!")
        });
    })
}
