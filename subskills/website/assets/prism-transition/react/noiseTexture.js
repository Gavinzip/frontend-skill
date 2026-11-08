import * as THREE from 'three';

const NOISE_SIZE = 256;

function createSeededRandom(seed) {
  let state = seed >>> 0;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

function blurNoise(source, size, radius) {
  const horizontal = new Float32Array(source.length);
  const result = new Float32Array(source.length);
  const sampleCount = radius * 2 + 1;

  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      let total = 0;
      for (let offset = -radius; offset <= radius; offset += 1) {
        total += source[y * size + ((x + offset + size) % size)];
      }
      horizontal[y * size + x] = total / sampleCount;
    }
  }

  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      let total = 0;
      for (let offset = -radius; offset <= radius; offset += 1) {
        total += horizontal[((y + offset + size) % size) * size + x];
      }
      result[y * size + x] = total / sampleCount;
    }
  }

  return result;
}

export function createNoiseTexture() {
  const random = createSeededRandom(260722);
  const source = Float32Array.from({ length: NOISE_SIZE * NOISE_SIZE }, () => random());
  const mediumNoise = blurNoise(source, NOISE_SIZE, 7);
  const broadNoise = blurNoise(source, NOISE_SIZE, 23);
  const pixels = new Uint8Array(NOISE_SIZE * NOISE_SIZE * 4);

  for (let index = 0; index < source.length; index += 1) {
    const pixelIndex = index * 4;
    pixels[pixelIndex] = Math.round(source[index] * 255);
    pixels[pixelIndex + 1] = Math.round(mediumNoise[index] * 255);
    pixels[pixelIndex + 2] = Math.round(broadNoise[index] * 255);
    pixels[pixelIndex + 3] = 255;
  }

  const texture = new THREE.DataTexture(pixels, NOISE_SIZE, NOISE_SIZE, THREE.RGBAFormat);
  texture.colorSpace = THREE.NoColorSpace;
  texture.magFilter = THREE.LinearFilter;
  texture.minFilter = THREE.LinearFilter;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.needsUpdate = true;
  return texture;
}
