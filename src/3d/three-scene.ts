import { State } from './state';
import { api as raycasterApi } from './raycaster';
import { Input } from './user';
import { interpreter } from './event';

const resizeCanvas = ({ renderCtx: { gl, camera } }: State): void => {
    const canvasEl = gl.domElement;
    const width = canvasEl.clientWidth;
    const height = canvasEl.clientHeight;
    const needResize = canvasEl.width !== width || canvasEl.height !== height;
    if (needResize) {
        gl.setSize(width, height, false);
        camera.aspect = canvasEl.clientWidth / canvasEl.clientHeight;
        camera.updateProjectionMatrix();
    }
};

const render = ({ renderCtx: { scene, gl, camera } }: State): void => {
    gl.render(scene, camera);
};

export const responseToInput = (input: Input, state: State) => {
    const { threeEvent } = raycasterApi;
    const intersectionEvts = threeEvent(input.canvasEvent)(state.sceneCtx)(state.renderCtx);
    return interpreter(state, intersectionEvts[0]);
};

// --> Update

export const update = (state: State) => {
    resizeCanvas(state);
    render(state);
    requestAnimationFrame(() => update(state));
};
