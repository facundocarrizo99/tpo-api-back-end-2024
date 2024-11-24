var express = require('express')
var router = express.Router()
var GroupController = require('../../controllers/group.controller');
var Authorization = require('../../auth/authorization');


// Authorize each API with middleware and map to the Controller Functions
/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('Llegaste a la ruta de  api/group.routes');
});
router.post('/create', Authorization, GroupController.createGroup)
router.get('/myGroups', Authorization, GroupController.getGroups)
router.get('/groupByID', Authorization, GroupController.getGroupByObjectID)
router.put('/update', Authorization, GroupController.updateGroup)
router.delete('/delete', Authorization, GroupController.removeGroup)



// Export the Router
module.exports = router;


