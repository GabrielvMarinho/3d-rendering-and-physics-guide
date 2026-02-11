import * as THREE from "three"
import RAPIER from "rapier"

await RAPIER.init()

/* ------------------ THREE SETUP ------------------ */
const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  100
)
camera.position.set(4, 4, 6)
camera.lookAt(0, 1, 0)

const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

scene.add(new THREE.AmbientLight(0xffffff, 0.8))
const dirLight = new THREE.DirectionalLight(0xffffff, 0.6)
dirLight.position.set(5, 10, 5)
scene.add(dirLight)

/* ------------------ RAPIER WORLD ------------------ */
const world = new RAPIER.World({
  x: 0,
  y: -0.981,
  z: 0
})

/* ------------------ CUBE (STATIC, FLOATING) ------------------ */
const cubeMesh = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshStandardMaterial({ color: "orange" })
)
cubeMesh.position.set(0, 1, 0)
scene.add(cubeMesh)

const cubeBody = world.createRigidBody(
  RAPIER.RigidBodyDesc.fixed().setTranslation(0, 1, 0)
)

world.createCollider(
  RAPIER.ColliderDesc.cuboid(0.5, 0.5, 0.5),
  cubeBody
)

/* ------------------ PLANE (DYNAMIC, FALLS) ------------------ */
const planeGeometry = new THREE.PlaneGeometry(1, 1, 10, 10)
const planeMesh = new THREE.Mesh(
  planeGeometry,
  new THREE.MeshStandardMaterial({ color: "lightblue", side: THREE.DoubleSide})
)
planeMesh.position.set(0, 4, 0)

scene.add(planeMesh)



/* ------------------ LOOP ------------------ */


function animate() {
  requestAnimationFrame(animate)

  world.step()

  // sync plane mesh with physics
  // const p = planeBody.translation()
  // const r = planeBody.rotation()
  // planeMesh.position.set(p.x, p.y, p.z)
  // planeMesh.quaternion.set(r.x, r.y, r.z, r.w)
  // planeMesh.rotateX(-Math.PI / 2)


  renderer.render(scene, camera)
}

animate()
