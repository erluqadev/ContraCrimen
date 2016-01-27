var express = require('express');
var router = express.Router();
var grupoController;


module.exports = function(models){
	grupoController = require('../controllers/grupoController')(models);

	router.post('/registro',grupoController.addGrupo);

	router.get('/show',grupoController.getGrupos);

	router.get('/grupos_usuario',grupoController.getGruposUsuario);

	return router;
};