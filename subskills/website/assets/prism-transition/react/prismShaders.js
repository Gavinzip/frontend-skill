export const FULLSCREEN_VERTEX_SHADER = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;

export const DISSOLVE_FIELD_GLSL = `
float dissolveEdge(vec2 uv) {
  vec2 noiseUv = uv * vec2(uViewportAspect, 1.0) / min(uViewportAspect, 1.0);
  float broadNoise = (texture2D(uNoise, fract(noiseUv * 0.31 + vec2(0.17, 0.31))).b - 0.5) * 2.0;
  float mediumNoise = (texture2D(uNoise, fract(noiseUv * 0.78 + vec2(0.63, 0.11))).g - 0.5) * 2.0;
  float detailNoise = (texture2D(uNoise, fract(noiseUv * 2.4 + vec2(0.29, 0.73))).r - 0.5) * 2.0;
  float filament = sin((uv.y + mediumNoise * 0.025) * 34.0) * 0.005;
  float noiseArrival = smoothstep(0.015, 0.12, uProgress);
  float organicEdge = (
    broadNoise * 0.12
    + mediumNoise * 0.065
    + detailNoise * 0.018
    + filament
  ) * noiseArrival;

  vec2 metricScale = vec2(uViewportAspect, 1.0);
  float metricDiagonal = length(metricScale);
  vec2 metricUv = uv * metricScale / metricDiagonal;
  vec2 ignitionA = vec2(-0.06 * uViewportAspect, 0.22) / metricDiagonal;
  vec2 ignitionB = vec2(0.11 * uViewportAspect, 0.86) / metricDiagonal;
  vec2 ignitionC = vec2(0.56 * uViewportAspect, -0.08) / metricDiagonal;
  vec2 ignitionD = vec2(0.71 * uViewportAspect, 0.62) / metricDiagonal;
  float waveAProgress = pow(smoothstep(0.0, 0.80, uProgress), 2.1);
  float waveBProgress = pow(smoothstep(0.06, 0.86, uProgress), 2.1);
  float waveCProgress = pow(smoothstep(0.13, 0.90, uProgress), 2.1);
  float waveDProgress = pow(smoothstep(0.20, 0.94, uProgress), 2.1);
  float waveA = mix(-0.12, 1.05, waveAProgress) - distance(metricUv, ignitionA);
  float waveB = mix(-0.12, 0.94, waveBProgress) - distance(metricUv, ignitionB);
  float waveC = mix(-0.12, 0.91, waveCProgress) - distance(metricUv, ignitionC);
  float waveD = mix(-0.12, 0.82, waveDProgress) - distance(metricUv, ignitionD);
  float edge = max(max(waveA, waveB), max(waveC, waveD)) + organicEdge;
  return mix(edge, 0.2, smoothstep(0.94, 1.0, uProgress));
}
`;

export const TARGET_FRAGMENT_SHADER = `
precision highp float;
uniform sampler2D uImage;
uniform float uImageAspect;
uniform float uViewportAspect;
uniform float uProgress;
varying vec2 vUv;

vec2 coverUv(vec2 uv) {
  vec2 scale = vec2(1.0);
  if (uViewportAspect > uImageAspect) {
    scale.y = uImageAspect / uViewportAspect;
  } else {
    scale.x = uViewportAspect / uImageAspect;
  }
  return (uv - 0.5) * scale + 0.5;
}

float imageLuma(vec3 color) {
  return dot(color, vec3(0.299, 0.587, 0.114));
}

void main() {
  vec2 imageUv = coverUv(vUv);
  vec2 centerVector = imageUv - 0.5;
  float parallaxEnvelope = sin(clamp(uProgress, 0.0, 1.0) * 3.14159265);
  vec2 backgroundUv = centerVector * (1.0 + parallaxEnvelope * 0.026) + 0.5;
  vec2 foregroundUv = centerVector * (1.0 - parallaxEnvelope * 0.014) + 0.5;
  vec3 background = texture2D(uImage, backgroundUv).rgb;
  vec3 foreground = texture2D(uImage, foregroundUv).rgb;
  float depthMask = smoothstep(0.32, 0.72, imageLuma(foreground));
  vec3 sceneColor = mix(background, foreground, depthMask * 0.28 * parallaxEnvelope);
  float vignette = 1.0 - smoothstep(0.42, 0.86, length(vUv - 0.5));
  sceneColor *= mix(1.0, mix(0.94, 1.025, vignette), parallaxEnvelope);
  gl_FragColor = vec4(sceneColor, 1.0);
}
`;

export const EFFECT_FRAGMENT_SHADER = `
precision highp float;
uniform sampler2D uNoise;
uniform float uProgress;
uniform float uTime;
uniform float uViewportAspect;
varying vec2 vUv;
${DISSOLVE_FIELD_GLSL}

void main() {
  float edge = dissolveEdge(vUv);
  float distanceToEdge = abs(edge);
  float antialiasWidth = max(fwidth(edge) * 1.15, 0.001);
  float presence = smoothstep(0.0, 0.035, uProgress) * (1.0 - smoothstep(0.965, 1.0, uProgress));
  float grain = texture2D(
    uNoise,
    fract(vUv * vec2(uViewportAspect, 1.0) * 4.7 + vec2(uTime * 0.014, -uTime * 0.009))
  ).r;
  float core = (1.0 - smoothstep(0.0, 0.0035 + antialiasWidth, distanceToEdge)) * presence;
  float inner = (1.0 - smoothstep(0.0, 0.019, distanceToEdge)) * presence;
  float outer = (1.0 - smoothstep(0.0, 0.076, distanceToEdge)) * presence;
  core *= mix(0.78, 1.24, grain);
  inner *= mix(0.74, 1.1, grain);
  float shimmer = 0.92 + sin(uTime * 7.0 + vUv.y * 73.0) * 0.08;
  vec3 whiteHeat = vec3(7.5, 7.0, 6.25) * core * shimmer;
  vec3 amberHeat = vec3(4.8, 1.75, 0.38) * inner;
  vec3 halo = vec3(1.35, 0.42, 0.08) * outer * 0.72;
  float alpha = max(core, max(inner * 0.88, outer * 0.36));
  gl_FragColor = vec4(whiteHeat + amberHeat + halo, alpha);
}
`;

export const COMPOSITE_FRAGMENT_SHADER = `
precision highp float;
uniform sampler2D uScene;
uniform sampler2D uEffects;
uniform sampler2D uNoise;
uniform float uProgress;
uniform float uViewportAspect;
varying vec2 vUv;
${DISSOLVE_FIELD_GLSL}

void main() {
  float edge = dissolveEdge(vUv);
  float antialiasWidth = max(fwidth(edge) * 1.15, 0.001);
  float reveal = smoothstep(-antialiasWidth, antialiasWidth, edge);
  float charBand = smoothstep(0.0, 0.018, edge) * (1.0 - smoothstep(0.018, 0.115, edge));
  vec3 sceneColor = texture2D(uScene, vUv).rgb * (1.0 - charBand * 0.27);
  vec4 effects = texture2D(uEffects, vUv);
  vec3 finalColor = sceneColor * reveal + effects.rgb;
  float finalAlpha = max(reveal, effects.a);
  if (finalAlpha < 0.001) discard;
  gl_FragColor = vec4(finalColor, finalAlpha);
}
`;

export const PARTICLE_VERTEX_SHADER = `
precision highp float;
uniform sampler2D uNoise;
uniform float uProgress;
uniform float uTime;
uniform float uViewportAspect;
uniform float uPixelRatio;
varying float vAlpha;
varying float vTemperature;
${DISSOLVE_FIELD_GLSL}

void main() {
  vec2 baseUv = position.xy;
  float seed = position.z;
  float edge = dissolveEdge(baseUv);
  float edgeActivity = (1.0 - smoothstep(0.012, 0.13, abs(edge)))
    * smoothstep(0.01, 0.08, uProgress)
    * (1.0 - smoothstep(0.92, 0.995, uProgress));
  float life = fract(uTime * mix(0.16, 0.31, seed) + seed * 7.31);
  vec2 direction = normalize(vec2(sin(seed * 81.7), -0.7 - cos(seed * 47.3) * 0.45));
  vec2 drift = direction * life * mix(0.018, 0.085, seed);
  vec2 particleUv = baseUv + drift * edgeActivity;
  vec2 clipPosition = particleUv * 2.0 - 1.0;
  gl_Position = vec4(clipPosition, 0.0, 1.0);
  vAlpha = edgeActivity * smoothstep(1.0, 0.68, life);
  vTemperature = seed;
  gl_PointSize = mix(1.4, 4.8, seed * seed) * uPixelRatio * vAlpha;
}
`;

export const PARTICLE_FRAGMENT_SHADER = `
precision highp float;
varying float vAlpha;
varying float vTemperature;

void main() {
  vec2 point = gl_PointCoord - 0.5;
  float angle = vTemperature * 6.2831853;
  mat2 rotation = mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
  vec2 sparkPoint = rotation * point;
  float radial = length(point);
  float core = 1.0 - smoothstep(0.03, 0.3, radial);
  float streak = (1.0 - smoothstep(0.018, 0.075, abs(sparkPoint.x)))
    * (1.0 - smoothstep(0.1, 0.5, abs(sparkPoint.y)));
  float shape = max(core, streak * 0.78) * (1.0 - smoothstep(0.44, 0.5, radial));
  vec3 color = mix(vec3(5.5, 1.55, 0.24), vec3(8.0, 7.4, 6.4), vTemperature);
  if (shape * vAlpha < 0.01) discard;
  gl_FragColor = vec4(color * shape, shape * vAlpha);
}
`;
