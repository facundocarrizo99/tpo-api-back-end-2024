var GroupService = require('../services/Group.service');
const User = require("../models/User.model");


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

exports.createGroup = async function (req, res, next) {
    // Req.Body contains the form submit values.
    console.log("llegue al controller", req.body)

    var participantsIDs = []
    for (let i = 0; i < req.body.participants.length; i++) {
        var user = await User.findOne({email: {$in: req.body.participants[i]}})
        if (user) {
            participantsIDs.push(user._id)
        }
    }
    participantsIDs.push(req.userId)

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

    // Id is necessary for the update
    if (!req.body.name) {
        return res.status(400).json({status: 400., message: "Name be present"})
    }

    var Group = {

        name: req.body.name ? req.body.name : null,
        description: req.body.description ? req.body.description : null,
        participants: req.body.participants ? req.body.participants : null
    }

    try {
        var updatedGroup = await GroupService.updateGroup(Group)
        return res.status(200).json({status: 200, data: updatedGroup, message: "Succesfully Updated Group"})
    } catch (e) {
        return res.status(400).json({status: 400., message: e.message})
    }
}

exports.removeGroup = async function (req, res, next) {

    var id = req.body.id;
    try {
        var deleted = await GroupService.deleteGroup(id);
        res.status(200).send("Succesfully Deleted... ");
    } catch (e) {
        return res.status(400).json({status: 400, message: e.message})
    }
}







