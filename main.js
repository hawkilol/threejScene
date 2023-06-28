import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { ShaderMaterial } from 'three';
import { MeshStandardMaterial, MeshBasicMaterial, MeshLambertMaterial , MeshPhongMaterial} from 'three';
import { vertexShader, fragmentShader } from './public/shaders.js';

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 2000 )
const modelLoader = new GLTFLoader()
const textureLoader = new THREE.TextureLoader()

const renderer = new THREE.WebGLRenderer({antialias: true})
renderer.setSize( window.innerWidth, window.innerHeight )
document.querySelector('#app').appendChild( renderer.domElement )
renderer.shadowMap.enabled = true
const controls = new OrbitControls(camera, renderer.domElement)

const light = new THREE.PointLight(0xffffff, 1, 10)
light.castShadow = true
var start = Date.now()
// const helper = new THREE.PointLightHelper(light)

light.position.y = 100

scene.add(light)
light.distance = 600
// scene.add(helper)
//903945
// const ambient = new THREE.AmbientLight(0Xd6ba8d)
// const ambient = new THREE.AmbientLight(0X903945)
// ambient.intensity = 0.5
const ambient = new THREE.AmbientLight(0X903945,0.1)

scene.add(ambient)

// const shaderMaterial = new THREE.ShaderMaterial({
//   vertexShader: myShader.vertexShader,
//   fragmentShader: myShader.fragmentShader,
// });

const cylinderG = new THREE.CylinderGeometry(500, 500, 5, 25)
const cylinderT = textureLoader.load('./textures/sea_red_calm.jpg')
cylinderT.wrapS = cylinderT.wrapT = THREE.RepeatWrapping
cylinderT.repeat = new THREE.Vector2(20, 20)
cylinderT.encoding = THREE.sRGBEncoding;

const cylinderM = new MeshStandardMaterial({map: cylinderT})
const cylinder = new THREE.Mesh(cylinderG, cylinderM)
cylinder.receiveShadow = true
cylinder.position.y = 0
scene.add(cylinder)

const skyboxG = new THREE.SphereGeometry(1000, 32, 16)
const skyboxT = textureLoader.load('./textures/sky_evaCrop.png')
skyboxT.wrapS = THREE.RepeatWrapping
skyboxT.wrapT = THREE.RepeatWrapping
skyboxT.repeat.set(5, 5)
skyboxT.anisotropy = renderer.capabilities.getMaxAnisotropy()
skyboxT.encoding = THREE.sRGBEncoding;

const skyboxM = new THREE.MeshBasicMaterial({ map: skyboxT, side: THREE.BackSide})
skyboxM.transparent = true; // Enable transparency to control brightness
skyboxM.opacity = 0.7; // Adjust the opacity value (0.0 - 1.0) to increase brightness
const skybox = new THREE.Mesh(skyboxG, skyboxM)
scene.add(skybox)

let hand_anatomy
modelLoader.load('./models/hand_anatomy/scene.gltf', gltf => {
  hand_anatomy = gltf.scene
  hand_anatomy.traverse((o) => {
    if (o.isMesh) {
      const texture = o.material.map
      o.material = new MeshStandardMaterial({map: texture})
      o.castShadow = true
      o.receiveShadow = true
    }
  })
  hand_anatomy.scale.set(2.5, 2.5, 2.5)
  hand_anatomy.position.set(4, 10.5, -40.9)
  hand_anatomy.rotation.y = Math.PI*1.9
  hand_anatomy.translateY(15)
  scene.add(hand_anatomy)
}, undefined, error => {
  console.error(error)
})

let frog
const FROGHEIGHT = 2.5
modelLoader.load('./models/frog/scene.gltf', gltf => {
  frog = gltf.scene
  scene.add(frog)
  frog.traverse((o) => {
    if (o.isMesh) {
      const texture = o.material.map
      o.material = new MeshStandardMaterial({map: texture})
      o.receiveShadow = true
    }
  })
  frog.scale.set(2, 2, 2)
  frog.position.set(-50, FROGHEIGHT, -10)
}, undefined, error => {
  console.error(error)
})

let redMoon
const uniforms = {
  u_time: { type: "f", value: 1.0 },
};

const material = new THREE.ShaderMaterial({
  uniforms: uniforms,
  vertexShader: vertexShader,
  fragmentShader: fragmentShader,
});
const radius = 1;
	redMoon = new THREE.Mesh(
		//new THREE.IcosahedronGeometry( 20, 4 ),
		new THREE.SphereGeometry(radius, 200, 100),
		material
	);
	scene.add(redMoon);
  redMoon.scale.set(70, 70, 70)
  redMoon.position.y = 400

camera.position.z = -150
camera.position.y = 100

let t = 0;
const orbitRadius = 600;
const revolutionSpeed =  0.01
function animate() {
  t += 0.01;
  

  requestAnimationFrame(animate);
  const now = performance.now();
  const deltaTime = now - prevTime;
  const frameRate = 1000 / 60; // Target frame rate of 60 fps

  if (deltaTime < frameRate) {
    // Skip this frame if it's too soon
    return;
  }
  t = deltaTime/1000
  const moonPosX = Math.cos(t/3) * orbitRadius;
  const moonPosy = Math.sin(t/3) * orbitRadius;
  const moonPosZ = Math.sin(t/3) * orbitRadius;
  
  redMoon.position.set(moonPosX, moonPosy, moonPosZ);
  redMoon.rotation.x += 0.001;
  redMoon.rotation.y += 0.005;
  redMoon.rotation.z += 0.001;

  cylinder.position.y = 0 + Math.sin(t) * 0.5;
  cylinderT.offset = new THREE.Vector2(Math.sin(t * 0.05) / 2 + 0.5, 0);
  skybox.rotation.x += 0.0002;
  skybox.rotation.y += 0.0002;
  skybox.rotation.z += 0.0002;
  light.position.x = 50 * Math.cos(t * 0.1) + 0;
  light.position.z = 50 * Math.sin(t * 0.1) + 0;

  renderer.render(scene, camera);
  controls.update();
  uniforms.u_time.value = Date.now() - start;
}
let prevTime = performance.now();

animate();
