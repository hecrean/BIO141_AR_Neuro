import { EventHandlers } from '../events/canvas';
import { InteractionCache, interactionCacheApi } from '../interaction-cache';
import { Mesh, Object3D, BufferGeometry, MeshStandardMaterial, Group, Vector3 } from 'three';
import { AssetsCtx } from '../assets';
import { createImagePlane } from './image-plane';
import { createVideoPlane } from './video-plane';

enum UIKinds {
    Button,
    Video,
    Image,
    ImageTarget,
}

type UIElement = {
    name: string;
    kind: UIKinds;
    api: EventHandlers;
    mesh: Mesh;
};

export type UIElementHandles = {
    raphel_bio: UIElement;
    edward_bio: UIElement;
    eva_bio: UIElement;
    app_video: UIElement;
};

type UIComponent = {
    name: string;
    group: Group;
};

export type UIComponentHandles = {
    mainSurface: UIComponent;
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
    const raphelBieriAltImgMesh = createImagePlane('/img/Raphael-Bieri-alt.png', assetCtx, true);
    const edwardRohrbachAltImgMesh = createImagePlane('/img/Eduard-Rohrbach-alt.png', assetCtx, true);
    const evaThomaAltImgMesh = createImagePlane('/img/Eva-Thoma-alt.png', assetCtx, true);
    const mainVideo = createVideoPlane('mp4/aurora_demo.mp4', 1, 1, true);

    const uis: UIElementHandles = {
        eva_bio: {
            name: 'eva_bio',
            kind: UIKinds.Button,
            api: defaultEventHandlers,
            mesh: evaThomaAltImgMesh,
        },
        app_video: {
            name: 'app_video',
            kind: UIKinds.Video,
            api: defaultEventHandlers,
            mesh: mainVideo.mesh,
        },
        edward_bio: {
            name: 'edward_bio',
            kind: UIKinds.Button,
            api: defaultEventHandlers,
            mesh: edwardRohrbachAltImgMesh,
        },
        raphel_bio: {
            name: 'raphael_bio',
            kind: UIKinds.Button,
            api: defaultEventHandlers,
            mesh: raphelBieriAltImgMesh,
        },
    };

    return uis;
};

export const initUiComponents = (el: UIElementHandles): UIComponentHandles => {
    const setMeshPosition = (m: Mesh, { x, y, z }: Vector3) => {
        m.position.set(x, y, z);
        return m;
    };

    const mainSurface = new Group();
    setMeshPosition(el.raphel_bio.mesh, new Vector3(1, 1, 0));
    setMeshPosition(el.edward_bio.mesh, new Vector3(-1, 1, 0));
    setMeshPosition(el.eva_bio.mesh, new Vector3(1, -1, 0));
    setMeshPosition(el.app_video.mesh, new Vector3(-1, -1, 0));
    mainSurface.add(...[el.raphel_bio.mesh, el.edward_bio.mesh, el.eva_bio.mesh, el.app_video.mesh]);

    return {
        mainSurface: { name: 'mainSurface', group: mainSurface },
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
