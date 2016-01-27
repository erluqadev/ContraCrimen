var express = require('express');
var router = express.Router();

/* GET home page. */

router.get('/', function(req, res, next) {
	if(typeof req.session.usuario !== 'undefined'){
	  	res.redirect('/home');
	}
	else{
		res.status(200).render('index');
	}
});


router.get('/home', function(req, res, next) {
	if(typeof req.session.usuario !== 'undefined'){
	  	res.status(200).render('home',{usuario : req.session.usuario});
	}
	else{
		res.redirect('/');
	}
	
});


router.get('/registro', function(req, res, next) {
  res.status(200).render('registro');
});


module.exports = router;
