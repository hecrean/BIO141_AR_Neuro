import * as THREE from 'three';
import { registerUi, initUiElements, UIComponentHandles, UIElementHandles, initUiComponents } from './3d-ui';
import { AssetsCtx } from './assets';
import { interactionCache, InteractionCache } from './interaction-cache';
import { DirectionalLight, AmbientLight } from 'three';
import { ImageTargets } from 'image-target';
import { DragControls } from 'three/examples/jsm/controls/DragControls'


export type RenderCxt = {
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    gl: THREE.Renderer;
};

export type SceneGraphCtx = {
    raycaster: THREE.Raycaster;
    uiElementHandles: UIElementHandles;
    uiComponentHandles: UIComponentHandles;
    interactionCache: InteractionCache;
    mouse: THREE.Vector2;
};

export const initSceneGraphCtx = (assetCtx: AssetsCtx): SceneGraphCtx => {
    const uiElementHandles = initUiElements(assetCtx);
    const uiComponentHandles = initUiComponents(uiElementHandles);

    const sceneCtx: SceneGraphCtx = {
        interactionCache: interactionCache(),
        raycaster: new THREE.Raycaster(),
        mouse: new THREE.Vector2(),
        uiElementHandles: uiElementHandles,
        uiComponentHandles: uiComponentHandles,
    };

    registerUi(sceneCtx.interactionCache, sceneCtx.uiElementHandles);

    return sceneCtx;
};

export type State = { sceneCtx: SceneGraphCtx; assetCtx: AssetsCtx; renderCtx: RenderCxt; imageTargets: ImageTargets };

export const initState = (
    renderCtx: RenderCxt,
    sceneCtx: SceneGraphCtx,
    assetCtx: AssetsCtx,
    imageTargets: ImageTargets,
): State => {
    // light
    const directionalLight1 = new DirectionalLight(0xffffff, 1);
    directionalLight1.position.set(1, 4.3, 2.5);
    directionalLight1.shadow.mapSize.width = 1024;
    directionalLight1.shadow.mapSize.height = 1024;
    directionalLight1.shadow.camera.near = 0.5;
    directionalLight1.shadow.camera.far = 500;
    directionalLight1.castShadow = true;
    const ambientLight1 = new AmbientLight(0x404040, 5);
    renderCtx.scene.add(...[ambientLight1, directionalLight1]);

    // components
    renderCtx.scene.add(sceneCtx.uiComponentHandles.rootSurface.group);
    new DragControls(renderCtx.scene.children, renderCtx.camera)


    return { renderCtx, sceneCtx, assetCtx, imageTargets };
};
