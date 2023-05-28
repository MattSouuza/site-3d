import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import './style.css'

// "scene" seria como se fosse um container, aonde os elementos 3d estarão dentro
const scene = new THREE.Scene();

// Primeiro argumento => field of view da câmera
// Segundo argumento => aspect ratio, que é igual a largura interior da tela do usuário divida pela altura interior da mesma
// Terceiro e Quarto argumento => controla quais elemento são visíveis relativo a câmera em si, com os valores abaixo, é possível ver basicamento a cena inteira
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
  alpha: true
})

renderer.setClearColor(0x000000, 0); // the default

renderer.setPixelRatio(window.devicePixelRatio);
// define como full screen
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);

// Objetos Geométricos _____________________________

const torusGeometry = new THREE.TorusGeometry(10, 1, 16, 100);
const torusMaterial = new THREE.MeshStandardMaterial({ color: 0xb52b2b });
const torus = new THREE.Mesh(torusGeometry, torusMaterial);

const geometry1 = new THREE.TetrahedronGeometry(10);
//* Quando se usa "0x" no js, o código entende que você quer usar um Hexadecimal!
const material1 = new THREE.MeshStandardMaterial({ color: 0xFF6347 });
const tetrahedron1 = new THREE.Mesh(geometry1, material1);

const geometry2 = new THREE.TetrahedronGeometry(5);
const material2 = new THREE.MeshStandardMaterial({ color: 0x2aeb94 });
const tetrahedron2 = new THREE.Mesh(geometry2, material2);

tetrahedron1.position.set(20, 10, -20);
tetrahedron2.position.set(-20, 20, -20);
scene.add(tetrahedron1, tetrahedron2, torus);

const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(10, 20, 20);

const ambientLight = new THREE.AmbientLight(0xffffff);

scene.add(pointLight, ambientLight);

// const lightHelper = new THREE.PointLightHelper(pointLight);
// const gridHelper = new THREE.GridHelper(200, 50);
// scene.add(lightHelper, gridHelper);

const controls = new OrbitControls(camera, renderer.domElement);


const renderScene = new RenderPass(scene, camera);

const params = {
  exposure: 1,
  bloomStrength: 0.15,
  bloomThreshold: 0,
  bloomRadius: 20
};

const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);
bloomPass.threshold = params.bloomThreshold;
bloomPass.strength = params.bloomStrength;
bloomPass.radius = params.bloomRadius;

const composer = new EffectComposer(renderer);
composer.addPass(renderScene);
composer.addPass(bloomPass);

function addStar() {
  const geometry = new THREE.SphereGeometry(0.025, 24, 24);
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const star = new THREE.Mesh(geometry, material);

  // cria um array com posições randomicas para "x", "y" e "z"
  const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100));

  star.position.set(x, y, z);

  scene.add(star);
}

Array(200).fill().forEach(addStar);

// Avatar

const mattTexture = new THREE.TextureLoader().load('../public/images/matt.png');

const matt = new THREE.Mesh(
  new THREE.BoxGeometry(3, 3, 3),
  new THREE.MeshBasicMaterial({ map: mattTexture })
);

matt.position.x = 8;
matt.position.z = 10
matt.position.y = -7

scene.add(matt);

// earth

const earthTexture = new THREE.TextureLoader().load('../public/images/earth.jpg');
const normalEarthTexture = new THREE.TextureLoader().load('../public/images/earth_normal_map.png');

const earth = new THREE.Mesh(
  new THREE.SphereGeometry(3, 100, 100),
  new THREE.MeshStandardMaterial({
    map: earthTexture,
    normalMap: normalEarthTexture,
  })
);

earth.rotation.x = -0.39;

scene.add(earth);

function animate() {
  requestAnimationFrame(animate);

  tetrahedron1.rotation.x += 0.01;
  tetrahedron1.rotation.y += 0.005;
  tetrahedron1.rotation.z += 0.01;

  torus.rotation.x += 0.01;
  torus.rotation.y += 0.005;
  torus.rotation.z += 0.01;

  tetrahedron2.rotation.x += -0.02;
  tetrahedron2.rotation.y += -0.01;
  tetrahedron2.rotation.z += -0.03;

  earth.rotation.y += 0.001;

  matt.rotation.y += 0.01;
  matt.rotation.z += 0.01;

  controls.update;

  composer.render();
}

animate();

function moveCamera() {
  const t = document.body.getBoundingClientRect().top;

  matt.rotation.y += 0.1;
  matt.rotation.z += 1;

  camera.position.z = t * -0.01;
  camera.position.x = t * -0.0002;
  camera.position.y = t * -0.0002;
}

document.body.onscroll = moveCamera;

function onWindowResize() {

  const width = window.innerWidth;
  const height = window.innerHeight;

  camera.aspect = width / height;
  camera.updateProjectionMatrix();

  renderer.setSize( width, height );
  composer.setSize( width, height );

}

window.addEventListener( 'resize', onWindowResize );