import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { Landmass } from './landmass';

const container = document.getElementById('container')


const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(60,window.innerWidth/ window.innerHeight, 1, 10000);

    camera.position.set( 1000, 5000, - 5000 );
    camera.lookAt( - 100, 810, - 800 );
    scene.add(camera);

scene.add(new THREE.AmbientLight(0xffffff,0.7));

const renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.useLegacyLights = false;
container.appendChild( renderer.domElement );

const controls = new OrbitControls(camera,renderer.domElement);

const ground = new Landmass(scene);
ground.createGround();

const clock = new THREE.Clock();
const animate=()=>{
    requestAnimationFrame(animate);
    controls.update(clock.getDelta());
    renderer.render(scene,camera);
}

animate();
