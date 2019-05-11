const express = require("../node_modules/express");
const router = express.Router();
const data = require("../data");
const userData = data.users;
const bodyParser = require("body-parser");

const bluebird = require('bluebird');
const flat = require('flat');
const unflatten = flat.unflatten
const redis = require('redis');
const client = redis.createClient();
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);
app.use(bodyParser.json());

let recentUserData = [];

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

router.get("/userHistory", async (req, res) => {
    if(recentUserData.length != 0)
    res.status(200).json(recentUserData.slice(0, 19));
    else
    res.status(500).json("No user found!");
})

router.get("/:id", async (req, res) => {
    console.log("Accessing user with ID ", req.params.id);
    let userExists = await client.hexistsAsync("users", req.params.id + ".id");
    if (userExists) {
        let userDataFrom_Redis = await client.hgetallAsync("users");
        let user1 = unflatten(userDataFrom_Redis);
        recentUserData.unshift(user1[req.params.id]);
        res.status(200).json(user1[req.params.id]);
    }
    else {
        try {
            let user = await userData.getUserById(req.params.id);
            userData[req.params.id] = user;
            let flat_users = flat(userData);
            let newUser = await client.hmsetAsync("users", flat_users);
            recentUserData.unshift(user);
            res.status(200).json(user);
        }catch(e){
            res.status(500).json({error: e});
        }
       
    }
})


//gets task based on the id
// router.get("/:id", async (req, res) => {
//     try {
//         const task = await taskData.getTaskById(req.params.id);
//         res.json(task);
//     } catch (e) {
//         res.status(404).json({ error: e });
//     }
// });


//posts a task with an empty comment array
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
        res.status(400).json({ error: "You must provide email" });
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
      res.status(400).json({ error: "name not valid" });
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

    if (!updatedData.username) {
        res.status(400).json({ error: "You must provide a valid username" });
        return;
    }
    if (!updatedData.name) {
        res.status(400).json({ error: "You must provide valid name" })
        return;
    }
    if (!updatedData.email) {
        res.status(400).json({ error: "You must provide valid email" });
        return;
    }
    
    // if (!updatedData.comments) {
    //     res.status(400).json({ error: "You must provide a valid comment object" });
    //     return;
    // }

    if (typeof updatedData.username !== "string") {
        res.status(400).json({ error: "username not provided" });
        return;
    }
    if (typeof updatedData.name !== "string") {
        res.status(400).json({ error: "Name not provided" });
        return;
    }
    if (typeof updatedData.email !== "string") {
        res.status(400).json({ error: "Email not provided" });
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
        const updatedUser = await userData.updateUser(username, name, email);
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

router.get

module.exports = router;