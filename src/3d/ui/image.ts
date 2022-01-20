import { DoubleSide, Mesh, PlaneGeometry, Vector3, LinearFilter, RGBFormat, MeshBasicMaterial } from 'three';
import { EventHandlers } from '../event';
import { isMesh } from '.';
import { AssetsCtx } from '../assets';
import { option } from 'fp-ts';
import { pipe } from 'fp-ts/function';

export const imageMesh = (imageUrl: string, asset: AssetsCtx, position: Vector3, rotation: Vector3) => {
    const imgTexture = pipe(
        asset.texture.api.get(asset.texture.cache, imageUrl),
        option.getOrElseW(() => null),
    );
    if (imgTexture) {
        imgTexture.minFilter = LinearFilter;
        imgTexture.magFilter = LinearFilter;
        imgTexture.format = RGBFormat;
    }

    const mesh = new Mesh(
        new PlaneGeometry(0.75, 1),
        new MeshBasicMaterial({
            side: DoubleSide,
            map: imgTexture,
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
    onTouchStart: ({ renderCtx, sceneCtx, assetCtx }, intersectionEv) => {
        //Prevent the browser from processing emulated mouse events.
        intersectionEv.nativeEvent.event.preventDefault();

        return { renderCtx, sceneCtx, assetCtx };
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
