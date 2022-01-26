/**  */

import { VideoTexture, LinearFilter, RGBFormat, Mesh, PlaneGeometry, MeshBasicMaterial, Texture } from 'three';
import { pipe } from 'fp-ts/function'
import { AssetsCtx } from '../assets';
import { option } from 'fp-ts'

export type VideoPlane = {
    videoEl: HTMLVideoElement;
    posterTexture: Texture | null;
    mesh: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>;
};

interface VideoPlaneHandlers {
    play: (surface: VideoPlane) => void;
    pause: (surface: VideoPlane) => void;
}

export const createVideoPlane = (asset: AssetsCtx, videoUrl: string, posterUrl: string, width: number, height: number, visible: boolean): VideoPlane => {
    const videoEl = document.createElement('video');
    videoEl.src = videoUrl;
    videoEl.crossOrigin = 'Anonymous';
    videoEl.loop = true;
    videoEl.poster = 'https://caples.org/images/video-play-button.png';
    videoEl.controls = false;

    const posterTexture = pipe(
        asset.texture.api.get(asset.texture.cache, posterUrl),
        option.getOrElseW(() => null),
    );
  
    const mesh = new Mesh(new PlaneGeometry(width, height), new MeshBasicMaterial({ map: posterTexture, visible: visible }));

    return {
        videoEl,
        posterTexture,
        mesh,
    };
};

export const videoPlaneHandlers: VideoPlaneHandlers = {
    play: (surface: VideoPlane) => {
        
        const videoTexture = new VideoTexture(surface.videoEl);
        videoTexture.minFilter = LinearFilter;
        videoTexture.magFilter = LinearFilter;
        videoTexture.format = RGBFormat;
        surface.mesh.material.map =  videoTexture
        surface.videoEl.play();
    },
    pause: (surface: VideoPlane) => {
        surface.videoEl.pause();
    },
};
