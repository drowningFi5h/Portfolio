'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import Fog from '../Effects/Fog';
import Lights from '../Effects/Lights';
import FloatingText from '../Effects/FloatingText';
import { useState, useEffect, useRef } from 'react';
import { ThemeProvider, useTheme } from '../Effects/ThemeContext';
import ThemeSwitcher from '../Effects/ThemeSwitcher';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function ZoomableCamera({ isZooming }: { isZooming: boolean }) {
    const cameraRef = useRef<THREE.PerspectiveCamera>(null);
    const startPosition = useRef([6, 1, 0]);
    const targetPosition = useRef([0, 1, 4]);
    const zoomProgress = useRef(0);

    useFrame(() => {
        if (cameraRef.current && isZooming) {
            zoomProgress.current += 0.01; // Zoom speed

            if (zoomProgress.current <= 1) {
                const progress = zoomProgress.current;
                const easeProgress = 1 - Math.pow(1 - progress, 3); // Ease-out curve

                cameraRef.current.position.x = THREE.MathUtils.lerp(
                    startPosition.current[0],
                    targetPosition.current[0],
                    easeProgress
                );
                cameraRef.current.position.y = THREE.MathUtils.lerp(
                    startPosition.current[1],
                    targetPosition.current[1],
                    easeProgress
                );
                cameraRef.current.position.z = THREE.MathUtils.lerp(
                    startPosition.current[2],
                    targetPosition.current[2],
                    easeProgress
                );
            }
        } else if (!isZooming) {
            zoomProgress.current = 0;
            if (cameraRef.current) {
                cameraRef.current.position.set(...startPosition.current);
            }
        }
    });

    return (
        <PerspectiveCamera
            ref={cameraRef}
            makeDefault
            position={[6, 1, 0]}
            fov={75}
        />
    );
}

function ThemedSceneContent({ isZooming }: { isZooming: boolean }) {
    const [isJapanese, setIsJapanese] = useState(true);
    const [transitionKey, setTransitionKey] = useState(0);
    const { theme } = useTheme();

    useEffect(() => {
        const intervalId = setInterval(() => {
            setIsJapanese((prev) => !prev);
            setTransitionKey((prevKey) => prevKey + 1);
        }, 5000);

        return () => clearInterval(intervalId);
    }, []);

    return (
        <div style={{ width: '100vw', height: '100vh' }}>
            <ThemeSwitcher />
            <Canvas shadows>
                <color attach="background" args={[theme.background]} />
                <ZoomableCamera isZooming={isZooming} />
                <Fog />
                <Lights />
                <FloatingText key={transitionKey} isJapanese={isJapanese} />
                <OrbitControls
                    enableZoom={false}
                    enablePan={false}
                    autoRotate={!isZooming}
                    autoRotateSpeed={1}
                    target={[0, 0, 0]}
                    maxPolarAngle={Math.PI}
                    minPolarAngle={0}
                />
            </Canvas>
        </div>
    );
}

export default function HomepageScene({ isZooming = false }: { isZooming?: boolean }) {
    return (
        <ThemeProvider>
            <ThemedSceneContent isZooming={isZooming} />
        </ThemeProvider>
    );
}