import { CameraPipelineEventMsg } from './type';
import { surfaceHandlers, SurfaceHandles } from './surface';
import * as THREE from 'three';

export type TargetName = 'por_amor_al_arte' | 'escher_birds' | 'conversations_with_friends';

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

export const onImageFoundListener = (surfaces: SurfaceHandles): CameraPipelineEventMsg => {
    return {
        event: 'reality.imagefound',
        process: ({ name, detail }) => {
            const { r, q, s } = getTargetTransform(detail);
            const { align, makeVisible, play } = surfaceHandlers;
            log(name, detail);
            switch (detail.name) {
                case 'escher_birds': {
                    const surface = surfaces[detail.name];
                    align(surface)(r, q, s);
                    makeVisible(surface);
                    play(surface);
                    break;
                }
                case 'por_amor_al_arte': {
                    const surface = surfaces[detail.name];
                    align(surface)(r, q, s);
                    makeVisible(surface);
                    play(surface);
                    break;
                }
                default:
                    break;
            }
        },
    };
};
export const onImageLostListener = (surfaces: SurfaceHandles): CameraPipelineEventMsg => {
    return {
        event: 'reality.imagelost',
        process: ({ name, detail }) => {
            log(name, detail);
            const { pause, makeInvisible } = surfaceHandlers;
            switch (detail.name) {
                case 'escher_birds': {
                    const surf = surfaces[detail.name];
                    pause(surf);
                    makeInvisible(surfaces[detail.name]);
                    break;
                }
                case 'por_amor_al_arte': {
                    const surf = surfaces[detail.name];
                    pause(surf);
                    makeInvisible(surf);
                    break;
                }
                default:
                    break;
            }
        },
    };
};

export const onImageUpdatedListener = (surfaces: SurfaceHandles): CameraPipelineEventMsg => {
    return {
        event: 'reality.imageupdated',
        process: ({ name, detail }) => {
            const { r, q, s } = getTargetTransform(detail);
            const { align } = surfaceHandlers;
            log(name, detail);
            switch (detail.name) {
                case 'escher_birds': {
                    const surface = surfaces[detail.name];
                    align(surface)(r, q, s);
                    break;
                }
                case 'por_amor_al_arte': {
                    const surface = surfaces[detail.name];
                    align(surface)(r, q, s);
                    break;
                }
                default:
                    break;
            }
        },
    };
};
