'use client';

import { useMemo } from 'react';
import { Points, PointMaterial } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';

export default function Particles() {
    const particles = useMemo(() => {
        const count = 5000;
        const positions = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 50;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 50;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 50;
        }
        return positions;
    }, []);

    useFrame((state) => {
        const time = state.clock.elapsedTime;
        state.scene.children.forEach((child) => {
            if (child.isPoints) {
                child.rotation.y = time * 0.1;
            }
        });
    });

    return (
        <Points>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    array={particles}
                    count={particles.length / 3}
                    itemSize={3}
                />
            </bufferGeometry>
            <PointMaterial
                size={0.1}
                color="#ffffff"
                transparent
                opacity={0.8}
            />
        </Points>
    );
}