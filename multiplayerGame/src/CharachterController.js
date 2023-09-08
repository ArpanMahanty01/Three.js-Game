import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { A, D, DIRECTIONS, S, W,SPACE,DOUBLESPACE } from './utils'

export class CharacterControls {

    model
    mixer
    animationsMap = new Map() // Walk, Run, Idle
    orbitControl
    camera

    // state
    toggleFly=false;
    toggleRun = false;
    currentAction
    
    // temporary data
    walkDirection = new THREE.Vector3()
    rotateAngle = new THREE.Vector3(0, 1, 0)
    rotateQuarternion = new THREE.Quaternion()
    cameraTarget = new THREE.Vector3()
    
    // constants
    fadeDuration = 0.2
    runVelocity = 70
    walkVelocity = 20
    flyVelocity = 150

    constructor(model,
        mixer, animationsMap,
        controls, camera,
        currentAction) {
        this.model = model
        this.mixer = mixer
        this.animationsMap = animationsMap
        this.currentAction = currentAction
        this.animationsMap.forEach((value, key) => {
            if (key == currentAction) {
                value.play()
            }
        })
        this.orbitControl = controls
        this.camera = camera
        this.updateCameraTarget(0,0)
    }

    switchRunToggle() {
        this.toggleRun = !this.toggleRun
    }

    switchFlyToggle(){
        this.toggleFly = !this.toggleFly;
    }
    

    update(delta, keysPressed) {
        const directionPressed = DIRECTIONS.some(key => keysPressed[key] == true);
        const jumpPressed = (keysPressed[SPACE] == true);

        var play = '';
        if(!jumpPressed){
            if (directionPressed && this.toggleRun && !this.toggleFly) {
                play = 'Run'
            }
            else if(directionPressed && this.toggleFly){
                play = 'Fly'
            }
             else if (directionPressed) {
                play = 'Walk'
            } else {
                play = 'Idle'
            }
        }else{
            play = 'Jump'
        }
        

        if (this.currentAction != play) {
            const toPlay = this.animationsMap.get(play)
            const current = this.animationsMap.get(this.currentAction)

            current.fadeOut(this.fadeDuration)
            toPlay.reset().fadeIn(this.fadeDuration).play();

            this.currentAction = play
        }

        this.mixer.update(delta)

        if (this.currentAction == 'Run' || this.currentAction == 'Walk' || this.currentAction == 'Fly') {
            if(this.currentAction == 'Fly'){
                this.model.position.y = 50;
            }else{
                this.model.position.y = 0;
            }
            
            // calculate towards camera direction
            var angleYCameraDirection = Math.atan2(
                    (this.camera.position.x - this.model.position.x), 
                    (this.camera.position.z - this.model.position.z));
            
            
                    
            // diagonal movement angle offset
            var directionOffset = this.directionOffset(keysPressed)

            // rotate model
            this.rotateQuarternion.setFromAxisAngle(this.rotateAngle, angleYCameraDirection + directionOffset)
            this.model.quaternion.rotateTowards(this.rotateQuarternion, 0.1)

            // calculate direction
            this.camera.getWorldDirection(this.walkDirection)
            this.walkDirection.y = 0
            this.walkDirection.normalize()
            this.walkDirection.applyAxisAngle(this.rotateAngle, directionOffset)

            // run/walk velocity
            let velocity;
            switch (this.currentAction) {
                case 'Run':
                    velocity = this.runVelocity;
                    break;
                case 'Walk':
                    velocity = this.walkVelocity;
                    break;
                case 'Fly':
                    velocity = this.flyVelocity;
                default:
                    break;
            }
            

            // move model & camera
            const moveX = this.walkDirection.x * velocity * delta
            const moveZ = this.walkDirection.z * velocity * delta
            this.model.position.x -= moveX
            this.model.position.z -= moveZ
            this.updateCameraTarget(moveX, moveZ)
        }
    }

     updateCameraTarget(moveX, moveZ) {
        // move camera
        this.camera.position.x -= moveX
        this.camera.position.z -= moveZ

        // update camera target
        this.cameraTarget.x = this.model.position.x
        this.cameraTarget.y = this.model.position.y + 1
        this.cameraTarget.z = this.model.position.z
        this.orbitControl.target = this.cameraTarget
    }

     directionOffset(keysPressed) {
        let directionOffset = 0 // w

        if (keysPressed[S]) {
            if (keysPressed[D]) {
                directionOffset = Math.PI / 4 // w+a
            } else if (keysPressed[A]) {
                directionOffset =  -Math.PI / 4 // w+d
            }
        } else if (keysPressed[W]) {
            if (keysPressed[D]) {
                directionOffset = Math.PI / 4 + Math.PI / 2 // s+a
            } else if (keysPressed[A]) {
                directionOffset = -Math.PI / 4 - Math.PI / 2 // s+d
            } else {
                directionOffset = Math.PI // s
            }
        } else if (keysPressed[D]) {
            directionOffset = Math.PI / 2 // a
        } else if (keysPressed[A]) {
            directionOffset = - Math.PI / 2 // d
        }

        return directionOffset
    }
}