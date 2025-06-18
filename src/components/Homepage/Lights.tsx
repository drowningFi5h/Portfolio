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
                intensity={2}
                color={theme.secondary}
                castShadow
            />
            <pointLight
                position={[-10, -5, -5]}
                intensity={1.5}
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