var express = require('express');
var router = express.Router();
var denunciaController;
var sedePolicialController;


module.exports = function(models){
	denunciaController = require('../controllers/denunciaController')(models);
	sedePolicialController = require('../controllers/sedePolicialController')(models);

	console.log(sedePolicialController.cargarSedesPoliciales);

	router.get('/' , function(req, res, next){
		res.json(200)
	});

	router.get('/registro_denuncia',denunciaController.showRegistroDenuncia);

	router.get('/cargarSedesPoliciales' , sedePolicialController.cargarSedesPoliciales);

	return router;
};