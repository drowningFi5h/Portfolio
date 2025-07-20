'use client';

import { useTheme } from './ThemeContext';
import { useMemo } from 'react';
import * as THREE from 'three';

export default function Lights() {
    const { theme } = useTheme();
    const isDarkMode = theme.background === '#121212';

    const textTarget = useMemo(() => {
        const target = new THREE.Object3D();
        target.position.set(0, 0, 0);
        return target;
    }, []);

    return (
        <>
            <ambientLight intensity={0.5} color={theme.foreground} />
            <spotLight
                position={[15, 15, 5]}
                angle={0.3}
                penumbra={1}
                intensity={5}
                color={theme.secondary}
                castShadow
            />
            <spotLight
                position={[0, 6, 2]}
                angle={0.4}
                penumbra={0.8}
                intensity={80}
                color={theme.accent}
                target={textTarget}
                castShadow
            />
            <pointLight
                position={[0, 2, -4]}
                intensity={10}
                color={theme.accent}
            />
            {isDarkMode && (
                <>
                    <primitive object={textTarget} />
                    <spotLight
                        position={[0, 4, 4]}
                        angle={0.6}
                        penumbra={0.5}
                        intensity={60}
                        color={theme.accent}
                        target={textTarget}
                        castShadow
                    />
                </>
            )}
        </>
    );
}