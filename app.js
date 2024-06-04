const express = require('express');
const app = express();
const Trends = require('./routes/selenium.models');
const { example } = require('./tests/firsttes.js');

app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static('public'))



app.get('/', async function (req, res) {
    res.render('index', { trends: [], ipAddress: "", jsonExtract: {} })
})

app.get('/getTrends', async function (req, res) {
    try {
        console.log("Fetching trends...");
        let trends = await example();
        console.log(trends);
        let trendsModel = await Trends.create({
            trends,
        })

        const ipAddress = req.ip;
        const jsonExtract = await Trends.findOne({ _id: trendsModel._id }).lean();
        console.log(jsonExtract);
        const jsonExtractString = JSON.stringify(jsonExtract, null, 2);

        res.render('index', { trends, ipAddress, jsonExtract:jsonExtractString});
    } catch (error) {
        console.error("Error fetching trends:", error);
        res.status(500).send("Failed to fetch trends.");
    }
})
app.listen(3000)