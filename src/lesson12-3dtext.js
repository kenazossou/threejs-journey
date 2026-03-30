// lesson12-3dtext.js
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import GUI from 'lil-gui';
import {FontLoader} from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'

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
    const matcapTexture = textureLoader.load('./textures/matcaps/8.png');
    matcapTexture.colorSpace = THREE.SRGBColorSpace;

    // /**
    //  * Object
    //  */
    // const cube = new THREE.Mesh(
    //     new THREE.BoxGeometry(1, 1, 1),
    //     new THREE.MeshBasicMaterial()
    // )
    // scene.add(cube)

    /**
     * Fonts
     */
    const fontLoader = new FontLoader();
    fontLoader.load('./fonts/helvetiker_regular.typeface.json',
        (font) =>
        {
            console.log('Loaded !');
            const textGeometry = new TextGeometry(
                'Hello Three.js',
                {
                    font: font,
                    size: 0.5,
                    depth: 0.2,
                    curveSegment: 12,
                    bevelEnabled: true,
                    bevelThickness: 0.03,
                    bevelSize: 0.02,
                    bevelOffset: 0,
                    bevelSegments: 5
                }
            );

            // Material shared by the text and the donuts
            const material = new THREE.MeshMatcapMaterial({matcap: matcapTexture});

            const text = new THREE.Mesh(textGeometry, material);
            scene.add(text);

            // // Center the text
            // textGeometry.computeBoundingBox();
            // const textGeometryBoundingBox = textGeometry.boundingBox;
            // textGeometry.translate(
            //     -(textGeometryBoundingBox.max.x - 0.02) * 0.5, // Substract the bevel size
            //     -(textGeometryBoundingBox.max.y - 0.02)* 0.5, // Substract the bevel size
            //     -(textGeometryBoundingBox.max.z - 0.03) * 0.5 // Substract the bevel thickness
            // )
            // Centering can also been perform simply like this
            textGeometry.center();

            const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 20, 45);
            for(let i= 0; i < 100; i++)
            {
                const donut = new THREE.Mesh(donutGeometry, material);
                scene.add(donut);

                // Set rendom positions
                donut.position.x = (Math.random() - 0.5) * 30;
                donut.position.y = (Math.random() - 0.5) * 30;
                donut.position.z = (Math.random() - 0.5) * 30;
                // Set random rotations
                donut.rotation.x = Math.random() * Math.PI;
                donut.rotation.y = Math.random() * Math.PI;
                // Set random scales
                const scale =  Math.random();
                donut.scale.set(scale, scale, scale);
            }
            
            const cubeGeometry = new THREE.BoxGeometry();
            for(let i= 0; i < 100; i++)
            {
                const donut = new THREE.Mesh(cubeGeometry, material);
                scene.add(donut);

                // Set rendom positions
                donut.position.x = (Math.random() - 0.5) * 30;
                donut.position.y = (Math.random() - 0.5) * 30;
                donut.position.z = (Math.random() - 0.5) * 30;
                // Set random rotations
                donut.rotation.x = Math.random() * Math.PI;
                donut.rotation.y = Math.random() * Math.PI;
                // Set random scales
                const scale =  Math.random();
                donut.scale.set(scale, scale, scale);
            }

            const coneGeometry = new THREE.ConeGeometry();
            for(let i= 0; i < 100; i++)
            {
                const donut = new THREE.Mesh(coneGeometry, material);
                scene.add(donut);

                // Set rendom positions
                donut.position.x = (Math.random() - 0.5) * 30;
                donut.position.y = (Math.random() - 0.5) * 30;
                donut.position.z = (Math.random() - 0.5) * 30;
                // Set random rotations
                donut.rotation.x = Math.random() * Math.PI;
                donut.rotation.y = Math.random() * Math.PI;
                // Set random scales
                const scale =  Math.random();
                donut.scale.set(scale, scale, scale);
            }

            const capsuleGeometry = new THREE.CapsuleGeometry();
            for(let i= 0; i < 100; i++)
            {
                const donut = new THREE.Mesh(capsuleGeometry, material);
                scene.add(donut);

                // Set rendom positions
                donut.position.x = (Math.random() - 0.5) * 30;
                donut.position.y = (Math.random() - 0.5) * 30;
                donut.position.z = (Math.random() - 0.5) * 30;
                // Set random rotations
                donut.rotation.x = Math.random() * Math.PI;
                donut.rotation.y = Math.random() * Math.PI;
                // Set random scales
                const scale =  Math.random();
                donut.scale.set(scale, scale, scale);
            }
        }
    );


    /**
     * Sizes
     */
    // Size
    const sizes = {
        width: canvas.clientWidth,
        height: canvas.clientHeight
    };

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

        // Update controls
        controls.update()

        // Render
        renderer.render(scene, camera)

        // Call tick again on the next frame
        window.requestAnimationFrame(tick)
    }

    tick()
}
