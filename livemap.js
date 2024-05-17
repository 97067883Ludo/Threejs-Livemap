import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import Stats from 'stats.js'


const scene = new THREE.Scene();
const camera = new THREE.OrthographicCamera(window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, 1, 10000);
const renderer = new THREE.WebGLRenderer();
const controls = new OrbitControls( camera, renderer.domElement );
const stats = new Stats()

stats.showPanel(0)
controls.enableRotate=false;
controls.enableDamping=true;
controls.dampingFactor=0.2;
controls.zoomSpeed=1.5;
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const lineBasicMaterial = new THREE.LineBasicMaterial({
    color: 0x0000ff,
    linecap: 'round', //ignored by WebGLRenderer
    linejoin:  'round'
});


camera.rotation.z = 90 * Math.PI / 180
camera.position.set(0, 0, 1);

renderer.render(scene, camera);

controls.update();

function animate() {
    requestAnimationFrame( animate );
    // required if controls.enableDamping or controls.autoRotate are set to true
    controls.update();
    renderer.render( scene, camera );
}

animate();
await logMovies();

async function logMovies() {
    const response = await fetch("json.txt");
    const movies = await  response.json();
    let points = [];
    //console.log(movies);
    movies.segment_file_v2.segment_data.segment.forEach((object, index) => {
        object.pts.sp.forEach((coordinates, index) => {
            points.push( new THREE.Vector2(coordinates.x, coordinates.y))
            let sdfsdf = new THREE.BufferGeometry().setFromPoints( points );
            let line = new THREE.Line( sdfsdf, lineBasicMaterial );
            scene.add(line);

            sdfsdf = null;
            line = null;
        })
        points = [];
    })
}