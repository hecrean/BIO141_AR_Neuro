import type { CameraPipelineModule, XR8 as XR8Type, XRExtras as XRExtrasType } from './type';
import { onImageFoundListener, onImageLostListener, onImageUpdatedListener } from './image-target';
import { responseToInput } from './three-scene';
import { initSceneGraphCtx, SceneGraphCtx, RenderCxt, UserCtx, initUserCtx, State } from './state';
import { AssetsCtx } from './assets';
import { input$ } from './event';

declare const XR8: XR8Type;
declare const XRExtras: XRExtrasType;

// init state :

/// Our ArPipelineModule :
const ArPipelineModule = (state: State): CameraPipelineModule => {
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

            const obj3ds = Object.values(state.sceneCtx.objectHandles);
            renderCtx.scene.add(...obj3ds);
            const uis = Object.values(state.sceneCtx.ui).map((ui) => ui.el);
            renderCtx.scene.add(...uis);

            input$.subscribe((input) => responseToInput(input, state));

            // Add objects to the scene and set starting camera position.

            XR8.XrController.configure({
                imageTargets: ['por_amor_al_arte', 'escher_birds', 'conversations_with_friends'],
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
        listeners: [
            onImageUpdatedListener(state.sceneCtx.surfaceHandles),
            onImageFoundListener(state.sceneCtx.surfaceHandles),
            onImageLostListener(state.sceneCtx.surfaceHandles),
        ],
    };
};

const onxrloaded = () => {
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
        ArPipelineModule(state),
    ]);

    // Open the camera and start running the camera run loop.
    XR8.run({
        canvas: document.getElementById('camerafeed'),
        allowedDevices: XR8.XrConfig.device().ANY,
    });
};

// Show loading screen before the full XR library has been loaded.
export const runAR = () => {
    XRExtras.Loading.showLoading({ onxrloaded });
};
