// Want to replicate grid layout, but in 3d:

import { Object3D, Vector3 } from 'three';

export type V3 = [x: number, y: number, z: number];

export function zero(): V3 {
    return [0, 0, 0];
}

export function one(): V3 {
    return [1, 1, 1];
}

export function add(a: V3, b: V3): V3 {
    return [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
}

export function sub(a: V3, b: V3): V3 {
    return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
}

export function scale(a: V3, n: number): V3 {
    return [a[0] * n, a[1] * n, a[2] * n];
}

export function dot(a: V3, b: V3): number {
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}

export function cross(a: V3, b: V3): V3 {
    const x = a[1] * b[2] - a[2] * b[1];
    const y = a[2] * b[0] - a[0] * b[2];
    const z = a[0] * b[1] - a[1] * b[0];

    return [x, y, z];
}

/**
 * Calculate the squared length of a vector.
 * Use this when comparing two vectors instead of length, as it's more efficient (no sqrt)
 */
export function lengthSqr(a: V3): number {
    return a[0] * a[0] + a[1] * a[1] + a[2] * a[2];
}

/**
 * Calculate the length of a vector.
 * If you only need to compare lenghts, consider using the more efficient lengthSqr
 */
export function length(a: V3): number {
    return Math.sqrt(a[0] * a[0] + a[1] * a[1] + a[2] * a[2]);
}

export function distance(a: V3, b: V3): number {
    return Math.sqrt((a[0] - b[0]) * (a[0] - b[0]) + (a[1] - b[1]) * (a[1] - b[1]) + (a[2] - b[2]) * (a[2] - b[2]));
}

export function basisVectors(object3D: Object3D): [Vector3, Vector3, Vector3] {
    const xAxis = new Vector3();
    const yAxis = new Vector3();
    const zAxis = new Vector3();
    object3D.matrixWorld.extractBasis(xAxis, yAxis, zAxis);
    return [xAxis, yAxis, zAxis];
}
