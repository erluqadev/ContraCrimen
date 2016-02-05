
var Usuarios;

var findAllUsuarios = function(cb){
	console.log('findAllUsuarios')

	Usuarios.find(function(err, respUsuarios) {
	    cb(err,respUsuarios);
	});
};

var findParamsUsuarios =  function(params,cb){
	console.log('findParamsUsuarios');

	Usuarios.findOne(params,function(err, respUsuarios) {
	    cb(err,respUsuarios);
	});
};


var findUsuarioById=function(id, cb){
	console.log('findUsuarioById:' + id);

	Usuarios.findById(id, function(err, respUsuario) {
		cb(err,respUsuario);
	});
};


var addUsuario = function(usu, cb){
	console.log('addUsuario');

	var usuarios= new Usuarios(usu);

	usuarios.save(function(err, respUsuario) {
		cb(err,respUsuario);
	});
};


var updateUsuario = function(conditions, usu, cb){
	console.log('updateUsuario');

	Usuarios.update(conditions,usu,function(err,respUsuario){
		cb(err,respUsuario);
	});
};


module.exports = function(models){
	Usuarios = models.Usuarios;

	return {
		findAllUsuarios : findAllUsuarios,
		findUsuarioById : findUsuarioById,
		findParamsUsuarios : findParamsUsuarios,
		addUsuario : addUsuario,
		updateUsuario : updateUsuario
	};
};