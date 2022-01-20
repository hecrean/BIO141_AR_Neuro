import './style.css';

// import { loadAr } from './ar-module-pipeline';

// loadAr();

import { update, responseToInput } from './3d/three-scene';
import { initState, initRenderCxt, initSceneGraphCtx, initUserCtx } from './3d/state';
import { input$ } from './3d/event';
import { textureBundle } from './bundles';
import { initAssetCtx, loadAssetBundle } from './3d/assets';

const run = async () => {
    const assetCtx = initAssetCtx();
    await loadAssetBundle(assetCtx.texture.api, assetCtx.texture.cache, textureBundle)();
    const renderCtx = initRenderCxt();
    const userCtx = initUserCtx(renderCtx.camera, renderCtx.gl.domElement);
    const sceneCxt = initSceneGraphCtx(assetCtx);
    const state = initState(renderCtx, userCtx, sceneCxt, assetCtx);
    update(state);
    input$.subscribe((input) => responseToInput(input, state));
};

await run();
