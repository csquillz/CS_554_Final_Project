const express = require("express");
const router = express.Router();
const data = require("../data");
const userData = data.users;
const chatData = data.chats;

//log all req bodies
router.use(function (req, res, next) {
    console.log("________________________________________________________")
    console.log("A " + req.method + " request was made to " + req.protocol + "://" + req.get("host") + req.originalUrl + " containing: \n" + JSON.stringify(req.body));
    console.log("________________________________________________________")
    next();
});

//number of requests that have been made to the current path
const paths = {};
router.use(function (req, res, next) {
    if (!paths[req.path]) {
        paths[req.path] = 0
    }
    paths[req.path]++;

    console.log("________________________________________________________")
    console.log("You visited " + req.protocol + "://" + req.get("host") + req.originalUrl + " " + paths[req.path] + " number of times.");
    console.log("________________________________________________________")
    next();
});

router.get("/", async (req, res) => {
    let skipNum = parseInt(req.query.skip)
    let takeNum = parseInt(req.query.take)

    //default to 0 is not provided or not a number
    if (isNaN(skipNum)){
        skipNum = 0
    }

    //default to 20 is not provided or not a number
    if(isNaN(takeNum)){
        takeNum = 20
    }else if (takeNum > 100){ //throw error if take num is over 100
        res.status(400).json({ error: "You must provide a valid take number less than 100" });
        return;
    }

    try {
        const chatList = await chatData.getFirstNChatrooms(skipNum, takeNum);
        res.json(chatList);
    } catch (e) {
        res.status(500).json({ error: e });
    }
});

//gets chatroom based on the id
router.get("/:id", async (req, res) => {
    try {
        const chatroom = await chatData.getChatroomById(req.params.id);
        res.json(chatroom);
    } catch (e) {
        res.status(404).json({ error: e });
    }
});

//posts a chatroom with an empty comment array
router.post("/", async (req, res) => {
    const chatInfo = req.body;

    if (!chatInfo.username) {
        res.status(400).json({ error: "You must provide a username" });
        return;
    }
    if (!chatInfo.chatroomName) {
        res.status(400).json({ error: "You must provide chatroomName" });
        return;
    }
    


    if (typeof chatInfo.username !== "string") {
        res.status(400).json({ error: "Username not valid" });
        return;
    }
    if (typeof chatInfo.name !== "string") {
      res.status(400).json({ error: "Chatroom Name not valid" });
      return;
    } 
    

    try {
        const { username, chatroomName} = chatInfo
        const newChat = await chatData.addChatroom(username, chatroomName);
        res.json(newChat);
    } catch (e) {
        res.status(500).json({ error: e });
    }
});


router.post("/:id/messages", async (req, res) => {

    const id = req.params.id;
    const messageInfo = req.body;

    if (!messageInfo.username) {
        res.status(400).json({ error: "You must provide a username" });
        return;
    }
    if (!messageInfo.message) {
        res.status(400).json({ error: "You must provide a message" });
        return;
    }

    if (typeof messageInfo.username !== "string") {
        res.status(400).json({ error: "Username not valid" });
        return;
    }
    if (typeof messageInfo.message !== "string") {
        res.status(400).json({ error: "Message not valid" });
        return;
    }

    try {
        const { username, message } = messageInfo
        const newMessage = await chatData.addMessages(id, username, message);
        res.json(newMessage);
    } catch (e) {
        res.status(500).json({ error: e });
    }
});

router.delete("/:chatroomId/:messageId", async (req, res) => {

    try {
        await chatData.getChatroomById(req.params.chatId);
    } catch (e) {
        res.status(404).json({ error: e });
    }

    try {
        const updatedChat = await chatData.removeMessage(req.params.chatroomId, req.params.messageId);
        res.json(updatedChat);
    } catch (e) {
        res.status(500).json({ error: e });
    }
});

module.exports = router;