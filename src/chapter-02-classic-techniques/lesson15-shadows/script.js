// lesson15-shadows.js
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import { directPointLight } from 'three/src/nodes/lighting/PointLightNode.js'

const baseUrl = import.meta.env.BASE_URL;

export default function init(canvas){
    /**
     * Base
     */
    // Debug
    const gui = new GUI()

    // Scene
    const scene = new THREE.Scene()

    /**
     * Axes helper
     */
    const axesHelper = new THREE.AxesHelper(1);
    scene.add(axesHelper);

    /**
     * Textures
     */
    const textureLoader = new THREE.TextureLoader();
    const bakedShadow = textureLoader.load(baseUrl + 'textures/bakedShadow.jpg');
    bakedShadow.colorSpace = THREE.SRGBColorSpace;
    const simpleShadow = textureLoader.load(baseUrl + 'textures/simpleShadow.jpg');

    /**
     * Lights
     */
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
    gui.add(ambientLight, 'intensity').min(0).max(3).step(0.001)
    scene.add(ambientLight)

    // Directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.1)
    directionalLight.position.set(2, 2, - 1)
    gui.add(directionalLight, 'intensity').min(0).max(3).step(0.001)
    gui.add(directionalLight.position, 'x').min(- 5).max(5).step(0.001)
    gui.add(directionalLight.position, 'y').min(- 5).max(5).step(0.001)
    gui.add(directionalLight.position, 'z').min(- 5).max(5).step(0.001)
    scene.add(directionalLight)
    directionalLight.castShadow = true;
    console.log(directionalLight.shadow);
    directionalLight.shadow.mapSize.width = 1024; // By default, the shadow map size is only 512x512 for performance reasons
    directionalLight.shadow.mapSize.height = 1024;

    // Change directional light shadow camera near and far
    directionalLight.shadow.camera.near = 1;
    directionalLight.shadow.camera.far = 6;
    // Change directional light shadow
    directionalLight.shadow.camera.top = 2;
    directionalLight.shadow.camera.right = 2;
    directionalLight.shadow.camera.bottom = - 2;
    directionalLight.shadow.camera.left = - 2;
    // Control shadow blur with shadow radius property
    directionalLight.shadow.radius = 10;
    // Add camera helper for directional shadow camera
    const directionalLightCameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
    scene.add(directionalLightCameraHelper);
    // Hide the camera helper once we've done
    directionalLightCameraHelper.visible = false;

    // Spot light
    const spotLight = new THREE.SpotLight(0Xffffff, 2.4, 10, Math.PI * 0.3);
    spotLight.castShadow = true;
    spotLight.position.set(0, 2, 2);
    spotLight.shadow.mapSize.width = 1024;
    spotLight.shadow.mapSize.height = 1024;
    spotLight.shadow.camera.near = 1;
    spotLight.shadow.camera.far = 6;
    scene.add(spotLight);
    scene.add(spotLight.target);
    const spotlightCameraHelper = new THREE.CameraHelper(spotLight.shadow.camera);
    scene.add(spotlightCameraHelper);
    spotlightCameraHelper.visible = false;

    // Point light
    const pointLight = new THREE.PointLight(0xffffff, 2.7);
    pointLight.castShadow = true;
    pointLight.shadow.mapSize.width = 1024;
    pointLight.shadow.mapSize.height = 1024;
    pointLight.shadow.camera.near = 0.1;
    pointLight.shadow.camera.far = 5;
    pointLight.position.set(-1, 1, 0);
    scene.add(pointLight);

    const pointLightCameraHelper = new THREE.CameraHelper(pointLight.shadow.camera);
    scene.add(pointLightCameraHelper);
    pointLightCameraHelper.visible = false;

    /**
     * Materials
     */
    const material = new THREE.MeshStandardMaterial()
    material.roughness = 0.7
    gui.add(material, 'metalness').min(0).max(1).step(0.001)
    gui.add(material, 'roughness').min(0).max(1).step(0.001)

    /**
     * Objects
     */
    const sphere = new THREE.Mesh(
        new THREE.SphereGeometry(0.5, 32, 32),
        material
    )
    sphere.castShadow = true;

    const plane = new THREE.Mesh(
        new THREE.PlaneGeometry(5, 5),
        material
    )
    // // Load bakedShadow map
    // const plane = new THREE.Mesh(
    //     new THREE.PlaneGeometry(5, 5),
    //     new THREE.MeshBasicMaterial({
    //         map: bakedShadow
    //     })
    // )
    plane.rotation.x = -Math.PI * 0.5;
    plane.position.y = -0.5;
    plane.receiveShadow = true;

    // Load simpleShadow map
    const sphereShadow = new THREE.Mesh(
        new THREE.PlaneGeometry(1.5, 1.5),
        new THREE.MeshBasicMaterial({
            color: 0x000000,
            transparent: true,
            alphaMap: simpleShadow
        })
    );
    sphereShadow.rotation.x = -Math.PI * 0.5;
    sphereShadow.position.y = plane.position.y + 0.01;

    scene.add(sphere, sphereShadow, plane);

    /**
     * Sizes
     */
    const sizes = {
        width: window.innerWidth,
        height: window.innerHeight
    }

    window.addEventListener('resize', () =>
    {
        // Update sizes
        sizes.width = window.innerWidth
        sizes.height = window.innerHeight

        // Update camera
        camera.aspect = sizes.width / sizes.height
        camera.updateProjectionMatrix()

        // Update renderer
        renderer.setSize(sizes.width, sizes.height)
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    })

    /**
     * Camera
     */
    // Base camera
    const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
    camera.position.x = 1
    camera.position.y = 1
    camera.position.z = 2
    scene.add(camera)

    // Controls
    const controls = new OrbitControls(camera, canvas)
    controls.enableDamping = true

    /**
     * Renderer
     */
    const renderer = new THREE.WebGLRenderer({
        canvas: canvas
    })
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    // renderer.shadowMap.enabled = true;
    
    //Different types of algorithms can be applied to shadow maps, each one with its specific behavior, cons and pro
    // renderer.shadowMap.type = THREE.BasicShadowMap; // Very performant but lousy quality
    // renderer.shadowMap.type = THREE.PCFShadowMap; // Less performant but smoother edges
    // renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Less performant but even softer edges
    renderer.shadowMap.type = THREE.VSMShadowMap; // Less performant, more constraints, can have unexpected results

    /**
     * Animate
     */
    const clock = new THREE.Clock()

    const tick = () =>
    {
        const elapsedTime = clock.getElapsedTime()

        // Animate the sphere and sphereShadown accordingly
        // Update the sphere
        sphere.position.x = Math.cos(elapsedTime) * 1.5
        sphere.position.z = Math.sin(elapsedTime) * 1.5
        sphere.position.y = Math.abs(Math.sin(elapsedTime * 3))

        // Update the shadow
        sphereShadow.position.x = sphere.position.x
        sphereShadow.position.z = sphere.position.z
        sphereShadow.material.opacity = (1 - sphere.position.y) * 0.3

        // Update controls
        controls.update()

        // Render
        renderer.render(scene, camera)

        // Call tick again on the next frame
        window.requestAnimationFrame(tick)
    }

    tick()
}

const canvas = document.querySelector('canvas.webgl')
if (canvas) {
    init(canvas)
}
