// Gettign the Newly created Mongoose Model we just created 
const Group = require('../models/Group.model');
const Ticket = require("../models/Ticket.model");
const Arreglo = require("../models/Arreglo.model");
const TicketService = require("../services/ticket.service");
const ArregloService = require("../services/arreglo.service");
const mongoose = require('mongoose');

// Saving the context of this module inside the _the variable
_this = this

// Async function to get the Group List
exports.getGroups = async function (query, page, limit) {

    // Options setup for the mongoose paginate
    var options = {
        page,
        limit
    }
    // Try Catch the awaited promise to handle the error 
    try {
        console.log("Query",query);
        var groups = await Group.find(query, options);
        var groupsData = [];
        for (let i = 0; i < groups.length; i++) {
            var oneGroup = await Group.findOne({_id: groups[i]._id})
                        .populate('participants', '_id name email profilePicture')
                        .populate('expenses')
                        .populate('arreglos');
            if (oneGroup) {
                groupsData.push(oneGroup);
            }
        }
        console.log(groupsData);
        // Return the Groupd list that was retured by the mongoose promise
        return groupsData;

    } catch (e) {
        // return a Error message describing the reason 
        console.log("error services",e)
        throw Error('Error while Paginating Groups');
    }
}

exports.createGroup = async function (group) {
    // Creating a new Mongoose Object by using the new keyword
    var newGroup = new Group({
        name: group.name,
        description: group.description,
        participants: group.participants,
        expenses: [],
        arreglos: [],
        date: new Date(),
    })

    try {
        // Saving the Group
        return await newGroup.save();
    } catch (e) {
        // return a Error message describing the reason 
        console.log(e)
        throw Error("Error while Creating Group")
    }
}

exports.updateGroup = async function (group) {

    var id = {_id: group.id}
    console.log(id)
    try {
        //Find the old Group Object by the Id
        var oldGroup = await Group.findOne(id);
        console.log (oldGroup)
    } catch (e) {
        throw Error("Error occured while Finding the Group")
    }
    // If no old Group Object exists return false
    if (!oldGroup) {
        return false;
    }
    //Edit the Group Object
    oldGroup.name = group.name ? group.name : oldGroup.name
    oldGroup.description = group.description ? group.description : oldGroup.description
    oldGroup.participants = group.participants ? group.participants : oldGroup.participants
    try {
        var savedGroup = await oldGroup.save()
        return savedGroup;
    } catch (e) {
        throw Error("And Error occured while updating the Group");
    }
}

exports.deleteGroup = async function (id) {
    console.log(id)
    // Delete the Group
    try {
        var deleted = await Group.deleteOne({
            _id: id
        })
        if (deleted.n === 0 && deleted.ok === 1) {
            throw Error("Group Could not be deleted")
        }
        return deleted;
    } catch (e) {
        throw Error("Error Occured while Deleting the Group")
    }
}

exports.getOneGroup = async function (id) {
        try {
        var group = await Group.findOne(id)
            .populate('participants', '_id name email profilePicture')
            .populate('expenses')
            .populate('arreglos');
        return group;
    }
    catch (e) {
        throw Error("Error while getting the Group")
    }
}


exports.createTicket = async function (ticket) {
    // Creating a new Mongoose Object by using the new keyword
    var newTicket = await TicketService.createTicket(ticket)
    console.log(newTicket)
    try {
        //Find the old Group Object by the Id
        var oldGroup = await Group.findOne({_id: ticket.groupId});
        console.log (oldGroup)
    } catch (e) {
        throw Error("Error occured while Finding the Group")
    }
    if (!oldGroup) {
        return false;
    }
    try {
        oldGroup.expenses.push(newTicket._id);
        await oldGroup.save();
        return newTicket;
    } catch (e) {
        throw Error("And Error occured while updating the Group");
    }
}

exports.deleteTicket = async function (ticket) {
    var newTicket = await TicketService.deleteTicket(ticket.ticketid)
    console.log(newTicket)
    try {
        //Find the old Group Object by the Id
        var oldGroup = await Group.findOne({_id: ticket.groupId});
        console.log (oldGroup)
    } catch (e) {
        throw Error("Error occured while Finding the Group")
    }
    if (!oldGroup) {
        return false;
    }
    var ticketToDelete = new mongoose.Types.ObjectId(ticket.ticketid);
    const indexOfTicket = oldGroup.expenses.indexOf(ticketToDelete);
    if (indexOfTicket !== -1) {
        oldGroup.expenses.splice(indexOfTicket, 1);
    }
    try {
        return await oldGroup.save();
    } catch (e) {
        throw Error("And Error occured while updating the Group");
    }
}

exports.getAllTicketsOfOneGroup = async function (groupQuery) {
    try {
        var group = await Group.findOne(groupQuery);
        var tickets = [];
        for (let i = 0; i < group.expenses.length; i++) {
            var ticket = await Ticket.findOne({_id: group.expenses[i]._id});
            tickets.push(ticket);
        }
        return tickets;
    } catch (e) {
        throw Error("Error while getting the Tickets")
    }
}

exports.updateTicket = async function (ticket) {
    try {
        return await TicketService.updateTicket(ticket);
    } catch (e) {
        throw Error("And Error occured while updating the ticket");
    }
}

exports.createArreglo = async function (ticket) {
    // Creating a new Mongoose Object by using the new keyword
    var newArreglo = await ArregloService.createArreglo(ticket)
    console.log(newArreglo)
    try {
        //Find the old Group Object by the Id
        var oldGroup = await Group.findOne({_id: ticket.groupid});
        console.log (oldGroup)
    } catch (e) {
        throw Error("Error occured while Finding the Group")
    }
    if (!oldGroup) {
        return false;
    }
    try {
        oldGroup.arreglos.push(newArreglo._id);
        await oldGroup.save();
        return newArreglo;
    } catch (e) {
        throw Error("And Error occured while updating the Group");
    }
}

exports.deleteArreglo = async function (ticket) {
    var newTicket = await ArregloService.deleteArreglo(ticket.arregloid)
    console.log(newTicket)
    try {
        //Find the old Group Object by the Id
        var oldGroup = await Group.findOne({_id: ticket.groupId});
        console.log (oldGroup)
    } catch (e) {
        throw Error("Error occured while Finding the Group")
    }
    if (!oldGroup) {
        return false;
    }
    var ticketToDelete = new mongoose.Types.ObjectId(ticket.arregloid);
    const indexOfTicket = oldGroup.arreglos.indexOf(ticketToDelete);
    if (indexOfTicket !== -1) {
        oldGroup.arreglos.splice(indexOfTicket, 1);
    }
    try {
        return await oldGroup.save();
    } catch (e) {
        throw Error("And Error occured while updating the Group");
    }
}

exports.getAllArreglosOfOneGroup = async function (groupQuery) {
    try {
        var group = await Group.findOne(groupQuery);
        var tickets = [];
        for (let i = 0; i < group.arreglos.length; i++) {
            var ticket = await Arreglo.findOne({_id: group.arreglos[i]._id});
            tickets.push(ticket);
        }
        return tickets;
    } catch (e) {
        throw Error("Error while getting the Tickets")
    }
}

exports.updateArreglo = async function (ticket) {
    try {
        return await ArregloService.updateArreglo(ticket);
    } catch (e) {
        throw Error("And Error occured while updating the ticket");
    }
}