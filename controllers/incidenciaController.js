var incidenciaModel;

var getIncidencias = function(req, res, next){
	if(typeof req.session.usuario !== 'undefined'){
		incidenciaModel.findAllIncidencias(function(err,respJson){
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

var getIncidenciasLimitOffset = function(req, res, next){
	if(typeof req.session.usuario !== 'undefined'){
		var offset=0;
		if(req.body.masResultados){
			offset = req.session.offset + 10;
			req.session.offset = offset;
		}
		else{
			req.session.offset = 0;
		}
		incidenciaModel.findIncidenciasLimitOffset(offset,function(err,respJson){
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

//HTTP:POST /incidencias/registrar
var addIncidencia = function(req, res, next){

	if(typeof req.session.usuario !== 'undefined'){
		var inc = {
			descripcion 	: req.body.descripcion,
			tipo 			: req.body.tipo,
			latitud 		: req.body.lat,
			longitud 		: req.body.lng,
			direccion 		: req.body.direccion,
			modoUsuario 	: req.body.modoUsuario,
			fechaRegistro	: new Date(),
			evidencias		: [],
			usuario 		: req.session.usuario
		};

		incidenciaModel.addIncidencia(inc, function(err, respJson){
			if(err) next(err);
			req.session.incidenciaRegister=respJson;
			res.status(200).json(true)
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

var uploadEvidencias = function(req, res, next){
	
	var async = require('async');
	var path = require('path');
	var fs = require('fs');
	var files = req.files['files'];
	
	req.session['files-evidencias']=[];	

	var guardarListaEvidencias = function(done){
		async.eachSeries(files,guardarEvidencia,done);
	};

	var guardarEvidencia = function(evidencia, done){
		var rutafileTemp = evidencia.path;
		var split = rutafileTemp.split('\\');
		var name = split[split.length-1];
		var newPath = path.join(__dirname,'../public/archivosEvidencias',name);
		var is = fs.createReadStream(rutafileTemp);
		var os = fs.createWriteStream(newPath);

		is.on('error',done);
		is.on('end', function(err) {
		   if(err) done(err);
  		   //eliminamos el archivo temporal
  		   fs.unlink(rutafileTemp,function(err){
  		   		if(err) done(err);
  		   		evidencia.name=name;
  		   		req.session['files-evidencias'].push(evidencia);
  		   		done();
  		   });
  		});

		is.pipe(os)
		
	};

	var updateIncidencia = function(done){
		var files = req.session['files-evidencias'];
		var array = [];
		for(var i=0 ; i < files.length ; i++){
			var newFile = {};
			newFile.name = files[i].name;
			newFile.size=files[i].size;
			newFile.type=files[i].type;
			array.push(newFile);
		}
		incidenciaModel.updateIncidencia({'_id':req.session.incidenciaRegister._id},{evidencias:array},{},function(err,numAffected){
			if(err) done(err);
			req.session.incidenciaRegister.evidencias = array;
			if(numAffected.nModified==1){
				done()
			}
			else{
				var err= new Error('error al actualizar incidencia');
				done(err);
			}
		})
	};

	var finishUploadEvidencias = function(err){
		
		if(err) res.status(500).json(false);
		req.session.incidenciaRegister.usuario=req.session.usuario;
		var incidencia = req.session.incidenciaRegister;
		req.session.incidenciaRegister = null;
		req.session['files-evidencias'] = null;
		res.status(200).json({'rpt' : true , 'incidencia' : incidencia});
	};

	async.series([
		guardarListaEvidencias,
		updateIncidencia
	],finishUploadEvidencias);

};



module.exports = function(models){
	incidenciaModel = require('../models/incidenciaModel')(models);

	return {
		getIncidencias : getIncidencias,
		addIncidencia : addIncidencia,
		uploadEvidencias : uploadEvidencias,
		getIncidenciasLimitOffset : getIncidenciasLimitOffset
	};
};

