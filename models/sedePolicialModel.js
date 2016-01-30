var SedesPoliciales

var findSedesPoliciales = function(params,cb){
	console.log('findSedesPoliciales')

	SedesPoliciales.find(params, cb);
};

var cargarSedesPoliciales = function(array, cb){

	var i = 0;

	var guardarSedePolicial = function(sp){
		var sp= new SedesPoliciales(array[i]);
		i++;
		sp.save(function(err, respSp) {
			if(err) cb(err);
			if(i < array.length){
				guardarSedePolicial(array[i]);
			}
		});
	};

	guardarSedePolicial(array[0]);
	cb(false);
	console.log('se guardaron las sedes policiales');
};


module.exports = function(models){
	SedesPoliciales =  models.SedesPoliciales;

	return {
		findSedesPoliciales : findSedesPoliciales,
		cargarSedesPoliciales : cargarSedesPoliciales
	};
};