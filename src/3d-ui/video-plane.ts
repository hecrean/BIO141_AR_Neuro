/**  */

import { VideoTexture, LinearFilter, RGBFormat, Mesh, PlaneGeometry, Texture, ShaderMaterial } from 'three';
import { pipe } from 'fp-ts/function'
import { AssetsCtx } from '../assets';
import { option } from 'fp-ts'
import { createImageMaterial, ImgMaterialUniforms} from './image-plane-custom-shader'

export type VideoPlane = {
    videoEl: HTMLVideoElement;
    posterTexture: Texture;
    videoTexture: VideoTexture;
    mesh: THREE.Mesh<THREE.PlaneGeometry, ShaderMaterial>;
};

interface VideoPlaneHandlers {
    play: (surface: VideoPlane) => void;
    pause: (surface: VideoPlane) => void;
}

export const createVideoPlane = (asset: AssetsCtx, videoUrl: string, posterUrl: string, width: number, height: number): VideoPlane => {
    const videoEl = document.createElement('video');
    videoEl.src = videoUrl;
    videoEl.crossOrigin = 'Anonymous';
    videoEl.loop = true;
    videoEl.poster = 'https://caples.org/images/video-play-button.png';
    videoEl.controls = false;

    const posterTexture = pipe(
        asset.texture.api.get(asset.texture.cache, posterUrl),
        option.getOrElseW(() => new Texture()),
    );

    const videoTexture = new VideoTexture(videoEl);
        videoTexture.minFilter = LinearFilter;
        videoTexture.magFilter = LinearFilter;
        videoTexture.format = RGBFormat;
  
    // const mesh = new Mesh(new PlaneGeometry(width, height), new MeshBasicMaterial({ map: posterTexture, visible: visible }));
    const mesh = new Mesh(new PlaneGeometry(width, height),  createImageMaterial([1, 1], [width, height], posterTexture));

   
    return {
        videoEl,
        posterTexture,
        videoTexture,
        mesh,
    };
};

export const videoPlaneHandlers: VideoPlaneHandlers = {
    play: (surface: VideoPlane) => {
        (surface.mesh.material.uniforms as ImgMaterialUniforms).map.value = surface.videoTexture;
        surface.mesh.material.needsUpdate = true;

        // surface.mesh.material.map = surface.videoTexture;
        // surface.mesh.material.map.needsUpdate = true;
        // surface.mesh.material.needsUpdate = true

        // surface.mesh.material = new MeshBasicMaterial({map: surface.videoTexture})
        // surface.mesh.material.needsUpdate = true
        surface.videoEl.play();
    },
    pause: (surface: VideoPlane) => {
        (surface.mesh.material.uniforms as ImgMaterialUniforms).map.value = surface.posterTexture;
        surface.mesh.material.needsUpdate = true;
        // surface.mesh.material.map = surface.posterTexture;
        // surface.mesh.material.map.needsUpdate = true;
        // surface.mesh.material.needsUpdate = true

        // surface.mesh.material = new MeshBasicMaterial({map: surface.posterTexture})
        // surface.mesh.material.needsUpdate = true
        surface.videoEl.pause();
    },
};
