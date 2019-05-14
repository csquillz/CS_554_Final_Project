const mongoCollections = require("../config/mongoCollections");
const pdfs = mongoCollections.pdfs;
const uuid = require("uuid");

let exportedMethods = {

    async getPDF(username) {
        if (!username) throw "Invalid username";
        const pdfCollection = await pdfs();
        return await pdfCollection.find({ username: username }).toArray();
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


    async addPDF(pdfName, username) {
        const pdfCollection = await pdfs();

        let newPDF = {
            id: uuid.v4(),
            pdfName: pdfName,
            username: username,
            comments: []
        };

        let updatedInfo = await pdfCollection.updateOne({ username: username }, { $push: { pdfs: newPDF } });
        if (updatedInfo.modifiedCount === 0) {
            addUser(username)
            updatedInfo = await pdfCollection.updateOne({ username: username }, { $push: { pdfs: newPDF } });
            if (updatedInfo.modifiedCount === 0) {
                throw "could not update pdf successfully";
            }
        }

        return await this.getPDF(username);
    },

    async addComments(pdfName, username, comment, pageNum) {
        const pdfCollection = await pdfs();

        let newComment = {
            id: uuid.v4(),
            comment: comment,
            pageNum: pageNum
        };
        console.log("here?")
        let checkExists = await pdfCollection.find({ username: username, 'pdfs.pdfName': pdfName, "pdfs.comments.pageNum": pageNum }).toArray()

        if (checkExists.length === 0) {
            console.log("here")
            const updatedInfo = await pdfCollection.updateOne({ username: username, 'pdfs.pdfName': pdfName }, { $push: { "pdfs.$.comments": newComment } });
            if (updatedInfo.modifiedCount === 0) {
                throw "could not update pdf successfully";
            }
        } else {
            let i
            let comment = {}
            console.log("here3000")
            // console.log(newpdf[0].pdfs)
            for(i in checkExists[0].pdfs){
                // console.log(newpdf[0].pdfs[i])
                if(checkExists[0].pdfs[i].pdfName == pdfName){
                    for(j in checkExists[0].pdfs[i].comments){
                        if(checkExists[0].pdfs[i].comments[j].pageNum == pageNum){
                            comment = checkExists[0].pdfs[i].comments[j]
                        }   
                    }
                }
            }

            await pdfCollection.updateOne({ username: username, 'pdfs.pdfName': pdfName }, { $pull: { "pdfs.$.comments": comment } });

            const updatedInfo = await pdfCollection.updateOne({ username: username, 'pdfs.pdfName': pdfName }, { $push: { "pdfs.$.comments": newComment } });

            // console.log(deletionInfo.modifiedCount)
            // const updatedInfo = await pdfCollection.updateOne({ username: username, 'pdfs.pdfName': pdfName }, { $push: { "pdfs.$.comments": newComment } });

            // console.log(updatedInfo)
            if (updatedInfo.modifiedCount === 0) {
                throw "could not update pdf successfully";
            }
            console.log("here3?")
        }
        return await this.getPDF(username);
    },
    async getComments(pdfName, username) {
        if (!username) throw "Invalid username";
        const pdfCollection = await pdfs();
        return await pdfCollection.find({ username: username, 'pdfs.pdfName': pdfName }).toArray();
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