// Gettign the Newly created Mongoose Model we just created
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const Arreglo = require("../models/Arreglo.model");

// Saving the context of this module inside the _the variable
_this = this

exports.createArreglo = async function (ticket) {
    var newTicket = new Arreglo({
        name: ticket.name,
        description: ticket.description,
        payer: ticket.payer,
        receiver: ticket.receiver,
        amount: ticket.amount,
        date: new Date(),
    })
    try {
        return await newTicket.save();
    } catch (e) {
        throw Error("And Error occured while creating the ticket");
    }
}

exports.updateArreglo = async function (ticket) {

    var id = {_id: ticket.arregloid}
    console.log(id)
    try {
        //Find the old Group Object by the Id
        var oldTicket = await Arreglo.findOne(id);
        console.log (oldTicket)
    } catch (e) {
        throw Error("Error occured while Finding the Group")
    }
    // If no old Group Object exists return false
    if (!oldTicket) {
        return false;
    }
    //Edit the Group Object
    oldTicket.name = ticket.name ? ticket.name : oldTicket.name
    oldTicket.description = ticket.description ? ticket.description : oldTicket.description
    oldTicket.receiver = ticket.receiver ? ticket.receiver : oldTicket.receiver
    oldTicket.amount = ticket.amount ? ticket.amount : oldTicket.amount
    oldTicket.payer = ticket.payer ? ticket.payer : oldTicket.payer
    try {
        return await oldTicket.save();
    } catch (e) {
        throw Error("And Error occured while updating the Group");
    }
}

exports.deleteArreglo = async function (ticket) {
    console.log(ticket)
    // Delete the Ticket
    try {
        var deleted = await Arreglo.deleteOne({
            _id: ticket
        })
        if (deleted.n === 0 && deleted.ok === 1) {
            throw Error("Ticket Could not be deleted")
        }
        return deleted;
    } catch (e) {
        throw Error("Error Occured while Deleting the Ticket")
    }
}

exports.getArregloData = async function (ticket) {
    console.log(ticket)
    // Delete the Ticket
    var id = {_id: ticket.id}
    console.log(id)
    try {
        //Find the old Group Object by the Id
        var oldTicket = await Arreglo.findOne(id);
        console.log (oldTicket)
        return oldTicket;
    } catch (e) {
        throw Error("Error occured while Finding the Ticket")
    }
}