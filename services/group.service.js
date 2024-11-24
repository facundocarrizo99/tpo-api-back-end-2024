// Gettign the Newly created Mongoose Model we just created 
var Group = require('../models/Group.model');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const Ticket = require("../models/Ticket.model");
const TicketService = require("../services/ticket.service");
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
            var oneGroup = await Group.findOne({_id: groups[i]._id});
            if (oneGroup) {
                groupsData.push(oneGroup);
            }
        }
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
        oldGroup.expenses.push(newTicket._id)
        return await oldGroup.save();
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
    //todo no se updatea bien la lista de expenses
    var ticketToDelete = new mongoose.Types.ObjectId(ticket.ticketid);
    var newExpenses = oldGroup.expenses.filter(expense => expense !== ticketToDelete);
    console.log(newExpenses)
    try {
        oldGroup.expenses = newExpenses;
        return await oldGroup.save();
    } catch (e) {
        throw Error("And Error occured while updating the Group");
    }
}