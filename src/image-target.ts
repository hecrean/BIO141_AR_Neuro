import { ImageFoundMsg, ImageLostMsg, ImageUpdatedMsg } from './type';
import { SceneGraphCtx } from './state';
import { Vector3, Quaternion } from 'three';

// this is used to keep track of our image targets...
export type TargetName = 'Eva-Thoma-front' | 'Eduard-Rohrbach-front' | 'Raphael-Bieri-front' | 'business_card';

type Detail = {
    position: { x: number; y: number; z: number };
    rotation: { x: number; y: number; z: number; w: number };
    scale: number;
};

const log = (name: string, detail: Detail) => {
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

export const onImageFoundListener = (sceneCtx: SceneGraphCtx): ImageFoundMsg => {
    return {
        event: 'reality.imagefound',
        process: ({ name, detail }) => {
            log(name, detail);
            switch (detail.name) {
                case 'business_card': {
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
export const onImageLostListener = (sceneCtx: SceneGraphCtx): ImageLostMsg => {
    return {
        event: 'reality.imagelost',
        process: ({ name, detail }) => {
            log(name, detail);
            switch (detail.name) {
                case 'business_card': {
                    const root = sceneCtx.uiComponentHandles.rootSurface.group;
                    // root.visible = false;
                    break;
                }
                default:
                    break;
            }
        },
    };
};

export const onImageUpdatedListener = (sceneCtx: SceneGraphCtx): ImageUpdatedMsg => {
    return {
        event: 'reality.imageupdated',
        process: ({ name, detail }) => {
            log(name, detail);
            switch (detail.name) {
                case 'business_card': {
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
