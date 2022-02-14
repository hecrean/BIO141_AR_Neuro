import { Group, Raycaster, Vector2} from 'three';
import { parseLayout, initLayout } from '3d-ui/3d-layout';
import {initUiElements, UIElementHandles } from './3d-ui/element-factory'
import { AssetsCtx } from './assets';
import { interactionCache, InteractionCache, interactionCacheApi } from './interaction-cache';
import { DirectionalLight, AmbientLight } from 'three';
import { ImageTargets } from 'image-target';


export type RenderCxt = {
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    gl: THREE.Renderer;
};

export type SceneGraphCtx = {
    raycaster: THREE.Raycaster;
    uiElementHandles: UIElementHandles;
    uiComponentHandles: Map<string, Group>;
    interactionCache: InteractionCache;
    mouse: THREE.Vector2;
};

export const initSceneGraphCtx = (assetCtx: AssetsCtx): SceneGraphCtx => {
    const uiElementHandles = initUiElements(assetCtx);
    const layout = initLayout(uiElementHandles)
    const uiComponentHandles = parseLayout(layout)
    
    const sceneCtx: SceneGraphCtx = {
        interactionCache: interactionCache(),
        raycaster: new Raycaster(),
        mouse: new Vector2(),
        uiElementHandles: uiElementHandles,
        uiComponentHandles: uiComponentHandles,
    };

    const registerUi = (cache: InteractionCache, uiElHandles: UIElementHandles): void => {
        Object.values(uiElHandles).map((handle) => interactionCacheApi.register(cache, handle.mesh, handle.api));
    };
    
    registerUi(sceneCtx.interactionCache, sceneCtx.uiElementHandles);

    return sceneCtx;
};

export type UserInput = {
    stage: 
    | {tag: 'image-target-not-yet-seen'}
    | {tag: 'initial-animation-sequence'}
    | {tag: 'post-initial-animation-sequence'}
    videoFocusState: 
    | {tag: 'aurora-app-focused'}
    | {tag:'edward-introduction-focused'}
    | {tag:'none-focused'};
    neuronRotationDirection: -1 | 1
    neuronRotating: boolean;
}

export const initUserInput = (): UserInput => ({
    stage: { tag: 'image-target-not-yet-seen'},
    videoFocusState: {tag:'none-focused'},
    neuronRotationDirection: 1,
    neuronRotating: true,
})

export type State = { 
    sceneCtx: SceneGraphCtx; 
    assetCtx: AssetsCtx; 
    renderCtx: RenderCxt; 
    imageTargets: ImageTargets;
    userInput: UserInput;
};

export const initState = (
    renderCtx: RenderCxt,
    sceneCtx: SceneGraphCtx,
    assetCtx: AssetsCtx,
    imageTargets: ImageTargets,
    userInput: UserInput
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
    const root = sceneCtx.uiComponentHandles.get('rootSurface');
    if (root) {
        root.visible = false;
        renderCtx.scene.add(root)
    }


    return { renderCtx, sceneCtx, assetCtx, imageTargets, userInput };
};
