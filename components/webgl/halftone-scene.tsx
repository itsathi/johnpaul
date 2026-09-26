"use client";

import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  precision highp float;

  uniform sampler2D uTex;
  uniform vec2  uRes;        // drawing-buffer size, px
  uniform float uTime;
  uniform float uProgress;   // 0 = scattered, 1 = fully resolved
  uniform float uImgAspect;
  uniform vec2  uFocus;      // assembly origin, uv
  uniform vec2  uPointer;    // px
  uniform float uPointerAmt;
  uniform float uPitch;      // dot pitch, px
  uniform float uZoom;
  uniform float uBloom;      // 0 dots stay dots, 1 they flood into tone

  varying vec2 vUv;

  float hash21(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  /* The house duotone: ink -> brass -> paper. */
  vec3 duotone(float t) {
    const vec3 dark  = vec3(0.039, 0.035, 0.031);
    const vec3 mid   = vec3(0.737, 0.541, 0.298);
    const vec3 light = vec3(0.925, 0.902, 0.855);
    return t < 0.5 ? mix(dark, mid, t * 2.0) : mix(mid, light, (t - 0.5) * 2.0);
  }

  void main() {
    vec2 px = gl_FragCoord.xy;
    float cell = uPitch;
    float canvasAspect = uRes.x / uRes.y;

    /* ---- which dot are we inside? ---- */
    vec2 cid    = floor(px / cell);
    vec2 centre = (cid + 0.5) * cell;

    /* ---- staggered assembly, spreading out from the face ---- */
    float dOrigin = distance(centre, uRes * uFocus);
    float delay = smoothstep(0.0, uRes.y * 0.9, dOrigin) * 0.52;
    float t = clamp((uProgress - delay) / 0.48, 0.0, 1.0);
    t = t * t * (3.0 - 2.0 * t);

    /* ---- where this dot flies in from ---- */
    float h1 = hash21(cid);
    float h2 = hash21(cid + 19.73);
    vec2 dir = normalize(vec2(h1 - 0.5, h2 - 0.5) + vec2(1e-4));
    float travel = (0.2 + 0.8 * h1) * uRes.y * 0.55 * (1.0 - t);
    vec2 pos = centre + dir * travel;
    pos += dir * sin(uTime * 0.7 + h2 * 6.2831) * cell * 0.18 * t;

    /* ---- the pointer pushes the plate around ---- */
    vec2 toPtr = px - uPointer;
    float pd = length(toPtr);
    float infl = uPointerAmt * exp(-(pd * pd) / (2.0 * uRes.y * uRes.y * 0.018));
    pos += normalize(toPtr + vec2(1e-4)) * infl * cell * 3.4;

    /* ---- sample the portrait, cover-fitted then zoomed ---- */
    vec2 uv = centre / uRes;
    if (canvasAspect > uImgAspect) {
      uv.y = (uv.y - 0.5) * (uImgAspect / canvasAspect) + 0.5;
    } else {
      uv.x = (uv.x - 0.5) * (canvasAspect / uImgAspect) + 0.5;
    }
    uv = (uv - 0.5) / uZoom + 0.5;

    /* Printed positive: the lit side of the frame earns the fat dots and the
       shadow side stays bare ink, so the plate keeps the photograph's own
       composition instead of inventing one. */
    vec3 tex = texture2D(uTex, clamp(uv, 0.001, 0.999)).rgb;
    float lum = dot(tex, vec3(0.2126, 0.7152, 0.0722));
    lum = clamp((lum - 0.02) * 1.35, 0.0, 1.0);

    /* ---- dot size, then the final beat: dots flood into tone ---- */
    float r = cell * 0.62 * lum * t;
    r = mix(r, cell * 0.98, uBloom);

    /* Coverage as a clamped linear falloff. A plain smoothstep(r, r - aa, d)
       inverts once the radius drops below the feather and floods the whole
       cell, which turns every shadow into a solid block. */
    float aa = 0.9;
    float dDot = distance(px, pos);
    float m = smoothstep(0.0, 1.0, clamp((r - dDot) / max(aa, 1e-4), 0.0, 1.0));

    /* ---- ground: ink, with a warm pool behind the face ---- */
    vec2 fv = (vUv - uFocus) * vec2(canvasAspect, 1.0);
    vec3 bg = mix(vec3(0.047, 0.039, 0.031), vec3(0.02, 0.018, 0.016), vUv.y);
    bg += vec3(0.11, 0.075, 0.035) * exp(-length(fv) * 2.1) * 0.55;

    /* ---- colour, with a warm lift where the visitor is ---- */
    vec3 col = duotone(lum);
    col += vec3(0.95, 0.72, 0.42) * infl * 0.22;

    /* ---- a prism band crossing while the plate resolves ---- */
    float sweep = uRes.x * (1.3 - 0.62 * uProgress);
    float band = exp(-pow((px.x - sweep) / (uRes.x * 0.055), 2.0));
    col += vec3(0.95, 0.74, 0.46) * band * (1.0 - smoothstep(0.9, 1.0, uProgress)) * 0.14;

    vec3 outColor = mix(bg, col, m);

    /* dither, so the wide gradients stay smooth */
    float dither = (hash21(px + fract(uTime * 0.37)) - 0.5) * 0.014;
    gl_FragColor = vec4(outColor + dither, 1.0);
  }
`;

export type HalftoneInput = {
  /** 0 -> 1 across the entrance, then eased back as the hero scrolls away. */
  progress: { current: number };
  /** 0 -> 1 while the pointer is over the hero. */
  pointer: { current: { x: number; y: number; amt: number } };
};

type Props = {
  src: string;
  /** 0 dots stay dots, 1 they flood into continuous tone. */
  bloom: number;
  focus: [number, number];
  zoom: number;
  /** Dot pitch as a fraction of canvas height. */
  density: number;
  input: HalftoneInput;
};

export default function HalftoneScene({ src, bloom, focus, zoom, density, input }: Props) {
  const texture = useTexture(src);
  const material = useRef<THREE.ShaderMaterial>(null);
  const { viewport, gl } = useThree();

  const imgAspect = useMemo(() => {
    const img = texture.image as { width?: number; height?: number } | undefined;
    const w = img?.width ?? 4;
    const h = img?.height ?? 5;
    return w / h;
  }, [texture]);

  const uniforms = useMemo(
    () => ({
      uTex: { value: texture },
      uRes: { value: new THREE.Vector2(1, 1) },
      uTime: { value: 0 },
      uProgress: { value: 0 },
      uImgAspect: { value: 1 },
      uFocus: { value: new THREE.Vector2(0.5, 0.44) },
      uPointer: { value: new THREE.Vector2(-999, -999) },
      uPointerAmt: { value: 0 },
      uPitch: { value: 6 },
      uZoom: { value: 1 },
      uBloom: { value: 0 },
    }),
    [texture],
  );

  useFrame((state) => {
    const u = material.current?.uniforms;
    if (!u) return;

    const dpr = gl.getPixelRatio();
    const buf = gl.getDrawingBufferSize(new THREE.Vector2());
    u.uRes.value.set(buf.x, buf.y);
    u.uTime.value = state.clock.elapsedTime;
    u.uProgress.value = input.progress.current;
    u.uImgAspect.value = imgAspect;
    u.uFocus.value.set(focus[0], focus[1]);
    u.uZoom.value = zoom;
    u.uBloom.value = bloom;
    u.uPitch.value = Math.max(5.5 * dpr, (buf.y * density));

    const p = input.pointer.current;
    u.uPointer.value.set(p.x * dpr, p.y * dpr);
    u.uPointerAmt.value = p.amt;
  });

  return (
    <mesh scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={material}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent={false}
        depthTest={false}
        depthWrite={false}
      />
    </mesh>
  );
}
