const express = require("express");
const router = express.Router();
const data = require("../data");
const pdfData = data.pdfs;


router.get("/user/:username", async (req, res) => {
    try {
        // console.log(req.params.username)
        const pdfList = await pdfData.getPDF(req.params.username);
        // console.log(pdfList)
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
        const { pdfName, pdf, username} = pdfInfo
        const newpdf = await pdfData.addPDF(pdfName, pdf, username)
        // console.log(newpdf)
        res.json(newpdf);
    } catch (e) {
        res.status(404).json({ error: e });
    }
});

router.post("/comments", async (req, res) => {
    const pdfInfo = req.body;
    // try {
        const {pdfName, username, comment, pageNum} = pdfInfo
        const newpdf = await pdfData.addComments(pdfName, username, comment, pageNum)
        console.log(newpdf)
        res.json(newpdf);
    // } catch (e) {
    //     res.status(404).json({ error: e });
    // }
});

module.exports = router;