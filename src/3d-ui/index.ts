import { EventHandlers } from '../events/canvas';
import { InteractionCache, interactionCacheApi } from '../interaction-cache';
import { Mesh, Object3D, BufferGeometry, MeshStandardMaterial, Group, Vector3, Color } from 'three';
import { AssetsCtx } from '../assets';
import { createImagePlane } from './image-plane';
import { createVideoPlane } from './video-plane';

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
    raphelBieriLinkedin: UIElement;
    edwardRohrbachLinkedin: UIElement;
    evaThomaLinkedin: UIElement;
    whatsappIcon: UIElement;
    zoomIcon: UIElement;
    mobileIcon: UIElement;
    emailIcon: UIElement;
    r42BusinessCard: UIElement;
    evaBio: UIElement;
    eduardBio: UIElement;
    raphaelBio: UIElement;
    mainVideo: UIElement;
    imageGallery: UIElement;
    quotation: UIElement;
    auroraAppExplaination: UIElement;
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
    onPointerDown: (state, intersectionEv) => {
        isMesh(intersectionEv.object) ? intersectionEv.object.material.color.set('yellow') : () => ({});

        return state;
    },
    onPointerUp: (state, intersectionEv) => {
        isMesh(intersectionEv.object) ? intersectionEv.object.material.color.set('blue') : () => ({});

        return state;
    },
    onPointerOver: (state, _) => state,
    onPointerOut: (state, _) => state,
    onPointerLeave: (state, _) => state,
    onPointerMove: (state, _) => state,
    onPointerCancel: (state, _) => state,
    onTouchStart: ({ renderCtx, sceneCtx, assetCtx }, intersectionEv) => {
        //Prevent the browser from processing emulated mouse events.
        intersectionEv.nativeEvent.event.preventDefault();

        return { renderCtx, sceneCtx, assetCtx };
    },
    onTouchMove: (state, _) => state,
    onTouchEnd: (state, _) => state,
    onTouchCancel: (state, _) => state,
};

export const isMesh = (o: Object3D): o is Mesh<BufferGeometry, MeshStandardMaterial> => {
    return o instanceof Mesh;
};

const PIXEL = 0.0002645833;

export const initUiElements = (assetCtx: AssetsCtx): UIElementHandles => {
    // img planes
    const raphelBieriLinkedin = createImagePlane('/img/Raphael-Bieri-alt.png', assetCtx, [1, 1], true);
    const edwardRohrbachLinkedin = createImagePlane('/img/Eduard-Rohrbach-alt.png', assetCtx, [1, 1], true);
    const evaThomaLinkedin = createImagePlane('/img/Eva-Thoma-alt.png', assetCtx, [1, 1], true);
    const whatsappIcon = createImagePlane('/img/Whastapp.png', assetCtx, [0.2, 0.2], true, new Color('white'));
    const zoomIcon = createImagePlane('/img/Zoom.png', assetCtx, [0.2, 0.2], true, new Color('white'));
    const mobileIcon = createImagePlane('/img/Mobile.png', assetCtx, [0.2, 0.2], true, new Color('white'));
    const emailIcon = createImagePlane('/img/Email.png', assetCtx, [0.2, 0.2], true, new Color('white'));
    const r42BusinessCard = createImagePlane('/img/random42-business-card.png', assetCtx, [1, 1], true);
    const evaBio = createImagePlane('/img/Eva-Bio.png', assetCtx, [1, 1], true);
    const eduardBio = createImagePlane('/img/Eduard-Bio.png', assetCtx, [1, 1], true);
    const raphaelBio = createImagePlane('/img/Raphael-Bio.png', assetCtx, [1, 1], true);
    const quotation = createImagePlane('/img/quotation.png', assetCtx, [1, 1], true);
    const imageGallery = createImagePlane('/img/image-gallery.png', assetCtx, [1, 1], true);
    const auroraAppExplaination = createImagePlane('/img/Aurora-app.png', assetCtx, [1, 1], true);

    const btnLinc = createImagePlane('/img/btn_linc.png', assetCtx, [640 * PIXEL, 240 * PIXEL], true);
    const btnSma = createImagePlane('/img/btn_sma.png', assetCtx, [640 * PIXEL, 240 * PIXEL], true);
    const ed = createImagePlane('/img/ed.png', assetCtx, [640 * PIXEL, 240 * PIXEL], true);
    const eva = createImagePlane('/img/eva.png', assetCtx, [640 * PIXEL, 240 * PIXEL], true);
    const raph = createImagePlane('/img/raph.png', assetCtx, [640 * PIXEL, 240 * PIXEL], true);

    // video planes
    const mainVideo = createVideoPlane('mp4/aurora_demo.mp4', 1, 1, true);

    const uis: UIElementHandles = {
        evaThomaLinkedin: {
            kind: UIKinds.img,
            api: defaultEventHandlers,
            mesh: evaThomaLinkedin,
        },
        mainVideo: {
            kind: UIKinds.video,
            api: defaultEventHandlers,
            mesh: mainVideo.mesh,
        },
        edwardRohrbachLinkedin: {
            kind: UIKinds.img,
            api: defaultEventHandlers,
            mesh: edwardRohrbachLinkedin,
        },
        raphelBieriLinkedin: {
            kind: UIKinds.img,
            api: defaultEventHandlers,
            mesh: raphelBieriLinkedin,
        },
        whatsappIcon: {
            kind: UIKinds.button,
            api: defaultEventHandlers,
            mesh: whatsappIcon,
        },
        zoomIcon: {
            kind: UIKinds.button,
            api: defaultEventHandlers,
            mesh: zoomIcon,
        },
        mobileIcon: {
            kind: UIKinds.button,
            api: defaultEventHandlers,
            mesh: mobileIcon,
        },
        emailIcon: {
            kind: UIKinds.button,
            api: defaultEventHandlers,
            mesh: emailIcon,
        },
        r42BusinessCard: {
            kind: UIKinds.img,
            api: defaultEventHandlers,
            mesh: r42BusinessCard,
        },
        evaBio: {
            kind: UIKinds.div,
            api: defaultEventHandlers,
            mesh: evaBio,
        },
        eduardBio: {
            kind: UIKinds.div,
            api: defaultEventHandlers,
            mesh: eduardBio,
        },
        raphaelBio: {
            kind: UIKinds.div,
            api: defaultEventHandlers,
            mesh: raphaelBio,
        },
        imageGallery: {
            kind: UIKinds.div,
            api: defaultEventHandlers,
            mesh: imageGallery,
        },
        quotation: {
            kind: UIKinds.div,
            api: defaultEventHandlers,
            mesh: quotation,
        },
        auroraAppExplaination: {
            kind: UIKinds.div,
            api: defaultEventHandlers,
            mesh: auroraAppExplaination,
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
            api: defaultEventHandlers,
            mesh: btnLinc,
        },
        btnSma: {
            kind: UIKinds.button,
            api: defaultEventHandlers,
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

    const rootSurface = new Group();
    // root surface will be centred at the business card. We replace this with our own image:
    // setPosition(el.auroraAppExplaination.mesh, new Vector3(0, 0, 0));
    // rootSurface.add(el.auroraAppExplaination.mesh);

    const leftPanel = new Group();
    setPosition(el.btnLinc.mesh, new Vector3(0, 180 * PIXEL, 0));
    setPosition(el.btnSma.mesh, new Vector3(0, -180 * PIXEL, 0));
    leftPanel.add(...[el.btnLinc.mesh, el.btnSma.mesh]);

    const rightPanel = new Group();
    setPosition(el.eva.mesh, new Vector3(0, 180 * PIXEL, 0));
    setPosition(el.ed.mesh, new Vector3(0, 0, 0));
    setPosition(el.raph.mesh, new Vector3(0, -180 * PIXEL, 0));
    rightPanel.add(...[el.eva.mesh, el.ed.mesh, el.raph.mesh]);

    const belowPanel = new Group();
    // setPosition(el.quotation.mesh, new Vector3(-0.5, 0, 0));
    // setPosition(el.imageGallery.mesh, new Vector3(0.5, 0, 0));
    // belowPanel.add(...[el.quotation.mesh, el.imageGallery.mesh]);

    const abovePanel = new Group();
    // abovePanel.add(el.mainVideo.mesh);

    // grouos:
    setPosition(rightPanel, new Vector3(1430 * PIXEL, 0, 0));
    setPosition(leftPanel, new Vector3(-1430 * PIXEL, 0, 0));
    setPosition(belowPanel, new Vector3(0, -1024 * PIXEL, 0));
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
