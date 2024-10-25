var mongoose = require('mongoose')
var mongoosePaginate = require('mongoose-paginate')
const {getUsersByMail} = require("../controllers/users.controller");
const {ObjectId} = require("mongodb");


var GroupSchema = new mongoose.Schema({
    name: String,
    description: String,
    owner: ObjectId,
    participants: [ObjectId],
    date: Date
})

GroupSchema.plugin(mongoosePaginate)
const Group = mongoose.model('Group', GroupSchema)

module.exports = Group;