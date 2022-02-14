//libraries
const express = require('express');
const path = require('path');
require('dotenv').config();
const morgan = require('morgan');
const mysql = require('mysql');
const connectionDB = require('./database/connection');
var cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

//importing routes
const vehiclesRoutes = require('./routes/vehicleRoutes');
const driversRoutes = require('./routes/driverRoutes');
//settings
app.set('port', process.env.PORT || 3000)

//connection to DB
app.use(connectionDB);

//middlewares
app.use(morgan('dev'));
app.use(cors());


app.use(bodyParser.urlencoded({ extended: false }));
//to read json post request
app.use(bodyParser.json());


//routes
app.use('/api/vehicles/', vehiclesRoutes);
app.use('/api/drivers/', driversRoutes);


//starting server
app.listen(app.get('port'), () => {
    console.log('Server running on port '+ app.get('port'));
});