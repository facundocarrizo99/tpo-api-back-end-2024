// Gettign the Newly created Mongoose Model we just created
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const Ticket = require("../models/Ticket.model");

// Saving the context of this module inside the _the variable
_this = this

exports.createTicket = async function (ticket) {
    var newTicket = new Ticket({
        name: ticket.name,
        description: ticket.description,
        owner: ticket.owner,
        participants: ticket.participants,
        ticketPicture: ticket.picture ? ticket.picture : null,
        amount: ticket.amount,
        date: new Date(),
    })
    try {
        var savedticket = await newTicket.save()
        return savedticket;
    } catch (e) {
        throw Error("And Error occured while creating the ticket");
    }
}

exports.updateTicket = async function (ticket) {

    var id = {_id: ticket.ticketid}
    console.log(id)
    try {
        //Find the old Group Object by the Id
        var oldTicket = await Ticket.findOne(id);
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
    oldTicket.participants = ticket.participants ? ticket.participants : oldTicket.participants
    oldTicket.amount = ticket.amount ? ticket.amount : oldTicket.amount
    oldTicket.owner = ticket.owner ? ticket.owner : oldTicket.owner
    oldTicket.ticketPicture = ticket.picture ? ticket.picture : oldTicket.ticketPicture
    try {
        return await oldTicket.save();
    } catch (e) {
        throw Error("And Error occured while updating the Group");
    }
}

exports.deleteTicket = async function (ticket) {
    console.log(ticket)
    // Delete the Ticket
    try {
        var deleted = await Ticket.deleteOne({
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

exports.getTicketData = async function (ticket) {
    console.log(ticket)
    // Delete the Ticket
    var id = {_id: ticket.id}
    console.log(id)
    try {
        //Find the old Group Object by the Id
        var oldTicket = await Ticket.findOne(id);
        console.log (oldTicket)
        return oldTicket;
    } catch (e) {
        throw Error("Error occured while Finding the Ticket")
    }
}