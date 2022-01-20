import './style.css';
import { textureBundle } from './assets/asset-bundles';
import { AssetsCtx, initAssetCtx, loadAssetBundle } from './assets';
import type { CameraPipelineModule, XR8 as XR8Type, XRExtras as XRExtrasType } from './type';
import { onImageFoundListener, onImageLostListener, onImageUpdatedListener } from './image-target';
import { initSceneGraphCtx, RenderCxt, initState, State, SceneGraphCtx } from './state';
import { input$, Input, interpreter } from './events/canvas';
import { api as raycasterApi } from './raycaster';

declare const XR8: XR8Type;
declare const XRExtras: XRExtrasType;

// update
const responseToInput = (input: Input, state: State) => {
    const { threeEvent } = raycasterApi;
    const intersectionEvts = threeEvent(input.canvasEvent)(state.sceneCtx)(state.renderCtx);
    return interpreter(state, intersectionEvts[0]);
};

/// Our ArPipelineModule :
const ArPipelineModule = (sceneCxt: SceneGraphCtx, assetCtx: AssetsCtx): CameraPipelineModule => {
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

            const state = initState(renderCtx, sceneCxt, assetCtx);

            input$.subscribe((input) => responseToInput(input, state));

            // Add objects to the scene and set starting camera position.

            XR8.XrController.configure({
                imageTargets: ['business_card', 'Raphael-Bieri-front', 'Eva-Thoma-front', 'Eduard-Rohrbach-front'],
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
                /*scene, camera, renderer, cameraTexture*/
            } = XR8.Threejs.xrScene();
            //updateScene(scene, camera, renderer)
        },
        // Listeners are called right after the processing stage that fired them. This guarantees that
        // updates can be applied at an appropriate synchronized point in the rendering cycle.
        listeners: [onImageUpdatedListener(sceneCxt), onImageFoundListener(sceneCxt), onImageLostListener(sceneCxt)],
    };
};

const onxrloaded = (sceneCxt: SceneGraphCtx, assetCtx: AssetsCtx) => () => {
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
        ArPipelineModule(sceneCxt, assetCtx),
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
    const bundlesLoaded = await loadAssetBundle<'texture'>(
        assetCtx.texture.api,
        assetCtx.texture.cache,
        textureBundle,
    )();
    console.log('bundles', bundlesLoaded);
    const sceneCxt = initSceneGraphCtx(assetCtx);
    console.log('sceneCxt', sceneCxt);
    XRExtras.Loading.showLoading({ onxrloaded: onxrloaded(sceneCxt, assetCtx) });
};

runAR();
