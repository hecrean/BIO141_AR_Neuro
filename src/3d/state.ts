import * as THREE from 'three';
// import { OrbitControlsExp } from "three-stdlib";
import { initSurfaces, SurfaceHandles } from './surface';
import { initObjects, ObjectHandles } from './objects';
import { UIs, registerUi, initUiElements } from './ui';
import { AssetsCtx } from './assets';
import { interactionCache, InteractionCache } from './interaction-cache';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export type RenderCxt = {
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    gl: THREE.Renderer;
};

export const initRenderCxt = (): RenderCxt => {
    const canvasEl = document.querySelector('canvas')!;
    const gl = new THREE.WebGLRenderer({
        canvas: canvasEl,
        antialias: true,
    });
    gl.setPixelRatio(window.devicePixelRatio);

    const camera = new THREE.PerspectiveCamera();
    camera.position.z = -10;

    return {
        scene: new THREE.Scene(),
        camera: camera,
        gl,
    };
};

export type SceneGraphCtx = {
    surfaceHandles: SurfaceHandles;
    objectHandles: ObjectHandles;
    raycaster: THREE.Raycaster;
    ui: UIs;
    interactionCache: InteractionCache;
    mouse: THREE.Vector2;
};

export const initSceneGraphCtx = (assetCtx: AssetsCtx): SceneGraphCtx => {
    const sceneCtx: SceneGraphCtx = {
        objectHandles: initObjects(),
        interactionCache: interactionCache(),
        surfaceHandles: initSurfaces(),
        raycaster: new THREE.Raycaster(),
        mouse: new THREE.Vector2(),
        ui: initUiElements(assetCtx),
    };

    registerUi(sceneCtx.interactionCache, sceneCtx.ui);

    return sceneCtx;
};

// export type UserCtx = unknown;

// export const initUserCtx = () => ({});

export type UserCtx = {
    controls: OrbitControls;
};

export const initUserCtx = (camera: THREE.PerspectiveCamera, canvasEl: HTMLCanvasElement): UserCtx => {
    return {
        controls: new OrbitControls(camera, canvasEl),
    };
};

export type State = { renderCtx: RenderCxt; sceneCtx: SceneGraphCtx; userCtx: UserCtx; assetCtx: AssetsCtx };

export const initState = (
    renderCtx: RenderCxt,
    userCtx: UserCtx,
    sceneCtx: SceneGraphCtx,
    assetCtx: AssetsCtx,
): State => {
    const obj3ds = Object.values(sceneCtx.objectHandles);
    const uis = Object.values(sceneCtx.ui).map((ui) => ui.el);
    renderCtx.scene.add(...obj3ds);
    renderCtx.scene.add(...uis);

    return { renderCtx, sceneCtx, userCtx, assetCtx };
};
