var denunciaModel
var sedePolicialModel

var getDatosRegistroDenuncia = function(){
	
}

var registrarDenuncia = function(req, res, next){
	if(typeof req.session.usuario !== 'undefined'){

		var sedPolId = req.body.sedPold;

		sedePolicialModel.findSedesPoliciales({_id : sedPold},function(err,respSedPol){
			if(err) next(err);

			var den = {
				descripcion 	: req.body.descripcion,
				tipo 			: req.body.tipo,
				latitud 		: req.body.lat,
				longitud 		: req.body.lng,
				direccion 		: req.body.direccion,
				modoUsuario 	: req.body.modoUsuario,
				fechaRegistro	: new Date(),
				evidencias		: [],
				acusados		: req.body.acusados,
				sedePolicial 	: respSedPol,
				usuario 		: req.session.usuario
			};

			denunciaModel.addDenuncia(den, function(err, respDen){
				if(err) next(err);

				req.session.denunciaRegister = respDen;

				res.status(200).json(true);
			})

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
	
	req.session['files-evidencias-denuncia']=[];	

	var guardarListaEvidencias = function(done){
		async.eachSeries(files,guardarEvidencia,done);
	};

	var guardarEvidencia = function(evidencia, done){
		var rutafileTemp = evidencia.path;
		var split = rutafileTemp.split('\\');
		var name = split[split.length-1];
		var newPath = path.join(__dirname,'../public/archivosEvidenciasDenuncias',name);
		var is = fs.createReadStream(rutafileTemp);
		var os = fs.createWriteStream(newPath);

		is.on('error',done);
		is.on('end', function(err) {
		   if(err) done(err);
  		   //eliminamos el archivo temporal
  		   fs.unlink(rutafileTemp,function(err){
  		   		if(err) done(err);
  		   		evidencia.name=name;
  		   		req.session['files-evidencias-denuncia'].push(evidencia);
  		   		done();
  		   });
  		});

		is.pipe(os)
		
	};

	var updateDenuncia = function(done){
		var files = req.session['files-evidencias-denuncia'];
		var array = [];
		for(var i=0 ; i < files.length ; i++){
			var newFile = {};
			newFile.name = files[i].name;
			newFile.size=files[i].size;
			newFile.type=files[i].type;
			array.push(newFile);
		}
		denunciaModel.updateDenuncia({'_id':req.session.denunciaRegister._id},{evidencias:array},{},function(err,numAffected){
			if(err) done(err);
			req.session.denunciaRegister.evidencias = array;
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
		req.session.denunciaRegister.usuario=req.session.usuario;
		var denuncia = req.session.denunciaRegister;
		req.session.denunciaRegister = null;
		req.session['files-evidencias-denuncia'] = null;
		res.status(200).json({'rpt' : true , 'denuncia' : denuncia});
	};

	async.series([
		guardarListaEvidencias,
		updateDenuncia
	],finishUploadEvidencias);

};

var showRegistroDenuncia = function(req, res, next){
	if(typeof req.session.usuario !== 'undefined'){
		res.status(200).render('registrar_denuncia', req.session.usuario);
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
}

module.exports = function(models){
	denunciaModel = require('../models/denunciaModel')(models);
	sedePolicialModel = require('../models/sedePolicialModel')(models);
	return {
		registrarDenuncia : registrarDenuncia,
		showRegistroDenuncia : showRegistroDenuncia,
		uploadEvidencias : uploadEvidencias
	};
};