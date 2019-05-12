const mongoCollections = require("../config/mongoCollections");
const pdfs = mongoCollections.pdfs;
const uuid = require("uuid");

let exportedMethods = {

    async getPDF(username) {
        if (!username) throw "Invalid username";
        const pdfCollection = await pdfs();
        return await pdfCollection.find({username: username}).toArray();
    },

    async addUser(username) {
        return pdfs().then(pdfCollection => {
            let newUser = {
                _id: uuid.v4(),
                username: username,
                pdfs: []
            };

            return pdfCollection
                .insertOne(newUser)
                .then(newInsertInformation => {
                    return newInsertInformation.insertedId;
                })
                .then(newId => {
                    return this.getPDF(username);
                });
        });
    },
    

    async addPDF(pdfName, pdf, username) {
        const pdfCollection = await pdfs();
        
        let newPDF= {
            id: uuid.v4(),
            pdfName: pdfName,
            pdf: pdf,
            username: username,
            comments: []
        };

        const updatedInfo = await pdfCollection.updateOne({ username: username }, { $push: {pdfs: newPDF}});
        if (updatedInfo.modifiedCount === 0) {
            throw "could not update pdf successfully";
        }

        return await this.getPDF(username);
    },

    async addComments(pdfName, username, comment, pageNum) {
        const pdfCollection = await pdfs();
        
        let newComment= {
            id: uuid.v4(),
            comment: comment,
            pageNum: pageNum
        };

    
        const updatedInfo = await pdfCollection.updateOne({username: username, 'pdfs.pdfName': pdfName}, { $push: {"pdfs.$.comments": newComment}});
        if (updatedInfo.modifiedCount === 0) {
            throw "could not update pdf successfully";
        }

        return await this.getPDF(username);
    },

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