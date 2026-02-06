import * as THREE from "three"
const mouseSize = 0.25
function getMesh(){
    const geometry = new THREE.DodecahedronGeometry(mouseSize, 8)
    const material = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: 0xffffff
    })
    return new THREE.Mesh(geometry, material)
}

function createRigidBody(RAPIER, world){
    let rigidBodyDesc = RAPIER.RigidBodyDesc.kinematicPositionBased().setTranslation(0, 0, 0)
    let rigidBody = world.createRigidBody(rigidBodyDesc)
    let colliderDesc = RAPIER.ColliderDesc.ball( mouseSize*3.0)
    return world.createCollider(colliderDesc, rigidBody) 
}


function getMouseBall(RAPIER, world){
    
    const mesh = getMesh(THREE)
    const rigidBody = createRigidBody(RAPIER, world)

    function update(mousePos){
        rigidBody.setTranslation({ x:mousePos.x, y:mousePos.y, z:mousePos.z})
        let { x, y, z } = rigidBody.translation()
        mesh.position.set(x, y, z)
    }

    return { mesh, update }

}

export { getMouseBall }