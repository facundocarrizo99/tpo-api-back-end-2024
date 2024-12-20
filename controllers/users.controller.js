var UserService = require('../services/user.service');
const mongoose = require("mongoose");


// Saving the context of this module inside the _the variable
_this = this;

// Async Controller function to get the To do List
exports.getUsers = async function (req, res, next) {

    // Check the existence of the query parameters, If doesn't exists assign a default value
    var page = req.query.page ? req.query.page : 1
    var limit = req.query.limit ? req.query.limit : 10;
    try {
        var Users = await UserService.getUsers({}, page, limit)
        // Return the Users list with the appropriate HTTP password Code and Message.
        return res.status(200).json({status: 200, data: Users, message: "Succesfully Users Recieved"});
    } catch (e) {
        //Return an Error Response Message with Code and the Error Message.
        return res.status(400).json({status: 400, message: e.message});
    }
}
exports.getUsersByMail = async function (req, res, next) {

    // Check the existence of the query parameters, If doesn't exists assign a default value
    var page = req.query.page ? req.query.page : 1
    var limit = req.query.limit ? req.query.limit : 10;
    let filtro = {email: req.body.email}
    console.log(filtro)
    try {
        var Users = await UserService.getUsers(filtro, page, limit)
        // Return the Users list with the appropriate HTTP password Code and Message.
        return res.status(200).json({status: 200, data: Users, message: "Succesfully Users Recieved"});
    } catch (e) {
        //Return an Error Response Message with Code and the Error Message.
        return res.status(400).json({status: 400, message: e.message});
    }
}

exports.createUser = async function (req, res, next) {
    // Req.Body contains the form submit values.
    console.log("llegue al controller", req.body)
    var User = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        picture: req.body.picture ? req.body.picture : null,
        safetyAnswer: req.body.safetyAnswer
    }
    try {
        var createdUser = await UserService.createUser(User)
        return res.status(201).json({createdUser, message: "Succesfully Created User"})
    } catch (e) {
        return res.status(400).json({message: "Error creating user. Please try again.", error: e.message})
    }
}

exports.updateUser = async function (req, res, next) {

    // Id is necessary for the update
    if (!req.body.name) {
        return res.status(400).json({status: 400., message: "Name be present"})
    }

    var User = {
        id: req.body.id,
        name: req.body.name ? req.body.name : null,
        email: req.body.email ? req.body.email : null,
        password: req.body.password ? req.body.password : null,
        picture: req.body.picture ? req.body.picture : null,
        safetyAnswer: req.body.safetyAnswer ? req.body.safetyAnswer : null
    }

    try {
        var updatedUser = await UserService.updateUser(User)
        return res.status(200).json({status: 200, data: updatedUser, message: "Succesfully Updated User"})
    } catch (e) {
        return res.status(400).json({status: 400., message: e.message})
    }
}

exports.removeUser = async function (req, res, next) {

    var id = req.body.id;
    try {
        var deleted = await UserService.deleteUser(id);
        res.status(200).json({message: "Successfully Deleted"});
    } catch (e) {
        return res.status(400).json({status: 400, message: e.message})
    }
}

exports.loginUser = async function (req, res, next) {
    // Req.Body contains the form submit values.
    console.log("body", req.body)
    var User = {
        email: req.body.email,
        password: req.body.password
    }
    try {
        // Calling the Service function with the new object from the Request Body
        var loginUser = await UserService.loginUser(User);
        if (loginUser === 0)
            return res.status(400).json({message: "Error en la contraseña"})
        else
            return res.status(200).json({loginUser, message: "Succesfully login"})
    } catch (e) {
        //Return an Error Response Message with Code and the Error Message.
        return res.status(400).json({status: 400, message: "Invalid username or password"})
    }
}

exports.recoverPassword = async function (req, res, next) {
    // Req.Body contains the form submit values.
    console.log("body", req.body)
    var User = {
        email: req.body.email,
        safetyAnswer: req.body.safetyAnswer
    }
    try {
        // Calling the Service function with the new object from the Request Body
        var recoverUser = await UserService.recoverUser(User);
        if (recoverUser === 0)
            return res.status(400).json({message: "Error en la contraseña"})
        else
            return res.status(200).json({recoverUser, message: "Succesfully login"})
    } catch (e) {
        //Return an Error Response Message with Code and the Error Message.
        return res.status(400).json({status: 400, message: "Invalid username or password"})
    }
}
    
    
