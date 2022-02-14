const driversController = {};

driversController.getDrivers = (req, res) => {
    try{
        let result = [], index = {};
        req.getConnection((err, connection) => {

            if (err) {
                return res.status(503).send({ result: false, error: 'CONNECTION error: ' + err.code});
            } else {
                let sqlString='SELECT driver.*, vehicle.id as vehicle_id, vehicle.plate, vehicle.model, vehicle.type, vehicle.capacity, vehicle.creation_date FROM driver INNER JOIN vehicle ON driver.id = vehicle.driver_id order by driver.id';
                let options={sql:sqlString,nestTables:true};
                    connection.query(options, 
                        
                    ((err, rows) => {
                        
                    
                        if (err){
                            return res.status(500).send({ result: false, error: 'QUERY ERROR: ' + error.code});
                        }
                    
                        rows.forEach(function (row) {
                            if ( !(row.driver.id in index) ) {
                                index[row.driver.id] = {
                                    id: row.driver.id,
                                    company_id: row.driver.company_id,
                                    city: row.driver.city,
                                    first_name: row.driver.first_name,
                                    last_name: row.driver.last_name,
                                    email: row.driver.email,
                                    phone: row.driver.phone,
                                    avatar_url: row.driver.avatar_url,
                                    status: row.driver.status,
                                    creation_date: row.driver.creation_date,
                                    vehicles: []
                                };
                                result.push(index[row.driver.id]);
                            }
                            index[row.driver.id].vehicles.push({
                                vehicle_id: row.vehicle.vehicle_id,
                                plate: row.vehicle.plate,
                                model: row.vehicle.model,
                                type: row.vehicle.type,
                                capacity: row.vehicle.capacity,
                                creation_date: row.vehicle.creation_date
                            });
                        });
                    
                        res.status(200).send({
                            message: 'successful query',
                            data: result,
                        });
                    }
                ));
            }
    
        });

    }catch(err){
        res.status(500).json(err);
    }
    
};

driversController.show = (req, res) => {
    try{
        let result = [], index = {};
        let driverId = req.params.driverId;
        //connection
        req.getConnection((err, conn) => {
            //get that vehicle
            let sqlString = 'SELECT driver.*, vehicle.* FROM driver INNER JOIN vehicle ON driver.id = vehicle.driver_id WHERE driver.id = '+driverId;
            let options={sql:sqlString,nestTables:true};
            conn.query(options, (err, driver) => {
                if(err){
                    next(err);
                } else {
                    if(driver === '' || driver.length === 0){
                        res.status(400).json("The selected driver does'nt exist");
                    } else {


                        driver.forEach(function (row) {
                            if ( !(row.driver.id in index) ) {
                                index[row.driver.id] = {
                                    id: row.driver.id,
                                    company_id: row.driver.company_id,
                                    city: row.driver.city,
                                    first_name: row.driver.first_name,
                                    last_name: row.driver.last_name,
                                    email: row.driver.email,
                                    phone: row.driver.phone,
                                    avatar_url: row.driver.avatar_url,
                                    status: row.driver.status,
                                    creation_date: row.driver.creation_date,
                                    vehicles: []
                                };
                                result.push(index[row.driver.id]);
                            }
                            index[row.driver.id].vehicles.push({
                                vehicle_id: row.vehicle.id,
                                plate: row.vehicle.plate,
                                model: row.vehicle.model,
                                type: row.vehicle.type,
                                capacity: row.vehicle.capacity,
                                creation_date: row.vehicle.creation_date
                            });
                        });



                        res.status(200).send({
                            message: 'successful query',
                            data: result
                         }); 
                    }
                }
            }); //end query
            
        }) //end connection
        
    }catch(err){
        res.status(500).json(err);
    }
};



module.exports = driversController;