module.exports = function (socket) {
		var _io = global.io;
		console.log("socket connected " + socket.id);
		//not sure if we're going to run into a new instance of socket somewhere 
		//use closure? 
		var _socket = socket;
		console.log(_socket.id);
		//user created room..add him to redis store
		//user joined room..add him to redis store
		//dont think we even need this..unless we have id's in the future..
		//db.connections.addUser(_socket.id);
	
		socket.on('createRoom', function() {
			console.log("client requesting room");
			var cb = function(err, room_id) {
				if(!!err) {
					_io.sockets.socket(_socket.id).emit('createdRoom', {room: 0});
				} else {
					console.log(room_id);
					_socket.join(room_id);
					_socket.emit('createdRoom', {room: room_id});
				}
			};
			db.connections.generateRoom(null, cb);
		});
		//user emits a join room request...
		socket.on('joinRoom', function(joinData) {
			var cb = function(err, data, status) {
				if (status == 0) {
					_io.sockets.socket(_socket.id).emit('joinedRoom', {room: 0});
				} else {
				//JOIN THE ROOM
				_socket.join(data);
				var tst = function () {
					console.log("READY UP");
					console.log(data);
					var clients = _io.sockets.clients(data);
					console.log(_io.sockets.clients(data));
					_io.sockets.in(data).emit('Ready', {status: 1});
					_socket.emit('Ready',{status: 1});
				};
				setTimeout(tst, 500);

				}
			};
			if (joinData.room != undefined && joinData.room != null) {
				db.connections.findRoom(joinData.room, cb);
			}
		});
		//leave a room and deleate it
		socket.on('leaveRoom', function(leaveData) {
			console.log("niggas be leaving " + leaveData.room + "is a " + leaveData.winner);
			if (!!leaveData.winner) {
				db.connections.deleteRoom(leaveData.room);
			}
			_socket.leave(leaveData.room);
		});
		//if we want to emit readies
		socket.on('readyplayer1', function(data) {
			//callback after player 1 readies and check if both people are ready
			var cb = function(err, room, _data) {
				if (_data == 2) {
					_io.sockets.in(room).emit('Ready', {status: 1});
					var count = 0;
					// async.whilst(
						// function () { return count < 2},
						// function (callback) {
							// count++;
							// _io.sockets.in(room).emit('updatedScore', {ready: count});
							// setTimeout(callback, 1000);
						// }, 
						// function (err) {
							// if(!!err) 
								// console.log(err);
						// }
					// );
				}
			}
			db.connections.ready(0, data.room, cb);
		});
		socket.on('readyplayer2', function(data) {
			//callback after player 2 readies and check if both people are ready
			var cb = function(err,  room, _data) {
				if (_data == 2) {
					_io.sockets.in(room).emit('Ready', {status: 1});
					var count = 0;
					// async.whilst(
						// function () { return count < 5},
						// function (callback) {
							// count++;
							// _io.sockets.in(room).emit('updatedScore', {ready: count});
							// setTimeout(callback, 1000);
						// }, 
						// function (err) {
							// if(!!err) 
								// console.log(err);
						// }
					// );
				}
			}
			db.connections.ready(1, data.room, cb);
		});
		//want to make this as lean as possible to shorten latency/response
		socket.on('updateScore', function(data) {
			_io.sockets.in(data.room).emit('updatedScore', {
											room: data.room, score: data.score});
		});
		
		socket.on('scoreclient', function(data) {
			console.log("client sending " + data + " stuff");
			_socket.emit('scoreserver', {score: data.score});
			console.log(data);
		});
		
		//scoreplayer2 means it's the creator
		socket.on('scoreplayer2', function(data) {
			console.log(data);
			var cb = function(err, room, data) {
				if (data == -5) {
					console.log("eh");
					_io.sockets.in(room).emit('win', {winplayer: "player1"});
				}
				if (data == 5) {
					console.log("eh");
					_io.sockets.in(room).emit('win', {winplayer: "player2"});
				}
			};
			console.log("creator is emitting");
			_io.sockets.in(data.room).emit('updatedscore2', {score: data.score} );
			db.connections.incrScore(0, data.incr, data.room, cb);
		});
		
		socket.on('scoreplayer1', function(data) {
			console.log(data);
			var cb = function(err, room, data) {
				if (data == -5) {
					console.log("eh");
					_io.sockets.in(room).emit('win', {winplayer: "player1"});
				}
				if (data == 5) {
					console.log("eh");
					_io.sockets.in(room).emit('win', {winplayer: "player2"});
				}
			};
			console.log("joiner is emitting");
			_io.sockets.in(data.room).emit('updatedscore1', {score: data.score});
			db.connections.incrScore(1, data.incr, data.room, cb);
		});
		
		socket.on('ping', function(data) {
			console.log(data.time);
			_socket.emit('pong', data);
			
		});
		
		
		
};