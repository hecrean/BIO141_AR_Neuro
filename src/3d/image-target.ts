import { CameraPipelineEventMsg } from './type';
import { videoSurfaceHandlers } from './video-surface';
import { SceneGraphCtx } from './state';
import * as THREE from 'three';
import { Mesh, Vector3 } from 'three';
import { basisVectors } from '../math';

// this is used to keep track of our image targets...
export type TargetName = 'por_amor_al_arte' | 'escher_birds' | 'conversations_with_friends' | 'business_card';

type Detail = {
    position: { x: number; y: number; z: number };
    rotation: { x: number; y: number; z: number; w: number };
    scale: number;
};

const log = (name: string, detail: Detail) => {
    console.log(`handling event ${name}: details: ${JSON.stringify(detail)}`);
};

const getTargetTransform = (detail: Detail) => {
    const { x: x1, y: x2, z: x3 } = detail.position;
    const { x: q1, y: q2, z: q3, w: q4 } = detail.rotation;
    const r = new THREE.Vector3(x1, x2, x3);
    const q = new THREE.Quaternion(q1, q2, q3, q4);
    const s = new THREE.Vector3(detail.scale, detail.scale, detail.scale);

    return { r, q, s };
};

type Transform = {
    position: THREE.Vector3;
    rotation: THREE.Quaternion;
    scale: THREE.Vector3;
};

// we want to transform meshes ino the same plane as the image target, but at an offset:
function transformMeshInImageTargetPlane(imgTargetTransform: Transform, offset: Vector3, mesh: Mesh): void {
    mesh.position.copy(imgTargetTransform.position);
    mesh.quaternion.copy(imgTargetTransform.rotation);
    mesh.scale.set(imgTargetTransform.scale.x, imgTargetTransform.scale.y, imgTargetTransform.scale.z);

    // const normal = new Vector3()
    //     .set(imgTargetTransform.position.x, imgTargetTransform.position.y, imgTargetTransform.position.z)
    //     .applyQuaternion(imgTargetTransform.rotation);
    const [e1, e2, e3] = basisVectors(mesh);

    //offset the mesh by an amout in the xy component of the normal:
    mesh.translateOnAxis(e1, offset.x);
    mesh.translateOnAxis(e2, offset.y);
    mesh.translateOnAxis(e3, offset.z);
}

export const onImageFoundListener = (sceneCtx: SceneGraphCtx): CameraPipelineEventMsg => {
    return {
        event: 'reality.imagefound',
        process: ({ name, detail }) => {
            const { r, q, s } = getTargetTransform(detail);
            const { align, makeVisible, play } = videoSurfaceHandlers;
            log(name, detail);
            switch (detail.name) {
                case 'escher_birds': {
                    const surface = sceneCtx.videoSurfaceHandles[detail.name];
                    align(surface)(r, q, s);
                    makeVisible(surface);
                    play(surface);
                    transformMeshInImageTargetPlane(
                        { position: r, rotation: q, scale: s },
                        new Vector3(0, 1, 0),
                        sceneCtx.ui['ui-EvaThomaWireframe'].el,
                    );
                    // sceneCtx.ui['ui-EvaThomaWireframe'].el.visible = true;
                    break;
                }
                case 'por_amor_al_arte': {
                    const surface = sceneCtx.videoSurfaceHandles[detail.name];
                    align(surface)(r, q, s);
                    makeVisible(surface);
                    play(surface);
                    transformMeshInImageTargetPlane(
                        { position: r, rotation: q, scale: s },
                        new Vector3(0, 1, 0),
                        sceneCtx.ui['ui-EvaThomaWireframe'].el,
                    );
                    // sceneCtx.ui['ui-EvaThomaWireframe'].el.visible = true;

                    break;
                }
                case 'business_card': {
                    const surface = sceneCtx.videoSurfaceHandles[detail.name];
                    align(surface)(r, q, s);
                    makeVisible(surface);
                    play(surface);
                    transformMeshInImageTargetPlane(
                        { position: r, rotation: q, scale: s },
                        new Vector3(0, 1, 0),
                        sceneCtx.ui['ui-EvaThomaWireframe'].el,
                    );
                    // sceneCtx.ui['ui-EvaThomaWireframe'].el.visible = true;

                    break;
                }
                default:
                    break;
            }
        },
    };
};
export const onImageLostListener = (sceneCtx: SceneGraphCtx): CameraPipelineEventMsg => {
    return {
        event: 'reality.imagelost',
        process: ({ name, detail }) => {
            log(name, detail);
            const { pause, makeInvisible } = videoSurfaceHandlers;
            switch (detail.name) {
                case 'escher_birds': {
                    const surf = sceneCtx.videoSurfaceHandles[detail.name];
                    pause(surf);
                    makeInvisible(sceneCtx.videoSurfaceHandles[detail.name]);
                    sceneCtx.ui['ui-EvaThomaWireframe'].el.visible = false;

                    break;
                }
                case 'por_amor_al_arte': {
                    const surf = sceneCtx.videoSurfaceHandles[detail.name];
                    pause(surf);
                    makeInvisible(surf);
                    sceneCtx.ui['ui-EvaThomaWireframe'].el.visible = false;

                    break;
                }
                case 'business_card': {
                    const surf = sceneCtx.videoSurfaceHandles[detail.name];
                    pause(surf);
                    makeInvisible(surf);
                    sceneCtx.ui['ui-EvaThomaWireframe'].el.visible = false;

                    break;
                }
                default:
                    break;
            }
        },
    };
};

export const onImageUpdatedListener = (sceneCtx: SceneGraphCtx): CameraPipelineEventMsg => {
    return {
        event: 'reality.imageupdated',
        process: ({ name, detail }) => {
            const { r, q, s } = getTargetTransform(detail);
            const { align } = videoSurfaceHandlers;
            log(name, detail);
            switch (detail.name) {
                case 'escher_birds': {
                    const surface = sceneCtx.videoSurfaceHandles[detail.name];
                    align(surface)(r, q, s);
                    break;
                }
                case 'por_amor_al_arte': {
                    const surface = sceneCtx.videoSurfaceHandles[detail.name];
                    align(surface)(r, q, s);
                    break;
                }
                case 'business_card': {
                    const surface = sceneCtx.videoSurfaceHandles[detail.name];
                    align(surface)(r, q, s);
                    break;
                }
                default:
                    break;
            }
        },
    };
};
