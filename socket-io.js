module.exports = function(server){
	console.log('socket-io');
	var io = require('socket.io')(server);


	io.on('connection' , function(socket){
		console.log('=============================');
		console.log('===== usuario conectado =====');
		console.log('=============================');

		socket.on('nueva incidencia' , function(data){
			console.log(data);
			socket.broadcast.emit('nueva incidencia' , data);
			socket.emit('nueva incidencia' , data);
		})
	})
};




