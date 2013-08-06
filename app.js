var express = require('express');
var app = express();
var Device = require('./device.js').device;
var helpers = require('./helpers.js');
var gcm = require("node-gcm");

process.env.PWD = process.cwd()
app.use(express.bodyParser());
app.use(express.static(process.env.PWD  + '/public'));


app.param('api_key',function(req, res, next, api_key){
	console.log(api_key);
	Device.findOne({api_key: api_key},function(err,device){
		if(err){
			res.json(500,{success:false,errors:["Internal Server Error"]});
		}else if(device){
			req.device = device;
			next();
		}else{
			res.json(400,{success:false,errors:["Invalid API Key"]});
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

	Function 
		Sends a pebble message to the associated device
*/
app.post('/devices/:api_key',function(req,res){
	if(!req.body.title || !req.body.body){
		res.json(400,{success:false,errors:["Invalid Parameters (did you include a title & a body?)"]});
		return;
	}

	var message = new gcm.Message({
		data: {
			title:req.body.title,
			body:req.body.body
		}
	});
	if(req.body.collapse_key){
		message.collapseKey	= req.body.collapse_key;
	}
	if(req.body.ttl){
		message.timeToLive = req.body.ttl;
	}
	var gcm_ids = [req.device.gcm_id];
	var sender = new gcm.Sender('AIzaSyDshQwMlWR7fbukMeJ38nivNAja7OKhXOU');

	sender.send(message,gcm_ids,2,function(err,result){
		if(err){
			res.json(500,{success:false,
			              errors:[
			              	"GCM Error - Code: " + err
			              ]});
			return;
		}
		res.send(200,{success:true});
	});

});

/* POST /devices/:api_key/delete
	As more parameters were needed this had to beomce a POST request :(

	Required Parameters
		device_id -> Unique ID just for safety
*/
app.post('/devices/:api_key/delete',function(req,res){
	if(!req.body.device_id){
		res.json(400,{success:false,"errors":["Invalid Parameters"]});
		return;
	}
	if(req.device.device_id == req.body.device_id){
		req.device.remove();
	}else{
		res.json(400,{success:false,"errors":["Invalid Device ID"]});
		return;
	}
	
	res.json(200,{success:true});
});

/* PUT /devices/:api_key/ */


app.listen(process.env.PORT || 8000);