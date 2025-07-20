'use client';

import { Text3D, Center } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef, useState, useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { MathUtils } from 'three';
import { GlitchEffect } from './GlitchEffect';
import { useTheme } from './ThemeContext';

interface LetterProps {
    offsetX: number;
    offsetY: number;
    offsetZ: number;
    rotationX: number;
    rotationY: number;
    rotationZ: number;
    opacity: number;
}


export default function FloatingText({ isJapanese }:{ isJapanese: boolean }) {
    const textRef = useRef<THREE.Group>(null);
    const [transitionProgress, setTransitionProgress] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(true);
    const [letterStates, setLetterStates] = useState<LetterProps[]>([]);
    const [cameraShakeIntensity, setCameraShakeIntensity] = useState(0);

    const { theme } = useTheme();

    const japaneseLetters = useMemo(() => "TAUSIF".split(''), []);
    const englishLetters = useMemo(() => "TAUSIF".split(''), []);
    const currentLetters = useMemo(() => (isJapanese ? japaneseLetters : englishLetters), [isJapanese, japaneseLetters, englishLetters]);

    useEffect(() => {
        setLetterStates(
            currentLetters.map(() => ({
                offsetX: 0,
                offsetY: 0,
                offsetZ: 0,
                rotationX: 0,
                rotationY: 0,
                rotationZ: 0,
                opacity: 1,
            }))
        );
    }, [currentLetters]);

    useEffect(() => {
        let animationFrame: number;
        const animateTransition = () => {
            if (isTransitioning) {
                setTransitionProgress((prev) => {
                    const newProgress = MathUtils.lerp(prev, 1, 0.08);
                    if (newProgress >= 0.99) {
                        setIsTransitioning(false);
                        return 1;
                    }
                    return newProgress;
                });
            }
            animationFrame = requestAnimationFrame(animateTransition);
        };

        animateTransition();
        return () => cancelAnimationFrame(animationFrame);
    }, [isTransitioning]);

    useEffect(() => {
        setIsTransitioning(true);
        setTransitionProgress(0);
    }, [isJapanese]);

    useFrame(({ camera }) => {
        const glitchFactor = 1 - transitionProgress;

        setCameraShakeIntensity(glitchFactor * 0.03);

        if (textRef.current) {
            const direction = new THREE.Vector3();
            camera.getWorldDirection(direction);
            const angle = Math.atan2(direction.x, direction.z);
            textRef.current.rotation.y = angle + Math.PI;
        }

        camera.position.x += MathUtils.randFloatSpread(cameraShakeIntensity);
        camera.position.y += MathUtils.randFloatSpread(cameraShakeIntensity);
        camera.position.z += MathUtils.randFloatSpread(cameraShakeIntensity);

        if (isTransitioning) {
            setLetterStates((prevStates) =>
                prevStates.map(() => ({
                    offsetX: MathUtils.randFloatSpread(glitchFactor * 0.15),
                    offsetY: MathUtils.randFloatSpread(glitchFactor * 0.15),
                    offsetZ: MathUtils.randFloatSpread(glitchFactor * 0.05),
                    rotationX: MathUtils.randFloatSpread(glitchFactor * 0.5),
                    rotationY: MathUtils.randFloatSpread(glitchFactor * 0.5),
                    rotationZ: MathUtils.randFloatSpread(glitchFactor * 0.5),
                    opacity: Math.random() > 0.5 ? 1 : MathUtils.randFloat(0.1, 0.8),
                }))
            );
        }
    });

    return (
        <>
            <GlitchEffect glitchIntensity={1 - transitionProgress} />
            <group>
                <Center ref={textRef}>
                    <group>
                        {currentLetters.map((letter, index) => {
                            const letterState = letterStates[index] || {
                                offsetX: 0,
                                offsetY: 0,
                                offsetZ: 0,
                                rotationX: 0,
                                rotationY: 0,
                                rotationZ: 0,
                                opacity: 1,
                            };

                            const basePosition = isJapanese
                                ? index * 0.5
                                : index * 0.5 - (currentLetters.length - 1) * 0.25; //spacing for ENglish

                            return (
                                <Text3D
                                    key={`text-${index}`}
                                    font={isJapanese ? "/fonts/Chinese Cally TFB_Regular.json" : "/fonts/VALORANT_Regular.json"}
                                    size={0.5}
                                    height={0.2}
                                    curveSegments={12}
                                    position={[
                                        basePosition + letterState.offsetX,
                                        letterState.offsetY,
                                        letterState.offsetZ,
                                    ]}
                                    rotation={[
                                        letterState.rotationX,
                                        letterState.rotationY,
                                        letterState.rotationZ,
                                    ]}
                                >
                                    {letter}
                                    <meshLambertMaterial
                                        color={theme.foreground}
                                        emissive={theme.accent}
                                        emissiveIntensity={1.5 * (1 - transitionProgress)}
                                        metalness={0.8}
                                        roughness={0.6}
                                        transparent
                                        opacity={letterState.opacity}
                                    />
                                </Text3D>
                            );
                        })}
                    </group>
                </Center>
            </group>
        </>
    );
}