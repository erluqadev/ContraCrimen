
var Grupos;

var findAllGruposUsuario = function(params,cb){
	console.log('findAllGruposUsuario')

	Grupos.find(params,function(err, respGrupos) {
	    cb(err,respGrupos);
	});
};

var findAllGrupos = function(cb){
	console.log('findAllGrupos');
	
	Grupos
	.find({})
	.populate('usuario')
	.exec(function(err,respGrupos){
		cb(err,respGrupos)
	});
};

var addGrupo = function(gru, cb){
	console.log('addGrupo');

	var grupos= new Grupos(gru);

	grupo.save(function(err, respGrupo) {
		cb(err,respGrupo);
	});
};


module.exports = function(models){
	Grupos =  models.Grupos;

	return {
		findAllGruposUsuario : findAllGruposUsuario,
		findAllGrupos : findAllGrupos,
		addGrupo : addGrupo
	};
};