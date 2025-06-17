// scene.tsx
'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import Fog from './Fog';
import Lights from './Lights';
import Particles from './Particles';
import GlowingObjects from './GlowingObjects';
import FloatingText from './FloatingText';
import { useState, useEffect } from 'react';
import { ThemeProvider } from './ThemeContext';
import ThemeSwitcher from './ThemeSwitcher';

export default function Scene() {
    const [isJapanese, setIsJapanese] = useState(true);
    const [transitionKey, setTransitionKey] = useState(0);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setIsJapanese((prev) => !prev);
            setTransitionKey((prevKey) => prevKey + 1);
        }, 5000);

        return () => clearInterval(intervalId);
    }, []);

    return (
        <ThemeProvider>
            <div style={{ width: '100vw', height: '100vh' }}>
                <ThemeSwitcher />
                <Canvas shadows>
                    <PerspectiveCamera
                        makeDefault
                        position={[5, 0, 0]}
                        fov={75}
                    />
                    <Fog />
                    <Lights />
                    <Particles />
                    <GlowingObjects />
                    <FloatingText key={transitionKey} isJapanese={isJapanese} />
                    <OrbitControls
                        enableZoom={true}
                        enablePan={false}
                        autoRotate
                        autoRotateSpeed={1}
                        target={[0, 0, 0]}
                        maxPolarAngle={Math.PI}
                        minPolarAngle={0}
                    />
                </Canvas>
            </div>
        </ThemeProvider>
    );
}