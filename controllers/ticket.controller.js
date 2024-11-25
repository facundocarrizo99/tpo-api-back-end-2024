var GroupService = require('../services/Group.service');
const User = require("../models/User.model");

exports.createTicket = async function (req, res, next) {
    // Req.Body contains the form submit values.
    console.log("llegue al controller Ticket", req.body)

    var participantsIDs = []
    for (let i = 0; i < req.body.participants.length; i++) {
        var user = await User.findOne({email: {$in: req.body.participants[i]}})
        if (user) {
            participantsIDs.push(user._id)
        }
    }

    var Ticket = {
        name: req.body.name,
        description: req.body.description,
        owner: await User.findOne({email: req.body.owner}),
        participants: participantsIDs,
        picture: req.body.picture,
        amount: req.body.amount,
        groupId: req.headers.groupid
    }
    console.log(participantsIDs)
    try {
        // Calling the Service function with the new object from the Request Body
        var createdTicket = await GroupService.createTicket(Ticket)
        return res.status(201).json({createdTicket, message: "Succesfully Created Ticket"})
    } catch (e) {
        //Return an Error Response Message with Code and the Error Message.
        console.log(e)
        return res.status(400).json({status: 400, message: "Ticket Creation was Unsuccesfull"})
    }
}


exports.updateTicket = async function (req, res, next) {
    if (!req.body.name) {
        return res.status(400).json({status: 400., message: "Name be present"})
    }

    var participantsIDs = []
    for (let i = 0; i < req.body.participants.length; i++) {
        var user = await User.findOne({email: {$in: req.body.participants[i]}})
        if (user) {
            participantsIDs.push(user._id)
        }
    }

    var ticket = {
        groupid: req.headers.groupid,
        ticketid: req.headers.ticketid,
        name: req.body.name ? req.body.name : null,
        description: req.body.description ? req.body.description : null,
        participants: req.body.participants ? participantsIDs : null,
        picture: req.body.picture ? req.body.picture : null,
        amount: req.body.amount ? req.body.amount : null,
        owner: req.body.owner ? await User.findOne({email: {$in: req.body.owner}}) : null
    }

    try {
        var updatedGroup = await GroupService.updateTicket(ticket)
        return res.status(200).json({status: 200, data: updatedGroup, message: "Succesfully Updated Group"})
    } catch (e) {
        return res.status(400).json({status: 400., message: e.message})
    }
}

exports.removeTicket = async function (req, res, next) {
    var Ticket = {
        ticketid: req.body.ticketid,
        groupId: req.headers.groupid
    }
    try {
        var deleted = await GroupService.deleteTicket(Ticket);
        res.status(200).json({message: "Successfully Deleted"});
    } catch (e) {
        return res.status(400).json({status: 400, message: e.message})
    }
}

exports.getTickets = async function (req, res, next) {
    // Req.Body contains the form submit values.
    try {
        var tickets = await GroupService.getAllTicketsOfOneGroup({_id: req.headers.groupid})
        // Return the Groups list with the appropriate HTTP password Code and Message.
        return res.status(200).json({status: 200, data: tickets, message: "Succesfully Groups Recieved"});
    } catch (e) {
        //Return an Error Response Message with Code and the Error Message.
        return res.status(400).json({status: 400, message: e.message});
    }
}

