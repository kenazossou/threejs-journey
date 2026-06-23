import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'

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
    const particleTexture = textureLoader.load(baseUrl + 'textures/particles/2.png');

    /**
     * Particles
     */
    // Geometry
    const particlesGeometry = new THREE.BufferGeometry();
    const count = 500000;

    const positions = new Float32Array(count * 3); // Multiply by 3 because each position is composed of 3 values (x, y, z)
    const colors = new Float32Array(count * 3);

    for(let i = 0; i < count * 3; i++) // Multiply by 3 for the same reason
    {
        positions[i] = (Math.random() - 0.5) * 10; // Math.random() - 0.5 to have a random value between -0.5 and +0.()
        colors[i] = Math.random();
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3)); // Create the Three.js BufferAttribute and specify that each information is composed of 3 values
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Material
    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.02,
        sizeAttenuation: true
    })
    //particlesMaterial.color = new THREE.Color('#ff88cc'); // Comment the main color to get the actual color set to vertex colors.
    //particlesMaterial.map = particleTexture;
    particlesMaterial.transparent = true;
    particlesMaterial.alphaMap = particleTexture;
    //particlesMaterial.alphaTest = 0.001;
    //particlesMaterial.depthTest = false;
    particlesMaterial.depthWrite = false;
    particlesMaterial.blending = THREE.AdditiveBlending;
    particlesMaterial.vertexColors = true;

    // Points
    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);

    /**
     * Lights
     */
    // Ambient light
    const ambientLight = new THREE.AmbientLight('#ffffff', 0.5)
    scene.add(ambientLight)

    // Directional light
    const directionalLight = new THREE.DirectionalLight('#ffffff', 1.5)
    directionalLight.position.set(3, 2, -8)
    scene.add(directionalLight)

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
    camera.position.x = 4
    camera.position.y = 2
    camera.position.z = 5
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

    /**
     * Animate
     */
    const timer = new THREE.Timer()

    const tick = () =>
    {
        // Timer
        timer.update()
        const elapsedTime = timer.getElapsed()

        // // Update particles. Animate the whole particles set once as a unique mesh object
        // particles.rotation.y = elapsedTime * 0.2;

        // Loop through vertices
        for(let i = 0; i < count; i++)
        {
            const i3 = i * 3;
             
            // The position attribute is a one dimension array where the first 3 values correspond to the x, y and z coordinates of the first vertex, then the next 3 values correspond to the x, y and z of the second vertex.

            // We have to go through it 3 by 3 and only update the first value (offset 0) to get x coordinate of each vertex.
            const x = particlesGeometry.attributes.position.array[i3];

            // We have to go through it 3 by 3 and only update the second (offset 1) value to move each on the y coordinate.
            particlesGeometry.attributes.position.array[i3 + 1] = Math.sin(elapsedTime + x); // We need to add the x coordinate as offset to get a wave like movement. Otherwise all vertex move with the same y coordinate, which results in a plane moving up down
        }

        // Set the needsUpdate to true on the position to notify Three.js that geometry changed
        particlesGeometry.attributes.position.needsUpdate = true;

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
