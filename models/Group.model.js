var mongoose = require('mongoose')
var mongoosePaginate = require('mongoose-paginate')
const {ObjectId} = require("mongodb");


var GroupSchema = new mongoose.Schema({
    name: String,
    description: String,
    participants: [ObjectId],
    expenses: [ObjectId],
    arreglos: [ObjectId],
    date: Date
})

GroupSchema.plugin(mongoosePaginate)
const Group = mongoose.model('Group', GroupSchema)

module.exports = Group;