var scene, camera, renderer;
var geometry, material, controls;
var sticks = [];
var surfaces = [];
var sky, sunSphere;

var group = new THREE.Group();
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



function init() {

	scene = new THREE.Scene();
	//scene.background = new THREE.Color( 0xffffff );

	camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
	camera.position.z = 10;

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

	var transparent = false;
	var opacity = 1;

	var vertexShader = document.getElementById( 'vertexshader' ).textContent;
var fragmentShader = document.getElementById( 'fragmentshader' ).textContent;
var uniforms = {
  "color1" : {
  type : "c",
  value : new THREE.Color(color1)
  },
  "color2" : {
    type : "c",
    value : new THREE.Color(color2)
  }
};

//skydome

var skyGeo = new THREE.SphereGeometry( 2000, 32, 15 );
var skyMat = new THREE.ShaderMaterial( { vertexShader: vertexShader, fragmentShader: fragmentShader, uniforms: uniforms, side: THREE.BackSide } );

var sky = new THREE.Mesh( skyGeo, skyMat );
scene.add( sky );

	// var mtlloader = new THREE.MTLLoader();
	// mtlloader.load('models/adenine.mtl', function(materials){
	// 	materials.preload();
	//
	// 	var objloader = new THREE.OBJLoader();
	// 	objloader.setMaterials(materials);
	// 	objloader.load('models/adenine.obj', function(stick){

			var objloader2 = new THREE.OBJLoader();
			objloader2.load('models/adenine_surface.obj', function(surface){

				var xRotation = 0.5;
				var yRotation = 1.7;
				var zRotation = -1.5;

				//createHelix(stick, 0, xRotation, yRotation, zRotation, sticks );
				var basicMaterial = new THREE.MeshLambertMaterial( { color: 0xed4040, transparent: transparent, opacity: opacity} );

				surface.traverse( function ( child ) {

				    if ( child instanceof THREE.Mesh ) {

				        child.material = basicMaterial;

				    }

				} );

				createHelix(surface, 0, xRotation, yRotation, zRotation, surfaces );
				render();
			});
	// 	});
	// });

	// var mtlloader = new THREE.MTLLoader();
	// mtlloader.load('models/thymine.mtl', function(materials){
	// 	materials.preload();
	//
	// 	var objloader = new THREE.OBJLoader();
	// 	objloader.setMaterials(materials);
	// 	objloader.load('models/thymine.obj', function(stick){

			var objloader2 = new THREE.OBJLoader();
			objloader2.load('models/thymine_surface.obj', function(surface){
				//createHelix(stick, 1.2, 0, 1.6, -0.5, sticks);
				var basicMaterial = new THREE.MeshLambertMaterial( { color: 0xefe639, transparent: transparent, opacity: opacity} );

				surface.traverse( function ( child ) {

				    if ( child instanceof THREE.Mesh ) {

				        child.material = basicMaterial;

				    }

				} );
				createHelix(surface, 1.2, 0, 1.6, -0.5, surfaces);
				render();
			});
	// 	});
	// });

  //createHelix();

  //render();

}

function render(){
  renderer.render( scene, camera );
}

function createHelix(object, xOffset, xRotation, yRotation, zRotation, container){
  var box, mesh;
  var scale = 1;
	xOffset = xOffset*scale;
  var dimensions = 0.1*scale;
  var offset = 0.34*scale;
  var period = 3.4*scale;
  var amplitude = 1*scale;
  for(var i=0; i<40; i++){
    var nucleotide = object.clone();
    var x = offset*i;
    var y = Math.sin((x+xOffset)/period*Math.PI*2)*amplitude;
    var z = Math.cos((x+xOffset)/period*Math.PI*2)*amplitude;
    // box = new THREE.BoxGeometry(dimensions, dimensions, dimensions);
    // mesh = new THREE.Mesh(box);
    //var material = new THREE.MeshBasicMaterial( { map: texture } );
    scene.add(nucleotide);
    nucleotide.position.set(x, y, z);
		nucleotide.rotation.x = -x/period*Math.PI*2+xRotation;
		nucleotide.rotation.y = yRotation;
		nucleotide.rotation.z = zRotation;

		container.push(nucleotide);
  }
}
