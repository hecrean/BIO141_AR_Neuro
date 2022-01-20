import { EventHandlers } from '../event';
import { buttonEventApi, textureButtonMesh } from './button';
import { videoMesh } from './video';
import { InteractionCache, interactionCacheApi } from '../interaction-cache';
import { Mesh, Vector2, Object3D, BufferGeometry, MeshStandardMaterial, Vector3 } from 'three';
import { AssetsCtx } from '../assets';

enum UIKinds {
    Button,
    None,
    Video,
}

type UIKey = 'ui-EvaThomaWireframe' | 'ui-main-video';

type UIValue = {
    name: string;
    kind: UIKinds;
    api: EventHandlers;
    el: Mesh;
};

export type UIs = { [K in UIKey]: UIValue };

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

const unitFn = () => {
    return;
};
export const isMesh = (o: Object3D): o is Mesh<BufferGeometry, MeshStandardMaterial> => {
    return o instanceof Mesh;
};

export const initUiElements = (assetCtx: AssetsCtx): UIs => {
    // const linkedinButton = textureButtonMesh(
    //     assetCtx,
    //     '/img/linkedin_logo.png',
    //     false,
    //     new Vector2(4, 4),
    //     new Vector3(0, -1, 3),
    // );
    // const textButton = textureButtonMesh(assetCtx, '/img/text.jpg', false, new Vector2(4, 4), new Vector3(3, 3, 3));

    // const biogenButton = textureButtonMesh(assetCtx, '/img/biogen.png', false, new Vector2(4, 4), new Vector3(2, 1, 1));

    const evaThomaWireframeButton = textureButtonMesh(
        assetCtx,
        '/eva-thoma-wireframe/wireframe.jpg',
        false,
        new Vector2(9.72, 3.49),
        new Vector3(0, 0, 0),
        true,
    );

    const mainVideo = videoMesh('mp4/aurora_demo.mp4', new Vector3(5, 0, 0), new Vector3(2, 0, 0));

    const uis: UIs = {
        'ui-EvaThomaWireframe': {
            name: 'ui-EvaThomaWireframe',
            kind: UIKinds.Button,
            api: buttonEventApi,
            el: evaThomaWireframeButton,
        },
        'ui-main-video': {
            name: 'ui-main-video',
            kind: UIKinds.Video,
            api: {
                ...defaultEventHandlers,
                onPointerDown: (state, intersectionEv) => {
                    isMesh(intersectionEv.object) ? intersectionEv.object.material.color.set('yellow') : unitFn;

                    return state;
                },
                onPointerUp: (state, intersectionEv) => {
                    isMesh(intersectionEv.object) ? intersectionEv.object.material.color.set('blue') : unitFn;

                    return state;
                },
            },
            el: mainVideo,
        },
    };

    return uis;
};

export const registerUi = (cache: InteractionCache, UIs: UIs) => {
    Object.values(UIs).map((ui) => interactionCacheApi.register(cache)(ui.el, ui.api));
};
