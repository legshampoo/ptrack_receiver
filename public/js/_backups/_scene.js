var scene = new THREE.Scene(); 
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 ); 
var renderer = new THREE.WebGLRenderer(); renderer.setSize( window.innerWidth, window.innerHeight ); 
document.body.appendChild( renderer.domElement );

// var geometry = new THREE.BoxGeometry( 1, 1, 1 ); 
var sphereGeo = new THREE.SphereGeometry(1, 32, 32);
var sphereMat = new THREE.MeshBasicMaterial( { color: 0xff0000 } ); 

var originMat = new THREE.MeshBasicMaterial( { color: 0x00ff00 });
var originGeo = new THREE.BoxGeometry(1, 1, 1);
var originObj = new THREE.Mesh( originGeo, originMat ); 
scene.add( originObj ); 

camera.position.set(0, 100, 0);
camera.lookAt(new THREE.Vector3(0, 0, 0));

var oldBlobs = [];

function update() {
	var tracks = messages.data.tracks;
	
	if(tracks != undefined){
		// console.log(Object.keys(tracks));
		var currentBlobs = [];

		Object.keys(tracks).forEach(function(key, index){
			var track = tracks[key];
			var b = new THREE.Mesh(sphereGeo, sphereMat);
			b.name = track.id;
			b.position.set(track.x*10, track.y*10, track.height*10);
			scene.add(b);

			currentBlobs.push(b);
			oldBlobs.push(b);
		});

		oldBlobs.forEach(function(object, index){
			if(_.includes(currentBlobs, object.id)){
				console.log('yes');
			}else{
				// oldBlobs.splice(index, 1);
				// scene.remove(scene.getObjectByName(blob.id));
				// console.log('remove');
			}
		})


		


	}

	// console.log('blobs length: ', blobs.length);

}

function animate() { 
	update();
	requestAnimationFrame( animate ); 
	// console.log(messages.data);
	// var tracks = messages.data.tracks;
	// var blobs = [];
	// if(tracks != undefined){
	// 	tracks.forEach(function(blob){
	// 		console.log(blob);
	// 		var c = new THREE.Mesh(geometry, material);
	// 		// scene.add(c);
	// 		c.position.x = blob.x;
	// 		c.position.y = 0;
	// 		c.position.z = 0;
	// 		blobs.push(c);
	// 	});
	// }

	// cube.rotation.x += 0.1; 
	// cube.rotation.y += 0.1;
	// cube.position.z -= 0.1;
	// blobs.forEach(function(blob){
	// 	scene.add(blob);
	// })

	renderer.render( scene, camera ); 
} 

animate();