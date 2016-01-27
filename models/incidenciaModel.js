
var Incidencia;

var findAllIncidencias = function(cb){
	console.log('findAllIncidencias');
	Incidencia
	.find({})
	.populate('usuario')
	.exec(function(err,respIncidencias){
		cb(err,respIncidencias)
	});
};

var findIncidenciasLimitOffset = function(offset, cb){
	console.log('findIncidenciasLimitOffset');
	Incidencia
	.find({})
	.sort({fechaRegistro : -1})
	.limit(10)
	.skip(offset)
	.populate('usuario')
	.exec(function(err, respIncidencias){
		cb(err,respIncidencias);
	});
};

var addIncidencia = function(inc, cb){
	console.log('addIncidencia');

	var incidencia= new Incidencia(inc);

	incidencia.save(function(err, respIncidencias) {
		cb(err,respIncidencias);
	});
};

var updateIncidencia = function(where,inc,options,cb){
	console.log('updateIncidencia');

	Incidencia.update(where,inc,options,function(err,numAffected){
		cb(err,numAffected);
	})

};


module.exports = function(models){
	Incidencia = models.Incidencia;

	return {
		findAllIncidencias : findAllIncidencias,
		addIncidencia : addIncidencia,
		updateIncidencia : updateIncidencia,
		findIncidenciasLimitOffset : findIncidenciasLimitOffset
	};
};