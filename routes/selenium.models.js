const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/twitterscraper')

const twitterSchema = mongoose.Schema({
    trends:[],
},{timestamps:true});

module.exports = mongoose.model("twitter",twitterSchema)