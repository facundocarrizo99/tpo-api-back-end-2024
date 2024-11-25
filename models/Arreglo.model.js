var mongoose = require('mongoose')
var mongoosePaginate = require('mongoose-paginate')
const {ObjectId} = require("mongodb");


var ArregloSchema = new mongoose.Schema({
    name: String,
    description: String,
    payer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    amount: Number,
    date: Date
})

ArregloSchema.plugin(mongoosePaginate)
const Arreglo = mongoose.model('Arreglo', ArregloSchema)

module.exports = Arreglo;