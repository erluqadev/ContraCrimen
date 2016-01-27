var usuarioModel;


//HTTP:GET /usuarios
var getUsuarios = function(req, res, next){
	if(typeof req.session.usuario !== 'undefined'){
		usuarioModel.findAllUsuarios(function(err,respJson){
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

//HTTP:GET /usuarios/:id
var getUsuarioById = function(req, res, next){
	var id = req.params.id;
	if(typeof id === 'undefined') next();

	if(typeof req.session.usuario !== 'undefined'){
		usuarioModel.findUsuarioById(id, function(err, respJson){
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

//HTTP:POST /usuarios
var addUsuario = function(req, res, next){

	var UUID = generarUUID();

	var usu = {
		nombre 		: req.body.nombre,
		apePaterno 	: req.body.apePaterno,
		apeMaterno 	: req.body.apeMaterno,
		telefono 	: req.body.telefono,
		email 		: req.body.email,
		usuario 	: req.body.usuario,
		password 	: req.body.password,
		dni 		: req.body.dni,
		codGen 		: UUID,
		modoNombre 	: true,
		modoDni 	: true,
		modoTelefono : true,
		modoEmail   : true,
		estadoCuenta : false,
		ubigeo		: null,
		seudonimo	: null,
		fechaRegistro: new Date()
	};

	usuarioModel.addUsuario(usu, function(err, respJson){
		if(err) next(err);

		var cbEmail = function(err,response){
			if(err){
				next(err);
			}
			else{
				res.status(200).json(true);
			}
		};
		enviarEmail(respJson.email, respJson.codGen, cbEmail);
	});
};


//HTTP:PUT /usuarios
var updateUsuario = function(req, res, next){

};

var login = function(req, res, next){
	var usuario = req.body.usuario;
	var password = req.body.password;
	if(typeof usuario === 'undefined' || typeof password === 'undefined') next();

	var conditions = {
		usuario : usuario,
		password : password
	};

	usuarioModel.findParamsUsuarios(conditions, function(err, respJson){
		if(err){
			next(err);
		}
		else{
			if(respJson === null){
				res.status(200).json({'rpt':false,'data':'Usuario o Contraseña incorrectos.'});
			}
			else{
				if(respJson.estadoCuenta){
					req.session.usuario=respJson
					res.status(200).json({'rpt':true,'data':respJson});
				}
				else{
					res.status(200).json({'rpt':false,'data':'Por favor, proceda a activar su cuenta siguiendo los pasos que se indican en el correo que se le envio.'});
				}
			}
		}
	});
};

var logout = function(req, res, next){
	req.session.destroy(function(err){
		res.status(200).redirect('/');
	});
}

var registroExitoso = function(req,res,next){
	res.status(200).render('registroexitoso');
};


var activarCuenta = function(req, res, next){
	var codigo = req.params.codgen;
	var conditions = {
		codGen : codigo
	};
	var usu = {
		estadoCuenta: true
	};
	usuarioModel.updateUsuario(conditions,usu,function(err, respJson){
		if(err){
			next(err);
		}
		else{
			res.status(200).redirect('/home');
		}
	});
};


var verificarActivacion = function(usuario , password){
	
};



var enviarEmail = function(email,codGen,cb){
	var nodemailer = require('nodemailer');


	var smtpTransport = nodemailer.createTransport("SMTP",{
	    service: "Gmail",
		auth: {
		  user: "ericson.quispe.sistemas@gmail.com",
		  pass: "elqa72973135@hardcoreis"
		}
	});

	var link = "http://localhost:3000/usuarios/activar/" + codGen;


	var mailOptions = {
	    from: "my site<soporte@contracrimen.com>", // sender address
		to: email, // list of receivers
		subject: "Correo de activación de cuenta", // Subject line
		html: "Haga click en el siguiente link : " + link// html body
	}

				    
 	smtpTransport.sendMail(mailOptions, function(err, response){
	    cb(err,response);
  	});
};


var generarUUID = function(){
	var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
    });
    return uuid;
};


module.exports = function(models){
	usuarioModel = require('../models/usuarioModel')(models);

	return {
		getUsuarios : getUsuarios,
		getUsuarioById : getUsuarioById,
		addUsuario : addUsuario,
		updateUsuario : updateUsuario,
		activarCuenta : activarCuenta,
		login : login,
		logout : logout,
		registroExitoso : registroExitoso
	};	
};