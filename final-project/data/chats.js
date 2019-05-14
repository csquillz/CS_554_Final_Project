const mongoCollections = require("../config/mongoCollections");
const users = mongoCollections.users;
const chats = mongoCollections.chats;
const uuid = require("uuid");

let exportedMethods = {
    async getChatrooms() {
        const chatsCollection = await chats();
        return await chatsCollection.find().toArray();
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

    async getChatroomByName(id) {
        if (!id) throw "Invalid ID";
        return chats().then(chatCollection => {
            return chatCollection.findOne({ chatroomName: id }).then(chat => {
                if (!chat) throw "Chatroom not found";
                return chat;
            });
        });
    },

    async addChatroom(chatroomName) {
        let rooms = await this.getChatrooms()

        let room = rooms.find(function (elem) {
            return elem.chatroomName == chatroomName
        })

        if (room) {
            return chats().then(chatCollection => {
                let newChat = {
                    _id: uuid.v4(),
                    chatroomName: chatroomName,
                    messages: []
                };

                return chatCollection
                    .insertOne(newChat)
                    .then(newInsertInformation => {
                        return newInsertInformation.insertedId;
                    })
                    .then(newId => {
                        return this.getChatroomById(newId);
                    });
            });
        }else{
            return false
        }
    },


    async addMessage(message, chatroomName) {
        const chatCollection = await chats();

        let newMessage = {
            id: uuid.v4(),
            message: message
        };

        const updatedInfo = await chatCollection.updateOne({ chatroomName: chatroomName }, { $push: { messages: newMessage } });
        if (updatedInfo.modifiedCount === 0) {
            throw "could not update chat successfully";
        }

        return await this.getChatroomByName(chatroomName);
    },

    async getMessages(chatroomName) {
        const chatCollection = await chats();

        let chatRoom = await this.getChatroomByName(chatroomName)

        return chatRoom.messages

    }

}

module.exports = exportedMethods;