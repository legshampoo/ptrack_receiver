var messages = {
	tracks: []
}
var socket = io.connect('http://localhost:3030');
socket.on('tracking', function(msg){
	console.log("msg",msg);
	messages.tracks = msg.tracks////JSON.parse(msg);  
	
});

//----------------------------------
//	Listen for messages from node server
//----------------------------------
// var SERVER_URI = 'localhost';
// var PORT = 3030;		//websocket port
// var ws = new WebSocket('ws://' + SERVER_URI + ':' + PORT);



// ws.onmessage = function(event){
// 	var msg = event.data;

// 	if(msg.length < 2 || msg.size == 0){
// 		return
// 	}else{
// 		try{
// 			messages.tracks = JSON.parse(msg);
// 			console.log(message);
// 		}catch(e){
// 			console.log('failed to parse');
// 			console.log(e);
// 			console.log(msg);
// 			return
// 		}
// 	}
// }

// exports = messages;

// listen socket io server


