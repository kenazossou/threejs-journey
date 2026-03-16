import * as THREE from 'three';
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'; // addons is an allias for 'examples/jsm'
import * as dat from 'lil-gui'

//////////////////////////////////////////////
////////////////// Custom GUI ////////////////
const customGui = new dat.GUI({
    width: 300,
    title: 'Custom GUI',
    closeFolders : true
})
const testTweaks = customGui.addFolder('Test Tweaks');
customGui.domElement.style.position = 'fixed';
customGui.domElement.style.top = '0';
customGui.domElement.style.left = '0';
customGui.domElement.style.right = 'auto';
//////////////////////////////////////////////

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Axes helper
 */
const axesHelper = new THREE.AxesHelper(2);
scene.add(axesHelper);

/**
 * Loading image
 */
// const image = new Image();
// const texture = new THREE.Texture(image);
// texture.colorSpace = THREE.SRGBColorSpace;
// image.addEventListener('load', () =>
// {
//     texture.needsUpdate = true;
// });
// image.src = '/textures/door/color.jpg';

const loadingManager = new THREE.LoadingManager();
const textureLoader = new THREE.TextureLoader(loadingManager);
loadingManager.onStart = () =>
{
    console.log('Loading started.');
};
loadingManager.onLoad = () =>
{
    console.log('loading finished');
};
loadingManager.onProgress = () =>
{
    console.log('loading progressing');
};
loadingManager.onError = () =>
{
    console.log('loading error');
};

const colorTexture = textureLoader.load('/textures/checkerboard-1024x1024.png');
colorTexture.colorSpace = THREE.SRGBColorSpace;
const alphaTexture = textureLoader.load('/textures/door/alpha.jpg');
const heightTexture = textureLoader.load('/textures/door/height.jpg');
const normalTexture = textureLoader.load('/textures/door/normal.jpg');
const ambientOcclusionTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg');
const metalnessTexture = textureLoader.load('/textures/door/metalness.jpg');
const roughnessTexture = textureLoader.load('/textures/door/roughness.jpg');

/**
 * Transforming texture
 */
colorTexture.repeat.x = 1;
colorTexture.repeat.y = 1;
colorTexture.wrapS = THREE.MirroredRepeatWrapping;
colorTexture.wrapT = THREE.MirroredRepeatWrapping;
colorTexture.offset.x = 0;
colorTexture.offset.y = 0;
testTweaks.add(colorTexture.offset, 'x')
.min(0)
.max(1)
.step(0.1)
.name('x offset');
testTweaks.add(colorTexture.offset, 'y')
.min(0)
.max(1)
.step(0.1)
.name('y offset');
colorTexture.generateMipmaps = false;
colorTexture.minFilter = THREE.NearestFilter;
colorTexture.magFilter = THREE.NearestFilter;


/**
 * Object
 */
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({map: colorTexture});
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);
console.log(geometry.attributes.uv);

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
};

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    // Update camera
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    // Update renderer
    renderer.setSize(sizes.width,  sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.x = 1;
camera.position.y = 1;
camera.position.z = 1;
scene.add(camera);

// Controls
// We pass in our camera as the camera we need to control
// and our canvas for the domElement of which we listen mouse events for
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime();

    // Update controls
    controls.update();

    // Render
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
};

tick();