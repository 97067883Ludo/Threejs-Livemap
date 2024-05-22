import * as THREE from 'three';
import {TrackballControls} from "three/addons";
import { SVGRenderer } from 'three/addons/renderers/SVGRenderer.js';


let width = window.innerWidth;
let viz_width = width;
let height = window.innerHeight;

let fov = 40;
let near = 1;
let far = 100000;
let targetRotation = 0;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xefefef);
const camera = new THREE.PerspectiveCamera(  fov,
    width / height,
    near,
    far );
const renderer = new THREE.WebGLRenderer( {antialias: true} );
const controls = new TrackballControls( camera, renderer.domElement );

controls.update();

window.addEventListener('resize', () => {
    width = window.innerWidth;
    viz_width = width;
    height = window.innerHeight;

    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
})

document.getElementById("rotate").addEventListener("click", () => {
    if(targetRotation !== 0 ) {
        return;
    }
    targetRotation = 90;

});

renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const lineBasicMaterial = new THREE.LineBasicMaterial({
    color: 0x0000ff,
    linecap: 'round', //ignored by WebGLRenderer
    linejoin:  'round'
});

camera.position.set(0, 0, 0);

//camera.rotation.z = 0 * Math.PI / 180

renderer.render(scene, camera);
let actualrotation = 0;

function animate() {
    requestAnimationFrame(animate);
    // required if controls.enableDamping or controls.autoRotate are set to true

    if (targetRotation > 0) {
        camera.rotation.z = (actualrotation += 10) * Math.PI / 180;
        targetRotation -= 10;
    }

    renderer.render( scene, camera );
}

animate();

await logMovies();

async function logMovies() {
    const response = await fetch("alpmamap.txt");
    const map = await  response.json();
    let points = [];
    console.log(map);
    const centerX = (map.XMax  + map.XMin) / 2;
    const centerY = (map.YMax + map.YMin) / 2;
    const width = map.XMax - map.XMin;
    const height = map.YMax - map.YMin;
    const aspectRatio = window.innerWidth / window.innerHeight;
    const cameraDistance = Math.max(width / (2 * Math.tan(Math.PI / 6)), height / (2 * aspectRatio * Math.tan(Math.PI / 6))) + 1000;

    map.RouteSegments.forEach((object, index) => {
        object.Points.forEach((coordinates, index) => {
            points.push( new THREE.Vector2(coordinates.X, coordinates.Y))
            let sdfsdf = new THREE.BufferGeometry().setFromPoints( points );
            let line = new THREE.Line( sdfsdf, lineBasicMaterial );
            scene.add(line);

            sdfsdf = null;
            line = null;
        })
        points = [];
    })
    camera.position.set(centerX, centerY, cameraDistance);
}
