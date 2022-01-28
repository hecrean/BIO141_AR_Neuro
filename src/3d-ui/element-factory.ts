import { EventHandlers } from '../events/canvas';
import { Mesh, Object3D, BufferGeometry, MeshStandardMaterial, Group, Color, Vector3 } from 'three';
import { AssetsCtx } from '../assets';
import { createImagePlane } from './image-plane';
import { createVideoPlane } from './video-plane';
import { create3DModel } from './3d-model';
import { IntersectionEvent } from '../events/canvas'

// Each element is unique, and only used once in the app. The record provides a handle to objects within the scene,
// and so we can conveniently mutate scene objects with functions that take in the corresponding scene handle


export const PIXEL = 0.0009765;

enum UIKinds {
    button,
    div,
    img,
    video,
    model,
}

export type UIElement<T extends Object3D> = {
    kind: UIKinds;
    api: EventHandlers;
    mesh: T;
};

export type UIElementHandles = {
    auroraAppInfo: UIElement<Mesh>;
    auroraVideo: UIElement<Mesh>;
    edwardWelcomeVideo: UIElement<Mesh>;
    ed: UIElement<Mesh>;
    eva: UIElement<Mesh>;
    raph: UIElement<Mesh>;
    btnLinc: UIElement<Mesh>;
    btnSma: UIElement<Mesh>;
    neuronModel: UIElement<Group>;
};

export type UIComponent = {
    name: string;
    group: Group;
};


export const defaultEventHandlers: EventHandlers = {
    onDoubleClick: (state, _) => state,
    onPointerEnter: (state, _) => state,
    onPointerDown: (state, _) => state,
    onPointerUp: (state, _) => state,
    onPointerOver: (state, _) => state,
    onPointerOut: (state, _) => state,
    onPointerLeave: (state, _) => state,
    onPointerMove: (state, _) => state,
    onPointerCancel: (state, _) => state,
    onTouchStart: ({ renderCtx, sceneCtx, assetCtx, imageTargets, userInput }, intersectionEv) => {
        //Prevent the browser from processing emulated mouse events.
        intersectionEv.nativeEvent.event.preventDefault();

        return { renderCtx, sceneCtx, assetCtx, imageTargets, userInput };
    },
    onTouchMove: (state, _) => state,
    onTouchEnd: (state, _) => state,
    onTouchCancel: (state, _) => state,
};


// utility functions 
const isMesh = (o: Object3D): o is Mesh<BufferGeometry, MeshStandardMaterial> => {
    return o instanceof Mesh;
};
const isGroup = (o: Object3D): o is Group => {
    return o instanceof Group;
};

function openInNewTab(href: string) {
    window.location.href = href;
}
function email(emailAddress: string,  emailSubject: string){
    window.location.href = `mailto:${emailAddress}?subject=${emailSubject}`;
}

const changeColor = (event: IntersectionEvent<"pointerdown">|IntersectionEvent<'pointerup'>, color: Color) => {
    if (isMesh(event.object)) {
        event.object.material.color = color;
    }
    if (isGroup(event.object)){
        event.object.children.forEach((obj) => {
            if(isMesh(obj)){
                obj.material.color = color;
            }
        })
    }
}
const videoElementIsPlaying = (el: HTMLVideoElement) => {
    return !!(el.currentTime > 0 && !el.paused && !el.ended && el.readyState > 2);
}


export const initUiElements = (assetCtx: AssetsCtx): UIElementHandles => {
       

    // video planes
    const auroraVideo = createVideoPlane(assetCtx, './mp4/aurora_demo.mp4', './img/uv-map.png', 1820 * PIXEL, 1024 * PIXEL);
    const edwardWelcomeVideo = createVideoPlane(assetCtx,  './mp4/aurora_demo.mp4', './img/uv-map.png', 1820 * PIXEL, 1024 * PIXEL)
    
    // 3d-models
    const neuron = create3DModel('./gltf/18_Neuron.glb', assetCtx);
    const groupifyMeshes = (meshes: Array<Mesh>) => {
        const group = new Group();
        meshes.forEach((mesh) => {
            group.add(mesh);
        });
        return group;
    };

    const elements: UIElementHandles = {
        auroraVideo: {
            kind: UIKinds.video,
            api: {
                ...defaultEventHandlers,
                onPointerDown: (state, event) => {
                    changeColor(event, new Color('blue'))
                    const videoIsPlaying = videoElementIsPlaying(edwardWelcomeVideo.videoEl);
                    switch (videoIsPlaying) {
                        case true: 
                            auroraVideo.videoEl.pause(); 
                            state.userInput.videoFocusState = { tag: 'none-focused'}

                            break;
                        case false:  
                            auroraVideo.videoEl.play(); 
                            state.userInput.videoFocusState = { tag: 'aurora-app-focused'}
                            break;
                    }
                    return state;
                },
                onPointerUp: (state, event) => {
                    changeColor(event, new Color('white'))
                    return state;
                },
            },
            mesh: auroraVideo.mesh,
        },
        edwardWelcomeVideo: {
            kind: UIKinds.video,
            api: {
                ...defaultEventHandlers,
                onPointerDown: (state, event) => {
                    changeColor(event, new Color('blue'))
                    const videoIsPlaying = videoElementIsPlaying(edwardWelcomeVideo.videoEl);
                    switch (videoIsPlaying) {
                        case true: 
                            edwardWelcomeVideo.videoEl.pause(); 
                            state.userInput.videoFocusState = { tag: 'none-focused'}
                            break;
                        case false:  
                            edwardWelcomeVideo.videoEl.play(); 
                            state.userInput.videoFocusState = { tag: 'edward-introduction-focused'}

                            break;
                    }
                    return state;
                },
                onPointerUp: (state, event) => {
                    changeColor(event, new Color('white'))
                    return state;
                },
            },
            mesh: edwardWelcomeVideo.mesh
        },
        auroraAppInfo: {
            kind: UIKinds.img,
            api: defaultEventHandlers,
            mesh: createImagePlane(
                './img/random42-business-card.png',
                assetCtx,
                [1636 * PIXEL, 1024 * PIXEL],
            ),
        },
        eva: {
            kind: UIKinds.img,
            api: {
                ...defaultEventHandlers,
                onPointerDown: (state, event) => {
                    changeColor(event, new Color('blue'))
                    email('eva@biogen.com', 'test')
                    return state;
                },
                onPointerUp: (state, event) => {
                    changeColor(event, new Color('white'))
                    return state;
                },
            },
            mesh: createImagePlane('./img/eva.png', assetCtx, [3 * 640 * PIXEL, 3 * 240 * PIXEL]),
        },
        raph: {
            kind: UIKinds.img,
            api: {
                ...defaultEventHandlers,
                onPointerDown: (state, event) => {
                    changeColor(event, new Color('blue'))
                    email('raph@biogen.com', 'test')
                    return state;
                },
                onPointerUp: (state, event) => {
                    changeColor(event, new Color('white'))
                    return state;
                },
            },            
            mesh: createImagePlane('./img/raph.png', assetCtx, [3 * 640 * PIXEL, 3 * 240 * PIXEL]),
        },
        ed: {
            kind: UIKinds.img,
            api: {
                ...defaultEventHandlers,
                onPointerDown: (state, event) => {
                    changeColor(event, new Color('blue'))
                    email('ed@biogen.com', 'test')
                    return state;
                },
                onPointerUp: (state, event) => {
                    changeColor(event, new Color('white'))
                    return state;
                },
            },            
            mesh: createImagePlane('./img/ed.png', assetCtx, [3 * 640 * PIXEL, 3 * 240 * PIXEL]),
        },
        btnLinc: {
            kind: UIKinds.button,
            api: {
                ...defaultEventHandlers,
                onPointerDown: (state, event) => {
                    changeColor(event, new Color('blue'))
                    openInNewTab('https://www.biogenlinc.ch/');
                    return state;
                },
                onPointerUp: (state, event) => {
                    changeColor(event, new Color('white'))
                    return state;
                },
            },
            mesh: createImagePlane('./img/btn_linc.png', assetCtx, [2.8 * 640 * PIXEL, 2.8 * 240 * PIXEL]),
        },
        btnSma: {
            kind: UIKinds.button,
            api: {
                ...defaultEventHandlers,
                onPointerDown: (state, event) => {
                    changeColor(event, new Color('blue'))
                    openInNewTab('https://www.togetherinsma.ch/de_CH/patienten/allgemeines.html');
                    return state;
                },
                onPointerUp: (state, event) => {
                    changeColor(event, new Color('white'))
                    return state;
                },
            },
            mesh: createImagePlane('./img/btn_sma.png', assetCtx, [2.8 * 640 * PIXEL, 2.8 * 240 * PIXEL]),
        },
        neuronModel: {
            kind: UIKinds.model,
            api: {
                ...defaultEventHandlers,
                onPointerDown: (state, event) => { 
                    console.log('clicked on neuron')
                    changeColor(event, new Color('red'))
                    return state;
                },
                onPointerUp: (state, event) => { 
                    changeColor(event, new Color('red'))
                    return state;
                }
                
            },
            mesh: groupifyMeshes(neuron),
        },
    };

    return elements;
};


