const express = require("express");
const router = express.Router();
const data = require("../data");
const pdfData = data.pdfs;


router.get("/user/:username", async (req, res) => {
    try {
        const pdfList = await pdfData.getPDF(req.params.username);
        res.json(pdfList);
    } catch (e) {
        res.status(404).json({ error: e });
    }
});

router.post("/user/:username", async (req, res) => {
    try {
        const newpdf = await pdfData.addUser(req.params.username)
        res.json(newpdf);
    } catch (e) {
        res.status(404).json({ error: e });
    }
});

router.post("/addPDF", async (req, res) => {

    const pdfInfo = req.body;
    try {
        const { pdfName, username} = pdfInfo
        const newpdf = await pdfData.addPDF(pdfName, username)

        res.json(newpdf);
    } catch (e) {
        res.status(404).json({ error: e });
    }
});

router.post("/comments", async (req, res) => {
    const pdfInfo = req.body;
    try {
        const {pdfName, username, comment, pageNum} = pdfInfo
        const newpdf = await pdfData.addComments(pdfName, username, comment, pageNum)
        console.log(newpdf)
        res.json(newpdf);
    } catch (e) {
        res.status(404).json({ error: e });
    }
});

router.get("/comments/:username/:fileName", async (req, res) => {
    try {
        let pdfName = req.params.fileName
        const newpdf = await pdfData.getComments(req.params.fileName, req.params.username)
        let i
        let comments = []
        for(i in newpdf[0].pdfs){
            if(newpdf[0].pdfs[i].pdfName == pdfName){
                comments = newpdf[0].pdfs[i].comments
            }
        }

        res.json(comments);
    } catch (e) {
        res.status(404).json({ error: e });
    }
});

module.exports = router;