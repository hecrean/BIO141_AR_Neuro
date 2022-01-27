import { Texture, ShaderMaterial, VideoTexture, DoubleSide } from "three";

export type ImgMaterialUniforms = {
    map: {
        value: Texture | VideoTexture;
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
  uniform sampler2D map;
  
  void main() {
   
    gl_FragColor = vec4(texture2D(map, vUv).xyz, 1.0);
  }
`

export const createImageMaterial = (map: Texture | VideoTexture) => {
  
  const initialUniforms: ImgMaterialUniforms = {
    map: {value: map},

}

  return new ShaderMaterial({
    side: DoubleSide,
    uniforms: initialUniforms, 
    vertexShader: vertexShader, 
    fragmentShader:fragmentShader
})
}