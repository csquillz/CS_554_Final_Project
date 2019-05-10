const mongoCollections = require("../config/mongoCollections");
const users = mongoCollections.users;
const chats = mongoCollections.chats;
const uuid = require("uuid");

let exportedMethods = {
    async getFirstNMessages(skipNum, takeNum) {
        const chatsCollection = await chats();
        return await chatsCollection.find().skip(skipNum).limit(takeNum).toArray();
    },
    async getChatroomById(id) {
        if (!id) throw "Invalid ID";
        return chats().then(chatCollection => {
            return chatCollection.findOne({ _id: id }).then(chat => {
                if (!chat) throw "Chatroom not found";
                return chat;
            });
        });
    },
    async addChatroom(username, chatroomName) {
        return chats().then(chatCollection => {
            let newChat = {
                _id: uuid.v4(),
                username: username,
                chatroomName: chatroomName,
                messages: []
            };

            return chatCollection
                .insertOne(newChat)
                .then(newInsertInformation => {
                    return newInsertInformation.insertedId;
                })
                .then(newId => {
                    return this.getUserById(newId);
                });
        });
    },
    
    
    async addMessages(id, chatroomId, username, message) {
        const chatCollection = await chats();
        
        let newMessage = {
            id: uuid.v4(),
            chatroomId: chatroomId,
            username: username,
            message: message
        };

        const updatedInfo = await chatCollection.updateOne({ _id: id }, { $push: {messages: newMessage}});

        if (updatedInfo.modifiedCount === 0) {
            throw "could not update chat successfully";
        }

        return await this.getUserById(id);
    },
    async removeMessage(userId, messageId) {
        const chatCollection = await chats();
        const deletionInfo = await chatCollection.updateOne({_id: userId}, {$pull: {messages: {id:messageId}}});
        if (deletionInfo.modifiedCount === 0) {
            throw `Could not delete message with id of ${messageId}`;
        }
        return await this.getUserById(userId);
    }
};

module.exports = exportedMethods;