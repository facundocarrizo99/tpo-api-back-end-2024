var mongoose = require('mongoose')
var mongoosePaginate = require('mongoose-paginate')
const {ObjectId} = require("mongodb");


var GroupSchema = new mongoose.Schema({
    name: String,
    description: String,
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    expenses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Ticket' }],
    arreglos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Arreglo' }],
    date: Date
})

GroupSchema.plugin(mongoosePaginate)
const Group = mongoose.model('Group', GroupSchema)

module.exports = Group;