const {validationResult} = require('express-validator');
const { CLIENT_FOUND_ROWS } = require('mysql/lib/protocol/constants/client');
const vehiclesController = {};
vehiclesController.getVehicles = (req, res) => {
    try{
        let result = [], index = {};
        req.getConnection((err, conn) => {
            if (err) {
                return res.status(503).send({ result: false, error: 'CONNECTION error: ' + err.code});
            }
            let sqlString= 'SELECT vehicle.*,  driver.* FROM vehicle INNER JOIN driver ON vehicle.driver_id = driver.id order by vehicle.id';
            let options={sql:sqlString,nestTables:true};
            conn. query(options, ((err, rows) => {
                if(err){
                    //next(err);
                    res.status(400).json(err);
                } else {
                    //getting vehicles
                    //console.log(vehicles);
                    rows.forEach(function (row) {

                        if ( !(row.vehicle.id in index) ) {
                                    index[row.vehicle.id] = {
                                        vehicle_id: row.vehicle.id,
                                        plate: row.vehicle.plate,
                                        model: row.vehicle.model,
                                        type: row.vehicle.type,
                                        capacity: row.vehicle.capacity,
                                        creation_date: row.vehicle.creation_date,
                                        driver: []
                                    };
                                    result.push(index[row.vehicle.id]);
                                }
                                index[row.vehicle.id].driver.push({
                                        driver_id: row.driver.id,
                                        company_id: row.driver.company_id,
                                        city: row.driver.city,
                                        first_name: row.driver.first_name,
                                        last_name: row.driver.last_name,
                                        email: row.driver.email,
                                        phone: row.driver.phone,
                                        avatar_url: row.driver.avatar_url,
                                        status: row.driver.status,
                                        creation_date: row.driver.creation_date,
                                });

                    });

                    res.status(200).send({
                       message: 'successful query',
                       data: result
                    });
                }
            }));
        });

    }catch(err){
        res.status(500).json(err);
    }
    
};

vehiclesController.save = (req, res) => {
    try{
        let result = [], index = {};
        const errors = validationResult(req);
            if(!errors.isEmpty()){
                return res.status(422).json({errores: errors.array()})
            }

        const data = req.body;

        req.getConnection((err, conn) => {

            //verify if that driver exist
            conn.query('SELECT * FROM vehicle WHERE id = '+data.driver_id, (err, driver) => {
                if(err){
                    //next(err);
                    next(err);
                } else {
                    //console.log('driver exist.');
                    //console.log(driver);
                    if(driver === '' || driver.length === 0){
                        res.status(400).json("The selected driver does'nt exist");
                    } else {

                        //do the insert
                        conn.query('INSERT INTO vehicle set ?',[data], (err, resp) => {

                            if(err){
                                //next(err);
                                res.status(400).json(err);
                            } else {
                                console.log("registro de vehiculo exitoso");
                            }
                            
                        });
                        //show new row
                        let sqlString = 'SELECT vehicle.*,  driver.* FROM vehicle INNER JOIN driver ON vehicle.driver_id = driver.id ORDER BY vehicle.id DESC LIMIT 1';
                        let options={sql:sqlString,nestTables:true};
                        conn.query(options,(err, rows) => {
                            if(err){
                                //next(err);
                                res.status(400).json(err);
                            } else {

                                rows.forEach(function (row) {
                                    console.log(row);
                                    if ( !(row.vehicle.id in index) ) {
                                                index[row.vehicle.id] = {
                                                    vehicle_id: row.vehicle.id,
                                                    plate: row.vehicle.plate,
                                                    model: row.vehicle.model,
                                                    type: row.vehicle.type,
                                                    capacity: row.vehicle.capacity,
                                                    creation_date: row.vehicle.creation_date,
                                                    driver: []
                                                };
                                                result.push(index[row.vehicle.id]);
                                            }
                                            index[row.vehicle.id].driver.push({
                                                    driver_id: row.driver.id,
                                                    company_id: row.driver.company_id,
                                                    city: row.driver.city,
                                                    first_name: row.driver.first_name,
                                                    last_name: row.driver.last_name,
                                                    email: row.driver.email,
                                                    phone: row.driver.phone,
                                                    avatar_url: row.driver.avatar_url,
                                                    status: row.driver.status,
                                                    creation_date: row.driver.creation_date,
                                            });
            
                                });
                                //console.log(result);

                                res.status(200).send({
                                    message: 'successful operation',
                                    newVehicle: result
                                 });
                            }
                        });


                    }

                    


                    
                }// end else
            });// end query of driver

        }); // end connection
    }catch(err){
        res.status(500).json(err);
    }
};

vehiclesController.show = (req, res) => {
    try{
        let result = [], index = {};
        let vehicleId = req.params.vehicleId;
        //connection
        req.getConnection((err, conn) => {
            //get that vehicle
            conn.query('SELECT vehicle.* FROM vehicle WHERE id = '+vehicleId, (err, vehicle) => {
                if(err){
                    next(err);
                } else {
                    if(vehicle === '' || vehicle.length === 0){
                        res.status(400).json("The selected vehicle does'nt exist");
                    } else {
                        res.status(200).send({
                            message: 'successful query',
                            Vehicle: vehicle
                         }); 
                    }
                }
            }); //end query
            
        }) //end connection
        
    }catch(err){
        res.status(500).json(err);
    }
};

vehiclesController.edit =  (req, res) => {

    try{
        let vehicleId = req.params.vehicleId;
        const errors = validationResult(req);
            if(!errors.isEmpty()){
                return res.status(422).json({errores: errors.array()})
            }

        const data = req.body;


        //connection
        req.getConnection((err, conn) => {
            //get that vehicle
            conn.query('SELECT vehicle.* FROM vehicle WHERE id = '+vehicleId, (err, vehicle) => {
                if(err){
                    next(err);
                } else {
                    if(vehicle === '' || vehicle.length === 0){
                        res.status(400).json("The selected vehicle does'nt exist");
                    } else {
                        //do the update
                        conn.query('UPDATE vehicle SET ? WHERE id = ?',[data, vehicleId], (err, resp) => {

                            if(err){
                                //next(err);
                                res.status(400).json(err);
                            } else {
                                console.log("actualizacion de vehiculo exitosa");
                                //get the new data of this vehicle
                                conn.query('SELECT vehicle.* FROM vehicle WHERE id = '+vehicleId, (err, vehicleUpdated) => {
                                    if(err){
                                        //next(err);
                                        res.status(400).json(err);
                                    } else {
                                        res.status(200).send({
                                            message: 'successful operation',
                                            Vehicle: vehicleUpdated
                                         });
                                    }
                                });

                                

                            }
                            
                        });

                    }
                }
            }); //end query
            
        }) //end connection


    }catch(err){
        res.status(500).json(err);
    }

};

vehiclesController.delete = (req, res) => {
    try{
        let vehicleId = req.params.vehicleId;

        //connection
        req.getConnection((err, conn) => {
            //get that vehicle
            conn.query('SELECT vehicle.* FROM vehicle WHERE id = '+vehicleId, (err, vehicle) => {
                if(err){
                    next(err);
                } else {
                    if(vehicle === '' || vehicle.length === 0){
                        res.status(400).json("The selected vehicle does'nt exist");
                    } else {
                        //do the update
                        conn.query('DELETE FROM vehicle WHERE id = ?',[vehicleId], (err, resp) => {

                            if(err){
                                //next(err);
                                res.status(400).json(err);
                            } else {
                                res.status(200).send({
                                    message: 'successful operation',
                                    
                                 });
                                

                            }
                            
                        });

                    }
                }
            }); //end querys

        });//end connection


    }catch(err){
        res.status(500).json(err);
    }


};

module.exports = vehiclesController;