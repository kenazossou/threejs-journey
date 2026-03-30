// lesson14-lights.js
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'

export default function init(canvas){
    /**
     * Base
     */
    // Debug
    const gui = new GUI()

    // Scene
    const scene = new THREE.Scene()

    /**
     * Lights
     */
    // Ambient lights
    // const ambientLight = new THREE.AmbientLight(0xffffff, 1)
    const ambientLight = new THREE.AmbientLight()
    ambientLight.color = new THREE.Color(0xffffff)
    ambientLight.intensity = 1
    scene.add(ambientLight)

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
