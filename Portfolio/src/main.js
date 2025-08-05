import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// Scene
const scene = new THREE.Scene()
scene.background = new THREE.Color(0x1A1818)

// Camera
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 )
camera.position.z = 20



// object
const geometry = new THREE.TorusGeometry(2, 1, 16, 100)
const material = new THREE.MeshPhongMaterial({ color: 0x999999})
const torus = new THREE.Mesh(geometry, material)
torus.position.y = 5
torus.position.x = -5


const DodecahedronGeometry = new THREE.DodecahedronGeometry(2, 0)
const dodecahedronMaterial = new THREE.MeshPhongMaterial({ color: 0x999999})
const dodecahedron = new THREE.Mesh(DodecahedronGeometry, dodecahedronMaterial)
dodecahedron.position.y = 5
dodecahedron.position.x = 5

const icosahedronGeometry = new THREE.IcosahedronGeometry(2, 1)
const icosahedronMaterial = new THREE.MeshPhongMaterial({ color: 0x999999, flatShading: true})
const icosahedron = new THREE.Mesh(icosahedronGeometry, icosahedronMaterial)
icosahedron.position.y = -3
icosahedron.position.x = -5

// Lights
const light = new THREE.DirectionalLight(0xffffff, 2)
light.position.set(1, 1, 1).normalize()
scene.add(light)

//Render
const canvas = document.querySelector( '#bg' );
const renderer = new THREE.WebGLRenderer( { antialias: true, canvas } );
renderer.setPixelRatio(window.devicePixelRatio)
renderer.setSize(window.innerWidth, window.innerHeight)

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// jiggle
const originalPositions = {};
const objectStates = new Map();
const mouse = new THREE.Vector2();
const raycaster = new THREE.Raycaster();

window.addEventListener('mousemove', (event) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
});




// add objects to scene
scene.add(torus, dodecahedron, icosahedron);
scene.add(light); 

[torus, dodecahedron, icosahedron].forEach(obj => {
  objectStates.set(obj.uuid, {
    originalPosition: obj.position.clone(),
    velocity: new THREE.Vector3()
  });
});



function animate(time) {
  time *= 0.001;

  [torus, dodecahedron, icosahedron].forEach(obj => {
    obj.rotation.x = time;
    obj.rotation.y = time;
    obj.rotation.z = time;
  });

  // run jiggle effect
  raycaster.setFromCamera(mouse, camera);

  const objects = [torus, dodecahedron, icosahedron];

  for (let obj of objects) {
    const state = objectStates.get(obj.uuid);
    const origPos = state.originalPosition;
    const velocity = state.velocity;

    // Проецируем позицию объекта в экранные координаты
    const objScreenPos = obj.position.clone().project(camera);
    const dx = mouse.x - objScreenPos.x;
    const dy = mouse.y - objScreenPos.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    const repelRadius = 0.5; 
    const repelForce = 0.03;
    const springForce = 0.01;
    const damping = 0.95;

    // 1. Отталкивание от мыши
    if (distance < repelRadius) {
      const direction = new THREE.Vector3(dx, dy, 0).normalize();
      velocity.x -= direction.x * repelForce;
      velocity.y -= direction.y * repelForce; // Invert Y because screen coords are flipped
    }

    // 2. Притяжение к исходной позиции (как пружина)
    const toOrigin = new THREE.Vector3().subVectors(origPos, obj.position);
    velocity.add(toOrigin.multiplyScalar(springForce));

    // 3. Применяем демпфирование (торможение)
    velocity.multiplyScalar(damping);

    // 4. Обновляем позицию
    obj.position.add(velocity);
  }

  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

requestAnimationFrame(animate)


document.querySelector('#app').innerHTML = `
  <div>
    <h1>Feliks</h1>
  </div>
`
