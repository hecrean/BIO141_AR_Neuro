import {
    DoubleSide,
    Mesh,
    MeshPhysicalMaterial,
    PlaneBufferGeometry,
    VideoTexture,
    Matrix4,
    Vector3,
    Euler,
} from 'three';
import { EventHandlers } from '../event';
import { isMesh } from '.';

export const videoMesh = (videoUrl: string, position: Vector3, rotation: Vector3) => {
    const videoEl = document.createElement('video');
    videoEl.src = videoUrl;
    videoEl.crossOrigin = 'Anonymous';
    videoEl.loop = true;
    videoEl.play();

    const mesh = new Mesh(
        new PlaneBufferGeometry(1, 1),
        new MeshPhysicalMaterial({
            clearcoat: 1,
            clearcoatRoughness: 0,
            toneMapped: false,
            side: DoubleSide,
            map: new VideoTexture(videoEl),
        }),
    );
    mesh.position.set(position.x, position.y, position.z);
    mesh.rotation.set(rotation.x, rotation.y, rotation.z);
    return mesh;
};

// event handlers

export const defaultEventHandlers: EventHandlers = {
    onPointerEnter: (state, _) => state,
    onPointerUp: (state, _) => state,
    onPointerDown: (state, _) => state,
    onPointerOver: (state, _) => state,
    onPointerOut: (state, _) => state,
    onPointerLeave: (state, _) => state,
    onPointerMove: (state, _) => state,
    onPointerCancel: (state, _) => state,
    onTouchStart: (state, _) => state,
    onTouchMove: (state, _) => state,
    onTouchEnd: (state, _) => state,
    onTouchCancel: (state, _) => state,
};

const unitFn = () => {
    return;
};

export const videoEventApi: EventHandlers = {
    ...defaultEventHandlers,
    onTouchStart: ({ renderCtx, sceneCtx, userCtx, assetCtx }, intersectionEv) => {
        //Prevent the browser from processing emulated mouse events.
        intersectionEv.nativeEvent.event.preventDefault();

        return { renderCtx, sceneCtx, userCtx, assetCtx };
    },
    onPointerDown: (state, intersectionEv) => {
        isMesh(intersectionEv.object) ? intersectionEv.object.material.color.set('yellow') : unitFn;

        return state;
    },
    onPointerUp: (state, intersectionEv) => {
        isMesh(intersectionEv.object) ? intersectionEv.object.material.color.set('blue') : unitFn;

        return state;
    },
};
