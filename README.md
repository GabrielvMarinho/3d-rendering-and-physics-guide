# Guide to rendering 3d objects and working with physics
## 3d rendering
Steps to creating a 3d object from a high-level:
1. create a `geometry`: the blueprint of the shape
2. create a `material`: the blueprint of the surface (just visual, no friction yet)
3. create a `mesh`: an instance of a `geometry` + `material`
4. create and add it to the `scene`: the holder of the visual assets

code example with THREE.js:
```js
geometry = new THREE.DodecahedronGeometry(1, 1)
material = new THREE.MeshPhysicalMaterial(options)
mesh =  new THREE.Mesh(geometry, material)
new THREE.Scene().add(mesh)
```

## Adding physics
Once you have a visual representation of an object, you can create an invisible physics-interactive object. This is how things go from a high-level:
1. create the `description of a rigid body`: the blueprint of the rigid body
2. create a `rigid body`: physical properties holder: mass, position, rotation, velocity
3. create a `collider desc`: the blueprint of the collider body
4. create a `collider`: hitbox of a rigid body
5. create and add to a `world`: the holder of physical assets

code example with RAPIER.js
```js
const world = new RAPIER.World({ x:0, y:0, z:0 })
const rigidBodyDesc = RAPIER.RigidBodyDesc.dynamic().setTranslation(0, 0, 0);
let rigidBody = world.createRigidBody(rigidBodyDesc)
world.createCollider(RAPIER.ColliderDesc.cuboid(1, 1, 1), rigidBody)
```

## Syncing
Notice how the `scene` and the `world` are different things, meaning the 3d object and physics object are independent, so we will need to sync both (this would be in a loop):

```js
world.step()
const pos = body.translation();
const rot = body.rotation();
mesh.position.set(pos.x, pos.y, pos.z);
mesh.quaternion.set(rot.x, rot.y, rot.z, rot.w);
```

## Showing
Now to show it we will need a few more things:
1. create a `camera`: what the user will see
2. create a `renderer`: what handles the updating
3. loop it forever

example:
```js
const renderer = new THREE.WebGLRenderer()
const camera = new THREE.PerspectiveCamera(90, w/h, 0.1, 1000)

function animate() {
    // infinite loop
    requestAnimationFrame(animate);

    // sync logic here...

    renderer.render(scene, camera);
}
animate();
```

