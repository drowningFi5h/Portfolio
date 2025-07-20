import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import Lights from '../Effects/Lights';
import { useState } from 'react';
import {ThemeProvider} from '../Effects/ThemeContext';

function Asteroid({ position, icon, text }) {
    const [hovered, setHovered] = useState(false);

    return (
        <group
            position={position}
            scale={hovered ? 1.2 : 1}
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => setHovered(false)}
        >
            {/* Replace with custom geometry or use a sphere for now */}
            <mesh>
                <sphereGeometry args={[1, 32, 32]} />
                <meshStandardMaterial color={hovered ? '#ffd700' : '#888'} />
            </mesh>
            {/* Icon/text transition */}
            {hovered ? (
                <mesh position={[0, 1.2, 0]}>
                    {/* Replace with Text3D or icon */}
                </mesh>
            ) : (
                <mesh position={[0, 1.2, 0]}>
                    {/* Replace with icon */}
                </mesh>
            )}
        </group>
    );
}

export default function AboutScene() {
    return (
        <Canvas shadows>
            <Lights />
            <OrbitControls enableZoom={false} />
            {/* Four asteroids */}
            <Asteroid position={[-3, 0, 0]} icon="work" text="Work" />
            <Asteroid position={[3, 0, 0]} icon="expertise" text="Expertise" />
            <Asteroid position={[0, 0, -3]} icon="about" text="About" />
            <Asteroid position={[0, 0, 3]} icon="contact" text="Contact" />
        </Canvas>
    );
}