var mongoose = require('mongoose');
var models = {};

console.log('CONECTANDO CON MONGODB');

// the application is executed on the local machine ...
mongoose.connect('mongodb://erluqadev:erluqadev@ds051575.mongolab.com:51575/contra_crimen');
//mongoose.connect('mongodb://localhost/contra_crimen');



var getModels = function(){

	var Usuarios = new mongoose.Schema({
		nombre 		: {type: String},
		apePaterno 	: {type: String},
		apeMaterno 	: {type: String},
		telefono 	: {type: String},
		email 		: {type: String},
		usuario 	: {type: String},
		password 	: {type: String},
		dni 		: {type: String},
		codGen 		: {type: String},
		modoNombre 	: {type: Boolean},
		modoDni 	: {type: Boolean},
		modoTelefono : {type: Boolean},
		modoEmail   : {type: Boolean},
		estadoCuenta : {type: Boolean},
		ubigeo		: {type: String},
		seudonimo	: {type: String},
		fechaRegistro: {type: Date}
	});

	var SedesPoliciales = new mongoose.Schema({
		nombre 			: {type: String},
		latitud 		: {type: String},
		longitud 		: {type: String},
		direccion 		: {type: String},
		departamento	: {type: String},
		provincia		: {type: String},
		distrito		: {type: String}
	});

	var Grupos = new mongoose.Schema({
		nombre 		: {type: String},
		tipo		: {type: String},
		usuario 	: {type: mongoose.Schema.ObjectId , ref:'Usuarios'}
	});

	var Incidencias = new mongoose.Schema({
		descripcion 	: {type: String},
		tipo 			: {type: String},
		latitud 		: {type: String},
		longitud 		: {type: String},
		direccion 		: {type: String},
		modoUsuario 	: {type: String},
		evidencias		: {type: Array},
		fechaRegistro	: {type: Date},
		usuario 		: {type: mongoose.Schema.ObjectId , ref:'Usuarios'}
	});


	var Denuncias = new mongoose.Schema({
		descripcion 	: {type: String},
		tipo 			: {type: String},
		latitud 		: {type: String},
		longitud 		: {type: String},
		direccion 		: {type: String},
		modoUsuario 	: {type: String},
		evidencias		: {type: Array},
		acusados		: {type: Array},
		fechaRegistro	: {type: Date},
		sedePolicial	: {type: mongoose.Schema.ObjectId , ref:'Sedespoliciales'},
		usuario 		: {type: mongoose.Schema.ObjectId , ref:'Usuarios'}
	});



	models.Usuarios = mongoose.model('Usuarios' , Usuarios);
	models.SedesPoliciales = mongoose.model('Sedespoliciales' , SedesPoliciales);
	models.Grupos = mongoose.model('Grupos' , Grupos);
	models.Incidencias = mongoose.model('Incidencias' , Incidencias);
	models.Denuncias = mongoose.model('Denuncias' , Denuncias);

	return models;
}




module.exports = getModels;
