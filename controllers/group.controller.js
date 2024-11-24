var GroupService = require('../services/Group.service');
const User = require("../models/User.model");
var GroupController = require('../controllers/group.controller');


// Saving the context of this module inside the _the variable
_this = this;

// Async Controller function to get the To do List
exports.getGroups = async function (req, res, next) {

    // Para un usuario te devuelve los grupos en los que esta
    var page = req.query.page ? req.query.page : 1
    var limit = req.query.limit ? req.query.limit : 10;
    try {
        var Groups = await GroupService.getGroups({participants: {$in: req.userId}}, page, limit)
        // Return the Groups list with the appropriate HTTP password Code and Message.
        return res.status(200).json({status: 200, data: Groups, message: "Succesfully Groups Recieved"});
    } catch (e) {
        //Return an Error Response Message with Code and the Error Message.
        return res.status(400).json({status: 400, message: e.message});
    }
}

exports.getGroupByObjectID = async function (req, res, next) {

    // Check the existence of the query parameters, If doesn't exists assign a default value
    var page = req.query.page ? req.query.page : 1
    var limit = req.query.limit ? req.query.limit : 10;
    let filtro = {_id: req.body.groupId}
    console.log(filtro)
    try {
        var Groups = await GroupService.getOneGroup(filtro, page, limit)
        // Return the Groups list with the appropriate HTTP password Code and Message.
        return res.status(200).json({status: 200, data: Groups, message: "Succesfully Groups Recieved"});
    } catch (e) {
        //Return an Error Response Message with Code and the Error Message.
        return res.status(400).json({status: 400, message: e.message});
    }
}

exports.interpretGroupParticipants = async function (req) {
    var participantsIDs = []
    for (let i = 0; i < req.body.participants.length; i++) {
        var user = await User.findOne({email: {$in: req.body.participants[i]}})
        if (user) {
            participantsIDs.push(user._id)
        }
    }
    participantsIDs.push(req.userId)
    return participantsIDs;
}

exports.createGroup = async function (req, res, next) {
    // Req.Body contains the form submit values.
    console.log("llegue al controller", req.body)

    var participantsIDs = await GroupController.interpretGroupParticipants(req);

    var Group = {
        name: req.body.name,
        description: req.body.description,
        participants: participantsIDs
    }

    try {
        // Calling the Service function with the new object from the Request Body
        var createdGroup = await GroupService.createGroup(Group)
        return res.status(201).json({createdGroup, message: "Succesfully Created Group"})
    } catch (e) {
        //Return an Error Response Message with Code and the Error Message.
        console.log(e)
        return res.status(400).json({status: 400, message: "Group Creation was Unsuccesfull"})
    }
}

exports.updateGroup = async function (req, res, next) {
    if (!req.body.name) {
        return res.status(400).json({status: 400., message: "Name be present"})
    }

    var Group = {
        id: req.headers.groupid,
        name: req.body.name ? req.body.name : null,
        description: req.body.description ? req.body.description : null,
        participants: req.body.participants ? await GroupController.interpretGroupParticipants(req) : null
    }

    try {
        var updatedGroup = await GroupService.updateGroup(Group)
        return res.status(200).json({status: 200, data: updatedGroup, message: "Succesfully Updated Group"})
    } catch (e) {
        return res.status(400).json({status: 400., message: e.message})
    }
}

exports.removeGroup = async function (req, res, next) {

    var id = req.headers.groupid;
    try {
        var deleted = await GroupService.deleteGroup(id);
        res.status(200).json({message: "Successfully Deleted"});
    } catch (e) {
        return res.status(400).json({status: 400, message: e.message})
    }
}

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


