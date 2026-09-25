"use client";

import { useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { scroll, pointer } from "./lab-state";
import { createRng } from "@/lib/random";

const INK = "#0a0908";
const WARM = "#d9aa6e";
const BONE = "#cfc7b6";

/**
 * Points, lines and cameras here mutate GPU buffers every frame. Those objects
 * are built once and held in refs (never through hook returns), which keeps
 * them out of React's render/immutability model entirely.
 */

/* ---------------------------------------------------------------- */

/** A large flowing "oscilloscope field" of points. */
function WaveField({ count = 2400, spread = 26 }: { count?: number; spread?: number }) {
  const pointsRef = useRef<THREE.Points | null>(null);
  const internal = useRef<{
    geometry: THREE.BufferGeometry;
    material: THREE.PointsMaterial;
    seeds: Float32Array;
  } | null>(null);

  if (!internal.current) {
    const rng = createRng(11);
    const positions = new Float32Array(count * 3);
    const seeds = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (rng() - 0.5) * spread;
      positions[i * 3 + 1] = 0;
      positions[i * 3 + 2] = (rng() - 0.5) * (spread * 0.34);
      seeds[i] = rng() * Math.PI * 2;
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const material = new THREE.PointsMaterial({
      color: WARM,
      size: 0.035,
      transparent: true,
      opacity: 0.85,
      sizeAttenuation: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    internal.current = { geometry, material, seeds };
  }

  const { geometry, material, seeds } = internal.current;

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const pos = geometry.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);
      const seed = seeds[i];
      const y =
        Math.sin(x * 0.42 + t * 0.9 + seed) * 0.55 +
        Math.sin(z * 0.8 - t * 1.3 + seed * 2) * 0.32 +
        Math.cos((x + z) * 0.25 + t * 0.5) * 0.28;
      pos.setY(i, Math.cos(seed) < -0.86 ? y - 1.5 : y);
    }
    pos.needsUpdate = true;

    if (pointsRef.current) {
      pointsRef.current.rotation.y = t * 0.012;
    }
    material.opacity = 0.55 + Math.sin(t * 0.4) * 0.2;
  });

  return <points ref={pointsRef} geometry={geometry} material={material} />;
}

/* ---------------------------------------------------------------- */

/** Sparse depth particles, cool by comparison. Constructed once, never mutated. */
function Haze({ count = 500 }: { count?: number }) {
  const geometry = useRef<THREE.BufferGeometry | null>(null);
  if (!geometry.current) {
    const rng = createRng(37);
    const p = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      p[i * 3] = (rng() - 0.5) * 44;
      p[i * 3 + 1] = (rng() - 0.5) * 24;
      p[i * 3 + 2] = (rng() - 0.5) * 14;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(p, 3));
    geometry.current = geo;
  }

  return (
    <points geometry={geometry.current}>
      <pointsMaterial
        color={BONE}
        size={0.05}
        transparent
        opacity={0.32}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

/* ---------------------------------------------------------------- */

/** Six long thin "strings" suspended in the dark — a harp in motion. */
function StringField({ strings = 6, segments = 150 }: { strings?: number; segments?: number }) {
  const internal = useRef<{ lines: THREE.Line[]; offsets: number[] } | null>(null);

  if (!internal.current) {
    const lines: THREE.Line[] = [];
    const offsets: number[] = [];
    const material = new THREE.LineBasicMaterial({
      color: BONE,
      transparent: true,
      opacity: 0.5,
    });
    for (let i = 0; i < strings; i++) {
      const positions = new Float32Array(segments * 3);
      for (let j = 0; j < segments; j++) {
        positions[j * 3 + 1] = j - segments / 2;
      }
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      lines.push(new THREE.Line(geometry, material));
      offsets.push((i / strings) * 13 - 6.5);
    }
    internal.current = { lines, offsets };
  }

  const { lines, offsets } = internal.current;

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    lines.forEach((line, i) => {
      const pos = line.geometry.attributes.position as THREE.BufferAttribute;
      for (let j = 0; j < segments; j++) {
        const v = (j / (segments - 1)) * 22 - 11;
        const y = j - segments / 2;
        const sway =
          Math.sin(v * 0.32 + t * 1.1 + i) * 0.5 +
          Math.sin(v * 0.8 - t * 0.7 + i * 2) * 0.16;
        pos.setXYZ(j, offsets[i] + sway * 0.5 + Math.sin(t * 0.3 + i) * 0.3, y, sway);
      }
      pos.needsUpdate = true;
    });
  });

  return (
    <>
      {lines.map((line, i) => (
        <primitive key={i} object={line} />
      ))}
    </>
  );
}

/* ---------------------------------------------------------------- */

/** Slow camera drift driven by page scroll + pointer motion. */
function DriftCamera() {
  useFrame(({ camera }) => {
    const targetZ = 7.4 - scroll.progress * 3.2;
    camera.position.z += (targetZ - camera.position.z) * 0.04;
    camera.position.x += (pointer.x * 0.9 - camera.position.x) * 0.035;
    camera.position.y +=
      (2.2 - scroll.progress * 1.4 - pointer.y * 0.5 - camera.position.y) * 0.035;
    camera.lookAt(0, 0, 0);
  });
  return null;
}

/* ---------------------------------------------------------------- */

export default function MusicScene() {
  return (
    <>
      <color attach="background" args={[INK]} />
      <fog attach="fog" args={[INK, 8.5, 26]} />
      <DriftCamera />
      <WaveField />
      <StringField />
      <Haze />
    </>
  );
}