import * as THREE from "three";
import { ImprovedNoise } from 'three/addons/math/ImprovedNoise.js';



const worldWidth = 256;
const worldDepth = 256;

const Ground = ()=>{
    const textureLoader = new THREE.TextureLoader();
    const baseColor = textureLoader.load("src/assets/textures/ground/Stylized_Stone_Floor_005_basecolor.jpg");
    const normalMap = textureLoader.load("src/assets/textures/ground/Stylized_Stone_Floor_005_normal.jpg");
    const heightMap = textureLoader.load("src/assets/textures/ground/Stylized_Stone_Floor_005_height.png");
    const ambientOcclusion = textureLoader.load("src/assets/textures/ground/Stylized_Stone_Floor_005_ambientOcclusion.jpg");

    const groundGeometry = new THREE.PlaneGeometry(750,750,);
    
    
    
    // const data = generateHeight(worldWidth,worldDepth);
    
    // const vertices = groundGeometry.attributes.position.array;
    // for ( let i = 0, j = 0, l = vertices.length; i < l; i ++, j += 3 ) {
        
    //     vertices[ j + 1 ] = data[ i ] * 10;
        
    // }
    // const texture = new THREE.CanvasTexture( generateTexture( data, worldWidth, worldDepth ) );
    // texture.wrapS = THREE.ClampToEdgeWrapping;
	// texture.wrapT = THREE.ClampToEdgeWrapping;
	// texture.colorSpace = THREE.SRGBColorSpace;
    // const groundMaterial = new THREE.MeshBasicMaterial({map:texture});
    const groundMaterial = new THREE.MeshStandardMaterial({
        
    });


    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    return ground;
}

function generateHeight(width,height){
    let seed = Math.PI / 4;
				window.Math.random = function () {

					const x = Math.sin( seed ++ ) * 10000;
					return x - Math.floor( x );

				};

				const size = width * height, data = new Uint8Array( size );
				const perlin = new ImprovedNoise(), z = Math.random() * 100;

				let quality = 1;

				for ( let j = 0; j < 4; j ++ ) {

					for ( let i = 0; i < size; i ++ ) {

						const x = i % width, y = ~ ~ ( i / width );
						data[ i ] += Math.abs( perlin.noise( x / quality, y / quality, z ) * quality * 1.75 );

					}

					quality *= 5;

				}

				return data;
}

function generateTexture( data, width, height ) {

    let context, image, imageData, shade;

    const vector3 = new THREE.Vector3( 0, 0, 0 );

    const sun = new THREE.Vector3( 1, 1, 1 );
    sun.normalize();

    const canvas = document.createElement( 'canvas' );
    canvas.width = width;
    canvas.height = height;

    context = canvas.getContext( '2d' );
    context.fillStyle = '#000';
    context.fillRect( 0, 0, width, height );

    image = context.getImageData( 0, 0, canvas.width, canvas.height );
    imageData = image.data;

    for ( let i = 0, j = 0, l = imageData.length; i < l; i += 4, j ++ ) {

        vector3.x = data[ j - 2 ] - data[ j + 2 ];
        vector3.y = 2;
        vector3.z = data[ j - width * 2 ] - data[ j + width * 2 ];
        vector3.normalize();

        shade = vector3.dot( sun );

        imageData[ i ] = ( 96 + shade * 128 ) * ( 0.5 + data[ j ] * 0.007 );
        imageData[ i + 1 ] = ( 32 + shade * 96 ) * ( 0.5 + data[ j ] * 0.007 );
        imageData[ i + 2 ] = ( shade * 96 ) * ( 0.5 + data[ j ] * 0.007 );

    }

    context.putImageData( image, 0, 0 );

    // Scaled 4x

    const canvasScaled = document.createElement( 'canvas' );
    canvasScaled.width = width * 4;
    canvasScaled.height = height * 4;

    context = canvasScaled.getContext( '2d' );
    context.scale( 4, 4 );
    context.drawImage( canvas, 0, 0 );

    image = context.getImageData( 0, 0, canvasScaled.width, canvasScaled.height );
    imageData = image.data;

    for ( let i = 0, l = imageData.length; i < l; i += 4 ) {

        const v = ~ ~ ( Math.random() * 5 );

        imageData[ i ] += v;
        imageData[ i + 1 ] += v;
        imageData[ i + 2 ] += v;

    }

    context.putImageData( image, 0, 0 );

    return canvasScaled;

}

export default Ground;