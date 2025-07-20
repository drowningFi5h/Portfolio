import React, { useRef, useMemo, useEffect } from 'react';
import { extend, useFrame, useThree } from '@react-three/fiber';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { WebGLRenderTarget } from 'three';
import * as THREE from 'three';

const GlitchShader = {
    uniforms: {
        'tDiffuse': { value: null },
        'amount': { value: 0.0 },
        'rgbShift': { value: new THREE.Vector2(0, 0) },
        'time': { value: 0.0 }
    },
    vertexShader: `
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    fragmentShader: /* glsl */`
        uniform sampler2D tDiffuse;
        uniform float amount;
        uniform vec2 rgbShift;
        uniform float time;
        varying vec2 vUv;

        void main() {
            vec2 uv = vUv;
            vec4 color = texture2D(tDiffuse, uv);

            float noise = fract(sin(dot(uv, vec2(12.9898, 78.233))) * 43758.5453);
            vec2 displacedUv = uv + vec2(noise * amount, 0.0);
            color = texture2D(tDiffuse, displacedUv);

            vec4 red = texture2D(tDiffuse, uv + rgbShift);
            vec4 green = texture2D(tDiffuse, uv);
            vec4 blue = texture2D(tDiffuse, uv - rgbShift);

            color = vec4(red.r, green.g, blue.b, 1.0);

            float scanline = sin(uv.y * 800.0) * 0.05;
            color.rgb += scanline * amount;

            if (fract(time * 10.0) < amount * 0.5) {
                color.rgb *= 0.5;
            }

            gl_FragColor = color;
        }
    `
};

extend({ EffectComposer, RenderPass, ShaderPass });

interface GlitchEffectProps {
    glitchIntensity: number;
}

export const GlitchEffect: React.FC<GlitchEffectProps> = ({ glitchIntensity }) => {
    const composer = useRef<EffectComposer | null>(null);
    const { scene, gl, size, camera } = useThree();

    const glitchPass = useMemo(() => {
        const pass = new ShaderPass(GlitchShader);
        pass.uniforms.rgbShift.value = new THREE.Vector2(0, 0);
        return pass;
    }, []);

    useEffect(() => {
        composer.current = new EffectComposer(gl, new WebGLRenderTarget(size.width, size.height));
        composer.current.addPass(new RenderPass(scene, camera));
        composer.current.addPass(glitchPass);

        const handleResize = () => {
            if (composer.current) {
                composer.current.setSize(size.width, size.height);
            }
        };
        window.addEventListener('resize', handleResize);
        handleResize();

        return () => {
            window.removeEventListener('resize', handleResize);
            if (composer.current) {
                composer.current.dispose();
            }
        };
    }, [composer, gl, scene, camera, size, glitchPass]);

    useFrame(({ clock }) => {
        if (composer.current && glitchPass) {
            glitchPass.uniforms.amount.value = glitchIntensity * 0.1;
            glitchPass.uniforms.rgbShift.value.set(glitchIntensity * 0.02, glitchIntensity * 0.005);
            glitchPass.uniforms.time.value = clock.getElapsedTime();

            composer.current.render();
        }
    }, 1);

    return null;
};