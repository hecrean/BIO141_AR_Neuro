/**  */

import * as THREE from 'three';
import { TargetName } from './image-target';

export type VideoTargetSurface<T = TargetName> = {
    name: T;
    videoEl: HTMLVideoElement;
    surfaceMesh: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>;
};

export type VideoSurfaceHandles = { [K in TargetName]?: VideoTargetSurface<K> };

export const initVideoSurfaces = (): VideoSurfaceHandles => {
    return {
        business_card: mkVideoTargetSurface('business_card', '/mp4/aurora_demo.mp4'),
    };
};

interface VideoTargetSurfaceHandlers {
    play: (surface: VideoTargetSurface) => void;
    pause: (surface: VideoTargetSurface) => void;
    align: (
        surface: VideoTargetSurface,
    ) => (position: THREE.Vector3, rotation: THREE.Quaternion, scale: THREE.Vector3) => void;
    makeVisible: (surface: VideoTargetSurface) => void;
    makeInvisible: (surface: VideoTargetSurface) => void;
}

export const mkVideoTargetSurface = <K = TargetName>(targetName: K, videoUrl: string): VideoTargetSurface<K> => {
    const videoEl = document.createElement('video');
    videoEl.src = videoUrl;
    videoEl.setAttribute('preload', 'auto');
    videoEl.setAttribute('loop', '');
    videoEl.setAttribute('muted', '');
    videoEl.setAttribute('playsinline', '');
    videoEl.setAttribute('webkit-playsinline', '');

    const texture = new THREE.VideoTexture(videoEl);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.format = THREE.RGBFormat;

    const surfaceMesh = new THREE.Mesh(new THREE.PlaneGeometry(0.75, 1), new THREE.MeshBasicMaterial({ map: texture }));
    return {
        name: targetName,
        videoEl,
        surfaceMesh,
    };
};

export const videoSurfaceHandlers: VideoTargetSurfaceHandlers = {
    play: (surface: VideoTargetSurface) => {
        surface.videoEl.play();
    },
    pause: (surface: VideoTargetSurface) => {
        surface.videoEl.pause();
    },
    align:
        (surface: VideoTargetSurface) =>
        (position: THREE.Vector3, rotation: THREE.Quaternion, scale: THREE.Vector3) => {
            surface.surfaceMesh.position.copy(position);
            surface.surfaceMesh.quaternion.copy(rotation);
            surface.surfaceMesh.scale.set(scale.x, scale.y, scale.z);
        },
    makeVisible: (surface: VideoTargetSurface) => {
        surface.surfaceMesh.visible = true;
    },
    makeInvisible: (surface: VideoTargetSurface) => {
        surface.surfaceMesh.visible = false;
    },
};
