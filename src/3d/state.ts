import * as THREE from 'three';
import { initVideoSurfaces, VideoSurfaceHandles } from './video-surface';
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
    videoSurfaceHandles: VideoSurfaceHandles;
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
        videoSurfaceHandles: initVideoSurfaces(),
        raycaster: new THREE.Raycaster(),
        mouse: new THREE.Vector2(),
        ui: initUiElements(assetCtx),
    };

    registerUi(sceneCtx.interactionCache, sceneCtx.ui);

    return sceneCtx;
};

export type State = { sceneCtx: SceneGraphCtx; assetCtx: AssetsCtx; renderCtx: RenderCxt };

export const initState = (renderCtx: RenderCxt, sceneCtx: SceneGraphCtx, assetCtx: AssetsCtx): State => {
    // obj3d / ui / surfaces are all meshes... We're just semantically differentiating them
    // for convenience. obj3d are regular ol' shapes. Ui are things like 3d buttons etc. Surfaces
    // have inbuilt image target functionality.
    const obj3ds = Object.values(sceneCtx.objectHandles);
    const uis = Object.values(sceneCtx.ui).map((ui) => ui.el);
    const videoSurfaceMeshes = Object.values(sceneCtx.videoSurfaceHandles).map((s) => s.surfaceMesh);
    renderCtx.scene.add(...obj3ds);
    renderCtx.scene.add(...uis);
    renderCtx.scene.add(...videoSurfaceMeshes);

    return { renderCtx, sceneCtx, assetCtx };
};
