import * as THREE from 'three';
import { TargetName } from './image-target';

/**
 * Emitted when image loading begins
 * Returns list of targets
 */
export type ImageLoadingMsg = {
    event: 'reality.imageloading';
    process: ({
        name,
        detail,
    }: {
        name: string;
        detail: {
            imageTargets: {
                name: TargetName;
                type: 'FLAT' | 'CYLINDRICAL' | 'CONICAL';
                metadata: any;
            };
        };
    }) => void;
};
/**
 * Emitted when images loaded, and scanning can begin
 * Returns list of targets
 * In response to this event, we often construct geoemtry, pop up UI eleements etc.
 */
export type ImageScanningMsg = {
    event: 'reality.imagescanning';
    process: ({
        name,
        detail,
    }: {
        name: string;
        detail: {
            imageTargets: {
                name: TargetName;
                type: 'FLAT' | 'CYLINDRICAL' | 'CONICAL';
                metadata: string;
                geometry: any;
            };
        };
    }) => void;
};
/**
 * Emitted when target is first found
 * typically we make AR content visible at this point
 */
export type ImageFoundMsg = {
    event: 'reality.imagefound';
    process: ({
        name,
        detail,
    }: {
        name: string;
        detail: {
            name: TargetName;
            type: 'FLAT' | 'CYLINDRICAL' | 'CONICAL';
            position: { x: number; y: number; z: number };
            rotation: { x: number; y: number; z: number; w: number };
            scale: number;
        };
    }) => void;
};
/**
 * Fires any time target image's position/rotation/scale is updated.
 */
export type ImageUpdatedMsg = {
    event: 'reality.imageupdated';
    process: ({
        name,
        detail,
    }: {
        name: string;
        detail: {
            name: TargetName;
            type: 'FLAT' | 'CYLINDRICAL' | 'CONICAL';
            position: { x: number; y: number; z: number };
            rotation: { x: number; y: number; z: number; w: number };
            scale: number;
        };
    }) => void;
};
/**
 * Emitted when target no longer tracked
 */
export type ImageLostMsg = {
    event: 'reality.imagelost';
    process: ({
        name,
        detail,
    }: {
        name: string;
        detail: {
            name: TargetName;
            type: 'FLAT' | 'CYLINDRICAL' | 'CONICAL';
            position: { x: number; y: number; z: number };
            rotation: { x: number; y: number; z: number; w: number };
            scale: number;
        };
    }) => void;
};

export type CameraPipelineEventMsg =
    | ImageLoadingMsg
    | ImageScanningMsg
    | ImageFoundMsg
    | ImageUpdatedMsg
    | ImageLostMsg;

export type CameraPipelineModule = {
    name: string;
    listeners?: CameraPipelineEventMsg[];
    onAppResourcesLoaded?: (args: any) => void; //Called when we have received the resources attached to an app from the server.
    onAttach?: (args: any) => void; //Called before the first time a module receives frame updates. It is called on modules that were added either before or after the pipeline is running.
    onBeforeRun?: (args: any) => void; //Called immediately after XR8.run(). If any promises are returned, XR will wait on all promises before continuing.
    onCameraStatusChange?: (args: any) => void; //Called when a change occurs during the camera permissions request.
    onCanvasSizeChange?: (args: any) => void; //Called when the canvas changes size.
    onDetach?: (args: any) => void; //is called after the last time a module receives frame updates. This is either after the engine is stopped or the module is manually removed from the pipeline, whichever comes first.
    onDeviceOrientationChange?: (args: any) => void; // 	Called when the device changes landscape/portrait orientation.
    onException?: (args: any) => void; // 	Called when an error occurs in XR. Called with the error object.
    onPaused?: (args: any) => void; // 	Called when XR8.pause() is called.
    onProcessCpu?: (args: any) => void; // 	Called to read results of GPU processing and return usable data.
    onProcessGpu?: (args: any) => void; // 	Called to start GPU processing.
    onRemove?: (args: any) => void; // 	is called when a module is removed from the pipeline.
    onRender?: (args: any) => void; // 	Called after onUpdate. This is the time for the rendering engine to issue any WebGL drawing commands. If an application is providing its own run loop and is relying on XR8.runPreRender() and XR8.runPostRender(), this method is not called and all rendering must be coordinated by the external run loop.
    onResume?: (args: any) => void; // 	Called when XR8.resume() is called.
    onStart?: ({
        canvas,
        GLctx,
        computeCtx,
        isWebgl2,
        orientation,
        videoHeight,
        videoWidth,
        canvasHeight,
        canvasWidth,
        config,
    }: {
        canvas: HTMLCanvasElement;
        GLctx: WebGLRenderingContext | WebGL2RenderingContext;
        computeCtx: WebGLRenderingContext | WebGL2RenderingContext;
        isWebgl2: boolean;
        orientation: any;
        videoWidth: number;
        videoHeight: number;
        canvasWidth: number;
        canvasHeight: number;
        config: any;
    }) => void; // 	Called when XR starts. First callback after XR8.run() is called.
    onUpdate?: (args: { framework: any; frameStartResult: any; processGpuResult: any; processCpuResult: any }) => void; // 	Called to update the scene before render. Data returned by modules in onProcessGpu and onProcessCpu will be present as processGpu.modulename and processCpu.modulename where the name is given by module.name = "modulename".
    onVideoSizeChange?: (args: any) => void; // 	Called when the canvas changes size.
    requiredPermissions?: (args: any) => void; // 	Modules can indicate what browser capabilities they require that may need permissions requests. These can be used by the framework to request appropriate permissions if absent, or to create components that request the appropriate permissions before running XR.
};

type XR8Three = {
    pipelineModule: () => void; //A pipeline module that interfaces with the threejs environment and lifecyle.
    xrScene: () => {
        scene: THREE.Scene;
        camera: THREE.PerspectiveCamera;
        renderer: THREE.WebGLRenderer;
        cameraTexture: THREE.Texture;
    }; //Get a handle to the xr scene, camera and renderer.
};

type GlTextureRenderer = {
    configure: (args: any) => void; //Configures the pipeline module that draws the camera feed to the canvas.
    create: (args: any) => void; //Creates an object for rendering from a THREE.texture to a canvas or another THREE.texture.
    fillViewport: (args: any) => void; //Convenience method for getting a Viewport struct that fills a THREE.texture or canvas from a source without distortion. This is passed to the render method of the object created by GlTHREE.TextureRenderer.create()
    getGLctxParameters: (args: any) => void; //Gets the current set of WebGL bindings so that they can be restored later.
    pipelineModule: () => void; //Creates a pipeline module that draws the camera feed to the canvas.
    setGLctxParameters: (args: any) => void; //Restores the WebGL bindings that were saved with getGLctxParameters.
    setTextureProvider: (args: any) => void; //Sets a provider that passes the THREE.texture to draw.
};

//XrController provides 6DoF camera tracking and interfaces for configuring tracking.
export type XrController = {
    configure: (args: {
        enableWorldPoints?: true;
        enableLighting?: true;
        disableWorldTracking?: true;
        imageTargets?: TargetName[];
    }) => void; //Configures what processing is performed by XrController (may have performance implications).
    hitTest: (args: {
        X: number;
        Y: number;
        includedTypes: Array<'FEATURE_POINT' | 'ESTIMATED_SURFACE' | 'DETECTED_SURFACE'>;
    }) => {
        type: 'FEATURE_POINT' | 'ESTIMATED_SURFACE' | 'DETECTED_SURFACE' | 'UNSPECIFIED';
        position: { x: number; y: number; z: number };
        rotation: { x: number; y: number; z: number; w: number };
        distance: number;
    }; //Estimate the 3D position of a point on the camera feed.
    pipelineModule: () => void; //Creates a camera pipeline module that, when installed, receives callbacks on when the camera has started, camera proessing events, and other state changes. These are used to calculate the camera's position.
    recenter: (args: any) => void; //	Repositions the camera to the origin / facing direction specified by updateCameraProjectionMatrix and restart tracking.
    updateCameraProjectionMatrix: (args: any) => void; //Reset the scene's display geometry and the camera's starting position in the scene. The display geometry is needed to properly overlay the position of objects in the virtual scene on top of their corresponding position in the camera image. The starting position specifies where the camera will be placed and facing at the start of a session.
};

export interface XR8 {
    // -- functions
    addCameraPipelineModule: (args: CameraPipelineModule) => void; //Adds a module to the camera pipeline that will receive event callbacks for each stage in the camera pipeline.
    addCameraPipelineModules: (modules: Array<CameraPipelineModule>) => void; //Add multiple camera pipeline modules. This is a convenience method that calls addCameraPipelineModule in order on each element of the input array.
    clearCameraPipelineModules: (args: any) => void; //  	Remove all camera pipeline modules from the camera loop.
    initialize: (args: any) => void; //  	Returns a promise that is fulfilled when the AR Engine's WebAssembly is initialized.
    isInitialized: (args: any) => void; //  	Indicates whether or not the AR Engine's WebAssembly is initialized.
    isPaused: (args: any) => void; //  	Indicates whether or not the XR session is paused.
    pause: (args: any) => void; //  	Pause the current XR session. While paused, the camera feed is stopped and device motion is not tracked.
    resume: (args: any) => void; //  	Resume the current XR session.
    removeCameraPipelineModule: (args: any) => void; //  	Removes a module from the camera pipeline.
    removeCameraPipelineModules: (args: any) => void; //  	Remove multiple camera pipeline modules. This is a convenience method that calls removeCameraPipelineModule in order on each element of the input array.
    requiredPermissions: (args: any) => void; //  	Return a list of permissions required by the application.
    run: (args: any) => void; //  	Open the camera and start running the camera run loop.
    runPreRender: (args: any) => void; //  	Executes all lifecycle updates that should happen before rendering.
    runPostRender: (args: any) => void; //  	Executes all lifecycle updates that should happen after rendering.
    stop: (args: any) => void; //  	Stop the current XR session. While stopped, the camera feed is closed and device motion is not tracked.
    version: (args: any) => void; //  	Get the 8th Wall Web engine version.
    // -- modules
    Threejs: XR8Three;
    GlTextureRenderer: GlTextureRenderer;
    CameraPixelArray: any; //Provides a camera pipeline module that gives access to camera data as a grayscale or color uint8 array.
    CanvasScreenshot: any; // 	Provides a camera pipeline module that can generate screenshots of the current scene.
    FaceController: any; //  	Provides face detection and THREE.meshing, and interfaces for configuring tracking.
    MediaRecorder: any; //  	Provides a camera pipeline module that allows you to record a video in MP4 format.
    XrConfig: any; //  	Specifying class of devices and cameras that pipeline modules should run on.
    XrController: XrController; //  	XrController provides 6DoF camera tracking and interfaces for configuring tracking.
    XrDevice: any; //  	Provides information about device compatibility and characteristics.
    XrPermissions: any; //  	Utilities for specifying permissions required by a pipeline module.
}

// export declare const XR8: XR8;

export interface XRExtras {
    AFrame: any;
    AlmostThere: any;
    DebugWebViews: any;
    FullWindowCanvas: any;
    Lifecycle: any;
    Loading: any;
    PauseOnBlur: any;
    PauseOnHidden: any;
    PlayCanvas: any;
    PwaInstaller: any;
    RuntimeError: any;
    Stats: any;
    ThreeExtras: any;
    MediaRecorder: any;
}
// export declare const XRExtras: XRExtras;
