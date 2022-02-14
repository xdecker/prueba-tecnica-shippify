const express = require('express');
const router = express.Router();
const driversController = require('../controllers/DriverController');

router.get('/getdrivers', driversController.getDrivers);
router.get('/getdriver/:driverId', driversController.show);
module.exports = router;