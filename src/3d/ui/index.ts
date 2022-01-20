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

export type UIs = Record<
    string,
    {
        name: string;
        kind: UIKinds;
        api: EventHandlers;
        el: Mesh;
    }
>;

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
    const linkedinButton = textureButtonMesh(
        assetCtx,
        '/img/linkedin_logo.png',
        false,
        new Vector2(4, 4),
        new Vector3(0, -1, 3),
    );
    const textButton = textureButtonMesh(assetCtx, '/img/text.jpg', false, new Vector2(4, 4), new Vector3(3, 3, 3));

    const biogenButton = textureButtonMesh(assetCtx, '/img/biogen.png', false, new Vector2(4, 4), new Vector3(2, 1, 1));

    const mainVideo = videoMesh('/aurora_demo.mp4', new Vector3(5, 0, 0), new Vector3(2, 0, 0));

    const uis: UIs = {
        'ui-linkedinButton': {
            name: 'ui-linkedinButton',
            kind: UIKinds.Button,
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
            el: linkedinButton,
        },
        'ui-textButton': {
            name: 'ui-textButton',
            kind: UIKinds.Button,
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
            el: textButton,
        },
        'ui-biogenButton': {
            name: 'ui-biogenButton',
            kind: UIKinds.Button,
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
            el: biogenButton,
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
    Object.values(UIs).map((ui) => interactionCacheApi.register(cache)(ui.el, buttonEventApi));
};
