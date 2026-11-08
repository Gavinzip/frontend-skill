import { useMemo } from 'react';
import * as THREE from 'three';
import { PARTICLE_FRAGMENT_SHADER, PARTICLE_VERTEX_SHADER } from './prismShaders';

function seededRandom(seed) {
  const value = Math.sin(seed * 91.731 + 17.17) * 43758.5453;
  return value - Math.floor(value);
}

export function GpuBoundaryParticles({ count, materialRef, noiseTexture }) {
  const positions = useMemo(() => {
    const values = new Float32Array(count * 3);
    for (let index = 0; index < count; index += 1) {
      const offset = index * 3;
      values[offset] = seededRandom(index * 3 + 1);
      values[offset + 1] = seededRandom(index * 3 + 2);
      values[offset + 2] = seededRandom(index * 3 + 3);
    }
    return values;
  }, [count]);

  const uniforms = useMemo(
    () => ({
      uNoise: { value: noiseTexture },
      uProgress: { value: 0 },
      uTime: { value: 0 },
      uViewportAspect: { value: 1 },
      uPixelRatio: { value: 1 },
    }),
    [noiseTexture],
  );

  return (
    <points frustumCulled={false} renderOrder={2}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        vertexShader={PARTICLE_VERTEX_SHADER}
        fragmentShader={PARTICLE_FRAGMENT_SHADER}
        transparent
        depthTest={false}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        toneMapped={false}
      />
    </points>
  );
}
