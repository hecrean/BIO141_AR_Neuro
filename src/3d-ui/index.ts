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
    onPointerUp: (state, _) => state,
    onPointerDown: (state, _) => state,
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
    rootSurface.add(el.r42BusinessCard.mesh);

    const experience = new Group();
    // top-right
    setPosition(el.raphelBieriLinkedin.mesh, new Vector3(0.5, 0.5, 0));
    // top-left
    setPosition(el.edwardRohrbachLinkedin.mesh, new Vector3(-0.5, 0.5, 0));
    // bottom-right
    setPosition(el.evaThomaLinkedin.mesh, new Vector3(0.5, -0.5, 0));
    experience.add(
        ...[el.raphelBieriLinkedin.mesh, el.edwardRohrbachLinkedin.mesh, el.evaThomaLinkedin.mesh, el.mainVideo.mesh],
    );

    const bios = new Group();
    // top-right
    setPosition(el.evaBio.mesh, new Vector3(0, 0.4, 0));
    // top-left
    setPosition(el.eduardBio.mesh, new Vector3(0, 0, 0));
    // bottom-right
    setPosition(el.raphaelBio.mesh, new Vector3(0, -0.4, 0));
    experience.add(...[el.evaBio.mesh, el.edwardRohrbachLinkedin.mesh, el.eduardBio.mesh, el.raphaelBio.mesh]);

    const contactMethods = new Group();
    // left
    setPosition(el.zoomIcon.mesh, new Vector3(-0.6, 0, 0));
    // mid-left
    setPosition(el.mobileIcon.mesh, new Vector3(-0.2, 0, 0));
    // mid-right
    setPosition(el.emailIcon.mesh, new Vector3(0.4, 0, 0));
    // right
    setPosition(el.whatsappIcon.mesh, new Vector3(0.8, 0, 0));
    contactMethods.add(...[el.zoomIcon.mesh, el.mobileIcon.mesh, el.emailIcon.mesh, el.whatsappIcon.mesh]);

    // grouos:
    setPosition(bios, new Vector3(-1, 0, 0));
    setPosition(contactMethods, new Vector3(1, 0, 0));

    rootSurface.add(...[bios, contactMethods]);

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
