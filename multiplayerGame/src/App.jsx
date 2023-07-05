import * as THREE from 'three';
import React, { useEffect, useRef } from 'react';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import {FBXLoader} from "three/examples/jsm/loaders/FBXLoader";

import Ground from './components/Ground';
import { CharacterControls } from './CharachterController';

function App() {
  const sceneRef = useRef();
  useEffect(()=>{
    //scene
    const scene = new THREE.Scene();

    //camera
    const camera = new THREE.PerspectiveCamera(45,window.innerWidth/ window.innerHeight, 0.1, 1000);  //fov, aspect, near, far
    camera.position.y = 50;
    camera.position.z = 5;
    camera.position.x = 0;
    camera.rotateY(Math.PI);
    scene.add(camera);

    //model
    let charachterControls;
    const modelloader = new FBXLoader();
    let mixer = new THREE.AnimationMixer();
    const animationsMap = new Map();
    modelloader.setPath("src/assets/models/");
    modelloader.load('Player.fbx',(fbx)=>{
      fbx.scale.multiplyScalar(0.1);
      fbx.traverse(c=>{
        c.castShadow = true;
      });
      
      mixer = new THREE.AnimationMixer(fbx);
      const anim = new FBXLoader();
      anim.setPath('src/assets/models/');
      anim.load("Walking(1).fbx",(anim)=>{
        const walking = mixer.clipAction(anim.animations[0]);
        animationsMap.set("Walk",walking);
      });
      anim.load("Jumping.fbx",(anim)=>{
        const jump = mixer.clipAction(anim.animations[0]);
        animationsMap.set("Jump",jump);
      });
      anim.load("Idle.fbx",(anim)=>{
        const idle = mixer.clipAction(anim.animations[0]);
        animationsMap.set("Idle",idle);
      });
      anim.load("Fast Run.fbx",(anim)=>{
        const sprint = mixer.clipAction(anim.animations[0]);
        animationsMap.set("Run",sprint);
      })
      charachterControls = new CharacterControls(fbx,mixer,animationsMap,controls,camera,"Idle");
        scene.add(fbx);
    }); 

    //lights
    const setUpLights = ()=>{
      scene.add(new THREE.AmbientLight(0xffffff, 0.7))

      const dirLight = new THREE.DirectionalLight(0xffffff, 1)
      dirLight.position.set(- 60, 100, - 10);
      dirLight.castShadow = true;
      dirLight.shadow.camera.top = 50;
      dirLight.shadow.camera.bottom = - 50;
      dirLight.shadow.camera.left = - 50;
      dirLight.shadow.camera.right = 50;
      dirLight.shadow.camera.near = 0.1;
      dirLight.shadow.camera.far = 200;
      dirLight.shadow.mapSize.width = 4096;
      dirLight.shadow.mapSize.height = 4096;
      scene.add(dirLight);
    }

    //components
    const ground = Ground();
    ground.position.set(0,0,0);
    ground.castShadow = false;
    ground.receiveShadow = true;
    ground.rotation.x = -Math.PI / 2;
    scene.add(ground);

    //renderer
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    sceneRef.current.appendChild(renderer.domElement);

    //orbitControl
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0,20,0);
    controls.update();

    
    //charachter control
    const keysPressed = {};
    document.addEventListener("keydown",(event)=>{
      if(event.shiftKey && charachterControls){
        charachterControls.switchRunToggle();
      } else {
        keysPressed[event.key.toLowerCase()] = true;
      }
    },false);
    document.addEventListener('keyup', (event) => {
      (keysPressed)[event.key.toLowerCase()] = false
  }, false);

    
    const loader = new THREE.CubeTextureLoader();
    const texture = loader.load([
      'src/assets/images/xpos.png',
      'src/assets/images/xneg.png',
      'src/assets/images/ypos.png',
      'src/assets/images/yneg.png',
      'src/assets/images/zpos.png',
      'src/assets/images/zneg.png'
  ]);
    scene.background = texture;

const clock = new THREE.Clock;
    //animate
    const animate = ()=>{
      let mixerUpdateDelta = clock.getDelta();
      if (charachterControls) {
        charachterControls.update(mixerUpdateDelta, keysPressed);
    }
      controls.enableZoom = true;
      controls.update();
      renderer.render(scene,camera);
      requestAnimationFrame(animate);
    }
    setUpLights();
    animate();
    


  },[])
  return (
    <div ref={sceneRef}></div>
  );
}

export default App;

