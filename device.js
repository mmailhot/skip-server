var randomstring = require("randomstring");
var mongoose = require("mongoose");
mongoose.connect(process.env.MONGOHQ_URL || 'mongodb://localhost/skip_devices')

var db = mongoose.connection;
var Device;

db.on('error',console.error.bind(console,"connection error: "));

var generateAPIKey = function(){
	return randomstring.generate(20);
}

var deviceSchema = mongoose.Schema({
	device_id: {type: String, required: true ,unique: true ,index: true},
	gcm_id: {type: String, required: true},
	api_key: {type: String, default: generateAPIKey, required: true, unique:true, index:true},
	type: {type: String, default: "android_gcm"},//There in case I decide to add iOS support in the future
	renew_gcm: {type: Boolean, default: false}//Flag to make the client renew GCM connectivity on next load
});

deviceSchema.methods.message = function(){
	//Placeholder
	return true;
}

Device = mongoose.model('Device',deviceSchema);

exports.device = Device;
