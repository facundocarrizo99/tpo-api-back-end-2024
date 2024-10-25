/**ROUTE USER APIs. */
var express = require('express')

var router = express.Router()
var users = require('./api/user.route')
var groups = require('./api/group.route')

router.use('/users', users);
router.use('/groups', groups);

module.exports = router;
