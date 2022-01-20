import * as THREE from 'three';
import { initSurfaces, SurfaceHandles } from './surface';
import { initObjects, ObjectHandles } from './objects';
import { UIs, registerUi, initUiElements } from './ui';
import { AssetsCtx } from './assets';
import { interactionCache, InteractionCache } from './interaction-cache';

export type RenderCxt = {
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    gl: THREE.Renderer;
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

export type State = { sceneCtx: SceneGraphCtx; assetCtx: AssetsCtx; renderCtx: RenderCxt };

export const initState = (renderCtx: RenderCxt, sceneCtx: SceneGraphCtx, assetCtx: AssetsCtx): State => {
    const obj3ds = Object.values(sceneCtx.objectHandles);
    const uis = Object.values(sceneCtx.ui).map((ui) => ui.el);
    const surfaceMeshes = Object.values(sceneCtx.surfaceHandles).map((s) => s.surfaceMesh);
    renderCtx.scene.add(...obj3ds);
    renderCtx.scene.add(...uis);
    renderCtx.scene.add(...surfaceMeshes);

    return { renderCtx, sceneCtx, assetCtx };
};
