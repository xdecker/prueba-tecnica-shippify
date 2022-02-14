const express = require('express');
const router = express.Router();
const {check} = require('express-validator');
const vehiclesController = require('../controllers/VehicleController');

router.get('/getvehicles', vehiclesController.getVehicles);
router.get('/getvehicle/:vehicleId', vehiclesController.show);
router.post('/create', [
    check('plate', "the 'plate' field is required").not().isEmpty(),
    check('model', "the 'model' field is required").not().isEmpty(),
    check('type', "the 'type' field is required").not().isEmpty(),
    check('capacity', "the 'capacity' field is required").not().isEmpty(),
    check('driver_id', "You have to specify the vehicle").not().isEmpty(),
    check('driver_id', "You must select a valid driver").isNumeric(),
],vehiclesController.save);
router.put('/edit/:vehicleId',[
    check('plate', "the 'plate' field is required").not().isEmpty(),
    // check('model', "the 'model' field is required").not().isEmpty(),
    // check('type', "the 'type' field is required").not().isEmpty(),
    // check('capacity', "the 'capacity' field is required").not().isEmpty(),
    // check('driver_id', "You have to specify the vehicle").not().isEmpty(),
    // check('driver_id', "You must select a valid driver").isNumeric(),
],vehiclesController.edit);
router.delete('/delete/:vehicleId', vehiclesController.delete);

module.exports = router;