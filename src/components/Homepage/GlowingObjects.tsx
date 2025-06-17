'use client';

import { useRef, useMemo } from 'react';
import { Points, AdditiveBlending, TextureLoader, BufferAttribute } from 'three';
import { useFrame, useLoader } from '@react-three/fiber';

export default function GlowingParticles() {
    const particlesRef = useRef<Points>(null);
    const particleCount = 200;
    const glowColor = "#00ff95";

    const texture = useLoader(TextureLoader, '/textures/particles.png');

    const positions = useMemo(() => {
        const pos = new Float32Array(particleCount * 3);
        const sizes = new Float32Array(particleCount);
        for (let i = 0; i < particleCount; i++) {
            pos[i * 3] = (Math.random() - 0.5) * 10;
            pos[i * 3 + 1] = (Math.random() - 0.5) * 10;
            pos[i * 3 + 2] = (Math.random() - 0.5) * 10;
            sizes[i] = Math.random() * 0.1;
        }
        return { positions: pos, sizes };
    }, []);

    useFrame((state) => {
        if (particlesRef.current) {
            particlesRef.current.rotation.y = state.clock.elapsedTime * 0.1;
            particlesRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.3;

            const sizes = particlesRef.current.geometry.attributes.size as BufferAttribute;
            for (let i = 0; i < particleCount; i++) {
                sizes.array[i] = Math.sin(state.clock.elapsedTime + i) * 0.05 + 0.05;
            }
            sizes.needsUpdate = true;
        }
    });

    return (
        <points ref={particlesRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    args={[positions.positions, 3]}
                />
                <bufferAttribute
                    attach="attributes-size"
                    args={[positions.sizes, 1]}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.05}
                map={texture}
                color={glowColor}
                transparent
                opacity={0.8}
                blending={AdditiveBlending}
                sizeAttenuation
                depthWrite={false}
            />
        </points>
    );
}