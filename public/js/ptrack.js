//----------------------------------
//	Listen for messages from node server
//----------------------------------
var SERVER_URI = 'localhost';
// var SERVER_URI = '192.168.2.165';  //server address if listening to another machine
var PORT = 3030;		//websocket port
// var ws = new WebSocket('ws://localhost:3030');
// var ws = new WebSocket('ws://192.168.2.229:3030');
var ws = new WebSocket('ws://' + SERVER_URI + ':' + PORT);

var messages = {
	data: {}
}

ws.onmessage = function(event){
	var msg = event.data;
	if(msg.length < 2){
		// if the msg is an incomplete string, skip
	}else{
		try{
			messages.data = JSON.parse(event.data);
		}catch(e){
			console.log('failed to parse');
			console.log(event.data);
		}
	}
	// console.log(msg);
	// if(msg.data == "reload"){
	// 	console.log('reload');
	// }
}

exports = messages;
