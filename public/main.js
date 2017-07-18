var scene, camera, renderer;
var geometry, material, controls;
var sticks = [];
var surfaces = [];
var sky, sunSphere;

var showSticks = false;
var transparent = showSticks;
var opacity = 0.5;

var sequence = "N".repeat(40);
sequence = insertStringAt(sequence, "TATA", -10);
sequence = insertStringAt(sequence, "TTGACA", -35);
sequence = sequence.replace(/N/g, getRandomNucleotide);
//sequence = "ATCG";
console.log(sequence);

function complementarySequence(sequence){
	var complementary = "";
	for(letter of sequence){
		if(letter === "A") complementary += "T";
		if(letter === "T") complementary += "A";
		if(letter === "C") complementary += "G";
		if(letter === "G") complementary += "C";
	}
	return complementary;
}

function getRandomNucleotide(nucleotide){
	var nucleotides = ["A", "T", "C", "G"];
	var index = Math.floor(Math.random()*4);
	return nucleotides[index];
}

function insertStringAt(str1, str2, pos){
	var position = str1.length+pos;
	return str1.substr(0, position) + str2 + str1.substr(position);
}

function generateHelix(sequence, offset){
	var index = 0;
	for(letter of sequence){
		var attributes = getNucleotideAttributesAtIndex(index, offset);
		createNucleotide(letter, attributes);
		index++;
	}
}

var axisX = THREE.Vector3( 1, 0, 0 );
var axisY = THREE.Vector3( 0, 1, 0 );
var axisZ = THREE.Vector3( 0, 0, 1 );

function createNucleotide(letter, attributes){
	var nucleotide = models.find(function(a){ return a.letter === letter });
	var object = nucleotide.object.clone();

	object.rotation.x += attributes.rotationX;
	object.rotation.y = attributes.rotationY;
	//object.rotateOnAxis(new THREE.Vector3( 0, 1, 0 ), attributes.rotationY);
	object.position.x = attributes.positionX;
	object.position.y = attributes.positionY;
	object.position.z = attributes.positionZ;

	scene.add(object);

	if(showSticks){
		var stick = nucleotide.stick.clone();

		// stick.rotateOnAxis(new THREE.Vector3( 1, 0, 0 ), attributes.rotationX);
			stick.rotation.x += attributes.rotationX;
		stick.rotation.y = attributes.rotationY;
		// stick.rotateOnAxis(new THREE.Vector3( 0, 1, 0 ), attributes.rotationY);
		//stick.rotation.x += attributes.rotationX;
		stick.position.x = attributes.positionX;
		stick.position.y = attributes.positionY;
		stick.position.z = attributes.positionZ;

		scene.add(stick);
	}
}

function getNucleotideAttributesAtIndex(i, codingStrand){
  var scale = 1;
	var rotationY, offsetX;
	if(codingStrand){
		rotationY = Math.PI;
		offsetX = 1.2;
	} else {
		rotationY = 0;
		offsetX = 0;
	}
	offsetX = offsetX*scale;
  var dimensions = 0.1*scale;
  var offset = 0.34*scale;
  var period = 3.4*scale;
  var amplitude = 1*scale;

  var x = offset*i;
  var y = Math.sin((x+offsetX)/period*Math.PI*2)*amplitude;
  var z = Math.cos((x+offsetX)/period*Math.PI*2)*amplitude;

	return {
		positionX: x,
		positionY: y,
		positionZ: z,
		rotationX: -x/period*Math.PI*2,
		rotationY: rotationY
	}
}

var models = [
	{
		name: 'adenine',
		letter: 'A',
		url: 'models/adenine_surface.obj',
		url_stick: 'models/adenine.obj',
		url_material: 'models/adenine.mtl',
		rotation: {x: 0, y: 1.7, z: -1.5},
		color: 0x34b52d
	},
	{
		name: 'thymine',
		letter: 'T',
		url: 'models/thymine_surface.obj',
		url_stick: 'models/thymine.obj',
		url_material: 'models/thymine.mtl',
		rotation: {x: -3.2, y: 4.6, z: 1.5},
		color: 0xf44141
	},
	{
		name: 'cytosine',
		letter: 'C',
		url: 'models/cytosine_surface.obj',
		url_stick: 'models/cytosine.obj',
		url_material: 'models/cytosine.mtl',
		rotation: {x: 0.2, y: 1.7, z: -1.7},
		color: 0x4289f4
	},
	{
		name: 'guanine',
		letter: 'G',
		url: 'models/guanine_surface.obj',
		url_stick: 'models/guanine.obj',
		url_material: 'models/guanine.mtl',
		rotation: {x: 1.0, y: 4.9, z: -0.7},
		color: 0xffe207
	}
];

init();

function hideSticks(){
	sticks.forEach(function(stick){
		console.log("test");
		stick.visible = false;
	});

	surfaces.forEach(function(surface){
		surface.traverse(function(child) {
			if (child instanceof THREE.Mesh) {
				child.material.opacity = 1;
			}
		});
	});
}

function loadModel(model, callback){
	console.log("askdjalskdjasl");
	var objloader = new THREE.OBJLoader();
	objloader.load(model.url, function(object){

		object.rotation.x = model.rotation.x;
		object.rotation.y = model.rotation.y;
		object.rotation.z = model.rotation.z;

		applyTransforms(object);

		// Traverse the loaded object and set all meshes material to color
		var basicMaterial = new THREE.MeshLambertMaterial( { color: model.color, transparent: transparent, opacity: opacity} );
		object.traverse( function ( child ) {
				if ( child instanceof THREE.Mesh ) {
						child.material = basicMaterial;
				}
		} );

		model.object = object;

		callback();

	});
}

function applyTransforms(object){
	object.updateMatrix();
	object.children[0].geometry.applyMatrix( object.matrix );
	object.position.set( 0, 0, 0 );
	object.rotation.set( 0, 0, 0 );
	object.scale.set( 1, 1, 1 );
	object.updateMatrix();
}

function loadStick(model, callback){

	var mtlloader = new THREE.MTLLoader();
	mtlloader.load(model.url_material, function(materials){
		materials.preload();

		var objloader = new THREE.OBJLoader();
		objloader.setMaterials(materials);
		objloader.load(model.url_stick, function(object){

			object.rotation.x = model.rotation.x;
			object.rotation.y = model.rotation.y;
			object.rotation.z = model.rotation.z;

			applyTransforms(object);

			model.stick = object;

			callback();

		});
	});
}



function init() {

	scene = new THREE.Scene();
	//scene.background = new THREE.Color( 0xffffff );

	camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
	camera.position.x = -2;

	renderer = new THREE.WebGLRenderer({ antialias: true });
	renderer.setSize( window.innerWidth, window.innerHeight );

	document.body.appendChild( renderer.domElement );

  controls = new THREE.OrbitControls(camera);
  controls.addEventListener( 'change', render );

  var axisHelper = new THREE.AxisHelper( 2 );
  scene.add( axisHelper );

	var color1 = 0x631466;
	var color2 = 0xbd41c1;

	var light = new THREE.HemisphereLight( 0xffffff, 0x6c4b6d, 1.2 );
	scene.add( light );


	async.each(models, loadModel, function(){
		console.log("All surfaces loaded");
		if(showSticks){
			async.each(models, loadStick, function(){
				console.log("All sticks loaded");
				generateHelix(sequence, false);
				generateHelix(complementarySequence(sequence), true);
				render();
			});
		} else {
			generateHelix(sequence, false);
			generateHelix(complementarySequence(sequence), true);
			render();
		}
	});

// 	var vertexShader = document.getElementById( 'vertexshader' ).textContent;
// var fragmentShader = document.getElementById( 'fragmentshader' ).textContent;
// var uniforms = {
//   "color1" : {
//   type : "c",
//   value : new THREE.Color(color1)
//   },
//   "color2" : {
//     type : "c",
//     value : new THREE.Color(color2)
//   }
// };
//
// //skydome
//
// var skyGeo = new THREE.SphereGeometry( 2000, 32, 15 );
// var skyMat = new THREE.ShaderMaterial( { vertexShader: vertexShader, fragmentShader: fragmentShader, uniforms: uniforms, side: THREE.BackSide } );
//
// var sky = new THREE.Mesh( skyGeo, skyMat );
// scene.add( sky );

	// var mtlloader = new THREE.MTLLoader();
	// mtlloader.load('models/adenine.mtl', function(materials){
	// 	materials.preload();
	//
	// 	var objloader = new THREE.OBJLoader();
	// 	objloader.setMaterials(materials);
	// 	objloader.load('models/adenine.obj', function(stick){

	// 		var objloader2 = new THREE.OBJLoader();
	// 		objloader2.load('models/adenine_surface.obj', function(surface){
	//
	// 			var xRotation = 0.5;
	// 			var yRotation = 1.7;
	// 			var zRotation = -1.5;
	//
	// 			//createHelix(stick, 0, xRotation, yRotation, zRotation, sticks );
	// 			var basicMaterial = new THREE.MeshLambertMaterial( { color: 0xed4040, transparent: transparent, opacity: opacity} );
	//
	// 			surface.traverse( function ( child ) {
	//
	// 			    if ( child instanceof THREE.Mesh ) {
	//
	// 			        child.material = basicMaterial;
	//
	// 			    }
	//
	// 			} );
	//
	// 			createHelix(surface, 0, xRotation, yRotation, zRotation, surfaces );
	// 			render();
	// 		});
	// // 	});
	// // });
	//
	// // var mtlloader = new THREE.MTLLoader();
	// // mtlloader.load('models/thymine.mtl', function(materials){
	// // 	materials.preload();
	// //
	// // 	var objloader = new THREE.OBJLoader();
	// // 	objloader.setMaterials(materials);
	// // 	objloader.load('models/thymine.obj', function(stick){
	//
	// 		var objloader2 = new THREE.OBJLoader();
	// 		objloader2.load('models/thymine_surface.obj', function(surface){
	// 			//createHelix(stick, 1.2, 0, 1.6, -0.5, sticks);
	// 			var basicMaterial = new THREE.MeshLambertMaterial( { color: 0xefe639, transparent: transparent, opacity: opacity} );
	//
	// 			surface.traverse( function ( child ) {
	//
	// 			    if ( child instanceof THREE.Mesh ) {
	//
	// 			        child.material = basicMaterial;
	//
	// 			    }
	//
	// 			} );
	// 			createHelix(surface, 1.2, 0, 1.6, -0.5, surfaces);
	// 			render();
	// 		});
	// 	});
	// });

  //createHelix();

  //render();

}

function render(){
  renderer.render( scene, camera );
}
