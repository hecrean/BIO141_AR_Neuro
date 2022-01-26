import { Color, Texture, ShaderMaterial, VideoTexture } from "three";

export type ImgMaterialUniforms = {
    scale: {
        value: [number, number];
    };
    imageBounds: {
        value: [number, number];
    };
    map: {
        value: Texture | VideoTexture;
    };
    zoom: {
        value: number;
    };
    grayscale: {
        value: number;
    };
    color: {
        value: Color;
    };
}



const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.);
    vUv = uv;
  }
`;

const fragmentShader = /* glsl */ `
  // mostly from https://gist.github.com/statico/df64c5d167362ecf7b34fca0b1459a44
  varying vec2 vUv;
  uniform vec2 scale;
  uniform vec2 imageBounds;
  uniform vec3 color;
  uniform sampler2D map;
  uniform float zoom;
  uniform float grayscale;
  const vec3 luma = vec3(.299, 0.587, 0.114);
  vec4 toGrayscale(vec4 color, float intensity) {
    return vec4(mix(color.rgb, vec3(dot(color.rgb, luma)), intensity), color.a);
  }
  vec2 aspect(vec2 size) {
    return size / min(size.x, size.y);
  }
  void main() {
    vec2 s = aspect(scale);
    vec2 i = aspect(imageBounds);
    float rs = s.x / s.y;
    float ri = i.x / i.y;
    vec2 new = rs < ri ? vec2(i.x * s.y / i.y, s.y) : vec2(s.x, i.y * s.x / i.x);
    vec2 offset = (rs < ri ? vec2((new.x - s.x) / 2.0, 0.0) : vec2(0.0, (new.y - s.y) / 2.0)) / new;
    vec2 uv = vUv * s / new + offset;
    vec2 zUv = (uv - vec2(0.5, 0.5)) / zoom + vec2(0.5, 0.5);
    gl_FragColor = toGrayscale(texture2D(map, zUv) * vec4(color, 1.0), grayscale);
  }
`

export const createImageMaterial = (scale: [number, number], imageBounds: [number, number], map: Texture | VideoTexture) => {
  
  const initialUniforms: ImgMaterialUniforms = {
    scale: {value: scale},
    imageBounds: {value: imageBounds},
    map: {value: map},
    zoom: {value: 1},
    grayscale: {value: 0},
    color: {value: new Color('white')}
}

  return new ShaderMaterial({
  uniforms: initialUniforms, 
  vertexShader: vertexShader, 
  fragmentShader:fragmentShader
})
}