// Fog.tsx
'use client';

import { useFrame, useThree } from '@react-three/fiber';
import { useState } from 'react';
import { Vector2 } from 'three';
import { useTheme } from './ThemeContext';

export default function Fog() {
    const { theme } = useTheme();
    const [fogParams, setFogParams] = useState({
        density: 0.15,
        near: 5,
        far: 25
    });
    const mouse = new Vector2();
    const { viewport } = useThree();

    useFrame((state) => {
        mouse.x = (state.mouse.x * viewport.width) / 2;
        mouse.y = (state.mouse.y * viewport.height) / 2;

        const time = state.clock.elapsedTime;
        const baseFar = 25 + Math.sin(time * 0.5) * 5;
        const newFar = baseFar - (Math.abs(mouse.x) + Math.abs(mouse.y)) * 3;

        setFogParams({
            ...fogParams,
            far: Math.max(15, newFar)
        });
    });

    return <fog attach="fog" args={[theme.fog, fogParams.near, fogParams.far]} />;
}