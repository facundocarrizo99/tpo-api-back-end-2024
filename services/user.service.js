// Gettign the Newly created Mongoose Model we just created 
var User = require('../models/User.model');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

// Saving the context of this module inside the _the variable
_this = this

// Async function to get the User List
exports.getUsers = async function (query, page, limit) {

    // Options setup for the mongoose paginate
    var options = {
        page,
        limit
    }
    // Try Catch the awaited promise to handle the error 
    try {
        console.log("Query", query)
        var users = await User.find(query, options)
        var usersData = [];
        for (let i = 0; i < users.length; i++) {
            var oneGroup = await User.findOne({_id: users[i]._id});
            if (oneGroup) {
                usersData.push(oneGroup);
            }
        }
        // Return the Userd list that was retured by the mongoose promise
        return usersData;

    } catch (e) {
        // return a Error message describing the reason 
        console.log("error services", e)
        throw Error('Error while Paginating Users');
    }
}

exports.createUser = async function (user) {
    // Creating a new Mongoose Object by using the new keyword
    var hashedPassword = bcrypt.hashSync(user.password, 8);

    var newUser = new User({
        name: user.name,
        email: user.email,
        date: new Date(),
        password: hashedPassword,
        profilePicture: user.picture ? user.picture : null
    })

    try {
        // Saving the User 
        var savedUser = await newUser.save();
        var token = jwt.sign({
            id: savedUser._id
        }, process.env.SECRET, {
            expiresIn: 86400 // expires in 24 hours
        });
        return token;
    } catch (err) {
        if (err.code === 11000) {
            console.error('Error: Duplicate email');
            throw new Error('Email already exists. Please use a different email.');
        } else {
            console.error('Error creating user:', err);
            throw err;
        }
    }
}

exports.updateUser = async function (user) {
    var id = {_id: user.id}
    console.log(id)
    try {
        //Find the old User Object by the Id
        var oldUser = await User.findOne(id);
        console.log(oldUser)
    } catch (e) {
        throw Error("Error occured while Finding the User")
    }
    // If no old User Object exists return false
    if (!oldUser) {
        return false;
    }
    //Edit the User Object
    var hashedPassword = bcrypt.hashSync(user.password, 8);
    oldUser.name = user.name ? user.name : oldUser.name
    oldUser.email = user.email ? user.email : oldUser.email
    oldUser.password = hashedPassword ? hashedPassword : oldUser.password
    oldUser.profilePicture = user.picture ? user.picture : oldUser.profilePicture
    try {
        return await oldUser.save();
    } catch (e) {
        throw Error("And Error occured while updating the User");
    }
}

exports.deleteUser = async function (id) {
    console.log(id)
    // Delete the User
    const objectId = new mongoose.Types.ObjectId(id);
    try {
        var deleted = await User.deleteOne({
            _id: objectId
        })
        if (deleted.n === 0 && deleted.ok === 1) {
            throw Error("User Could not be deleted")
        }
        return deleted;
    } catch (e) {
        console.error("Error occurred while deleting user:", e);
        throw Error("Error Occured while Deleting the User" + e.message)
    }
}


exports.loginUser = async function (user) {

    // Creating a new Mongoose Object by using the new keyword
    try {
        // Find the User 
        console.log("login:", user)
        var _details = await User.findOne({
            email: user.email
        });
        var passwordIsValid = bcrypt.compareSync(user.password, _details.password);
        if (!passwordIsValid) return 0;

        var token = jwt.sign({
            id: _details._id
        }, process.env.SECRET, {
            expiresIn: 86400 // expires in 24 hours
        });
        return {token: token, user: _details};
    } catch (e) {
        // return a Error message describing the reason     
        throw Error("Error while Login User")
    }

}