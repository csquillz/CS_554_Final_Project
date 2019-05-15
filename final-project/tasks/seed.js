const dbConnection = require("../config/mongoConnection");
const data = require("../data/");
const chats = data.chats;

const bluebird = require("bluebird");
const redis = require("redis");
const client = redis.createClient();

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

client.flushdb()

dbConnection().then(
    db => {
        return db
            .dropDatabase()
            .then(() => {
                return dbConnection;
            })
            .then(db => {
            return chats.addChatroom("Select a Room").then(() =>{
                return chats.addChatroom("CS554");
            })

            })
            .then(() => {
                console.log("Done seeding database");
                db.serverConfig.close();
            })
    },
    error => {
        console.error(error);
    });