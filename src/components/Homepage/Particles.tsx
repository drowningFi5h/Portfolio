// src/components/Homepage/Particles.tsx
'use client';

import { useMemo, useRef } from 'react';
import { Points as DreiPoints, PointMaterial } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useTheme } from './ThemeContext';
import * as THREE from 'three';
import { Points } from 'three';

export default function Particles() {
    const { theme } = useTheme();
    const pointsRef = useRef<Points>(null);

    const particles = useMemo(() => {
        const count = 500;
        const positions = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 50;
            positions[i * 3 + 1] = Math.random() * 50 - 40;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 50;
        }
        return positions;
    }, []);

    useFrame((state) => {
        if (pointsRef.current) {
            const { pointer } = state;
            pointsRef.current.rotation.y = THREE.MathUtils.lerp(pointsRef.current.rotation.y, (pointer.x * Math.PI) / 10, 0.1);
            pointsRef.current.rotation.x = THREE.MathUtils.lerp(pointsRef.current.rotation.x, (pointer.y * Math.PI) / 10, 0.1);
        }
    });

    return (
        <DreiPoints ref={pointsRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    args={[particles, 3]}
                />
            </bufferGeometry>
            <PointMaterial
                size={0.005}
                color={theme.accent}
                transparent
                opacity={0.4}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
            />
        </DreiPoints>
    );
}