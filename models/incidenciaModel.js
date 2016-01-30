
var Incidencias;

var findAllIncidencias = function(cb){
	console.log('findAllIncidencias');
	Incidencias
	.find({})
	.populate('usuario')
	.exec(function(err,respIncidencias){
		cb(err,respIncidencias)
	});
};

var findIncidenciasLimitOffset = function(offset, cb){
	console.log('findIncidenciasLimitOffset');
	Incidencias
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

	var incidencias= new Incidenciass(inc);

	incidencia.save(function(err, respIncidencia) {
		cb(err,respIncidencia);
	});
};

var updateIncidencia = function(where,inc,options,cb){
	console.log('updateIncidencia');

	Incidencias.update(where,inc,options,function(err,numAffected){
		cb(err,numAffected);
	})

};


module.exports = function(models){
	Incidencias = models.Incidencias;

	return {
		findAllIncidencias : findAllIncidencias,
		addIncidencia : addIncidencia,
		updateIncidencia : updateIncidencia,
		findIncidenciasLimitOffset : findIncidenciasLimitOffset
	};
};