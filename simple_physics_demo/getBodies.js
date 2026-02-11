import * as THREE from "three"

const sceneMiddle = new THREE.Vector3(0, 0, 0)

function getMesh(){
    const geometry = new THREE.DodecahedronGeometry(0.5, 2)
    const material = new THREE.MeshPhysicalMaterial()
    return new THREE.Mesh(geometry, material)
}

function addBorderLines(mesh){
    const edges = new THREE.EdgesGeometry(mesh.geometry)
    const lines = new THREE.LineSegments(
        edges,
        new THREE.LineBasicMaterial({color:0xffffff})
    )
    mesh.add(lines)

}
function getRandomCoordinates(){
    const range = 12
    const x = Math.random() * range - range * 0.5
    const y = Math.random() * range - range * 0.5 + 3
    const z = Math.random() * range - range * 0.5
    return { x, y, z }
}

function createRigidBody(RAPIER, mesh, world, x, y, z){
    let rigidBodyDesc = RAPIER.RigidBodyDesc.dynamic().setTranslation(x, y, z)
    let rigidBody = world.createRigidBody(rigidBodyDesc)
    let points = mesh.geometry.attributes.position.array
    let colliderDesc = RAPIER.ColliderDesc.convexHull(points).setDensity(0.1)
    world.createCollider(colliderDesc, rigidBody)
    return rigidBody
}

function getBody(RAPIER, world){

    const mesh = getMesh()
    addBorderLines(mesh)
    const { x, y, z } = getRandomCoordinates()
    const rigidBody = createRigidBody(RAPIER, mesh, world, x, y, z)
    
    function update(){
        rigidBody.resetForces(true)
        let { x, y, z } = rigidBody.translation()
        let pos = new THREE.Vector3(x, y, z)
        let dir = pos.clone().sub(sceneMiddle).normalize()
        let q = rigidBody.rotation()
        let rote = new THREE.Quaternion(q.x, q.y, q.z, q.w)
        mesh.rotation.setFromQuaternion(rote)
        rigidBody.addForce(dir.multiplyScalar(-0.5), true)
        mesh.position.set(x, y, z)
    }
    return { mesh, rigidBody, update }
}

export { getBody }