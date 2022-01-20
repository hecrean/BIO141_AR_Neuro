import { EventHandlers } from '../event';
import { Mesh, MeshStandardMaterial, Texture, Vector2, PlaneBufferGeometry, DoubleSide, Vector3 } from 'three';
import { AssetsCtx } from '../assets';
import { isMesh } from '.';
import { option as o } from 'fp-ts';
import { pipe } from 'fp-ts/function';

// element

export const textureButtonMesh = (
    { texture: { api, cache } }: AssetsCtx,
    url: string,
    backgroundShown: boolean,
    size: Vector2,
    position: Vector3,
) => {
    const diffuseMapO = api.get(cache, url);

    const material = new MeshStandardMaterial({
        map: pipe(
            diffuseMapO,
            o.fold(
                () => new Texture(),
                (texture) => texture,
            ),
        ),
        transparent: backgroundShown,
        name: url,
        side: DoubleSide,
    });
    // procedurally change size of plane based on input texture size?
    const geometry = new PlaneBufferGeometry(size.x, size.y);
    const mesh = new Mesh<PlaneBufferGeometry, MeshStandardMaterial>(geometry, material);
    mesh.position.set(position.x, position.y, position.z);
    console.log(mesh);
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

export const buttonEventApi: EventHandlers = {
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
    // onPointerMove: (state, intersectionEv) => {
    //   isMesh(intersectionEv.object)
    //     ? intersectionEv.object.material.color.set("pink")
    //     : _;

    //   return state;
    // },
};
