import { DoubleSide, Mesh, PlaneGeometry, MeshBasicMaterial, Color } from 'three';
import { AssetsCtx } from '../assets';
import { option } from 'fp-ts';
import { pipe } from 'fp-ts/function';

export type ImagePlane = {
    mesh: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>;
};

export const createImagePlane = (
    imageUrl: string,
    asset: AssetsCtx,
    size: [number, number],
    visible: boolean,
    backgroundColor?: Color,
) => {
    const imgTexture = pipe(
        asset.texture.api.get(asset.texture.cache, imageUrl),
        option.map((texture) => {
            texture.generateMipmaps = false;
            return texture;
        }),
        option.getOrElseW(() => null),
    );

    const mesh = new Mesh(
        new PlaneGeometry(size[0], size[1]),
        new MeshBasicMaterial({
            side: DoubleSide,
            map: imgTexture,
            visible: visible,
            color: backgroundColor,
            transparent: true,
        }),
    );

    return mesh;
};
