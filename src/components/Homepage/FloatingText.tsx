// src/components/Homepage/FloatingText.tsx
'use client';

import { useFrame, useLoader, useThree } from '@react-three/fiber';
import { useRef, useState, useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { MeshSurfaceSampler } from 'three/addons/math/MeshSurfaceSampler.js';
import { MathUtils } from 'three';
import { useTheme } from './ThemeContext';

export default function FloatingText({ isJapanese }: { isJapanese: boolean }) {
    const particlesRef = useRef<THREE.Points>(null);
    const { theme } = useTheme();
    const { viewport } = useThree();
    const mousePosition = useRef(new THREE.Vector3(10000, 10000, 10000)).current;

    const [isInitialized, setIsInitialized] = useState(false);

    const fontEn = useLoader(FontLoader, '/fonts/Vanger_Regular.json');
    const fontJp = useLoader(FontLoader, '/fonts/Chinese Cally TFB_Regular.json');

    const particleCount = 3000;
    const [targetPositions, setTargetPositions] = useState<Float32Array | null>(null);
    const currentPositionsRef = useRef<Float32Array>(new Float32Array(particleCount * 3));

    const textOptions = useMemo(() => ({
        font: isJapanese ? fontJp : fontEn,
        size: isJapanese ? 0.5 : 0.5,
        height: 0.01,
        curveSegments: 12,
        bevelEnabled: false,
        bevelSize: 0,
        bevelOffset: 0,
        bevelSegments: 1,
    }), [isJapanese, fontEn, fontJp]);

    const textToRender = isJapanese ? 'T A U S I F' : 'T A U S I F';

    useEffect(() => {
        const geometry = new TextGeometry(textToRender, textOptions);
        geometry.center();

        const mesh = new THREE.Mesh(geometry);
        const sampler = new MeshSurfaceSampler(mesh).build();

        const newTargetPositions = new Float32Array(particleCount * 3);
        const tempPosition = new THREE.Vector3();

        for (let i = 0; i < particleCount; i++) {
            sampler.sample(tempPosition);
            newTargetPositions.set([tempPosition.x, tempPosition.y, 0], i * 3);
        }

        if (!isInitialized) {
            currentPositionsRef.current.set(newTargetPositions);
            if (particlesRef.current) {
                particlesRef.current.geometry.attributes.position.needsUpdate = true;
            }
            setIsInitialized(true);
        }

        setTargetPositions(newTargetPositions);
    }, [textToRender, textOptions, isInitialized]);

    useFrame((state, delta) => {
        const { pointer, camera } = state;
        mousePosition.x = (pointer.x * viewport.width) / 2;
        mousePosition.y = (pointer.y * viewport.height) / 2;

        if (particlesRef.current && targetPositions && currentPositionsRef.current) {
            const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
            const currentPositions = currentPositionsRef.current;

            const textGroup = particlesRef.current;
            const direction = new THREE.Vector3();
            camera.getWorldDirection(direction);
            const angle = Math.atan2(direction.x, direction.z);
            textGroup.rotation.y = MathUtils.lerp(textGroup.rotation.y, angle + Math.PI, 0.1);

            const tempPosition = new THREE.Vector3();
            const repulsionRadius = 5;
            const repulsionStrength = 5;
            const returnStrength = 0.05;

            for (let i = 0; i < particleCount; i++) {
                const i3 = i * 3;

                const targetX = targetPositions[i3];
                const targetY = targetPositions[i3 + 1];
                const targetZ = targetPositions[i3 + 2];

                currentPositions[i3] = MathUtils.lerp(currentPositions[i3], targetX, returnStrength);
                currentPositions[i3 + 1] = MathUtils.lerp(currentPositions[i3 + 1], targetY, returnStrength);
                currentPositions[i3 + 2] = MathUtils.lerp(currentPositions[i3 + 2], targetZ, returnStrength);

                tempPosition.set(currentPositions[i3], currentPositions[i3 + 1], currentPositions[i3 + 2]);
                const distanceToMouse = tempPosition.distanceTo(mousePosition);

                let finalX = currentPositions[i3];
                let finalY = currentPositions[i3 + 1];
                const finalZ = currentPositions[i3 + 2];

                if (distanceToMouse < repulsionRadius) {
                    const repulsionForce = (repulsionRadius - distanceToMouse) / repulsionRadius;
                    const repulsionVec = tempPosition.clone().sub(mousePosition).normalize();
                    finalX += repulsionVec.x * repulsionForce * repulsionStrength * delta;
                    finalY += repulsionVec.y * repulsionForce * repulsionStrength * delta;
                }

                positions[i3] = finalX;
                positions[i3 + 1] = finalY;
                positions[i3 + 2] = finalZ;
            }
            particlesRef.current.geometry.attributes.position.needsUpdate = true;
        }
    });

    return (
        <points ref={particlesRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    args={[currentPositionsRef.current, 3]}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.05}
                color={theme.accent}
                transparent
                opacity={0.7}
                blending={THREE.AdditiveBlending}
                sizeAttenuation
                depthWrite={false}
            />
        </points>
    );
}