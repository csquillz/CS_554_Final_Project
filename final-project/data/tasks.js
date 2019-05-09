const mongoCollections = require("../config/mongoCollections");
const tasks = mongoCollections.tasks;
const uuid = require("uuid");

let exportedMethods = {
    async getFirstNTasks(skipNum, takeNum) {
        const tasksCollection = await tasks();
        return await tasksCollection.find().skip(skipNum).limit(takeNum).toArray();
    },
    async getTaskById(id) {
        if (!id) throw "Invalid ID";
        return tasks().then(taskCollection => {
            return taskCollection.findOne({ _id: id }).then(task => {
                if (!task) throw "Task not found";
                return task;
            });
        });
    },
    async addTask(title, description, hoursEstimated, completed) {
        return tasks().then(taskCollection => {
            let newTask = {
                _id: uuid.v4(),
                title: title,
                description: description,
                hoursEstimated: hoursEstimated,
                completed: completed,
                comments: []
            };

            return taskCollection
                .insertOne(newTask)
                .then(newInsertInformation => {
                    return newInsertInformation.insertedId;
                })
                .then(newId => {
                    return this.getTaskById(newId);
                });
        });
    },
    async updateTask(id, title, description, hoursEstimated, completed) {
        const taskCollection = await tasks();

        const oldItem = await this.getTaskById(id)

        let updatedTask = {
            _id: id,
            title: title,
            description: description,
            hoursEstimated: hoursEstimated,
            completed: completed,
            comments: oldItem.comments
        };

        const updatedInfo = await taskCollection.updateOne({ _id: id }, { $set: updatedTask });

        if (updatedInfo.modifiedCount === 0) {
            throw "could not update task successfully";
        }
        return await this.getTaskById(id);
    },
    async patchTask(id, updatedTask) {

        const taskCollection = await tasks();

        const patchedInfo = await taskCollection.updateOne({ _id: id }, { $set: updatedTask });

        if (patchedInfo.modifiedCount === 0) {
            throw "could not patch task successfully";
        }
        return await this.getTaskById(id)
    },
    async addComment(id, name, comment) {
        const taskCollection = await tasks();
        
        let newComment = {
            id: uuid.v4(),
            name: name,
            comment: comment
        };

        const updatedInfo = await taskCollection.updateOne({ _id: id }, { $push: {comments: newComment}});

        if (updatedInfo.modifiedCount === 0) {
            throw "could not update task successfully";
        }

        return await this.getTaskById(id);
    },
    async removeComment(taskId, commentId) {
        const taskCollection = await tasks();
        const deletionInfo = await taskCollection.updateOne({_id: taskId}, {$pull: {comments: {id:commentId}}});
        if (deletionInfo.modifiedCount === 0) {
            throw `Could not delete comment with id of ${commentId}`;
        }
        return await this.getTaskById(taskId);
    }
};

module.exports = exportedMethods;