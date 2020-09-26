

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const PlayersSchema = new Schema({
    name: {
        type: String
    },
    score: {
        type: Number
    },level: {
        type: Number
    }
})


module.exports = mongoose.model('Players',PlayersSchema);

