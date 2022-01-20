import * as THREE from 'three';

export type ObjectHandles = { [key: string]: THREE.Object3D };

export const initObjects = (): ObjectHandles => {
    // light
    const directionalLight1 = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight1.position.set(1, 4.3, 2.5);
    directionalLight1.shadow.mapSize.width = 1024;
    directionalLight1.shadow.mapSize.height = 1024;
    directionalLight1.shadow.camera.near = 0.5;
    directionalLight1.shadow.camera.far = 500;
    directionalLight1.castShadow = true;

    const ambientLight1 = new THREE.AmbientLight(0x404040, 5);

    const cube1 = new THREE.Mesh(new THREE.BoxBufferGeometry(), new THREE.MeshStandardMaterial());
    cube1.material.color.set('red');

    return {
        directionalLight1,
        ambientLight1,
        cube1,
    };
};
