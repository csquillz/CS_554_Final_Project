const express = require("express");
const router = express.Router();
const data = require("../data");
const userData = data.users;

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
        const userList = await userData.getFirstNUsers(skipNum, takeNum);
        res.json(userList);
    } catch (e) {
        res.status(500).json({ error: e });
    }
});

//gets user based on the id
router.get("/:id", async (req, res) => {
    try {
        const user = await userData.getUserById(req.params.id);
        res.json(user);
    } catch (e) {
        res.status(404).json({ error: e });
    }
});

//posts a user with an empty comment array
router.post("/", async (req, res) => {
    const userInfo = req.body;

    if (!userInfo.username) {
        res.status(400).json({ error: "You must provide a username" });
        return;
    }
    if (!userInfo.name) {
        res.status(400).json({ error: "You must provide name" });
        return;
    }
    if (!userInfo.email) {
        res.status(400).json({ error: "You must provide an email" });
        return;
    }

    // if (!taskInfo.comments) {
    //     res.status(400).json({ error: "You must provide comments here" });
    //     return;
    // }

    if (typeof userInfo.username !== "string") {
        res.status(400).json({ error: "Username not valid" });
        return;
    }
    if (typeof userInfo.name !== "string") {
      res.status(400).json({ error: "Name not valid" });
      return;
    } 
    if (typeof userInfo.email !== "string"){
        res.status(400).json({ error: "Email not valid" });
        return;
    } 
    // if (typeof taskInfo.comments !== "object") {
    //     res.status(400).json({ error: "Comments not valid" });
    //     return;
    // }

    try {
        const { username, name, email} = userInfo
        const newUser = await userData.addUser(username, name, email);
        res.json(newUser);
    } catch (e) {
        res.status(500).json({ error: e });
    }
});

router.put("/:id", async (req, res) => {
    const id = req.params.id;
    const updatedData = req.body;

    if (!userInfo.username) {
        res.status(400).json({ error: "You must provide a username" });
        return;
    }
    if (!userInfo.name) {
        res.status(400).json({ error: "You must provide name" });
        return;
    }
    if (!userInfo.email) {
        res.status(400).json({ error: "You must provide an email" });
        return;
    }

    // if (!updatedData.comments) {
    //     res.status(400).json({ error: "You must provide a valid comment object" });
    //     return;
    // }

    if (typeof userInfo.username !== "string") {
        res.status(400).json({ error: "Username not valid" });
        return;
    }
    if (typeof userInfo.name !== "string") {
      res.status(400).json({ error: "Name not valid" });
      return;
    } 
    if (typeof userInfo.email !== "string"){
        res.status(400).json({ error: "Email not valid" });
        return;
    }
    // if (typeof updatedData.comments !== "object") res.status(400).json({ error: "Comments not provided" });

    try {
        await userData.getUserById(id)
    } catch (e) {
        res.status(404).json({ error: e });
    }

    try {
        const { username, name, email} = updatedData
        const updatedUser = await userData.updateUser(id, username, name, email);
        res.json(updatedUser);
    } catch (e) {
        res.status(500).json({ error: e });
    }

});

router.patch("/:id", async (req, res) => {
    const id = req.params.id;
    let updatedData = req.body;

    if (updatedData.username && typeof updatedData.username !== "string") {
        res.status(400).json({ error: "You must provide a valid username" });
        return;
    }
    if (updatedData.name && typeof updatedData.name !== "string") {
        res.status(400).json({ error: "You must provide valid name" });
        return;
    }
    if (updatedData.email && typeof updatedData.email !== "string") {
        res.status(400).json({ error: "You must provide valid email" });
        return;
    }
    if (updatedData.comments) {
        res.status(400).json({ error: "You cannot change comments" });
        return;
    }

    try {
        await userData.getUserById(id);
    } catch (e) {
        res.status(404).json({ error: e });
    }

    try {
        const updatedUser = await userData.patchUser(id, updatedData);
        res.json(updatedUser);
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
        const newComment = await userData.addComment(id, name, comment);
        res.json(newComment);
    } catch (e) {
        res.status(500).json({ error: e });
    }
});

router.delete("/:userId/:commentId", async (req, res) => {

    try {
        await userData.getUserById(req.params.userId);
    } catch (e) {
        res.status(404).json({ error: e });
    }

    try {
        const updatedUser = await userData.removeComment(req.params.userId, req.params.commentId);
        res.json(updatedUser);
    } catch (e) {
        res.status(500).json({ error: e });
    }
});

module.exports = router;