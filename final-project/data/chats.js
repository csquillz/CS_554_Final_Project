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
    },
    
    
    async addMessage(message, chatroomName) {
        const chatCollection = await chats();
        
        let newMessage = {
            id: uuid.v4(),
            message: message
        };

        const updatedInfo = await chatCollection.updateOne({ chatroomName: chatroomName }, { $push: {messages: newMessage}});
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
//     async removeMessage(chatroomId, messageId) {
//         const chatCollection = await chats();
//         const deletionInfo = await chatCollection.updateOne({_id: userId}, {$pull: {messages: {id:messageId}}});
//         if (deletionInfo.modifiedCount === 0) {
//             throw `Could not delete message with id of ${messageId}`;
//         }
//         return await this.getChatroomById(chatroomId);
//     }
// };

module.exports = exportedMethods;