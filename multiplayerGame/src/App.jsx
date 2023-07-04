import * as THREE from 'three';
import React, { useEffect, useRef } from 'react';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import {FBXLoader} from "three/examples/jsm/loaders/FBXLoader";

import Ground from './components/Ground';

function App() {
  const sceneRef = useRef();
  useEffect(()=>{
    //scene
    const scene = new THREE.Scene();

    //camera
    const camera = new THREE.PerspectiveCamera(50,window.innerWidth/ window.innerHeight, 0.1, 1000);  //fov, aspect, near, far
    scene.add(camera);
    camera.position.set( 0, 20, 50 );

    //model
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
      anim.load("Walking.fbx",(anim)=>{
        const walking = mixer.clipAction(anim.animations[0]);
        animationsMap.set("walk",walking);
      });
      anim.load("Jumping.fbx",(anim)=>{
        const jump = mixer.clipAction(anim.animations[0]);
        animationsMap.set("jump",jump);
      });
      anim.load("Idle.fbx",(anim)=>{
        const idle = mixer.clipAction(anim.animations[0]);
        animationsMap.set("idle",idle);
        idle.play();
      });
      anim.load("Sprint.fbx",(anim)=>{
        const sprint = mixer.clipAction(anim.animations[0]);
        animationsMap.set("sprint",sprint);
      })

        scene.add(fbx);
    }); 

    //lights
    let light = new THREE.DirectionalLight(0xFFFFFF);
    light.position.set(100,100,100);
    light.target.position.set(0,0,0);
    light.castShadow = true;
    light.shadow.bias = -0.001;
    light.shadow.mapSize.width = 2048;
    light.shadow.mapSize.height = 2048;
    light.shadow.camera.near = 0.1;
    light.shadow.camera.far = 500.0;
    light.shadow.camera.near = 0.5;
    light.shadow.camera.far = 500.0;
    light.shadow.camera.left = 100;
    light.shadow.camera.right = -100;
    light.shadow.camera.top = 100;
    light.shadow.camera.bottom = -100;
    scene.add(light);

    light = new THREE.AmbientLight(0x101010);
    scene.add(light);

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
    document.addEventListener("keydown",(e)=>{
      if(e.code==="Space"){
        const anime = animationsMap.get('jump');
        anime.reset();
        anime.play();
        setTimeout(()=>{
          anime.stop();
        },1300)
      }
      if(e.code==="ArrowUp"){
        const anime = animationsMap.get("walk");
        const idle = animationsMap.get("idle");
        idle.stop();
        anime.reset();
        anime.play();
        setTimeout(()=>{
          anime.stop();
        },1000)

      }
    })
    
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
      controls.enableZoom = true;
      controls.update();
      renderer.render(scene,camera);
      requestAnimationFrame(animate);
      mixer.update(clock.getDelta());
    }

    animate();
    


  },[])
  return (
    <div ref={sceneRef}></div>
  );
}

export default App;

