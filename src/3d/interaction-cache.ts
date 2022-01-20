import { EventHandlers } from './event';
import { Object3D } from 'three';

// db of object3d that are interactive, and their event handlers:
export type InteractionCache = Map<string, EventHandlers>;

export const interactionCache = (): InteractionCache => {
    return new Map<string, EventHandlers>();
};

interface InteractionCacheApi {
    register: (cache: InteractionCache) => (o: Object3D, eventHandlers: EventHandlers) => void;
    unregister: (cache: InteractionCache) => (o: Object3D) => void;
}

export const interactionCacheApi: InteractionCacheApi = {
    register: (cache) => (o, eventHandlers) => {
        cache.set(o.uuid, eventHandlers);
    },
    unregister: (cache) => (o) => {
        cache.delete(o.uuid);
    },
};
