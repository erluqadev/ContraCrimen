var Denuncias

var addDenuncia = function(den, cb){
	Denuncias.save(den, cb);
};

var findDenuncias = function(params, cb){
	Denuncias.find(params, cb);
};

var updateDenuncia = function(where,den,options,cb){
	Denuncias.update(where, den, options, cb);
};


module.exports = function(models){
	Denuncias =  models.Denuncias;

	return {
		addDenuncia : addDenuncia,
		findDenuncias : findDenuncias,
		updateDenuncia : updateDenuncia
	};
};