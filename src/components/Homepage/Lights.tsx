// Lights.tsx
'use client';

import { useTheme } from './ThemeContext';

export default function Lights() {
    const { theme } = useTheme();

    return (
        <>
            <ambientLight intensity={0.05} color={theme.foreground} />
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
                intensity={0.8}
                color={theme.accent}
            />
        </>
    );
}