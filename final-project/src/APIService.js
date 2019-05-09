const express = require("../node_modules/express");
const router = express.Router();
const data = require("../data");
const taskData = data.tasks;

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
        const taskList = await taskData.getFirstNTasks(skipNum, takeNum);
        res.json(taskList);
    } catch (e) {
        res.status(500).json({ error: e });
    }
});

//gets task based on the id
router.get("/:id", async (req, res) => {
    try {
        const task = await taskData.getTaskById(req.params.id);
        res.json(task);
    } catch (e) {
        res.status(404).json({ error: e });
    }
});

//posts a task with an empty comment array
router.post("/", async (req, res) => {
    const taskInfo = req.body;

    if (!taskInfo.title) {
        res.status(400).json({ error: "You must provide a title" });
        return;
    }
    if (!taskInfo.description) {
        res.status(400).json({ error: "You must provide description" });
        return;
    }
    if (!taskInfo.hoursEstimated) {
        res.status(400).json({ error: "You must provide hours estimated" });
        return;
    }
    if (typeof (taskInfo.completed) === "undefined") {
        res.status(400).json({ error: "You must provide a completed status" });
        return;
    }

    // if (!taskInfo.comments) {
    //     res.status(400).json({ error: "You must provide comments here" });
    //     return;
    // }

    if (typeof taskInfo.title !== "string") {
        res.status(400).json({ error: "Title not valid" });
        return;
    }
    if (typeof taskInfo.description !== "string") {
      res.status(400).json({ error: "Description not valid" });
      return;
    } 
    if (typeof taskInfo.hoursEstimated !== "number"){
        res.status(400).json({ error: "Hours estimated not valid" });
        return;
    } 
    if (typeof taskInfo.completed !== "boolean") {
        res.status(400).json({ error: "Completed status not valid" });
        return;
    }
    // if (typeof taskInfo.comments !== "object") {
    //     res.status(400).json({ error: "Comments not valid" });
    //     return;
    // }

    try {
        const { title, description, hoursEstimated, completed} = taskInfo
        const newTask = await taskData.addTask(title, description, hoursEstimated, completed);
        res.json(newTask);
    } catch (e) {
        res.status(500).json({ error: e });
    }
});

router.put("/:id", async (req, res) => {
    const id = req.params.id;
    const updatedData = req.body;

    if (!updatedData.title) {
        res.status(400).json({ error: "You must provide a valid title" });
        return;
    }
    if (!updatedData.description) {
        res.status(400).json({ error: "You must provide valid description" })
        return;
    }
    if (!updatedData.hoursEstimated) {
        res.status(400).json({ error: "You must provide valid hours estimated" });
        return;
    }
    if (typeof (updatedData.completed) === "undefined") {
        res.status(400).json({ error: "You must provide a valid completed status" });
        return;
    }
    // if (!updatedData.comments) {
    //     res.status(400).json({ error: "You must provide a valid comment object" });
    //     return;
    // }

    if (typeof updatedData.title !== "string") {
        res.status(400).json({ error: "Title not provided" });
        return;
    }
    if (typeof updatedData.description !== "string") {
        res.status(400).json({ error: "Description not provided" });
        return;
    }
    if (typeof updatedData.hoursEstimated !== "number") {
        res.status(400).json({ error: "Hours estimated not provided" });
        return;
    }
    if (typeof updatedData.completed !== "boolean") {
        res.status(400).json({ error: "Completed status not provided" });
        return;
    }
    // if (typeof updatedData.comments !== "object") res.status(400).json({ error: "Comments not provided" });

    try {
        await taskData.getTaskById(id)
    } catch (e) {
        res.status(404).json({ error: e });
    }

    try {
        const { title, description, hoursEstimated, completed} = updatedData
        const updatedTask = await taskData.updateTask(id, title, description, hoursEstimated, completed);
        res.json(updatedTask);
    } catch (e) {
        res.status(500).json({ error: e });
    }

});

router.patch("/:id", async (req, res) => {
    const id = req.params.id;
    let updatedData = req.body;

    if (updatedData.title && typeof updatedData.title !== "string") {
        res.status(400).json({ error: "You must provide a valid title" });
        return;
    }
    if (updatedData.decription && typeof updatedData.description !== "string") {
        res.status(400).json({ error: "You must provide valid description" });
        return;
    }
    if (updatedData.hoursEstimated && typeof updatedData.hoursEstimated !== "number") {
        res.status(400).json({ error: "You must provide valid hours estimated" });
        return;
    }
    if (updatedData.completed && typeof updatedData.completed !== "boolean") {
        res.status(400).json({ error: "You must provide a valid completed status" });
        return;
    }
    if (updatedData.comments) {
        res.status(400).json({ error: "You cannot change comments" });
        return;
    }

    try {
        await taskData.getTaskById(id);
    } catch (e) {
        res.status(404).json({ error: e });
    }

    try {
        const updatedTask = await taskData.patchTask(id, updatedData);
        res.json(updatedTask);
    } catch (e) {
        res.status(500).json({ error: e });
    }
});

router.post("/:id/comments", async (req, res) => {

    const id = req.params.id;
    const commentInfo = req.body;

    if (!commentInfo.name) {
        res.status(400).json({ error: "You must provide a name" });
        return;
    }
    if (!commentInfo.comment) {
        res.status(400).json({ error: "You must provide a comment" });
        return;
    }

    if (typeof commentInfo.name !== "string") {
        res.status(400).json({ error: "Name not valid" });
        return;
    }
    if (typeof commentInfo.comment !== "string") {
        res.status(400).json({ error: "Comment not valid" });
        return;
    }

    try {
        const { name, comment } = commentInfo
        const newComment = await taskData.addComment(id, name, comment);
        res.json(newComment);
    } catch (e) {
        res.status(500).json({ error: e });
    }
});

router.delete("/:taskId/:commentId", async (req, res) => {

    try {
        await taskData.getTaskById(req.params.taskId);
    } catch (e) {
        res.status(404).json({ error: e });
    }

    try {
        const updatedTask = await taskData.removeComment(req.params.taskId, req.params.commentId);
        res.json(updatedTask);
    } catch (e) {
        res.status(500).json({ error: e });
    }
});

module.exports = router;