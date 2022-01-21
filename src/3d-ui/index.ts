import { EventHandlers } from '../events/canvas';
import { InteractionCache, interactionCacheApi } from '../interaction-cache';
import { Mesh, Object3D, BufferGeometry, MeshStandardMaterial, Group, Vector3 } from 'three';
import { AssetsCtx } from '../assets';
import { createImagePlane } from './image-plane';
import { createVideoPlane } from './video-plane';

function openInNewTab(href: string) {
    Object.assign(document.createElement('a'), { target: '_blank', href }).click();
}

enum UIKinds {
    button,
    div,
    img,
    video,
}

type UIElement = {
    kind: UIKinds;
    api: EventHandlers;
    mesh: Mesh;
};

export type UIElementHandles = {
    r42BusinessCard: UIElement;
    mainVideo: UIElement;
    ed: UIElement;
    eva: UIElement;
    raph: UIElement;
    btnLinc: UIElement;
    btnSma: UIElement;
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
    const r42BusinessCard = createImagePlane(
        '/img/random42-business-card.png',
        assetCtx,
        [1636 * PIXEL, 1024 * PIXEL],
        true,
    );
    const btnLinc = createImagePlane('/img/btn_linc.png', assetCtx, [2.8 * 640 * PIXEL, 2.8 * 240 * PIXEL], true);
    const btnSma = createImagePlane('/img/btn_sma.png', assetCtx, [2.8 * 640 * PIXEL, 2.8 * 240 * PIXEL], true);
    const ed = createImagePlane('/img/ed.png', assetCtx, [3 * 640 * PIXEL, 3 * 240 * PIXEL], true);
    const eva = createImagePlane('/img/eva.png', assetCtx, [3 * 640 * PIXEL, 3 * 240 * PIXEL], true);
    const raph = createImagePlane('/img/raph.png', assetCtx, [3 * 640 * PIXEL, 3 * 240 * PIXEL], true);

    // video planes
    const mainVideo = createVideoPlane('mp4/aurora_demo.mp4', 1820 * PIXEL, 1024 * PIXEL, true);

    const uis: UIElementHandles = {
        mainVideo: {
            kind: UIKinds.video,
            api: {
                ...defaultEventHandlers,
                onPointerDown: (state, _) => {
                    mainVideo.videoEl.play();
                    return state;
                },
            },
            mesh: mainVideo.mesh,
        },
        r42BusinessCard: {
            kind: UIKinds.img,
            api: defaultEventHandlers,
            mesh: r42BusinessCard,
        },
        eva: {
            kind: UIKinds.img,
            api: defaultEventHandlers,
            mesh: eva,
        },
        raph: {
            kind: UIKinds.img,
            api: defaultEventHandlers,
            mesh: raph,
        },
        ed: {
            kind: UIKinds.img,
            api: defaultEventHandlers,
            mesh: ed,
        },
        btnLinc: {
            kind: UIKinds.button,
            api: {
                ...defaultEventHandlers,
                onPointerDown: (state, _) => {
                    openInNewTab('https://www.biogenlinc.ch/');
                    return state;
                },
            },
            mesh: btnLinc,
        },
        btnSma: {
            kind: UIKinds.button,
            api: {
                ...defaultEventHandlers,
                onPointerDown: (state, _) => {
                    openInNewTab('https://www.togetherinsma.ch/de_CH/patienten/allgemeines.html');
                    return state;
                },
            },
            mesh: btnSma,
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

    const belowPanel = new Group();
    setPosition(el.btnLinc.mesh, new Vector3(0, 340 * PIXEL, 0));
    setPosition(el.btnSma.mesh, new Vector3(0, -340 * PIXEL, 0));
    belowPanel.add(...[el.btnLinc.mesh, el.btnSma.mesh]);

    const abovePanel = new Group();

    const rightPanel = new Group();
    setPosition(el.eva.mesh, new Vector3(0, 740 * PIXEL, 0));
    setPosition(el.ed.mesh, new Vector3(0, 0, 0));
    setPosition(el.raph.mesh, new Vector3(0, -740 * PIXEL, 0));
    rightPanel.add(...[el.eva.mesh, el.ed.mesh, el.raph.mesh]);

    const leftPanel = new Group();
    // abovePanel.add(el.mainVideo.mesh);

    // grouos:
    setPosition(rightPanel, new Vector3(2100 * PIXEL, -612 * PIXEL, 0));
    setPosition(leftPanel, new Vector3(-1430 * PIXEL, 0, 0));
    setPosition(belowPanel, new Vector3(0, -1300 * PIXEL, 0));
    setPosition(abovePanel, new Vector3(0, 1024 * PIXEL, 0));

    rootSurface.add(...[leftPanel, rightPanel, belowPanel, abovePanel]);

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
