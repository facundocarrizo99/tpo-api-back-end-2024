var mongoose = require('mongoose')
var mongoosePaginate = require('mongoose-paginate')
const {ObjectId} = require("mongodb");


var TicketSchema = new mongoose.Schema({
    name: String,
    description: String,
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    amount: Number,
    date: Date
})

TicketSchema.plugin(mongoosePaginate)
const Ticket = mongoose.model('Ticket', TicketSchema)

module.exports = Ticket;