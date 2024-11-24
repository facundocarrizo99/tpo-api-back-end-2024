var express = require('express')
var router = express.Router()
var GroupController = require('../../controllers/group.controller');
var TicketController = require('../../controllers/ticket.controller');
var ArregloController = require('../../controllers/arreglo.controller');
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
router.post('/createTicket', Authorization, TicketController.createTicket)
router.put('/updateTicket', Authorization, TicketController.updateTicket)
router.delete('/deleteTicket', Authorization, TicketController.removeTicket)
router.get('/group/tickets', Authorization, TicketController.getTickets)
router.post('/createArreglo', Authorization, ArregloController.createArreglo)
router.put('/updateArreglo', Authorization, ArregloController.updateArreglo)
router.delete('/deleteArreglo', Authorization, ArregloController.removeArreglo)
router.get('/group/arreglos', Authorization, ArregloController.getArreglos)

// Export the Router
module.exports = router;


