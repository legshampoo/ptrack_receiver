var ws = new WebSocket('ws://localhost:3030');


var messages = {
	data: {}
}

ws.onmessage = function(event){
	var msg = event.data;
	if(msg.length < 2){
		//incomplete string
	}else{
		try{
			messages.data = JSON.parse(event.data);
		}catch(e){
			console.log('failed to parse');
			console.log(event.data);
		}
	}
	// console.log(event.data);
	// messages.raw = event.data;
	// messages.data = JSON.parse(msg);
}

exports = messages;