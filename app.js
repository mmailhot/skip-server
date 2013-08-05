var express = require('express');
var app = express();
var Device = require('./device.js').device;
var helpers = require('./helpers.js');

app.use(express.bodyParser());


app.param('api_key',function(req, res, next, api_key){
	console.log(api_key);
	Device.findOne({api_key: api_key},function(err,device){
		if(err){
			res.json(500,{sucess:false,errors:["Internal Server Error"]});
		}else if(device){
			req.device = device;
			next();
		}else{
			res.json(400,{sucess:false,errors:["Invalid API Key"]});
		}
	});
});

/*POST /devices

Required Parameters:
	device_id -> Unique ID of the device
	gcm_id -> The Push Messaging ID (from GCM)

Function
	Add's device to the database and returns the device w/ API key

Returns
	Success:
		The device just added
	Failures:
		Error 400: Improper Data Sent
		Error 500: Server Error
*/

app.post('/devices',function(req,res){
	if(!req.body.device_id || !req.body.gcm_id){
		res.json(400,{"errors":["Invalid Parameters"]});
		return;
	}
	var device = new Device({device_id: req.body.device_id, gcm_id: req.body.gcm_id});
	device.save(function(err,device){
		if(err){
			helpers.handleValidationError(err,res);
			return;
		}
		res.json([device]);
	});
});

/* GET /devices

Required Parameters:
	device_id -> Unique ID of the device

Function
	Returns the device's details

Returns
	Success:
		The device
	Failures:
		Error 400: Improper Data Sent
		Error 500: Server Error
*/

app.get('/devices',function(req,res){
	if(!req.query.device_id){
		res.json(400,{"errors":["Invalid Parameters"]});
		return;
	}
	Device.findOne({device_id: req.query.device_id},'device_id gcm_id api_key',function(err,device){
		if(err){
			res.json(500,{"errors":["Internal Server Error"]});
			return;
		}
		if(device == null){
			res.json([]);
			return;
		}
		res.json([device]);
		return;
	});
});

/* POST /devices/:api_key/

Function */

/* POST /devices/:api_key/delete
	As more parameters were needed this had to beomce a POST request :(

	Required Parameters
		device_id -> Unique ID just for safety
*/
app.post('/devices/:api_key/delete',function(req,res){
	if(!req.body.device_id){
		res.json(400,{sucess:false,"errors":["Invalid Parameters"]});
		return;
	}
	if(req.device.device_id == req.body.device_id){
		req.device.remove();
	}else{
		res.json(400,{sucess:false,"errors":["Invalid Device ID"]});
		return;
	}
	
	res.json(200,{sucess:true});
});

/* PUT /devices/:api_key/ */


app.listen(process.env.PORT || 8000);