import * as THREE from "three"
import { OrbitControls } from "jsm/controls/OrbitControls.js"
import RAPIER from "rapier"
import { getBody } from "./getBodies.js"
import { getMouseBall } from "./getMouseBall.js"

const w = window.innerWidth
const h = window.innerHeight
const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(90, w/h, 0.1, 1000)
camera.position.z = 5
const renderer = new THREE.WebGLRenderer({antialias:true})
renderer.setSize(w, h)

document.body.appendChild(renderer.domElement)

const ctrls = new OrbitControls(camera, renderer.domElement)

await RAPIER.init()
const gravity = { x:0, y:0, z:0 }
const world = new RAPIER.World(gravity)

const numBodies = 30
const bodies = []

for(let i=0; i<numBodies; i++){
    const body = getBody(RAPIER, world)
    bodies.push(body)
    scene.add(body.mesh)
}

const mouseBall = getMouseBall(RAPIER, world)
scene.add(mouseBall.mesh)

// mouse interactivity

const raycaster = new THREE.Raycaster()
const pointerPos = new THREE.Vector2(0, 0)
const mousePos = new THREE.Vector3()

const mousePlaneGeo = new THREE.PlaneGeometry(10, 10, 10, 10)
const mousePlaneMat = new THREE.MeshBasicMaterial({wireframe: true})
const mousePlane = new THREE.Mesh(mousePlaneGeo, mousePlaneMat)
mousePlane.position.set(0, 0, 0.2)
scene.add(mousePlane)

window.addEventListener("mousemove", (e)=>{
    pointerPos.set(
        (e.clientX / window.innerWidth) * 2 -1,
        -(e.clientY / window.innerHeight) * 2 +1
    )
})

let cameraDirection = new THREE.Vector3()

function handlerRaycast(){
    camera.getWorldDirection(cameraDirection)
    cameraDirection.multiplyScalar(-1)
    mousePlane.lookAt(cameraDirection)
    raycaster.setFromCamera(pointerPos, camera)
    const intersects = raycaster.intersectObjects(
        [mousePlane],
        false
    )
    if (intersects.length>0){
        mousePos.copy(intersects[0].point)
    }
}

function animate(){
    requestAnimationFrame(animate)
    world.step()
    handlerRaycast()
    mouseBall.update(mousePos)
    ctrls.update()
    bodies.forEach(b=>b.update())
    renderer.render(scene, camera)

}
animate()