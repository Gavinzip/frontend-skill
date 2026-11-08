import { Canvas } from '@react-three/fiber';
import { memo, useMemo } from 'react';
import * as THREE from 'three';
import { BloomRenderPipeline } from './BloomRenderPipeline';
import { DualRenderPipeline } from './DualRenderPipeline';
import { ScrollRenderDriver } from './ScrollRenderDriver';
import './PrismTransition.css';

function getQualityTier() {
  const compactViewport = window.matchMedia('(max-width: 820px)').matches;
  const limitedCpu = navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4;
  return compactViewport || limitedCpu ? 'balanced' : 'high';
}

function PrismTransition({ progressRef, targetImageUrl }) {
  const quality = useMemo(getQualityTier, []);

  return (
    <div className="prism-transition" aria-hidden="true">
      <Canvas
        frameloop="demand"
        dpr={quality === 'high' ? [1, 1.5] : [1, 1.1]}
        camera={{ position: [0, 0, 1], near: 0.1, far: 10 }}
        gl={{
          alpha: true,
          antialias: false,
          powerPreference: 'high-performance',
          premultipliedAlpha: false,
        }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0);
          gl.outputColorSpace = THREE.SRGBColorSpace;
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1;
        }}
      >
        <DualRenderPipeline
          progressRef={progressRef}
          quality={quality}
          targetImageUrl={targetImageUrl}
        />
        <ScrollRenderDriver progressRef={progressRef} />
        <BloomRenderPipeline quality={quality} />
      </Canvas>
    </div>
  );
}

export default memo(PrismTransition);
