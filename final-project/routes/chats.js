const express = require("express");
const router = express.Router();
const data = require("../data");
const chatData = data.chats;


router.get("/", async (req, res) => {
    try {
        const chatList = await chatData.getChatrooms();
        res.json(chatList);
    } catch (e) {
        res.status(500).json({ error: e });
    }
});

//gets chatroom based on the id
// router.get("/:id", async (req, res) => {
//     try {
//         const chatroom = await chatData.getChatroomById(req.params.id);
//         res.json(chatroom);
//     } catch (e) {
//         res.status(404).json({ error: e });
//     }
// });

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

    if (!chatInfo.chatroomName) {
        res.status(400).json({ error: "You must provide chatroomName" });
        return;
    }

    try {
        const { message, chatroomName} = chatInfo
        const newMessage = await chatData.addMessage(message, chatroomName)
        res.json(newMessage);
    } catch (e) {
        res.status(500).json({ error: e });
    }
});

router.get("/messages/:id", async (req, res) => {

    try {
        const allMessages = await chatData.getMessages(req.params.id)
        res.json(allMessages);
    } catch (e) {
        res.status(500).json({ error: e });
    }
});



// router.post("/:id/messages", async (req, res) => {

//     const id = req.params.id;
//     const messageInfo = req.body;

//     if (!messageInfo.username) {
//         res.status(400).json({ error: "You must provide a username" });
//         return;
//     }
//     if (!messageInfo.message) {
//         res.status(400).json({ error: "You must provide a message" });
//         return;
//     }

//     if (typeof messageInfo.username !== "string") {
//         res.status(400).json({ error: "Username not valid" });
//         return;
//     }
//     if (typeof messageInfo.message !== "string") {
//         res.status(400).json({ error: "Message not valid" });
//         return;
//     }

//     try {
//         const { username, message } = messageInfo
//         const newMessage = await chatData.addMessages(id, username, message);
//         res.json(newMessage);
//     } catch (e) {
//         res.status(500).json({ error: e });
//     }
// });

// router.delete("/:chatroomId/:messageId", async (req, res) => {

//     try {
//         await chatData.getChatroomById(req.params.chatId);
//     } catch (e) {
//         res.status(404).json({ error: e });
//     }

//     try {
//         const updatedChat = await chatData.removeMessage(req.params.chatroomId, req.params.messageId);
//         res.json(updatedChat);
//     } catch (e) {
//         res.status(500).json({ error: e });
//     }
// });

module.exports = router;