'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { Float, OrbitControls, PerspectiveCamera, Environment, ContactShadows, Stars, Sparkles, Float as FloatDrei } from '@react-three/drei';
import { useRef, useMemo } from 'react';
import * as THREE from 'three';

function ModernTower({ position, scale, color = "#ffffff", speed = 1, delay = 0, hasGlow = false }) {
    const group = useRef();
    const slats = useMemo(() => [...Array(8)], []);

    useFrame((state) => {
        const t = state.clock.getElapsedTime() * speed + delay;
        if (group.current) {
            group.current.rotation.y = Math.sin(t * 0.1) * 0.05;
            group.current.position.y = position[1] + Math.sin(t * 0.3) * 0.15;
        }
    });

    return (
        <group ref={group} position={position} scale={scale}>
            {/* Main Body */}
            <mesh castShadow>
                <boxGeometry args={[1, 1, 1]} />
                <meshStandardMaterial
                    color={color}
                    metalness={0.9}
                    roughness={0.1}
                    envMapIntensity={2}
                />
            </mesh>

            {/* Glass Section */}
            <mesh position={[0, 0, 0.51]} castShadow>
                <boxGeometry args={[0.85, 0.9, 0.05]} />
                <meshStandardMaterial
                    color="#ffffff"
                    transparent
                    opacity={0.3}
                    metalness={1}
                    roughness={0}
                />
            </mesh>

            {/* Vertical Slats */}
            {slats.map((_, i) => (
                <mesh key={i} position={[(i - 3.5) * 0.12, 0, 0.52]}>
                    <boxGeometry args={[0.015, 0.95, 0.02]} />
                    <meshStandardMaterial color="#c9a961" metalness={1} roughness={0.2} />
                </mesh>
            ))}

            {/* Glowing Windows (Optional) */}
            {hasGlow && (
                <mesh position={[0, 0, 0.48]}>
                    <boxGeometry args={[0.7, 0.7, 0.1]} />
                    <meshStandardMaterial
                        color="#c9a961"
                        emissive="#c9a961"
                        emissiveIntensity={2}
                        transparent
                        opacity={0.5}
                    />
                </mesh>
            )}

            {/* Top Detail */}
            <mesh position={[0, 0.55, 0]}>
                <boxGeometry args={[1.15, 0.08, 1.15]} />
                <meshStandardMaterial color="#0f172a" metalness={0.8} />
            </mesh>
        </group>
    );
}

function FloatingCrystal({ position, scale, color = "#c9a961" }) {
    const mesh = useRef();
    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        if (mesh.current) {
            mesh.current.rotation.x = t * 0.2;
            mesh.current.rotation.y = t * 0.3;
            mesh.current.position.y = position[1] + Math.sin(t * 0.5) * 0.2;
        }
    });

    return (
        <mesh ref={mesh} position={position} scale={scale} castShadow>
            <octahedronGeometry args={[1, 0]} />
            <meshStandardMaterial
                color={color}
                metalness={1}
                roughness={0}
                emissive={color}
                emissiveIntensity={0.5}
            />
        </mesh>
    );
}

function LuxuryScene() {
    return (
        <>
            {/* Background Elements */}
            <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
            <Sparkles count={100} scale={20} size={2} speed={0.5} opacity={0.2} color="#c9a961" />

            {/* Main Towers */}
            <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
                <ModernTower position={[0, 0, 0]} scale={[2.5, 6, 2.5]} color="#c9a961" speed={0.5} hasGlow={true} />
            </Float>

            <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.4}>
                <ModernTower position={[-6, -1, -5]} scale={[1.8, 4.5, 1.8]} color="#f8fafc" speed={0.4} delay={1} />
            </Float>

            <Float speed={1.8} rotationIntensity={0.4} floatIntensity={0.6}>
                <ModernTower position={[6, 1, -4]} scale={[1.5, 7, 1.5]} color="#f8fafc" speed={0.6} delay={2} />
            </Float>

            {/* Distant Towers for Depth */}
            <Float speed={1.2} rotationIntensity={0.1} floatIntensity={0.3}>
                <ModernTower position={[-12, -2, -12]} scale={[2.5, 9, 2.5]} color="#0f172a" speed={0.3} delay={3} />
            </Float>

            <Float speed={1.4} rotationIntensity={0.2} floatIntensity={0.5}>
                <ModernTower position={[12, -1, -10]} scale={[2.2, 6, 2.2]} color="#c9a961" speed={0.4} delay={4} />
            </Float>

            <Float speed={1.6} rotationIntensity={0.3} floatIntensity={0.4}>
                <ModernTower position={[0, -4, -15]} scale={[4, 10, 4]} color="#f8fafc" speed={0.2} delay={5} />
            </Float>

            {/* Abstract Floating Elements */}
            <FloatingCrystal position={[-8, 4, -2]} scale={[0.5, 0.5, 0.5]} color="#c9a961" />
            <FloatingCrystal position={[8, 3, -3]} scale={[0.4, 0.4, 0.4]} color="#ffffff" />
            <FloatingCrystal position={[0, 6, -8]} scale={[0.8, 0.8, 0.8]} color="#0f172a" />

            {/* Lighting */}
            <ambientLight intensity={0.4} />
            <spotLight position={[20, 30, 10]} angle={0.15} penumbra={1} intensity={3} castShadow />
            <pointLight position={[-15, 10, 5]} color="#c9a961" intensity={2} />
            <pointLight position={[15, -10, -5]} color="#ffffff" intensity={1} />

            <Environment preset="night" />

            {/* Polished Ground */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -6, 0]} receiveShadow>
                <planeGeometry args={[100, 100]} />
                <meshStandardMaterial
                    color="#020617"
                    metalness={0.9}
                    roughness={0.1}
                    transparent
                    opacity={0.4}
                />
            </mesh>

            {/* Grid Overlay */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -5.9, 0]}>
                <planeGeometry args={[100, 100]} />
                <meshStandardMaterial
                    color="#c9a961"
                    transparent
                    opacity={0.05}
                    wireframe
                />
            </mesh>
        </>
    );
}

export default function Hero3D() {
    return (
        <div className="w-full h-full absolute inset-0 z-0 opacity-60">
            <Canvas shadows dpr={[1, 2]} gl={{ antialias: true, alpha: true }}>
                <PerspectiveCamera makeDefault position={[0, 5, 20]} fov={35} />
                <LuxuryScene />
                <OrbitControls
                    enableZoom={false}
                    enablePan={false}
                    autoRotate
                    autoRotateSpeed={0.3}
                    maxPolarAngle={Math.PI / 1.8}
                    minPolarAngle={Math.PI / 2.5}
                />
                <ContactShadows
                    position={[0, -6, 0]}
                    opacity={0.4}
                    scale={60}
                    blur={2.5}
                    far={15}
                />
            </Canvas>
        </div>
    );
}


