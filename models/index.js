var mongoose = require('mongoose');
var models = {};

console.log('CONECTANDO CON MONGODB');

var dbName = 'contracrimen'

// the application is executed on the local machine ...
mongoose.connect('mongodb://localhost/' + dbName);



var getModels = function(){

	var Usuario = new mongoose.Schema({
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

	var Grupo = new mongoose.Schema({
		nombre 		: {type: String},
		tipo		: {type: String},
		usuario 	: {type: mongoose.Schema.ObjectId , ref:'usuario'}
	});

	var Incidencia = new mongoose.Schema({
		descripcion 	: {type: String},
		modo 			: {type: String},
		tipo 			: {type: String},
		latitud 		: {type: String},
		longitud 		: {type: String},
		direccion 		: {type: String},
		modoUsuario 	: {type: String},
		evidencias		: {type: Array},
		fechaRegistro	: {type: Date},
		usuario 		: {type: mongoose.Schema.ObjectId , ref:'usuario'}
	});

	models.Usuario = mongoose.model('usuario' , Usuario);
	models.Grupo = mongoose.model('grupo' , Grupo);
	models.Incidencia = mongoose.model('incidencia' , Incidencia);

	return models;
}




module.exports = getModels;
