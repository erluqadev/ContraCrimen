var express = require('express');
var router = express.Router();
var usuarioController;


module.exports = function(models){
	usuarioController = require('../controllers/usuarioController')(models);

	router.get('/show', usuarioController.getUsuarios);

	router.get('/show/:id',usuarioController.getUsuarioById);

	router.post('/add',usuarioController.addUsuario);

	router.put('/update',usuarioController.updateUsuario);

	router.get('/activar/:codgen',usuarioController.activarCuenta);

	router.post('/login',usuarioController.login);

	router.get('/logout',usuarioController.logout);

	router.get('/registro_exitoso',usuarioController.registroExitoso);

	return router;
};
