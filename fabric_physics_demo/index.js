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
const planeGeometry = new THREE.PlaneGeometry(1, 1, 20, 20)
const planeMesh = new THREE.Mesh(
  planeGeometry,
  new THREE.MeshStandardMaterial({ color: "lightblue", side: THREE.DoubleSide})
)
planeMesh.position.set(0, 4, 0)

scene.add(planeMesh)

const positions = planeMesh.geometry.attributes.position.array
const count = planeMesh.geometry.attributes.position.count

for (let i = 0; i < count; i++) {
  const idx = i * 3

  // original vertex position
  const x0 = positions[idx]
  const y0 = positions[idx + 1]
  const z0 = positions[idx + 2]

  // add small random offsets to make it look wrinkled
  positions[idx]     = x0 + (Math.random() - 0.5) * 0.04  // x small offset
  positions[idx + 1] = y0 + (Math.random() - 0.5) * 0.04  // y small offset
  positions[idx + 2] = z0 + (Math.random() - 0.5) * 0.04  // z small offset
}

planeMesh.geometry.attributes.position.needsUpdate = true
planeMesh.geometry.computeVertexNormals()
/* ------------------ LOOP ------------------ */


function animate() {
  requestAnimationFrame(animate)

  world.step()
  
  renderer.render(scene, camera)
}

animate()
