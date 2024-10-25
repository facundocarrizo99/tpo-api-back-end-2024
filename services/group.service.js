// Gettign the Newly created Mongoose Model we just created 
var Group = require('../models/Group.model');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

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
        console.log("Query",query)
        var Groups = await Group.paginate(query, options)
        // Return the Groupd list that was retured by the mongoose promise
        return Groups;

    } catch (e) {
        // return a Error message describing the reason 
        console.log("error services",e)
        throw Error('Error while Paginating Groups');
    }
}

exports.createGroup = async function (Group) {
    // Creating a new Mongoose Object by using the new keyword
    var hashedPassword = bcrypt.hashSync(Group.password, 8);

    var newGroup = new Group({
        name: Group.name,
        email: Group.email,
        date: new Date(),
        password: hashedPassword
    })

    try {
        // Saving the Group 
        var savedGroup = await newGroup.save();
        var token = jwt.sign({
            id: savedGroup._id
        }, process.env.SECRET, {
            expiresIn: 86400 // expires in 24 hours
        });
        return token;
    } catch (e) {
        // return a Error message describing the reason 
        console.log(e)
        throw Error("Error while Creating Group")
    }
}

exports.updateGroup = async function (Group) {

    var id = {name :Group.name}
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
    var hashedPassword = bcrypt.hashSync(Group.password, 8);
    oldGroup.name = Group.name
    oldGroup.email = Group.email
    oldGroup.password = hashedPassword
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
        var deleted = await Group.remove({
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


exports.loginGroup = async function (Group) {

    // Creating a new Mongoose Object by using the new keyword
    try {
        // Find the Group 
        console.log("login:",Group)
        var _details = await Group.findOne({
            email: Group.email
        });
        var passwordIsValid = bcrypt.compareSync(Group.password, _details.password);
        if (!passwordIsValid) return 0;

        var token = jwt.sign({
            id: _details._id
        }, process.env.SECRET, {
            expiresIn: 86400 // expires in 24 hours
        });
        return {token:token, Group:_details};
    } catch (e) {
        // return a Error message describing the reason     
        throw Error("Error while Login Group")
    }

}