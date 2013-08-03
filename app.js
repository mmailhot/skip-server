var express = require('express');
var app = express();
var Device = require('./device.js').device;
var helpers = require('./helpers.js');

app.use(express.bodyParser());

/*POST /devices

Required Parameters:
	device_id -> Unique ID of the device
	gcm_id -> The Push Messaging ID (from GCM)

Function
	Add's device to the database and returns the device w/ API key
*/

app.post('/devices',function(req,res){
	if(!req.body.device_id || !req.body.gcm_id){
		res.json(400,{"errors":["Invalid Parameters"]});
		return
	}
	var device = new Device({device_id: req.body.device_id, gcm_id: req.body.gcm_id});
	device.save(function(err,device){
		if(err){
			helpers.handleValidationError(err,res);
			return
		}
		res.json(device);
	});
});

/* GET /devices

Required Parameters:
	device_id -> Unique ID of the device

Function
	Returns the device's details

*/

app.get('/devices',function(req,res){
	
});

app.listen(process.env.PORT || 8000);