import {  Mesh } from 'three';
import { AssetsCtx } from '../assets';
import { option } from 'fp-ts';
import { pipe } from 'fp-ts/function';
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';
import { isMeshWithStandardMaterial } from '../util';


const load3DModelFromFile = (gltf: GLTF) => {
    const model: Array<Mesh> = [];
    gltf.scene.traverse((child) => {
        if(isMeshWithStandardMaterial(child)){
           model.push(child)
        }
    })
    return model;
}

export const create3DModel = (
    glbUrl: string,
    asset: AssetsCtx,
):  Array<Mesh> => {
    return pipe(
        asset.gltf.api.get(asset.gltf.cache, glbUrl),
        option.map(load3DModelFromFile),
        option.getOrElseW(() => ([])),
    );
};


