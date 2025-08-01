import './style.css'
import * as THREE from 'three'

// Scene
const scene = new THREE.Scene()
scene.background = new THREE.Color(0x282F3A)

// Camera
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 )
camera.position.z = 20

// object
const geometry = new THREE.TorusGeometry(5, 2, 16, 100)
const material = new THREE.MeshBasicMaterial({ color: 0x006347})
const torus = new THREE.Mesh(geometry, material)
torus.position.x = -10


const DodecahedronGeometry = new THREE.DodecahedronGeometry(5, 0)
const dodecahedronMaterial = new THREE.MeshBasicMaterial({ color: 0x00347})
const dodecahedron = new THREE.Mesh(DodecahedronGeometry, dodecahedronMaterial)
dodecahedron.position.x = 10

// Lights
const light = new THREE.SpotLight(0x006769, 2000)
light.position.set(1, 1, 1)


//Render
const renderer = new THREE.WebGLRenderer({ canvas: document.querySelector('#bg') })
renderer.setPixelRatio(window.devicePixelRatio)
renderer.setSize(window.innerWidth, window.innerHeight)



scene.add(torus, dodecahedron, light)

function animate() {
  requestAnimationFrame(animate)
  renderer.render(scene, camera)
}
animate()


document.querySelector('#app').innerHTML = `
  <div>
    <h1>Feliks</h1>
  </div>
`

setupCounter(document.querySelector('#counter'))
