var scene, camera, renderer;
var geometry, material, controls;

init();

function init() {

	scene = new THREE.Scene();

	camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
	camera.position.z = 10;

	renderer = new THREE.WebGLRenderer({ antialias: true });
	renderer.setSize( window.innerWidth, window.innerHeight );

	document.body.appendChild( renderer.domElement );

  controls = new THREE.OrbitControls(camera);
  controls.addEventListener( 'change', render );

  var axisHelper = new THREE.AxisHelper( 2 );
  scene.add( axisHelper );

  var light = new THREE.AmbientLight( 0x404040 ); // soft white light
scene.add( light );

  var loader = new THREE.OBJLoader();
  loader.load('models/cytosine.obj', function(object){
    console.log(object);
    createHelix(object);
  });

  //createHelix();

  render();

}

function render(){
  renderer.render( scene, camera );
}

function createHelix(object){
  var box, mesh;
  var scale = 10;
  var dimensions = 0.1*scale;
  var offset = 0.34*scale;
  var period = 3.4*scale;
  var amplitude = 1*scale;
  for(var i=0; i<30; i++){
    var nucleotide = object.clone();
    var x = offset*i;
    var y = Math.sin(x/period*Math.PI*2)*amplitude;
    var z = Math.cos(x/period*Math.PI*2)*amplitude;
    // box = new THREE.BoxGeometry(dimensions, dimensions, dimensions);
    // mesh = new THREE.Mesh(box);
    //var material = new THREE.MeshBasicMaterial( { map: texture } );
    scene.add(nucleotide);
    nucleotide.position.set(x, y, z);
  }
}
