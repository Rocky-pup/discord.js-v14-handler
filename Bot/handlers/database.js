const config = require(`${process.cwd()}/config/config.json`);
const colors = require("colors");
const Josh = require('@joshdb/core');
const JoshMongo = require('@joshdb/mongo');

module.exports = async (client) => {
    return new Promise(async (res) => {

        const connectionOptions = {
            useUnifiedTopology: true,
            maxPoolSize: 100,
            minPoolSize: 50,
            writeConcern: "majority",
        };
         
        // CACHE DURATION OPTIONS
        process.env.DB_cache_ping = 10_000; // Delete the cache after X ms | < 0 === never delete [DEFAULT: 60_000]
        process.env.DB_cache_get = 10_000; // Delete the cache after X ms | < 0 === never delete [DEFAULT: 300_000]
        process.env.DB_cache_all = 10_000; // Delete the cache after X ms | < 0 === never delete [DEFAULT: 600_000]
        // You can also add: db.get(key, true) // to force-fetch the db

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
              dbName: "test"
            },
        });
        client.database.settings.defer.then( async () => {
            client.logger("Database connected!")
            client.webhook(false, "Database connected!")
        });
    })
}