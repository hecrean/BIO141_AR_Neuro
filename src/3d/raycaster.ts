import * as THREE from 'three';
import { Vector2 } from 'three';
import { IntersectionEvent, CanvasEvent, CanvasEventName } from './event';
import { SceneGraphCtx, RenderCxt } from './state';

export const initRaycaster = () => {
    const raycaster = new THREE.Raycaster();

    return raycaster;
};

/**
 *
 */
export interface RaycasterApi {
    setRayOrientation: (
        raycaster: THREE.Raycaster,
    ) => (screenRaySource: THREE.Vector2, camera: THREE.PerspectiveCamera) => void;
    threeEvent: <K extends CanvasEventName>(
        canvasEvent: CanvasEvent<K>,
    ) => ({ raycaster }: SceneGraphCtx) => ({ scene, camera }: RenderCxt) => IntersectionEvent<K>[];
}

export const api = {
    setRayOrientation:
        (raycaster: THREE.Raycaster) =>
        (screenRaySource: THREE.Vector2, camera: THREE.PerspectiveCamera): void => {
            raycaster.setFromCamera(screenRaySource, camera);
        },

    threeEvent:
        <K extends CanvasEventName>(canvasEvent: CanvasEvent<K>) =>
        ({ raycaster }: SceneGraphCtx) =>
        ({ scene, camera }: RenderCxt): IntersectionEvent<K>[] => {
            switch (canvasEvent.tag) {
                // case "pointercancel":
                case 'pointerdown':
                // case "pointerenter":
                // case "pointerleave":
                case 'pointermove':
                // case "pointerout":
                // case "pointerover":
                case 'pointerup': {
                    canvasEvent.tag === 'pointermove' ? console.log(canvasEvent.tag) : () => ({});
                    const ev = canvasEvent.event as PointerEvent;

                    const pointerPosition = new Vector2(
                        (ev.clientX / window.innerWidth) * 2 - 1,
                        -(ev.clientY / window.innerHeight) * 2 + 1,
                    );

                    raycaster.setFromCamera(pointerPosition, camera);

                    const intersections: THREE.Intersection<THREE.Object3D<HTMLElementEventMap[K]>>[] =
                        raycaster.intersectObjects(scene.children);

                    const pointerEvts: IntersectionEvent<K>[] = intersections.map((intersection) => ({
                        ...intersection,
                        nativeEvent: canvasEvent as CanvasEvent<K>,
                    }));
                    return pointerEvts;
                }
                default:
                    return [];
            }
        },
};
