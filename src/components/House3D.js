'use client';

import { Canvas } from '@react-three/fiber';
import {
    OrbitControls,
    PerspectiveCamera,
    Float,
    ContactShadows,
    Environment,
    useTexture
} from '@react-three/drei';
import * as THREE from 'three';

// --- Minimalist Materials ---

const Glass = () => (
    <meshPhysicalMaterial
        color="#ffffff"
        transmission={0.98}
        opacity={0.5}
        metalness={0.1}
        roughness={0}
        thickness={0.5}
        envMapIntensity={2}
        transparent
        side={THREE.DoubleSide}
    />
);

const Concrete = () => (
    <meshStandardMaterial color="#f8fafc" roughness={0.5} metalness={0.1} />
);

const DarkStone = () => (
    <meshStandardMaterial color="#1e293b" roughness={0.8} metalness={0.2} />
);

const GoldAccent = () => (
    <meshStandardMaterial color="#c9a961" metalness={0.8} roughness={0.2} />
);

// --- Components ---

function ModernPavilion() {
    return (
        <group position={[0, -0.5, 0]}>
            {/* --- Main Structure --- */}

            {/* Floor Slab */}
            <mesh position={[0, 0, 0]} receiveShadow castShadow>
                <boxGeometry args={[6, 0.2, 4]} />
                <Concrete />
            </mesh>

            {/* Roof Slab */}
            <mesh position={[0, 2.5, 0]} receiveShadow castShadow>
                <boxGeometry args={[6.5, 0.2, 4.5]} />
                <Concrete />
            </mesh>

            {/* Back Wall (Stone) */}
            <mesh position={[0, 1.25, -1.5]} receiveShadow castShadow>
                <boxGeometry args={[5, 2.5, 0.5]} />
                <DarkStone />
            </mesh>

            {/* Side Feature Wall (Gold Accent) */}
            <mesh position={[-2, 1.25, 0]} receiveShadow castShadow>
                <boxGeometry args={[0.2, 2.5, 3]} />
                <GoldAccent />
            </mesh>

            {/* Glass Enclosure */}
            <mesh position={[0.5, 1.25, 0.5]}>
                <boxGeometry args={[4, 2.3, 3]} />
                <Glass />
            </mesh>

            {/* --- Interior Hints (Abstract) --- */}
            {/* Low Table */}
            <mesh position={[1, 0.3, 1]} castShadow>
                <cylinderGeometry args={[0.5, 0.5, 0.2, 32]} />
                <DarkStone />
            </mesh>

            {/* Tall Lamp/Sculpture */}
            <mesh position={[2, 1, -0.5]} castShadow>
                <cylinderGeometry args={[0.05, 0.05, 1.8, 16]} />
                <GoldAccent />
            </mesh>

            {/* --- Exterior Details --- */}
            {/* Steps */}
            <mesh position={[0, -0.2, 2.5]} receiveShadow>
                <boxGeometry args={[2, 0.2, 1]} />
                <Concrete />
            </mesh>

            {/* Pool/Water Feature */}
            <mesh position={[3.5, -0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[2, 4]} />
                <meshStandardMaterial color="#bae6fd" roughness={0.1} metalness={0.8} opacity={0.8} transparent />
            </mesh>
        </group>
    );
}

export default function House3D() {
    return (
        <div className="w-full h-[400px] md:h-[600px] cursor-grab active:cursor-grabbing relative">
            <Canvas shadows dpr={[1, 2]} gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.2 }}>
                <PerspectiveCamera makeDefault position={[6, 4, 8]} fov={45} />
                <OrbitControls
                    enableZoom={false}
                    autoRotate
                    autoRotateSpeed={0.5}
                    minPolarAngle={Math.PI / 3}
                    maxPolarAngle={Math.PI / 2.2}
                    enableDamping
                />

                {/* --- Professional Studio Lighting --- */}
                <ambientLight intensity={0.5} />
                <spotLight
                    position={[10, 10, 5]}
                    angle={0.4}
                    penumbra={1}
                    intensity={2}
                    castShadow
                    shadow-bias={-0.0001}
                />
                <pointLight position={[-10, 5, -10]} color="#ffffff" intensity={1} />

                <Environment preset="city" />

                <Float speed={2} rotationIntensity={0.05} floatIntensity={0.1}>
                    <ModernPavilion />
                </Float>

                <ContactShadows
                    position={[0, -1.5, 0]}
                    opacity={0.4}
                    scale={15}
                    blur={2}
                    far={4.5}
                />
            </Canvas>
        </div>
    );
}
