
var Usuario;

var findAllUsuarios = function(cb){
	console.log('findAllUsuarios')

	Usuario.find(function(err, respUsuarios) {
	    cb(err,respUsuarios);
	});
};

var findParamsUsuarios =  function(params,cb){
	console.log('findParamsUsuarios');

	Usuario.findOne(params,function(err, respUsuarios) {
	    cb(err,respUsuarios);
	});
};


var findUsuarioById=function(id, cb){
	console.log('findUsuarioById:' + id);

	Usuario.findById(id, function(err, respUsuario) {
		cb(err,respUsuario);
	});
};


var addUsuario = function(usu, cb){
	console.log('addUsuario');

	var usuario= new Usuario(usu);

	usuario.save(function(err, respUsuario) {
		cb(err,respUsuario);
	});
};


var updateUsuario = function(conditions, usu, cb){
	console.log('updateUsuario');

	Usuario.update(conditions,usu,function(err,respUsuario){
		cb(err,respUsuario);
	});
};


module.exports = function(models){
	Usuario = models.Usuario;

	return {
		findAllUsuarios : findAllUsuarios,
		findUsuarioById : findUsuarioById,
		addUsuario : addUsuario,
		updateUsuario : updateUsuario,
		findParamsUsuarios : findParamsUsuarios
	};
};