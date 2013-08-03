var express = require('express');
var app = express();
var Device = require('./device.js').device;

app.use(express.bodyParser());

app.post('/devices',function(req,res){
	if(!req.body.device_id || !req.body.gcm_id){
		res.send(400,"Invalid Parameters.");
		return
	}
	var device = new Device({device_id:req.body.device_id,
	                     gcm_id:   req.body.gcm_id});
	device.save(function(err,device){
		if(err){
			res.send(500,"Internal Server Error");
			return
		}
		res.json(device);
	});
});

app.get('/devices',function(req,res){
	res.type('text/plain');
	res.send('Test');
});

app.listen(process.env.PORT || 8000);