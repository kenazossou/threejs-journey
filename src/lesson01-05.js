import * as THREE from 'three'
import gsap from 'gsap'

export default function init(canvas){
    // Scene
    const scene = new THREE.Scene();

    /**
     * Axes helper
     */
    const axesHelper = new THREE.AxesHelper(2);
    scene.add(axesHelper);

    const RenderCube = () =>
    {
        const cube = new THREE.Mesh(
            new THREE.BoxGeometry(1, 1, 1),
            new THREE.MeshBasicMaterial({ color: 0xff0000 })
        )
        cube.position.x = 0

        // Add object to the scene
        scene.add(cube);

        // Canvas
        const canvas = document.querySelector('canvas.webgl');

        // Size
        const sizes = {
            width: 800,
            height: 600
        };

        // Renderer
        const renderer = new THREE.WebGLRenderer({
            canvas: canvas
        });
        renderer.setSize(sizes.width, sizes.height);

        // Camera
        const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
        camera.position.z = 3;
        scene.add(camera);

        // Adjust renderer to fit canvas size
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
        const useGasp = false;
        if(useGasp)
        {
            gsap.to(cube.position, {duration:1, delay:1, x:2});
        }

        const clock = new THREE.Clock();
        const tick = () =>
        {
            if(!useGasp)
            {
                const elapsedTime = clock.getElapsedTime();
                // Update objects
                cube.rotation.y = elapsedTime;
                cube.position.x = Math.cos(elapsedTime);
                cube.position.y = Math.sin(elapsedTime);

                camera.position.x = Math.cos(elapsedTime);
                camera.position.y = Math.sin(elapsedTime);
                camera.lookAt(cube.position);
            }

            // Render
            renderer.render(scene, camera);
            // Call tick again on the next frame
            window.requestAnimationFrame(tick);
        }
        tick();
    }
    RenderCube();


    const RenderGroup = () =>
    {
        /**
         * Objects
         */
        const group = new THREE.Group()
        group.scale.y = 2
        group.rotation.y = 0.2
        scene.add(group)

        const cube1 = new THREE.Mesh(
            new THREE.BoxGeometry(1, 1, 1),
            new THREE.MeshBasicMaterial({ color: 0xff0000 })
        )
        cube1.position.x = - 1.5
        group.add(cube1)

        const cube2 = new THREE.Mesh(
            new THREE.BoxGeometry(1, 1, 1),
            new THREE.MeshBasicMaterial({ color: 0xff0000 })
        )
        cube2.position.x = 0
        group.add(cube2)

        const cube3 = new THREE.Mesh(
            new THREE.BoxGeometry(1, 1, 1),
            new THREE.MeshBasicMaterial({ color: 0xff0000 })
        )
        cube3.position.x = 1.5
        group.add(cube3)

        // Add object to the scene
        scene.add(group);

        // Size
        const sizes = {
            width: 800,
            height: 600
        };

        const resize = () => {
            const width = canvas.clientWidth
            const height = canvas.clientHeight

            renderer.setSize(width, height, false)
            camera.aspect = width / height
            camera.updateProjectionMatrix()
        }
        window.addEventListener('resize', resize)
        resize()        

        // Camera
        const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
        camera.position.z = 3;
        scene.add(camera);

        // Canvas
        const canvas = document.querySelector('canvas.webgl');

        // Renderer
        const renderer = new THREE.WebGLRenderer({
            canvas: canvas
        });
        renderer.setSize(sizes.width, sizes.height);
        renderer.render(scene, camera);
    }
    // RenderGroup();
}
