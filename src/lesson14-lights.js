// lesson14-lights.js
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper.js';
import GUI from 'lil-gui'

export default function init(canvas){
    /**
     * Base
     */
    // Debug
    const gui = new GUI()
    const lightTweaks = gui.addFolder('Light Tweaks');

    const ui = document.querySelector('.ui');
    ui.appendChild(gui.domElement);

    // Scene
    const scene = new THREE.Scene()

    /**
     * Axes helper
     */
    const axesHelper = new THREE.AxesHelper(1);
    scene.add(axesHelper);


    /**
     * Lights
     */

    // AmbientLight : Omnidirectional light on all geometries in the scene. All faces of the geometries are lit equally.
    // Alone it has the same effect as MeshBasicMaterial.
    // const ambientLight = new THREE.AmbientLight(0xffffff, 1)
    const ambientLight = new THREE.AmbientLight()
    ambientLight.color = new THREE.Color(0xffffff)
    ambientLight.intensity = 1
    scene.add(ambientLight)
    lightTweaks.add(ambientLight, 'intensity').name("AmbientLight intensity").min(0).max(3).step(0.001); 

    // ADDING OTHER LIGHTS TO AMBIENTLIGHT MAKE THE SCENE MORE INTERSTING
    
    // DirectionalLight: Sun like light where rays act like they are travelling in parallel
    const directionalLight = new THREE.DirectionalLight(0x00fffc, 0.9)
    scene.add(directionalLight)
    // By default the light comes from above. change its position to make it light from another position
    directionalLight.position.set(1, 0.25, 0);
    lightTweaks.add(directionalLight, 'intensity').name('DirectionalLight intensity').min(0).max(3).step(0.001); 
    const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 0.2);
    scene.add(directionalLightHelper);

    // HemisphereLight: Like Ambient light but one color comes from the sky and another form the ground
    const hemisphereLight = new THREE.HemisphereLight(0xff0000, 0x0000ff, 0.9);
    scene.add(hemisphereLight)
    lightTweaks.add(hemisphereLight, 'intensity').name('HemisphereLight intensity').min(0).max(3).step(0.001); 
    const hemisphereLightHelper = new THREE.HemisphereLightHelper(hemisphereLight, 0.2);
    scene.add(hemisphereLightHelper);

    // PointLight: Act like a lighter (briquet in french)
    // The third parameter is the distance which default value is 0, meaning infinite distance impact
    // The second parameter is the decay. The lower the decay, the faster the light will decay. Its default value is 2
    const pointLight = new THREE.PointLight(0xff9000, 1.5, 0, 2);
    pointLight.position.set(1, - 0.5, 1);
    scene.add(pointLight);
    lightTweaks.add(pointLight, 'intensity').name('PointLight intensity').min(0).max(3).step(0.001); 
    const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.2);
    scene.add(pointLightHelper);

    // RectAreaLight: It's like the big rectangle lights used on photoshoot set. It acts like a directional light and a diffuse light
    const rectAreaLight = new THREE.RectAreaLight(0x4e00ff, 6, 1, 1); 
    scene.add(rectAreaLight);
    rectAreaLight.position.set(-1.5, 0, 1.5);
    rectAreaLight.lookAt(new THREE.Vector3()); // Look at the center of the scene
    lightTweaks.add(rectAreaLight, 'intensity').name('RectAreaLight intensity').min(0).max(3).step(0.001); 
    const rectAreaLightHelper = new RectAreaLightHelper(rectAreaLight);
    scene.add(rectAreaLightHelper);

    // SpotLight: It acts like a flash light. It's a cone starting at a point and oriented in a direction
    const spotLight = new THREE.SpotLight(0x78ff00, 4.5, 10, Math.PI * 0.1, 0.25, 1);
    spotLight.position.set(0, 2, 3);
    spotLight.target.position.x = - 0.75;
    scene.add(spotLight.target);
    scene.add(spotLight);
    lightTweaks.add(spotLight, 'intensity').name('SpotLight intensity').min(0).max(3).step(0.001); 
    const spotLightHelper = new THREE.SpotLightHelper(spotLight);
    scene.add(spotLightHelper);

    /**
     * Objects
     */
    // Material
    const material = new THREE.MeshStandardMaterial()
    material.roughness = 0.4

    // Objects
    const sphere = new THREE.Mesh(
        new THREE.SphereGeometry(0.5, 32, 32),
        material
    )
    sphere.position.x = - 1.5

    const cube = new THREE.Mesh(
        new THREE.BoxGeometry(0.75, 0.75, 0.75),
        material
    )

    const torus = new THREE.Mesh(
        new THREE.TorusGeometry(0.3, 0.2, 32, 64),
        material
    )
    torus.position.x = 1.5

    const plane = new THREE.Mesh(
        new THREE.PlaneGeometry(5, 5),
        material
    )
    plane.rotation.x = - Math.PI * 0.5
    plane.position.y = - 0.65

    scene.add(sphere, cube, torus, plane)

    /**
     * Sizes
     */
    // Size
    const sizes = {
        width: canvas.clientWidth,
        height: canvas.clientHeight
    };
    console.log("Canvas client width: " + canvas.clientWidth);
    console.log("Canvas client height: " + canvas.clientHeight);

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

    const resize = () => {
    const width = canvas.clientWidth
    const height = canvas.clientHeight

    renderer.setSize(width, height, false)
    camera.aspect = width / height
    camera.updateProjectionMatrix()
    }
    window.addEventListener('resize', resize)
    resize()        

    /**
     * Animate
     */
    const clock = new THREE.Clock()

    const tick = () =>
    {
        const elapsedTime = clock.getElapsedTime()

        // Update objects
        sphere.rotation.y = 0.1 * elapsedTime
        cube.rotation.y = 0.1 * elapsedTime
        torus.rotation.y = 0.1 * elapsedTime

        sphere.rotation.x = 0.15 * elapsedTime
        cube.rotation.x = 0.15 * elapsedTime
        torus.rotation.x = 0.15 * elapsedTime

        // Update controls
        controls.update()

        // Render
        renderer.render(scene, camera)

        // Call tick again on the next frame
        window.requestAnimationFrame(tick)
    }

    tick()
}
