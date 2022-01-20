import { fromEvent, map, merge, Observable } from 'rxjs';
import { State } from '../state';

// eslint @typescript-eslint/no-non-null-assertion
const canvasEl: HTMLCanvasElement = document.querySelector('canvas')!;

export type CanvasEventName = keyof HTMLElementEventMap;
type EventFromCanvasEventTag<K extends CanvasEventName> = HTMLElementEventMap[K];

export type CanvasEvent<K extends CanvasEventName> = {
    tag: K;
    element: HTMLCanvasElement;
    event: HTMLElementEventMap[K];
};

const observable = <K extends CanvasEventName>(canvasEl: HTMLCanvasElement, tag: K): Observable<CanvasEvent<K>> => {
    return fromEvent<EventFromCanvasEventTag<K>>(canvasEl, tag).pipe(
        map((ev) => ({ tag: tag, element: canvasEl, event: ev })),
    );
};

const pointercancel$ = observable(canvasEl, 'pointercancel');
const pointerdown$ = observable(canvasEl, 'pointerdown');
const pointerenter$ = observable(canvasEl, 'pointerenter');
const pointerleave$ = observable(canvasEl, 'pointerleave');
const pointermove$ = observable(canvasEl, 'pointermove');
const pointerout$ = observable(canvasEl, 'pointerout');
const pointerover$ = observable(canvasEl, 'pointerover');
const pointerup$ = observable(canvasEl, 'pointerup');

export type Input = {
    canvasEvent: CanvasEvent<CanvasEventName>;
};

// @TODO : we naively are just inputing raw streams. Use operators to control these streams (I.e throttle etc.)
export const input$ = merge(
    pointerover$,
    pointerenter$,
    pointerleave$,
    pointerdown$,
    pointermove$, //.pipe(throttle((_) => interval(1000))),
    pointerup$,
    pointercancel$,
    pointerout$,
).pipe(
    map<CanvasEvent<CanvasEventName>, Input>((canvasEv) => ({
        canvasEvent: canvasEv,
    })),
);

export interface IntersectionEvent<K extends CanvasEventName>
    extends THREE.Intersection<THREE.Object3D<HTMLElementEventMap[K]>> {
    nativeEvent: CanvasEvent<K>;
}

export type EventHandlers = {
    onPointerUp: (state: State, event: IntersectionEvent<'pointerup'>) => State;
    onPointerDown: (state: State, event: IntersectionEvent<'pointerdown'>) => State;
    onPointerOver: (state: State, event: IntersectionEvent<'pointerover'>) => State;
    onPointerOut: (state: State, event: IntersectionEvent<'pointerout'>) => State;
    onPointerEnter: (state: State, event: IntersectionEvent<'pointerenter'>) => State;
    onPointerLeave: (state: State, event: IntersectionEvent<'pointerleave'>) => State;
    onPointerMove: (state: State, event: IntersectionEvent<'pointermove'>) => State;
    onPointerCancel: (state: State, event: IntersectionEvent<'pointercancel'>) => State;
    onTouchStart: (state: State, event: IntersectionEvent<'touchstart'>) => State;
    onTouchMove: (state: State, event: IntersectionEvent<'touchmove'>) => State;
    onTouchEnd: (state: State, event: IntersectionEvent<'touchend'>) => State;
    onTouchCancel: (state: State, event: IntersectionEvent<'touchcancel'>) => State;
};

export const interpreter = <K extends CanvasEventName>(state: State, ev: IntersectionEvent<K>): State => {
    if (ev === undefined) return state;

    const { sceneCtx } = state;
    const handlers = sceneCtx.interactionCache.get(ev.object.uuid);

    if (!handlers) return state;

    switch (ev.nativeEvent.tag) {
        case 'pointercancel':
            return handlers.onPointerCancel(state, ev as IntersectionEvent<'pointercancel'>);
        case 'pointerdown':
            return handlers.onPointerDown(state, ev as IntersectionEvent<'pointerdown'>);
        case 'pointerenter':
            return handlers.onPointerEnter(state, ev as IntersectionEvent<'pointerenter'>);
        case 'pointerleave':
            return handlers.onPointerLeave(state, ev as IntersectionEvent<'pointerleave'>);
        case 'pointermove':
            return handlers.onPointerMove(state, ev as IntersectionEvent<'pointermove'>);
        case 'pointerout':
            return handlers.onPointerOut(state, ev as IntersectionEvent<'pointerout'>);
        case 'pointerover':
            return handlers.onPointerOver(state, ev as IntersectionEvent<'pointerover'>);
        case 'pointerup':
            return handlers.onPointerUp(state, ev as IntersectionEvent<'pointerup'>);
        default:
            return state;
    }
};
