var sedePolicialModel

var getSedesPoliciales = function(req , res, next){

	if(typeof req.session.usuario !== 'undefined'){

		var params = {};

		if(req.body.departamento){
			params.departamento = req.body.departamento;
		}
		if(req.body.provincia){
			params.provincia = req.body.provincia;
		}
		if(req.body.distrito){
			params.distrito = req.body.distrito;
		}

		sedePolicialModel.findSedesPliciales(params, function(err,respJson){
			if(err){
				next(err);
			}
			else{
				res.status(200).json(respJson);
			}
		});
	}else{
		var accept=req.headers.accept;
		var split = accept.split(',');
		var isJson = false;
		for(var i=0;i < split.length;i++){
			if(split[i]==='application/json'){
				isJson=true;
				break;
			}
		}
		if(isJson){
			res.status(200).json(false);
		}
		else{
			res.status(200).redirect('/');
		}
	}
};

var cargarSedesPoliciales = function(req, res, next){
	var array = [];
	var s1 = {
		nombre 			: "COMISARIA LA VICTORIA",
		latitud 		: "-6.798462",
		longitud 		: "-79.835515",
		direccion 		: "Pachacutec 1510",
		departamento	: "LAMBAYEQUE",
		provincia		: "CHICLAYO",
		distrito		: "LA VICTORIA"
	};
	var s2 = {
		nombre 			: "COMISARIA CESAR LLATAS",
		latitud 		: "-6.770684",
		longitud 		: "-79.835384",
		direccion 		: "Vicente de la Vega 1082",
		departamento	: "LAMBAYEQUE",
		provincia		: "CHICLAYO",
		distrito		: "CHICLAYO"
	};
	var s3 = {
		nombre 			: "COMISARIA CAMPODÓNICO",
		latitud 		: "-6.768232",
		longitud 		: "-79.829932",
		direccion 		: "Jorge Chavez 808",
		departamento	: "LAMBAYEQUE",
		provincia		: "CHICLAYO",
		distrito		: "CAMPODÓNICO"
	};
	var s4 = {
		nombre 			: "COMISARIA ATUSPARIAS",
		latitud 		: "-6.759171",
		longitud 		: "-79.825703",
		direccion 		: "Virrey Toledo 1098",
		departamento	: "LAMBAYEQUE",
		provincia		: "CHICLAYO",
		distrito		: "JOSE LEONARDO ORTIZ"
	};
	var s5 = {
		nombre 			: "COMISARIA DEL NORTE",
		latitud 		: "-6.769088",
		longitud 		: "-79.855656",
		direccion 		: "Francisco Cuneo Salazar",
		departamento	: "LAMBAYEQUE",
		provincia		: "CHICLAYO",
		distrito		: "CHICLAYO"
	};
	array.push(s1);
	array.push(s2);
	array.push(s3);
	array.push(s4);
	array.push(s5);
	console.log('aqui');
	sedePolicialModel.cargarSedesPoliciales(array,function(err){
		if(err){
			next(err);
		}
		else{
			res.status(200).json(true);
		}
	});
};

module.exports = function(models){
	sedePolicialModel = require('../models/sedePolicialModel')(models);
	return {
		getSedesPoliciales : getSedesPoliciales,
		cargarSedesPoliciales : cargarSedesPoliciales
	};
};