/**  */

import { VideoTexture, LinearFilter, RGBFormat, Mesh, PlaneGeometry, MeshBasicMaterial } from 'three';

export type VideoPlane = {
    videoEl: HTMLVideoElement;
    mesh: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>;
};

interface VideoPlaneHandlers {
    play: (surface: VideoPlane) => void;
    pause: (surface: VideoPlane) => void;
}

export const createVideoPlane = (videoUrl: string, width: number, height: number, visible: boolean): VideoPlane => {
    const videoEl = document.createElement('video');
    videoEl.src = videoUrl;
    videoEl.crossOrigin = 'Anonymous';
    videoEl.loop = true;

    const texture = new VideoTexture(videoEl);
    texture.minFilter = LinearFilter;
    texture.magFilter = LinearFilter;
    texture.format = RGBFormat;

    const mesh = new Mesh(new PlaneGeometry(width, height), new MeshBasicMaterial({ map: texture, visible: visible }));

    return {
        videoEl,
        mesh,
    };
};

export const videoPlaneHandlers: VideoPlaneHandlers = {
    play: (surface: VideoPlane) => {
        surface.videoEl.play();
    },
    pause: (surface: VideoPlane) => {
        surface.videoEl.pause();
    },
};
