import * as THREE from 'three';
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'; // addons is an allias for 'examples/jsm'

// Scene
const scene = new THREE.Scene();

/**
 * Axes helper
 */
const axesHelper = new THREE.AxesHelper(2);
scene.add(axesHelper);

const RenderCube = () =>
{
    const mesh = new THREE.Mesh(
        new THREE.BoxGeometry(1, 1, 1),
        new THREE.MeshBasicMaterial({ color: 0xff0000 })
    )
    mesh.position.x = 0

    // Add object to the scene
    scene.add(mesh);

    // Canvas
    const canvas = document.querySelector('canvas.webgl');

    // Size
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

    window.addEventListener('keydown', (event) =>
    {
        const fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement;
        if(event.key.toLowerCase() === 'f')
        {
            if(!fullscreenElement)
            {
                if(canvas.requestFullscreen)
                {
                    canvas.requestFullscreen();
                }
                else if(canvas.webkitRequestFullscreen)
                {
                    canvas.webkitRequestFullscreen();
                }
            }
            else
            {
                if(document.exitFullscreen)
                {
                    document.exitFullscreen();
                }
                else if(document.webkitExitFullscreen)
                {
                    document.webkitExitFullscreen();
                }
            }
        }
    });

    const aspectRatio = sizes.width / sizes.height;

    // Perspective Camera
    const camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 1000);
    // // Orthographic Camera
    // const camera = new THREE.OrthographicCamera(-1 * aspectRatio, 1 * aspectRatio, 1, -1, 0.1, 100);
    camera.position.z = 3;
    camera.lookAt(mesh.position);
    scene.add(camera);

    // Controls
    // We pass in our camera as the camera we need to control
    // and our canvas for the domElement of which we listen mouse events for
    const controls = new OrbitControls(camera, canvas);
    controls.enableDamping = true;

    //Cursor
    const cursor = {
        x: 0,
        y: 0
    };

    window.addEventListener('mousemove', (event) =>
    {
        cursor.x = event.clientX / sizes.width - 0.5;
        cursor.y = - (event.clientY / sizes.height - 0.5);
    });

    // Renderer
    const renderer = new THREE.WebGLRenderer({
        canvas: canvas
    });
    renderer.setSize(sizes.width, sizes.height);

    const tick = () =>
    {
        // Camera controls : OrbitControls

        // Update controls: this is needed for the damping to work well
        controls.update();

        // Render
        renderer.render(scene, camera);
        // Call tick again on the next frame
        window.requestAnimationFrame(tick);
    }
    tick();
}
RenderCube();
