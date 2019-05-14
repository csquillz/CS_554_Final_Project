const express = require("express");
const router = express.Router();
const data = require("../data");
const chatData = data.chats;
const bluebird = require("bluebird");
const redis = require("redis");
const client = redis.createClient();

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

router.get("/", async (req, res) => {
    try {
        const chatList = await chatData.getChatrooms();
        res.json(chatList);
    } catch (e) {
        res.status(500).json({ error: e });
    }
});

router.post("/", async (req, res) => {
    try {
        const chatroom = await chatData.addChatroom(req.body.chatroomName);
        res.json(chatroom);
    } catch (e) {
        res.status(404).json({ error: e });
    }
});

router.post("/messages", async (req, res) => {
    const chatInfo = req.body;

    // await client.flushdb()
    if (!chatInfo.chatroomName) {
        res.status(400).json({ error: "You must provide chatroomName" });
        return;
    }

    try {
        const { message, chatroomName} = chatInfo
        const newMessage = await chatData.addMessage(message, chatroomName)
        const jsonMessage = JSON.stringify(message);
        
        let messageLength = await client.llenAsync(chatroomName);

        if (messageLength === 15) {
            await client.lpopAsync(chatroomName)
        }

        let me = await client.rpushAsync(chatroomName, jsonMessage)
        // console.log(await client.lrangeAsync(chatroomName, 0, -1))
        res.json(newMessage);
    } catch (e) {
        res.status(500).json({ error: e });
    }

});

router.get("/messages/:id", async (req, res) => {
    try {
        //await client.flushdb()
        let msgList = [];
        msgList = await client.lrangeAsync(req.params.id, 0, -1)
        for (let i = 0; i < msgList.length; i++) {
            msgList[i] = JSON.parse(msgList[i]);
        }
        console.log(msgList)
        res.json(msgList);

    } catch (e) {
        res.status(500).json({ error: e });
    }
});

module.exports = router;