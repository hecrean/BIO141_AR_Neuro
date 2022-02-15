import './style.css';
import { textureBundle, gltfBundle } from './assets/asset-bundles';
import { AssetsCtx, initAssetCtx, loadAssetBundle } from './assets';
import type { CameraPipelineModule, XR8 as XR8Type, XRExtras as XRExtrasType } from './type';
import {
    ImageTargets,
    initImageTargets,
    onImageFoundListener,
    onImageLostListener,
    onImageUpdatedListener,
} from './image-target';
import { initSceneGraphCtx, RenderCxt, initState, State, SceneGraphCtx, initUserInput, UserInput } from './state';
import { input$, Input, interpreter } from './events/canvas';
import { api as raycasterApi } from './raycaster';
import { Vector3, Quaternion } from 'three';
import { PIXEL} from './3d-ui/element-factory'


declare const XR8: XR8Type;
declare const XRExtras: XRExtrasType;

// Iphone welcome / prompt for permission styling :
let inDom = false;
const observer = new MutationObserver(() => {
    if (document.querySelector('.prompt-box-8w')) {
        if (!inDom) {
            document.querySelector(
                '.prompt-box-8w p',
            )!.innerHTML = /*html*/ `<strong> A Random42 experience </strong><br/><br/>Press Approve to continue.`;
            document.querySelector('.prompt-button-8w')!.innerHTML = /*html*/ `Deny`;
            document.querySelector('.button-primary-8w')!.innerHTML = /*html*/ `Approve`;
        }
        inDom = true;
    } else if (inDom) {
        inDom = false;
        if(document.querySelector('.overlay-heading')){
            document.querySelector('.overlay-heading')!.innerHTML = /*html*/ `
            <h1> Biogen Switzerland AG <h1>
            `
        }

        observer.disconnect();
    }
});
observer.observe(document.body, { childList: true });


// Input to Output Mapping
const responseToInput = (input: Input, state: State) => {
    const { threeEvent } = raycasterApi;
    const intersectionEvts = threeEvent(input.canvasEvent)(state.sceneCtx)(state.renderCtx);
    return interpreter(state, intersectionEvts[0]);
};

/// ArPipelineModule :
const ArPipelineModule = (
    sceneCxt: SceneGraphCtx,
    assetCtx: AssetsCtx,
    imageTargets: ImageTargets,
    userInput: UserInput
): CameraPipelineModule => {
    // define variables


    return {
        // Pipeline modules need a name.
        name: 'ar-pipeline',

        // onStart is called once when the camera feed begins. In this case, we need to wait for the
        // XR8.Threejs scene to be ready before we can access it to add content. It was created in
        // XR8.Threejs.pipelineModule()'s onStart method.
        onStart: (
            {
                /*canvas, canvasWidth, canvasHeight*/
            },
        ) => {
            const { scene, camera, renderer } = XR8.Threejs.xrScene(); // Get the 3js sceen from xr3js.

            const renderCtx: RenderCxt = { scene, camera, gl: renderer };

            const state = initState(renderCtx, sceneCxt, assetCtx, imageTargets, userInput);


            input$.subscribe((input) => responseToInput(input, state));

            // Add objects to the scene and set starting camera position.

            XR8.XrController.configure({
                imageTargets: ['qrcode'],
            });

            // Sync the xr controller's 6DoF position and camera paremeters with our scene.
            XR8.XrController.updateCameraProjectionMatrix({
                origin: camera.position,
                facing: camera.quaternion,
            });
        },

        // onUpdate is called once per camera loop prior to render. Any 3js geometry scene would
        // typically happen here.
        onUpdate: () => {
            // Update the position of objects in the scene, etc.
            const {
                /*camera, scene , renderer, cameraTexture*/
            } = XR8.Threejs.xrScene();


            switch(userInput.videoFocusState.tag){
                
                case 'aurora-app-focused': {
                    const auroraVidPanel = sceneCxt.uiComponentHandles.get('auroraVideoPanel')

                    if (auroraVidPanel) {
                        auroraVidPanel.position.lerp(new Vector3(0,0,1), 0.5)
                        auroraVidPanel.scale.lerp(new Vector3(2,2,2), 0.5)
                    }
                    break;
                }
                case 'edward-introduction-focused': {
                    const edwardVidPane = sceneCxt.uiComponentHandles.get('edwardWelcomeVideoPanel')
                    if (edwardVidPane) {
                        edwardVidPane.position.lerp(new Vector3(0,0,1), 0.5)
                        edwardVidPane.scale.lerp(new Vector3(2,2,2), 0.5)
                    }    
                    break;
                }            
                case 'none-focused': {
                    const auroraVidPanel = sceneCxt.uiComponentHandles.get('auroraVideoPanel')
                    if (auroraVidPanel) {
                        auroraVidPanel.position.lerp(new Vector3(950 * PIXEL, -1400 * PIXEL, 0), 0.1)
                        auroraVidPanel.scale.lerp(new Vector3(1,1,1), 0.5)
                    }
                    const edwardVidPane = sceneCxt.uiComponentHandles.get('edwardWelcomeVideoPanel')
                    if (edwardVidPane) {
                        edwardVidPane.position.lerp(new Vector3(-950 * PIXEL, -1400 * PIXEL, 0), 0.1)
                        edwardVidPane.scale.lerp(new Vector3(1,1,1), 0.5)
                    }    

                    break;
                }
            }

            const root = sceneCxt.uiComponentHandles.get('rootSurface');
            switch(userInput.stage.tag){
                case 'image-target-not-yet-seen': {

                    break;
                }
                case 'initial-animation-sequence': {

                    // - opacity 0 -> 100%
                    // - rotation of neuron 0 -> 100%
                    // - elements start from centre, and organise themselves around neuron

                    if (root) {
                        const LERP_RATE = 0.05;
                        const { x, y, z } = imageTargets['qrcode'].transform.position;
                        const { x: q1, y: q2, z: q3, w: q4 } = imageTargets['qrcode'].transform.rotation;
                        root.position.lerp(new Vector3(x, y, z), LERP_RATE);
                        root.quaternion.slerp(new Quaternion(q1, q2, q3, q4), LERP_RATE);
                        const scale = imageTargets['qrcode'].transform.scale;
                        root.scale.lerp(new Vector3(scale, scale, scale), LERP_RATE);
                       
                    }

                     //rotate model
                     const neuronHandle = sceneCxt.uiElementHandles.neuronModel;
                     const ROTATION_RATE = (0.2 * 2 * Math.PI * 1) / 60;
                     if(userInput.neuronRotating){
                        neuronHandle.mesh.rotateY(userInput.neuronRotationDirection * ROTATION_RATE);
                     }


                
                    break;
                }
                case 'post-initial-animation-sequence': {

                    // lerp plane to tracked image target
                    if (root) {
         
                        const LERP_RATE = 0.4;
                        const { x, y, z } = imageTargets['qrcode'].transform.position;
                        const { x: q1, y: q2, z: q3, w: q4 } = imageTargets['qrcode'].transform.rotation;
                        root.position.lerp(new Vector3(x, y, z), LERP_RATE);
                        root.quaternion.slerp(new Quaternion(q1, q2, q3, q4), LERP_RATE);
                        const scale = imageTargets['qrcode'].transform.scale;
                        root.scale.lerp(new Vector3(scale, scale, scale), LERP_RATE);
                    }


                    //rotate model
                    const neuronHandle = sceneCxt.uiElementHandles.neuronModel;
                    const ROTATION_RATE = (0.2 * 2 * Math.PI * 1) / 60;
                    if(userInput.neuronRotating){
                        neuronHandle.mesh.rotateY(userInput.neuronRotationDirection * ROTATION_RATE);
                     }
                    break;

                }
            }

           
         
           
          

        },
        // Listeners are called right after the processing stage that fired them. This guarantees that
        // updates can be applied at an appropriate synchronized point in the rendering cycle.
        listeners: [
            onImageUpdatedListener(userInput, imageTargets),
            onImageFoundListener(userInput, sceneCxt, imageTargets),
            onImageLostListener(userInput),
        ],
    };
};

const onxrloaded = (sceneCxt: SceneGraphCtx, assetCtx: AssetsCtx, imageTargets: ImageTargets, userInput: UserInput) => () => {
    XR8.XrController.configure({ disableWorldTracking: undefined });
    XR8.addCameraPipelineModules([
        // Add camera pipeline modules.
        // Existing pipeline modules.
        XR8.GlTextureRenderer.pipelineModule(), // Draws the camera feed.
        // we can create a custom versin of this
        XR8.Threejs.pipelineModule(), // Creates a ThreeJS AR THREE.Scene.
        XR8.XrController.pipelineModule(), // Enables SLAM tracking.
        XRExtras.AlmostThere.pipelineModule(), // Detects unsupported browsers and gives hints.
        XRExtras.FullWindowCanvas.pipelineModule(), // Modifies the canvas to fill the window.
        XRExtras.Loading.pipelineModule(), // Manages the loading screen on startup.
        XRExtras.RuntimeError.pipelineModule(), // Shows an error image on runtime error.
        // Custom pipeline modules.
        ArPipelineModule(sceneCxt, assetCtx, imageTargets, userInput),
    ]);

    // Open the camera and start running the camera run loop.
    XR8.run({
        canvas: document.getElementById('camerafeed'),
        allowedDevices: XR8.XrConfig.device().ANY,
    });
};

// Show loading screen before the full XR library has been loaded.
const runAR = async () => {
    const assetCtx = initAssetCtx();
    await loadAssetBundle<'texture'>(assetCtx.texture.api, assetCtx.texture.cache, textureBundle)();
    await loadAssetBundle<'gltf'>(assetCtx.gltf.api, assetCtx.gltf.cache, gltfBundle)();
    const sceneCxt = initSceneGraphCtx(assetCtx);
    const imageTargets = initImageTargets();
    const userInput = initUserInput()
    XRExtras.Loading.showLoading({ onxrloaded: onxrloaded(sceneCxt, assetCtx, imageTargets, userInput) });

    const loadImage = document.getElementById('loadImage') as HTMLImageElement;
    if (loadImage) {
        loadImage.src = 'img/r42.png';
    }
};

runAR();
  


