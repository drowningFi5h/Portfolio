// src/components/Effects/Fog.tsx
'use client';

import { useMemo, useRef, useEffect } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import * as THREE from 'three';
import { useTheme } from './ThemeContext';

// Reusable THREE objects to avoid creating them in the render loop
const dummy = new THREE.Object3D();
const position = new THREE.Vector3();
const quaternion = new THREE.Quaternion();
const scale = new THREE.Vector3();
const euler = new THREE.Euler();

export default function Fog() {
    const groupRef = useRef<THREE.InstancedMesh>(null);
    const { theme } = useTheme();

    const smokeTexture = useLoader(THREE.TextureLoader, 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/82015/blue-smoke.png');
    const particleCount = 150;

    const smokeGeometry = useMemo(() => new THREE.PlaneGeometry(40, 40), []);
    const smokeMaterial = useMemo(() => new THREE.MeshLambertMaterial({
        map: smokeTexture,
        color: theme.fog,
        transparent: true,
        opacity: 0.2,
        blending: THREE.NormalBlending,
        depthWrite: false,
    }), [smokeTexture, theme.fog]);

    useEffect(() => {
        if (groupRef.current) {
            for (let i = 0; i < particleCount; i++) {
                dummy.position.set(
                    (Math.random() - 0.5) * 120,
                    (Math.random() - 0.5) * 40,
                    (Math.random() - 0.5) * 120
                );
                dummy.rotation.z = Math.random() * 2 * Math.PI;
                dummy.updateMatrix();
                groupRef.current.setMatrixAt(i, dummy.matrix);
            }
            groupRef.current.instanceMatrix.needsUpdate = true;
        }
    }, [particleCount, smokeMaterial]);

    useFrame((state, delta) => {
        if (groupRef.current) {

            const direction = new THREE.Vector3();
            state.camera.getWorldDirection(direction);
            const angle = Math.atan2(direction.x, direction.z);
            groupRef.current.rotation.y = angle + Math.PI;

            for (let i = 0; i < particleCount; i++) {
                groupRef.current.getMatrixAt(i, dummy.matrix);
                dummy.matrix.decompose(position, quaternion, scale);

                euler.setFromQuaternion(quaternion);
                euler.z += delta * 0.2;
                quaternion.setFromEuler(euler);

                dummy.matrix.compose(position, quaternion, scale);
                groupRef.current.setMatrixAt(i, dummy.matrix);
            }
            groupRef.current.instanceMatrix.needsUpdate = true;
        }
    });

    return (
        <instancedMesh
            ref={groupRef}
            args={[smokeGeometry, smokeMaterial, particleCount]}
        />
    );
}