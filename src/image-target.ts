import { ImageFoundMsg, ImageLostMsg, ImageUpdatedMsg } from './type';
import { SceneGraphCtx } from './state';
import { Vector3, Quaternion } from 'three';

// this is used to keep track of our image targets...

export type TargetName =
    // | 'Eva-Thoma-front'
    // | 'Eduard-Rohrbach-front'
    // | 'Raphael-Bieri-front'
    // | 'business_card'
    'r42-business-card';

type Transform = {
    position: { x: number; y: number; z: number };
    rotation: { x: number; y: number; z: number; w: number };
    scale: number;
};
export const initTransform = () => ({
    position: { x: 0, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 0, w: 0 },
    scale: 0,
});

type ImageTarget<T extends TargetName> = { tag: T; transform: Transform };

const createImageTarget = (tag: TargetName, transform: Transform) => ({ tag, transform });

export type ImageTargets = { [T in TargetName]: ImageTarget<T> };

export const initImageTargets = (): ImageTargets => ({
    'r42-business-card': { tag: 'r42-business-card', transform: initTransform() },
});

const log = (name: string, detail: Transform) => {
    console.log(`handling event ${name}: details: ${JSON.stringify(detail)}`);
};

// type Transform = {
//     position: THREE.Vector3;
//     rotation: THREE.Quaternion;
//     scale: THREE.Vector3;
// };

// const getTargetTransform = (detail: Detail): Transform => {
//     const { x: x1, y: x2, z: x3 } = detail.position;
//     const { x: q1, y: q2, z: q3, w: q4 } = detail.rotation;
//     const r = new Vector3(x1, x2, x3);
//     const q = new Quaternion(q1, q2, q3, q4);
//     const s = new Vector3(detail.scale, detail.scale, detail.scale);

//     return { position: r, rotation: q, scale: s };
// };

export const onImageFoundListener = (sceneCtx: SceneGraphCtx, imageTargets: ImageTargets): ImageFoundMsg => {
    return {
        event: 'reality.imagefound',
        process: ({ name, detail }) => {
            log(name, detail);
            switch (detail.name) {
                case 'r42-business-card': {
                    imageTargets[detail.name] = createImageTarget(detail.name, {
                        position: detail.position,
                        rotation: detail.rotation,
                        scale: detail.scale,
                    });
                    const root = sceneCtx.uiComponentHandles.rootSurface.group;
                    root.visible = true;

                    root.position.copy(new Vector3(detail.position.x, detail.position.y, detail.position.z));
                    root.quaternion.copy(
                        new Quaternion(detail.rotation.x, detail.rotation.y, detail.rotation.z, detail.rotation.w),
                    );
                    root.scale.set(detail.scale, detail.scale, detail.scale);
                    break;
                }

                default:
                    break;
            }
        },
    };
};
export const onImageLostListener = (sceneGraphCtx: SceneGraphCtx, imageTargets: ImageTargets): ImageLostMsg => {
    return {
        event: 'reality.imagelost',
        process: ({ name, detail }) => {
            log(name, detail);
            switch (detail.name) {
                case 'r42-business-card': {
                    console.log(imageTargets[detail.name]);
                    console.log(sceneGraphCtx);

                    // const root = sceneCtx.uiComponentHandles.rootSurface.group;
                    // root.visible = false;

                    break;
                }
                default:
                    break;
            }
        },
    };
};

export const onImageUpdatedListener = (sceneCtx: SceneGraphCtx, imageTargets: ImageTargets): ImageUpdatedMsg => {
    return {
        event: 'reality.imageupdated',
        process: ({ name, detail }) => {
            log(name, detail);
            switch (detail.name) {
                case 'r42-business-card': {
                    imageTargets[detail.name] = createImageTarget(detail.name, {
                        position: detail.position,
                        rotation: detail.rotation,
                        scale: detail.scale,
                    });
                    const root = sceneCtx.uiComponentHandles.rootSurface.group;
                    root.position.copy(new Vector3(detail.position.x, detail.position.y, detail.position.z));
                    root.quaternion.copy(
                        new Quaternion(detail.rotation.x, detail.rotation.y, detail.rotation.z, detail.rotation.w),
                    );
                    root.scale.set(detail.scale, detail.scale, detail.scale);
                    // root.visible = true;
                    break;
                }
                default:
                    break;
            }
        },
    };
};
