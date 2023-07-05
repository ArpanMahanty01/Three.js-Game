import * as THREE from "three";



const Ground = ()=>{
    const textureLoader = new THREE.TextureLoader();
    const baseColor = textureLoader.load("src/assets/textures/ground/Stylized_Stone_Floor_005_basecolor.jpg");
    const normalMap = textureLoader.load("src/assets/textures/ground/Stylized_Stone_Floor_005_normal.jpg");
    const heightMap = textureLoader.load("src/assets/textures/ground/Stylized_Stone_Floor_005_height.png");
    const ambientOcclusion = textureLoader.load("src/assets/textures/ground/Stylized_Stone_Floor_005_ambientOcclusion.jpg");

    const groundGeometry = new THREE.PlaneGeometry(500,500,512,512);
    const groundMaterial = new THREE.MeshStandardMaterial({
        map: baseColor,
        normalMap:normalMap,
        displacementMap:heightMap,
        displacementScale:0.1,
        aoMap:ambientOcclusion
    });
    wrapAndRepeatTexture(groundMaterial.map)
    wrapAndRepeatTexture(groundMaterial.normalMap)
    wrapAndRepeatTexture(groundMaterial.displacementMap)
    wrapAndRepeatTexture(groundMaterial.aoMap)

    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    return ground;
}

function wrapAndRepeatTexture (map) {
    map.wrapS = map.wrapT = THREE.RepeatWrapping
    map.repeat.x = map.repeat.y = 10
}

export default Ground;