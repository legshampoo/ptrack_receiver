var dgram = require('dgram');
var WebSocketServer = require('ws').Server;
var dataHandler = require('../utils/dataHandler');

var udp_socket;

// 	web socket connection
var wss;					// web socket server
var web_socket;				// web socket

// 	connection parameters for multicast (UDP)
var mc = {
	port: 	21234,			// ptrack port
	group: 	'224.0.0.1',	// standard LAN multicast address
	host: 	undefined 		// undefined so node listens to all hosts
}


/*/	Main exported function to effect UDP listening and TCP forwarding on
websocket.
/*/
function API_ConnectTracker () {

/**	1. create UDP listener to remote camera tracker **********************/

	udp_socket = dgram.createSocket('udp4');

	// connect to UDP group/host (host is optional)
	udp_socket.bind ( mc.port, mc.host, function () {
		var address = udp_socket.address();
		console.log("*** LISTENING TO "+address.address+" PORT "+address.port+" ("+address.family+") ***")
		// enable receiving multicast packets
		udp_socket.setMulticastLoopback ( true);
		// join multicast group
		udp_socket.addMembership( mc.group, mc.host );
	});


	udp_socket.on('message', function(msg, rinfo){
		dataHandler.elapsedTime();  //log the time since last msg received

		var msgString = msg.toString();
		msgString = msgString.substr(0, msgString.indexOf(']}') + 2);

		var tracks = dataHandler.getTracks(msgString);

		tracks = dataHandler.processTracks(tracks);  //match them to previous tracks

		// send data to client
		if (web_socket) {
	  	// web_socket.send(tracks);
			web_socket.send(JSON.stringify(tracks));
	  }
	})

/**	2. create TCP server on port 3030 for browser-based web app **********/

	// create a websocket server to listen to...
	// TCP Port 3030 is an arbitrary port.
	wss = new WebSocketServer( { port: 3030 } );

	// connect to TCP port
	wss.on('connection', function ( wsocket ) {
		console.log("*** 3030 Browser Client Connect");
		web_socket = wsocket;
		web_socket.once('close',function() {
			console.log('remote socket BROWSER 3030 closed');
			web_socket = null;
		});
	});

	// report errors
	wss.on('error', function (err) {
		console.log("connectTracker socket server error: "+err);
		web_socket = null;
	});

}

//brute force close connection
function API_CloseTracker () {
	if (web_socket) web_socket.close();
	if (wss) wss.close();
	if (udp_socket) udp_socket.close();
	console.log("\n*** closing connections\n");

}

function sendBrowserRefresh(){
	if(web_socket){
		console.log('send it here');
	}
}

exports.connectTracker = API_ConnectTracker;
exports.closeTracker = API_CloseTracker;
