import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import { BloomEffect, EffectComposer, EffectPass, RenderPass } from 'postprocessing';

export function BloomRenderPipeline({ quality }) {
  const gl = useThree((state) => state.gl);
  const scene = useThree((state) => state.scene);
  const camera = useThree((state) => state.camera);
  const size = useThree((state) => state.size);
  const composerRef = useRef(null);

  useEffect(() => {
    const previousAutoClear = gl.autoClear;
    const composer = new EffectComposer(gl, {
      depthBuffer: false,
      stencilBuffer: false,
      multisampling: 0,
    });
    const renderPass = new RenderPass(scene, camera);
    const bloom = new BloomEffect({
      mipmapBlur: true,
      intensity: quality === 'high' ? 1.12 : 0.96,
      luminanceThreshold: 1.02,
      luminanceSmoothing: 0.035,
      radius: 0.78,
      levels: quality === 'high' ? 7 : 5,
    });
    const effectPass = new EffectPass(camera, bloom);

    composer.addPass(renderPass);
    composer.addPass(effectPass);
    composer.setSize(size.width, size.height);
    composerRef.current = composer;

    return () => {
      composerRef.current = null;
      composer.dispose();
      gl.autoClear = previousAutoClear;
    };
  }, [camera, gl, quality, scene, size.height, size.width]);

  useFrame((_, delta) => composerRef.current?.render(delta), 1);
  return null;
}
