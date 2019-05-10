const mongoCollections = require("../config/mongoCollections");
const users = mongoCollections.users;
const uuid = require("uuid");

let exportedMethods = {
    async getFirstNUsers(skipNum, takeNum) {
        const usersCollection = await users();
        return await usersCollection.find().skip(skipNum).limit(takeNum).toArray();
    },
    async getUserById(id) {
        if (!id) throw "Invalid ID";
        return users().then(userCollection => {
            return userCollection.findOne({ _id: id }).then(user => {
                if (!user) throw "User not found";
                return user;
            });
        });
    },
    async addUser(username, name, email) {
        return users().then(userCollection => {
            let newUser = {
                _id: uuid.v4(),
                username: username,
                name: name,
                email: email,
                comments: []
            };

            return userCollection
                .insertOne(newUser)
                .then(newInsertInformation => {
                    return newInsertInformation.insertedId;
                })
                .then(newId => {
                    return this.getUserById(newId);
                });
        });
    },
    async updateUser(id, username, name, email) {
        const userCollection = await users();

        const oldItem = await this.getUserById(id)

        let updatedUser = {
            _id: id,
            username: username,
            name: name,
            email: email,
            comments: oldItem.comments
        };

        const updatedInfo = await userCollection.updateOne({ _id: id }, { $set: updatedUser });

        if (updatedInfo.modifiedCount === 0) {
            throw "could not update user successfully";
        }
        return await this.getUserById(id);
    },
    async patchUser(id, updatedUser) {

        const userCollection = await users();

        const patchedInfo = await userCollection.updateOne({ _id: id }, { $set: updatedUser });

        if (patchedInfo.modifiedCount === 0) {
            throw "could not patch user successfully";
        }
        return await this.getUserById(id)
    },
    async addComment(id, username, name, comment) {
        const userCollection = await users();
        
        let newComment = {
            id: uuid.v4(),
            username: username,
            name: name,
            comment: comment
        };

        const updatedInfo = await userCollection.updateOne({ _id: id }, { $push: {comments: newComment}});

        if (updatedInfo.modifiedCount === 0) {
            throw "could not update user successfully";
        }

        return await this.getUserById(id);
    },
    async removeComment(userId, commentId) {
        const userCollection = await users();
        const deletionInfo = await userCollection.updateOne({_id: userId}, {$pull: {comments: {id:commentId}}});
        if (deletionInfo.modifiedCount === 0) {
            throw `Could not delete comment with id of ${commentId}`;
        }
        return await this.getUserById(userId);
    }
};

module.exports = exportedMethods;