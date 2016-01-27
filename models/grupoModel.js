
var Grupo;

var findAllGruposUsuario = function(params,cb){
	console.log('findAllGruposUsuario')

	Grupo.find(params,function(err, respGrupos) {
	    cb(err,respGrupos);
	});
};

var findAllGrupos = function(cb){
	console.log('findAllGrupos');
	
	Grupo
	.find({})
	.populate('usuario')
	.exec(function(err,respGrupos){
		cb(err,respGrupos)
	});
};

var addGrupo = function(gru, cb){
	console.log('addGrupo');

	var grupo= new Grupo(gru);

	grupo.save(function(err, respGrupo) {
		cb(err,respGrupo);
	});
};


module.exports = function(models){
	Grupo =  models.Grupo;

	return {
		findAllGruposUsuario : findAllGruposUsuario,
		findAllGrupos : findAllGrupos,
		addGrupo : addGrupo
	};
};