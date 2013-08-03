var mongoose = require("mongoose");
mongoose.connect('mongodb://localhost/skip_devices')

var db = mongoose.connection;
var Device;

db.on('error',console.error.bind(console,"connection error: "));
var deviceSchema = mongoose.Schema({
	device_id: String,
	gcm_id: String,
	api_key: {type:String,default:"",
	type: {type:String, default: "android_gcm"},//There in case I decide to add iOS support in the future
	renew_gcm: {type:Boolean,default: false}//Flag to make the client renew GCM connectivity on next load
});

var generateAPIKey(){
	
}

deviceSchema.methods.message = function(){
	//Placeholder
	return true;
}

Device = mongoose.model('Device',deviceSchema);

exports.device = Device;
