var grupoModel;

var getGruposUsuario = function(req, res, next){
	if(typeof req.session.usuario !== 'undefined'){

		var params = {
			usuario : req.session.usuario
		};

		grupoModel.findAllGruposUsuario(params, function(err,respJson){
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

var getGrupos = function(req, res, next){
	if(typeof req.session.usuario !== 'undefined'){

		grupoModel.findAllGrupos(function(err,respJson){
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

var addGrupo = function(req, res, next){

	if(typeof req.session.usuario !== 'undefined'){
		var grupo = {
			nombre : req.body.nombre,
			tipo : req.body.tipo,
			usuario : req.session.usuario
		}
		grupoModel.addGrupo(grupo, function(err, respJson){
		if(err) next(err);

		res.status(200).json(true)
	});
	}
	else{
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


module.exports = function(models){
	grupoModel = require('../models/grupoModel')(models);
	return {
		getGruposUsuario : getGruposUsuario,
		getGrupos : getGrupos,
		addGrupo : addGrupo
	};
};