const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://kayalvishakha:kWKRHFcu5FHX8wYu@selenium-proxymesh.8hzr3ne.mongodb.net/twitter')

const twitterSchema = mongoose.Schema({
    trends:[],
},{timestamps:true});

module.exports = mongoose.model("twitter",twitterSchema)