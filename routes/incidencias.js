var express = require('express');
var router = express.Router();
var incidenciaController;
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();


module.exports = function(models){
	incidenciaController = require('../controllers/incidenciaController')(models);

	router.get('/listar',incidenciaController.getIncidenciasLimitOffset);

	router.post('/publicar',incidenciaController.addIncidencia);

	router.post('/upload-evidencias',multipartMiddleware,incidenciaController.uploadEvidencias);


	return router;
};