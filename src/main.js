//Alunos: 
// Kalil Saldanha Kaliffe / 202004940030 
// PEDRO INACIO DE CARVALHO JUNIOR / 202004940011

import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { ShaderMaterial } from 'three';
import { MeshStandardMaterial, MeshBasicMaterial, MeshLambertMaterial, MeshPhongMaterial } from 'three';
import { vertexShader, fragmentShader } from './shaders.js';
import { Water } from 'three/addons/objects/Water.js'
import { Sky } from 'three/addons/objects/Sky.js'

import Stats from 'stats.js'

// renderer.useLegacyLights = false;
// renderer.toneMapping = THREE.ACESFilmicToneMapping;
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000)
const modelLoader = new GLTFLoader()
const textureLoader = new THREE.TextureLoader()

const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)
document.querySelector('#app').appendChild(renderer.domElement)
renderer.shadowMap.enabled = true
const controls = new OrbitControls(camera, renderer.domElement)

const light = new THREE.PointLight(0xffffff, 1, 10)
let water, sun
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
const ambient = new THREE.AmbientLight(0X903945, 0.1)

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

const cylinderM = new MeshStandardMaterial({ map: cylinderT })
const cylinder = new THREE.Mesh(cylinderG, cylinderM)
cylinder.receiveShadow = true
cylinder.position.y = 0
//scene.add(cylinder)

//Sun
sun = new THREE.Vector3();

const waterGeometry = new THREE.PlaneGeometry(10000, 10000);

water = new Water(
  waterGeometry,
  {
    textureWidth: 512,
    textureHeight: 512,
    waterNormals: new THREE.TextureLoader().load('/textures/waternormals.jpg', function (texture) {

      texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

    }),
    sunDirection: new THREE.Vector3(),
    // sunColor: 0xe46c48,
    sunColor: 0x9c0b51,
    waterColor: 0xde5042,
    distortionScale: 3.7,
    fog: scene.fog !== undefined
  }
);

water.rotation.x = - Math.PI / 2;
water.position.y = 5
scene.add(water);
const waterUniforms = water.material.uniforms;

const skyboxG = new THREE.SphereGeometry(1000, 32, 16)
const skyboxT = textureLoader.load('/textures/sky_evaCrop.png')
skyboxT.wrapS = THREE.RepeatWrapping
skyboxT.wrapT = THREE.RepeatWrapping
skyboxT.repeat.set(5, 5)
skyboxT.anisotropy = renderer.capabilities.getMaxAnisotropy()
skyboxT.encoding = THREE.sRGBEncoding;

const skyboxM = new THREE.MeshBasicMaterial({ map: skyboxT, side: THREE.BackSide })
skyboxM.transparent = true; // Enable transparency to control brightness
skyboxM.opacity = 0.7; // Adjust the opacity value (0.0 - 1.0) to increase brightness
const skybox = new THREE.Mesh(skyboxG, skyboxM)
scene.add(skybox)

const sky = new Sky();
sky.scale.setScalar(10000);
scene.add( sky );

const skyUniforms = sky.material.uniforms;

skyUniforms[ 'turbidity' ].value = 5;
skyUniforms[ 'rayleigh' ].value = 2;
skyUniforms[ 'mieCoefficient' ].value = 0.005;
skyUniforms[ 'mieDirectionalG' ].value = 0.8;

function rei_head_up() {
  rei_head.rotation.z = Math.PI / 2
  rei_head.rotation.x = -Math.PI / 2
  rei_head.position.y = -0.005
  rei_head.position.x = 1.5
}
function rei_head_side() {
  rei_head.rotation.z = Math.PI / 2

  rei_head.position.y = 0.01
  rei_head.position.x = 1.5
  //rei_head.rotation.y = Math.PI*1.9

}
const pivotRei = new THREE.Object3D();
scene.add(pivotRei);
let rei_head
modelLoader.load('./public/models/rei_head/rei_head.gltf', gltf => {
  rei_head = gltf.scene

  rei_head.traverse((o) => {
    if (o.isMesh) {
      const texture = o.material.map
      o.material = new MeshStandardMaterial({ map: texture })
      o.castShadow = true
      o.receiveShadow = true
    }
  })
  pivotRei.add(rei_head)
  rei_head.position.set(0, 0, 0);

  pivotRei.position.set(0, 0, 0)

  pivotRei.scale.set(550, 550, 550)
  //rei_head_up()
  //scene.add(rei_head)
  rei_head_side()

  //rei_head.rotation.y = Math.PI*1.9




}, undefined, error => {
  console.error(error)
})
let sand_cliffs
modelLoader.load('./public/models/sand_beach/scene.gltf', gltf => {
  sand_cliffs = gltf.scene
  sand_cliffs.traverse((o) => {
    if (o.isMesh) {
      const texture = o.material.map
      o.material = new MeshStandardMaterial({ map: texture })
      o.castShadow = true
      o.receiveShadow = true
    }
  })
  sand_cliffs.scale.set(70, 70, 70)
  sand_cliffs.position.set(500, 115, 385)
  sand_cliffs.rotation.y = Math.PI / 6 * 2.7
  //sand_cliffs.rotation.x = -0.192665
  //sand_cliffs.rotation.z = Math.PI * 1.3

  scene.add(sand_cliffs)
}, undefined, error => {
  console.error(error)
})
let asuka
modelLoader.load('./public/models/asuka/scene.gltf', gltf => {
  asuka = gltf.scene
  asuka.traverse((o) => {
    if (o.isMesh) {
      const texture = o.material.map
      o.material = new MeshStandardMaterial({ map: texture })
      o.castShadow = true
      o.receiveShadow = true
    }
  })
  // asuka.scale.set(15, 15, 15)
  // asuka.position.set(-15, 10, 100)
  // asuka.rotation.y = Math.PI
  // asuka.scale.set(15, 15, 15)
  // asuka.position.set(-15, 10, 100)
  // asuka.rotation.y = Math.PI


  asuka.scale.set(15, 15, 15)
  asuka.position.set(-5, 7, 215)
  asuka.rotation.y = Math.PI

  scene.add(asuka)
}, undefined, error => {
  console.error(error)
})

let moonlight_sword
modelLoader.load('./public/models/moonlight_sword/scene.gltf', gltf => {
  moonlight_sword = gltf.scene
  moonlight_sword.traverse((o) => {
    if (o.isMesh) {
      const texture = o.material.map
      o.material = new MeshStandardMaterial({ map: texture })
      o.castShadow = true
      o.receiveShadow = true
    }
  })

  moonlight_sword.scale.set(15, 15, 15)
  moonlight_sword.position.set(150, 7, 250)
  moonlight_sword.rotation.x = Math.PI

  scene.add(moonlight_sword)
}, undefined, error => {
  console.error(error)
})

let hand_anatomy
modelLoader.load('./public/models/hand_anatomy/scene.gltf', gltf => {
  hand_anatomy = gltf.scene
  hand_anatomy.traverse((o) => {
    if (o.isMesh) {
      const texture = textureLoader.load('./public/models/hand_anatomy/textures/hand_texture.jpg');
      o.material = new MeshStandardMaterial({ map: texture })
      o.castShadow = true
      o.receiveShadow = true
    }
  })
  hand_anatomy.scale.set(5.9,5.9 ,5.9)
  hand_anatomy.position.set(100, 15, -50)
  hand_anatomy.rotation.y = -Math.PI /4
 
  scene.add(hand_anatomy)
}, undefined, error => {
  console.error(error)
})

let dead_tree
modelLoader.load('./public/models/dead_tree/scene.gltf', gltf => {
  dead_tree = gltf.scene
  dead_tree.traverse((o) => {
    if (o.isMesh) {
      const texture = o.material.map
      o.material = new MeshStandardMaterial({ map: texture })
      o.castShadow = true
      o.receiveShadow = true
    }
  })
  dead_tree.scale.set(11, 11, 11)
  dead_tree.position.set(350, 0, 370)
  dead_tree.rotation.y = Math.PI / 6 * 2.7
  //sand_cliffs.rotation.x = -0.192665
  //sand_cliffs.rotation.z = Math.PI * 1.3

  scene.add(dead_tree)
}, undefined, error => {
  console.error(error)
})
let plateau_terrain
modelLoader.load('./public/models/plateau_terrain/scene.gltf', gltf => {
  plateau_terrain = gltf.scene
  plateau_terrain.traverse((o) => {
    if (o.isMesh) {
      const texture = textureLoader.load('./public/models/plateau_terrain/textures/material_baseColor.jpeg');
      o.material = new MeshStandardMaterial({ map: texture })
      o.castShadow = true
      o.receiveShadow = true
    }
  })
  plateau_terrain.scale.set(150, 150, 150)
  plateau_terrain.position.set(500, -45, 500)
  plateau_terrain.rotation.y = Math.PI / 6 * 2.7
  //sand_cliffs.rotation.x = -0.192665
  //sand_cliffs.rotation.z = Math.PI * 1.3

  scene.add(plateau_terrain)
}, undefined, error => {
  console.error(error)
})
let sun_disk
modelLoader.load('./public/models/sun_disk/scene.gltf', gltf => {
  sun_disk = gltf.scene
  sun_disk.traverse((o) => {
    if (o.isMesh) {
      const texture = o.material.map
      o.material = new MeshStandardMaterial({ map: texture })
      o.castShadow = true
      o.receiveShadow = true
    }
  })
  sun_disk.scale.set(0.5, 0.5, 0.5)
  sun_disk.position.set(-200, -5, 0)
  sun_disk.rotation.y = Math.PI / 6 * 2.7
  //sand_cliffs.rotation.x = -0.192665
  //sand_cliffs.rotation.z = Math.PI * 1.3

  scene.add(sun_disk)
}, undefined, error => {
  console.error(error)
})

modelLoader.load('./public/models/dead_tree/scene.gltf', gltf => {
  dead_tree = gltf.scene
  dead_tree.traverse((o) => {
    if (o.isMesh) {
      const texture = o.material.map
      o.material = new MeshStandardMaterial({ map: texture })
      o.castShadow = true
      o.receiveShadow = true
    }
  })
  dead_tree.scale.set(11, 11, 11)
  dead_tree.position.set(350, 0, 370)
  dead_tree.rotation.y = Math.PI / 6 * 2.7
  //sand_cliffs.rotation.x = -0.192665
  //sand_cliffs.rotation.z = Math.PI * 1.3

  scene.add(dead_tree)
}, undefined, error => {
  console.error(error)
})
let desert_rock_terrain
modelLoader.load('./public/models/snow_rocks_terrain/scene.gltf', gltf => {
  desert_rock_terrain = gltf.scene
  desert_rock_terrain.traverse((o) => {
    if (o.isMesh) {
      const texture = o.material.map
      o.material = new MeshStandardMaterial({ map: texture })
      o.castShadow = true
      o.receiveShadow = true
    }
  })
  desert_rock_terrain.scale.set(25, 25, 25)
  desert_rock_terrain.position.set(0, -30, 500)
  desert_rock_terrain.rotation.y = Math.PI * 1.3

  scene.add(desert_rock_terrain)
}, undefined, error => {
  console.error(error)
})
let canyon_terrain
modelLoader.load('./public/models/mountains/scene.gltf', gltf => {
  canyon_terrain = gltf.scene
  canyon_terrain.traverse((o) => {
    if (o.isMesh) {
      const texture = o.material.map
      o.material = new MeshStandardMaterial({ map: texture })
      o.castShadow = true
      o.receiveShadow = true
    }
  })
  canyon_terrain.scale.set(15, 15, 15)
  canyon_terrain.position.set(500, -50, -485)
  // canyon_terrain.rotation.y = Math.PI * 1.9
  canyon_terrain.rotation.y = Math.PI
  scene.add(canyon_terrain)
}, undefined, error => {
  console.error(error)
})
let lance
modelLoader.load('./public/models/lance_of_longinus/scene.gltf', gltf => {
  lance = gltf.scene
  lance.traverse((o) => {
    if (o.isMesh) {
      const texture = o.material.map
      o.material = new MeshStandardMaterial({ map: texture })
      o.castShadow = true
      o.receiveShadow = true
    }
  })
  lance.scale.set(2, 2, 2)
  lance.position.set(-400, 400, -400)
  lance.rotation.y = -Math.PI / 2
  lance.rotation.z = -Math.PI / 2
  lance.rotation.x = Math.PI / 2
  scene.add(lance)
}, undefined, error => {
  console.error(error)
})

let frog
const FROGHEIGHT = 2.5
modelLoader.load('./public/models/frog/scene.gltf', gltf => {
  frog = gltf.scene
  scene.add(frog)
  frog.traverse((o) => {
    if (o.isMesh) {
      const texture = o.material.map
      o.material = new MeshStandardMaterial({ map: texture })
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
  u_time: { type: "f", value: 1 },
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

const redMoonLight = new THREE.DirectionalLight(0xff0000, 1);
redMoonLight.position.copy(redMoon.position);
scene.add(redMoonLight);

redMoonLight.castShadow = true;
redMoonLight.shadow.mapSize.width = 1024;
redMoonLight.shadow.mapSize.height = 1024;
redMoonLight.shadow.camera.near = 0.1;
redMoonLight.shadow.camera.far = 2000;

const parameters = {
  elevation: 2,
  azimuth: 180
}

const pmremGenerator = new THREE.PMREMGenerator(renderer);
let renderTarget;

function updateSun() {
  const phi = THREE.MathUtils.degToRad(90 - parameters.elevation);
  const theta = THREE.MathUtils.degToRad(parameters.azimuth);

  sun.setFromSphericalCoords(1, phi, theta);
  sky.material.uniforms['sunPosition'].value.copy(sun);
  water.material.uniforms['sunDirection'].value.copy(sun).normalize();
  if (renderTarget !== undefined) renderTarget.dispose();
  renderTarget = pmremGenerator.fromScene(sky);
  renderTarget.texture.opacity = 0.1;
  renderTarget.opacity = 0.1
  scene.environment = renderTarget.texture;
  
}

updateSun();
camera.position.z = 298.951
camera.position.x = 25
camera.position.y = 30

let t = 0;
const orbitRadius = 600;
const revolutionSpeed = 0.01
function animate() {
  t += 0.01;


  requestAnimationFrame(animate);
  const now = performance.now();
  const deltaTime = now - prevTime;
  const frameRate = 1000 / 60; // Target frame rate of 60 fps
  const secondRate = 1000 / 5;
  if (deltaTime < frameRate) {
    // Skip this frame if it's too soon
    return;
  }
  t = deltaTime / 1000
  const moonPosY = Math.cos(t / 3) * orbitRadius;
  const moonPosX = Math.sin(t / 3) * orbitRadius;
  const moonPosZ = Math.sin(t / 3) * orbitRadius;
  redMoon.position.set(moonPosX, moonPosY, moonPosZ);
  redMoon.rotation.x += 0.001;
  redMoon.rotation.y += 0.005;
  redMoon.rotation.z += 0.001;
  redMoonLight.position.set(moonPosX, moonPosY, moonPosZ)
  cylinder.position.y = 0 + Math.sin(t) * 0.5;
  cylinderT.offset = new THREE.Vector2(Math.sin(t * 0.05) / 2 + 0.5, 0);
  water.material.uniforms['time'].value += 1.0 / 60.0;
  skybox.rotation.x += 0.0002;
  skybox.rotation.y += 0.0002;
  skybox.rotation.z += 0.0002;
  light.position.x = 50 * Math.cos(t * 0.1) + 0;
  light.position.z = 50 * Math.sin(t * 0.1) + 0;

  renderer.toneMapping = THREE.ACESFilmicToneMapping; // or THREE.ReinhardToneMapping

  renderer.toneMappingExposure = 0.1;

  renderer.render(scene, camera);
  controls.update();
  uniforms.u_time.value = Date.now() - start;

  //sun
  if(!(deltaTime < secondRate)){
    parameters.azimuth +=0.1
    parameters.elevation +=0.1
    updateSun()
  }
  
  }
  
let prevTime = performance.now();

animate();