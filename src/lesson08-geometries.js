// lesson08-geometries.js
import * as THREE from 'three';
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'; // addons is an allias for 'examples/jsm'

export default function init(canvas){
    // Scene
    const scene = new THREE.Scene();

    /**
     * Axes helper
     */
    const axesHelper = new THREE.AxesHelper(2);
    scene.add(axesHelper);

    //////////////////////////////////////////////
    ////////// Builtin geometry creation //////////
    //////////////////////////////////////////////
    const CreateBuiltinGeometry = () =>
    {
        return new THREE.Mesh(
            new THREE.SphereGeometry(1, 32, 32),
            new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true })
        )
    }

    //////////////////////////////////////////////
    ////////// Custom geometry creation //////////
    //////////////////////////////////////////////
    const CreateCustomGeometry = () =>
    {
        // For this example, we will create a simple triangle

        // create an empty BufferGeometry
        const geometry = new THREE.BufferGeometry();

        // Create a native JavaScript Float32Array to store our mesh vertices locations
        // A triangle need 3 vertices and vertex position has 3 components (x, y, z)
        const positionsArray = new Float32Array([
            0, 0, 0, // First vertex
            0, 1, 0, // Second vertex
            1, 0, 0  // Third vertex
        ]);


        // Make that array a BufferAttribute to be able to send it to the BufferGeometry
        const positionsAttribute = new THREE.BufferAttribute(positionsArray, 3); // 3 corresponds to how much values make one vertex attribute
        
        // Add this BufferAttribute to the BufferGeometry
        // The faces (here one) are automatically created following the order of the vertices
        geometry.setAttribute("position", positionsAttribute); // Three internal shaders look for name value 'position' to position the vertices

        return new THREE.Mesh(
            geometry,
            new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true })
        );
    }

    //////////////////////////////////////////////
    //////////// Geometry rendering //////////////
    //////////////////////////////////////////////
    // // Builtin geometry
    // const mesh = CreateBuiltinGeometry();

    // Custom geometry
    const mesh = CreateCustomGeometry();

    //mesh.position.x = 0;

    // Add object to the scene
    scene.add(mesh);

    // Size
    const sizes = {
        width: canvas.clientWidth,
        height: canvas.clientHeight
    };

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

    // Renderer
    const renderer = new THREE.WebGLRenderer({
        canvas: canvas
    });
    renderer.setSize(sizes.width, sizes.height);

    const resize = () => {
        const width = canvas.clientWidth
        const height = canvas.clientHeight

        renderer.setSize(width, height, false)
        camera.aspect = width / height
        camera.updateProjectionMatrix()
    }
    window.addEventListener('resize', resize)
    resize()        

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
