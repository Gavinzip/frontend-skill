import { createPortal, useFrame, useLoader, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { createNoiseTexture } from './noiseTexture';
import { GpuBoundaryParticles } from './GpuBoundaryParticles';
import {
  COMPOSITE_FRAGMENT_SHADER,
  EFFECT_FRAGMENT_SHADER,
  FULLSCREEN_VERTEX_SHADER,
  TARGET_FRAGMENT_SHADER,
} from './prismShaders';

function makeRenderTarget() {
  const target = new THREE.WebGLRenderTarget(1, 1, {
    type: THREE.HalfFloatType,
    format: THREE.RGBAFormat,
    minFilter: THREE.LinearFilter,
    magFilter: THREE.LinearFilter,
    depthBuffer: false,
    stencilBuffer: false,
  });
  target.texture.colorSpace = THREE.LinearSRGBColorSpace;
  return target;
}

export function DualRenderPipeline({ progressRef, quality, targetImageUrl }) {
  const gl = useThree((state) => state.gl);
  const size = useThree((state) => state.size);
  const viewport = useThree((state) => state.viewport);
  const camera = useThree((state) => state.camera);
  const imageTexture = useLoader(THREE.TextureLoader, targetImageUrl);
  const targetScene = useMemo(() => new THREE.Scene(), []);
  const effectScene = useMemo(() => new THREE.Scene(), []);
  const targetRenderTarget = useMemo(makeRenderTarget, []);
  const effectRenderTarget = useMemo(makeRenderTarget, []);
  const noiseTexture = useMemo(createNoiseTexture, []);
  const targetMaterialRef = useRef(null);
  const effectMaterialRef = useRef(null);
  const compositeMaterialRef = useRef(null);
  const particleMaterialRef = useRef(null);
  const clearColor = useMemo(() => new THREE.Color(), []);

  const imageAspect = imageTexture.image
    ? imageTexture.image.width / imageTexture.image.height
    : 16 / 9;

  const targetUniforms = useMemo(
    () => ({
      uImage: { value: imageTexture },
      uImageAspect: { value: imageAspect },
      uViewportAspect: { value: 1 },
      uProgress: { value: 0 },
    }),
    [imageAspect, imageTexture],
  );

  const effectUniforms = useMemo(
    () => ({
      uNoise: { value: noiseTexture },
      uProgress: { value: 0 },
      uTime: { value: 0 },
      uViewportAspect: { value: 1 },
    }),
    [noiseTexture],
  );

  const compositeUniforms = useMemo(
    () => ({
      uScene: { value: targetRenderTarget.texture },
      uEffects: { value: effectRenderTarget.texture },
      uNoise: { value: noiseTexture },
      uProgress: { value: 0 },
      uViewportAspect: { value: 1 },
    }),
    [effectRenderTarget.texture, noiseTexture, targetRenderTarget.texture],
  );

  useEffect(() => {
    imageTexture.colorSpace = THREE.SRGBColorSpace;
    imageTexture.minFilter = THREE.LinearFilter;
    imageTexture.magFilter = THREE.LinearFilter;
    imageTexture.generateMipmaps = true;
    imageTexture.needsUpdate = true;
  }, [imageTexture]);

  useEffect(() => {
    const renderScale = quality === 'high' ? Math.min(window.devicePixelRatio, 1.5) : 1;
    const targetWidth = Math.max(1, Math.round(size.width * renderScale));
    const targetHeight = Math.max(1, Math.round(size.height * renderScale));
    const effectScale = quality === 'high' ? 0.58 : 0.44;

    targetRenderTarget.setSize(targetWidth, targetHeight);
    effectRenderTarget.setSize(
      Math.max(1, Math.round(targetWidth * effectScale)),
      Math.max(1, Math.round(targetHeight * effectScale)),
    );
  }, [effectRenderTarget, quality, size.height, size.width, targetRenderTarget]);

  useEffect(
    () => () => {
      targetRenderTarget.dispose();
      effectRenderTarget.dispose();
      noiseTexture.dispose();
    },
    [effectRenderTarget, noiseTexture, targetRenderTarget],
  );

  useFrame((state) => {
    const progress = progressRef.current;
    const time = state.clock.elapsedTime;
    const viewportAspect = size.width / Math.max(1, size.height);
    const pixelRatio = Math.min(gl.getPixelRatio(), quality === 'high' ? 1.5 : 1.1);

    if (targetMaterialRef.current) {
      targetMaterialRef.current.uniforms.uProgress.value = progress;
      targetMaterialRef.current.uniforms.uViewportAspect.value = viewportAspect;
    }
    if (effectMaterialRef.current) {
      effectMaterialRef.current.uniforms.uProgress.value = progress;
      effectMaterialRef.current.uniforms.uTime.value = time;
      effectMaterialRef.current.uniforms.uViewportAspect.value = viewportAspect;
    }
    if (compositeMaterialRef.current) {
      compositeMaterialRef.current.uniforms.uProgress.value = progress;
      compositeMaterialRef.current.uniforms.uViewportAspect.value = viewportAspect;
    }
    if (particleMaterialRef.current) {
      particleMaterialRef.current.uniforms.uProgress.value = progress;
      particleMaterialRef.current.uniforms.uTime.value = time;
      particleMaterialRef.current.uniforms.uViewportAspect.value = viewportAspect;
      particleMaterialRef.current.uniforms.uPixelRatio.value = pixelRatio;
    }

    const previousTarget = gl.getRenderTarget();
    const previousAlpha = gl.getClearAlpha();
    gl.getClearColor(clearColor);

    gl.setRenderTarget(targetRenderTarget);
    gl.setClearColor(0x000000, 0);
    gl.clear(true, false, false);
    gl.render(targetScene, camera);

    gl.setRenderTarget(effectRenderTarget);
    gl.setClearColor(0x000000, 0);
    gl.clear(true, false, false);
    gl.render(effectScene, camera);

    gl.setRenderTarget(previousTarget);
    gl.setClearColor(clearColor, previousAlpha);
  }, -1);

  return (
    <>
      {createPortal(
        <mesh frustumCulled={false}>
          <planeGeometry args={[2, 2]} />
          <shaderMaterial
            ref={targetMaterialRef}
            uniforms={targetUniforms}
            vertexShader={FULLSCREEN_VERTEX_SHADER}
            fragmentShader={TARGET_FRAGMENT_SHADER}
            depthTest={false}
            depthWrite={false}
          />
        </mesh>,
        targetScene,
      )}

      {createPortal(
        <>
          <mesh frustumCulled={false} renderOrder={1}>
            <planeGeometry args={[2, 2]} />
            <shaderMaterial
              ref={effectMaterialRef}
              uniforms={effectUniforms}
              vertexShader={FULLSCREEN_VERTEX_SHADER}
              fragmentShader={EFFECT_FRAGMENT_SHADER}
              transparent
              depthTest={false}
              depthWrite={false}
              toneMapped={false}
            />
          </mesh>
          <GpuBoundaryParticles
            count={quality === 'high' ? 1600 : 700}
            materialRef={particleMaterialRef}
            noiseTexture={noiseTexture}
          />
        </>,
        effectScene,
      )}

      <mesh scale={[viewport.width, viewport.height, 1]} frustumCulled={false}>
        <planeGeometry args={[2, 2]} />
        <shaderMaterial
          ref={compositeMaterialRef}
          uniforms={compositeUniforms}
          vertexShader={FULLSCREEN_VERTEX_SHADER}
          fragmentShader={COMPOSITE_FRAGMENT_SHADER}
          transparent
          depthTest={false}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
    </>
  );
}
