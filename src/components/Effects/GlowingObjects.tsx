'use client';

import { useRef, useMemo } from 'react';
import { Points, AdditiveBlending, TextureLoader, BufferAttribute } from 'three';
import { useFrame, useLoader, useThree } from '@react-three/fiber';
import { useTheme } from './ThemeContext';
import * as THREE from 'three';

export default function GlowingObjects() {
    const particlesRef = useRef<Points>(null);
    const particleCount = 500;
    const initialPositionsRef = useRef<Float32Array | null>(null);
    const { theme } = useTheme();
    const { viewport } = useThree();
    const mousePosition = useRef(new THREE.Vector3(0, 0, 0)).current;

    const texture = useLoader(TextureLoader, '/textures/particles.png');

    const attributes = useMemo(() => {
        const positions = new Float32Array(particleCount * 3);
        const sizes = new Float32Array(particleCount);
        for (let i = 0; i < particleCount; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 10;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
            sizes[i] = Math.random() * 0.15 + 0.05;
        }
        initialPositionsRef.current = new Float32Array(positions);
        return { positions, sizes };
    }, [particleCount]);

    useFrame((state) => {
        mousePosition.x = (state.pointer.x * viewport.width) / 2;
        mousePosition.y = (state.pointer.y * viewport.height) / 2;

        if (particlesRef.current && initialPositionsRef.current) {
            const positions = particlesRef.current.geometry.attributes.position as BufferAttribute;
            const sizes = particlesRef.current.geometry.attributes.size as BufferAttribute;
            const initialPositions = initialPositionsRef.current;
            const tempParticlePosition = new THREE.Vector3();

            for (let i = 0; i < particleCount; i++) {
                const i3 = i * 3;
                const initialX = initialPositions[i3];
                const initialY = initialPositions[i3 + 1];
                const initialZ = initialPositions[i3 + 2];


                const time = state.clock.elapsedTime * 0.4;
                const oscX = Math.sin(time + i) * 0.2;
                const oscY = Math.cos(time + i * 2) * 0.2;
                const oscZ = Math.sin(time + i * 3) * 0.2;
                let targetX = initialX + oscX;
                let targetY = initialY + oscY;
                const targetZ = initialZ + oscZ;

                tempParticlePosition.set(positions.array[i3], positions.array[i3 + 1], positions.array[i3 + 2]);
                const distanceToMouse = tempParticlePosition.distanceTo(mousePosition);
                const repulsionRadius = 4;
                const repulsionStrength = 3;

                if (distanceToMouse < repulsionRadius) {
                    const repulsionForce = (repulsionRadius - distanceToMouse) / repulsionRadius;
                    const repulsionVec = tempParticlePosition.clone().sub(mousePosition).normalize();
                    targetX += repulsionVec.x * repulsionForce * repulsionStrength;
                    targetY += repulsionVec.y * repulsionForce * repulsionStrength;
                }

                positions.array[i3] = THREE.MathUtils.lerp(positions.array[i3], targetX, 0.05);
                positions.array[i3 + 1] = THREE.MathUtils.lerp(positions.array[i3 + 1], targetY, 0.05);
                positions.array[i3 + 2] = THREE.MathUtils.lerp(positions.array[i3 + 2], targetZ, 0.05);

                sizes.array[i] = Math.sin(state.clock.elapsedTime * 2 + i) * 0.05 + 0.1;
            }

            positions.needsUpdate = true;
            sizes.needsUpdate = true;
        }
    });

    return (
        <points ref={particlesRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    args={[attributes.positions, 3]}
                />
                <bufferAttribute
                    attach="attributes-size"
                    args={[attributes.sizes, 1]}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.2}
                map={texture}
                color={theme.accent}
                transparent
                opacity={0.6}
                blending={AdditiveBlending}
                sizeAttenuation
                depthWrite={false}
            />
        </points>
    );
}