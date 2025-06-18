'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import Fog from './Fog';
import Lights from './Lights';
import Particles from './Particles';
import GlowingObjects from './GlowingObjects';
import FloatingText from './FloatingText';
import { useState, useEffect } from 'react';
import { ThemeProvider, useTheme } from './ThemeContext';
import ThemeSwitcher from './ThemeSwitcher';

function ThemedSceneContent() {
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
                <PerspectiveCamera
                    makeDefault
                    position={[6, 1, 0]}
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
    );
}

export default function Scene() {
    return (
        <ThemeProvider>
            <ThemedSceneContent />
        </ThemeProvider>
    );
}