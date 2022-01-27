import { EventHandlers } from '../events/canvas';
import { InteractionCache, interactionCacheApi } from '../interaction-cache';
import { Mesh, Object3D, BufferGeometry, MeshStandardMaterial, Group, Vector3, Color } from 'three';
import { AssetsCtx } from '../assets';
import { createImagePlane } from './image-plane';
import { createVideoPlane } from './video-plane';
import { create3DModel } from './3d-model';
import { IntersectionEvent } from '../events/canvas'

function openInNewTab(href: string) {
    window.location.href = href;
}
function email(emailAddress: string,  emailSubject: string){
    window.location.href = `mailto:${emailAddress}?subject=${emailSubject}`;
}

const changeButtonColor = (event: IntersectionEvent<"pointerdown">, color: Color) => {
    if (isMesh(event.object)) {
        event.object.material.color = color;
    }
}

enum UIKinds {
    button,
    div,
    img,
    video,
    model,
}

type UIElement<T extends Object3D> = {
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

type UIComponent = {
    name: string;
    group: Group;
};

export type UIComponentHandles = {
    rootSurface: UIComponent;
};

export const defaultEventHandlers: EventHandlers = {
    onPointerEnter: (state, _) => state,
    onPointerDown: (state, _) => state,
    onPointerUp: (state, _) => state,
    onPointerOver: (state, _) => state,
    onPointerOut: (state, _) => state,
    onPointerLeave: (state, _) => state,
    onPointerMove: (state, _) => state,
    onPointerCancel: (state, _) => state,
    onTouchStart: ({ renderCtx, sceneCtx, assetCtx, imageTargets }, intersectionEv) => {
        //Prevent the browser from processing emulated mouse events.
        intersectionEv.nativeEvent.event.preventDefault();

        return { renderCtx, sceneCtx, assetCtx, imageTargets };
    },
    onTouchMove: (state, _) => state,
    onTouchEnd: (state, _) => state,
    onTouchCancel: (state, _) => state,
};

export const isMesh = (o: Object3D): o is Mesh<BufferGeometry, MeshStandardMaterial> => {
    return o instanceof Mesh;
};

// const PIXEL = 0.0002645833;
const PIXEL = 0.0009765;

export const initUiElements = (assetCtx: AssetsCtx): UIElementHandles => {
    // img planes
    const auroraAppInfo = createImagePlane(
        './img/random42-business-card.png',
        assetCtx,
        [1636 * PIXEL, 1024 * PIXEL],
        true,
    );
    const btnLinc = createImagePlane('./img/btn_linc.png', assetCtx, [2.8 * 640 * PIXEL, 2.8 * 240 * PIXEL], true);
    const btnSma = createImagePlane('./img/btn_sma.png', assetCtx, [2.8 * 640 * PIXEL, 2.8 * 240 * PIXEL], true);
    const ed = createImagePlane('./img/ed.png', assetCtx, [3 * 640 * PIXEL, 3 * 240 * PIXEL], true);
    const eva = createImagePlane('./img/eva.png', assetCtx, [3 * 640 * PIXEL, 3 * 240 * PIXEL], true);
    const raph = createImagePlane('./img/raph.png', assetCtx, [3 * 640 * PIXEL, 3 * 240 * PIXEL], true);

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

    const uis: UIElementHandles = {
        auroraVideo: {
            kind: UIKinds.video,
            api: {
                ...defaultEventHandlers,
                onPointerDown: (state, _) => {
                    auroraVideo.videoEl.play();
                    return state;
                },
            },
            mesh: auroraVideo.mesh,
        },
        edwardWelcomeVideo: {
            kind: UIKinds.video,
            api: {
                ...defaultEventHandlers,
                onPointerDown: (state, _) => {
                    edwardWelcomeVideo.videoEl.play();
                    return state;
                }
            },
            mesh: edwardWelcomeVideo.mesh
        },
        auroraAppInfo: {
            kind: UIKinds.img,
            api: defaultEventHandlers,
            mesh: auroraAppInfo,
        },
        eva: {
            kind: UIKinds.img,
            api: {
                ...defaultEventHandlers,
                onPointerDown: (state, event) => {
                   
                    changeButtonColor(event, new Color('blue'))
                    setTimeout(() => changeButtonColor(event, new Color('white')), 1000)
                    email('eva@biogen.com', 'test')
                    return state;
                }
            },
            mesh: eva,
        },
        raph: {
            kind: UIKinds.img,
            api: {
                ...defaultEventHandlers,
                onPointerDown: (state, event) => {
                    changeButtonColor(event, new Color('blue'))
                    setTimeout(() => changeButtonColor(event, new Color('white')), 1000)

                    email('hector@hectorcrean.xyz', 'test')
                    return state;
                }
            },            mesh: raph,
        },
        ed: {
            kind: UIKinds.img,
            api: {
                ...defaultEventHandlers,
                onPointerDown: (state, event) => {
                    changeButtonColor(event, new Color('blue'))
                    setTimeout(() => changeButtonColor(event, new Color('white')), 1000)

                    email('hector@hectorcrean.xyz', 'test')
                    return state;
                }
            },            mesh: ed,
        },
        btnLinc: {
            kind: UIKinds.button,
            api: {
                ...defaultEventHandlers,
                onPointerDown: (state, event) => {
                    if (isMesh(event.object)) {
                        event.object.material.color = new Color('blue');
                    }

                    openInNewTab('https://www.biogenlinc.ch/');
                    return state;
                },
                onPointerUp: (state, event) => {
                    if (isMesh(event.object)) {
                        event.object.material.color = new Color(0xffffff);
                    }
                    return state;
                },
            },
            mesh: btnLinc,
        },
        btnSma: {
            kind: UIKinds.button,
            api: {
                ...defaultEventHandlers,
                onPointerDown: (state, event) => {
                    if (isMesh(event.object)) {
                        event.object.material.color = new Color('blue');
                    }
                    openInNewTab('https://www.togetherinsma.ch/de_CH/patienten/allgemeines.html');
                    return state;
                },
                onPointerUp: (state, event) => {
                    if (isMesh(event.object)) {
                        event.object.material.color = new Color(0xffffff);
                    }
                    return state;
                },
            },
            mesh: btnSma,
        },
        neuronModel: {
            kind: UIKinds.model,
            api: {
                ...defaultEventHandlers,
            },
            mesh: groupifyMeshes(neuron),
        },
    };

    return uis;
};

export const initUiComponents = (el: UIElementHandles): UIComponentHandles => {
    const setPosition = (m: Object3D, { x, y, z }: Vector3) => {
        m.position.set(x, y, z);
        return m;
    };

    // When the image target is found, we calculate the ration betwee { size of image on server : size of image viewed through camera}
    // We use this ratio to resize the root surface group (and consequently all its children)

    const rootSurface = new Group();
    rootSurface.visible = false;
    // root surface will be centred at the business card. We replace this with our own image:
    // setPosition(el.r42BusinessCard.mesh, new Vector3(0, 0, 0));
    // rootSurface.add(el.r42BusinessCard.mesh);

    const biogenAndTismaPanel = new Group();
    setPosition(el.btnLinc.mesh, new Vector3(0, 340 * PIXEL, 0));
    setPosition(el.btnSma.mesh, new Vector3(0, -340 * PIXEL, 0));
    biogenAndTismaPanel.add(...[el.btnLinc.mesh, el.btnSma.mesh]);

    const neuronPanel = new Group();
    neuronPanel.add(el.neuronModel.mesh);

    const teamInfoPanel = new Group();
    setPosition(el.eva.mesh, new Vector3(0, 740 * PIXEL, 0));
    setPosition(el.ed.mesh, new Vector3(0, 0, 0));
    setPosition(el.raph.mesh, new Vector3(0, -740 * PIXEL, 0));
    teamInfoPanel.add(...[el.eva.mesh, el.ed.mesh, el.raph.mesh]);

    const auroraVideoPanel = new Group();
    auroraVideoPanel.add(el.auroraVideo.mesh);

    const edwardWelcomeVideoPanel = new Group()
    edwardWelcomeVideoPanel.add(el.edwardWelcomeVideo.mesh);


    // grouos:
    const Right = new Vector3(2100 * PIXEL, 0, 0);
    const Left = new Vector3(-2100 * PIXEL, 0, 0);
    // const Up  = new Vector3(0, 2100 * PIXEL, 0);
    const Down  = new Vector3(0, -2100 * PIXEL, 0);
    const addv3 = (v1: Vector3, v2: Vector3) => (new Vector3(v1.x + v2.x, v1.y + v2.y, v1.z + v2.z))
    // const multv3 = (v: Vector3, scale: number) => (new Vector3(v.x * scale, v.y * scale, v.z * scale))


    setPosition(biogenAndTismaPanel, Right);
    setPosition(neuronPanel, new Vector3(0,0,0));
    setPosition(teamInfoPanel, Left);
    setPosition(auroraVideoPanel, addv3(Right, Down));
    setPosition(edwardWelcomeVideoPanel, addv3(Left, Down));


    rootSurface.add(...[biogenAndTismaPanel, neuronPanel, teamInfoPanel, auroraVideoPanel, edwardWelcomeVideoPanel]);
    console.log('root surface', rootSurface);

    return {
        rootSurface: { name: 'rootSurface', group: rootSurface },
    };
};

export const registerUi = (cache: InteractionCache, uiElHandles: UIElementHandles): void => {
    Object.values(uiElHandles).map((handle) => interactionCacheApi.register(cache, handle.mesh, handle.api));
};

export interface UiApi {
    align: (ui: Object3D) => (position: THREE.Vector3, rotation: THREE.Quaternion, scale: THREE.Vector3) => Object3D;
    makeVisible: (ui: Object3D) => Object3D;
    makeInvisible: (ui: Object3D) => Object3D;
}

export const uiApi: UiApi = {
    align: (ui: Object3D) => (position: THREE.Vector3, rotation: THREE.Quaternion, scale: THREE.Vector3) => {
        ui.position.copy(position);
        ui.quaternion.copy(rotation);
        ui.scale.set(scale.x, scale.y, scale.z);
        return ui;
    },
    makeVisible: (ui: Object3D) => {
        ui.visible = true;
        return ui;
    },
    makeInvisible: (ui: Object3D) => {
        ui.visible = false;
        return ui;
    },
};
