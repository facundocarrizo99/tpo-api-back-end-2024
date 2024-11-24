const User = require("../models/User.model");
const Arreglo = require("../models/Arreglo.model");
const GroupService = require("../services/group.service");

exports.createArreglo = async function (req, res, next) {
    // Req.Body contains the form submit values.
    console.log("llegue al controller Ticket", req.body)

    var arreglo = {
        name: req.body.name,
        description: req.body.description,
        payer: await User.findOne({email: req.body.payer}),
        receiver: await User.findOne({email: req.body.receiver}),
        amount: req.body.amount,
        groupid: req.headers.groupid
    }
    try {
        // Calling the Service function with the new object from the Request Body
        var createdArreglo = await GroupService.createArreglo(arreglo)
        return res.status(201).json({createdArreglo, message: "Succesfully Created Ticket"})
    } catch (e) {
        //Return an Error Response Message with Code and the Error Message.
        console.log(e)
        return res.status(400).json({status: 400, message: "Ticket Creation was Unsuccesfull"})
    }
}


exports.updateArreglo = async function (req, res, next) {
    if (!req.body.name) {
        return res.status(400).json({status: 400., message: "Name be present"})
    }
    var ticket = {
        groupid: req.headers.groupid,
        arregloid: req.headers.arregloid,
        name: req.body.name ? req.body.name : null,
        description: req.body.description ? req.body.description : null,
        payer: req.body.payer ? await User.findOne({email: req.body.payer}) : null,
        receiver: req.body.receiver ? await User.findOne({email: req.body.receiver}): null,
        amount: req.body.amount ? req.body.amount : null,
    }

    try {
        var updatedGroup = await GroupService.updateArreglo(ticket)
        return res.status(200).json({status: 200, data: updatedGroup, message: "Succesfully Updated Group"})
    } catch (e) {
        return res.status(400).json({status: 400., message: e.message})
    }
}

exports.removeArreglo = async function (req, res, next) {
    var Ticket = {
        arregloid: req.body.arregloid,
        groupId: req.headers.groupid
    }
    try {
        var deleted = await GroupService.deleteArreglo(Ticket);
        res.status(200).json({message: "Successfully Deleted"});
    } catch (e) {
        return res.status(400).json({status: 400, message: e.message})
    }
}

exports.getArreglos = async function (req, res, next) {
    // Req.Body contains the form submit values.
    try {
        var tickets = await GroupService.getAllArreglosOfOneGroup({_id: req.headers.groupid})
        // Return the Groups list with the appropriate HTTP password Code and Message.
        return res.status(200).json({status: 200, data: tickets, message: "Succesfully Groups Recieved"});
    } catch (e) {
        //Return an Error Response Message with Code and the Error Message.
        return res.status(400).json({status: 400, message: e.message});
    }
}
