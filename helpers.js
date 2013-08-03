exports.handleValidationError = function(err,res){
	if(err.name == "ValidationError"){
		response = {"errors":[]};
		for(var error in err.errors){
			if(err.errors.hasOwnProperty(error)){
				response.push(error);
			}
		}
		res.json(400,response)
		return;
	}
	if(err.name == "MongoError"){
		if(err.code == 11000){
			res.json(400,{errors:["Duplicate Entry"]})
			return;
		}
		
	}
	res.json(500,{errors:["Internal Server Error"]});
}