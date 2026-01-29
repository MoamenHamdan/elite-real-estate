'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import {
    OrbitControls,
    PerspectiveCamera,
    Float,
    ContactShadows,
    Environment,
    MeshReflectorMaterial,
    Sparkles,
    Sphere,
    Sky,
    Stars,
    Cloud
} from '@react-three/drei';
import { useRef, useMemo } from 'react';
import * as THREE from 'three';

// --- Premium Materials with PBR Properties ---

const PremiumGlass = () => (
    <meshPhysicalMaterial
        color="#e0f2fe"
        transmission={0.96}
        opacity={0.3}
        metalness={0}
        roughness={0.05}
        thickness={0.8}
        envMapIntensity={2.5}
        clearcoat={1}
        clearcoatRoughness={0.1}
        transparent
        side={THREE.DoubleSide}
        ior={1.5}
    />
);

const WhiteConcrete = () => (
    <meshStandardMaterial
        color="#fafafa"
        roughness={0.4}
        metalness={0.05}
        envMapIntensity={0.8}
    />
);

const DarkStone = () => (
    <meshStandardMaterial
        color="#0f172a"
        roughness={0.7}
        metalness={0.15}
        envMapIntensity={1}
    />
);

const BrushedGold = () => (
    <meshStandardMaterial
        color="#d4af37"
        metalness={0.9}
        roughness={0.25}
        envMapIntensity={2}
    />
);

const Wood = () => (
    <meshStandardMaterial
        color="#8b4513"
        roughness={0.9}
        metalness={0}
    />
);

const MarbleTile = () => (
    <meshStandardMaterial
        color="#f8f9fa"
        roughness={0.1}
        metalness={0.3}
        envMapIntensity={1.5}
    />
);

// --- Foliage Components ---
function Tree({ position }) {
    return (
        <group position={position}>
            {/* Trunk */}
            <mesh position={[0, 0.5, 0]} castShadow>
                <cylinderGeometry args={[0.15, 0.2, 1, 8]} />
                <Wood />
            </mesh>
            {/* Foliage */}
            <mesh position={[0, 1.3, 0]} castShadow>
                <sphereGeometry args={[0.6, 8, 8]} />
                <meshStandardMaterial color="#2d5016" roughness={0.9} />
            </mesh>
            <mesh position={[0, 1.7, 0]} castShadow>
                <sphereGeometry args={[0.5, 8, 8]} />
                <meshStandardMaterial color="#3a6b1f" roughness={0.9} />
            </mesh>
        </group>
    );
}

function Plant({ position }) {
    return (
        <group position={position}>
            <mesh position={[0, 0.15, 0]} castShadow>
                <cylinderGeometry args={[0.08, 0.1, 0.3, 6]} />
                <meshStandardMaterial color="#654321" roughness={0.9} />
            </mesh>
            <mesh position={[0, 0.4, 0]} castShadow>
                <coneGeometry args={[0.25, 0.4, 6]} />
                <meshStandardMaterial color="#2d5016" roughness={0.9} />
            </mesh>
        </group>
    );
}

// --- Animated Water ---
function AnimatedWater({ position }) {
    const meshRef = useRef();

    useFrame(({ clock }) => {
        if (meshRef.current) {
            meshRef.current.material.emissiveIntensity = 0.3 + Math.sin(clock.getElapsedTime() * 0.5) * 0.1;
        }
    });

    return (
        <mesh
            ref={meshRef}
            position={position}
            rotation={[-Math.PI / 2, 0, 0]}
            receiveShadow
        >
            <planeGeometry args={[2.5, 5]} />
            <meshStandardMaterial
                color="#0ea5e9"
                roughness={0.05}
                metalness={0.9}
                emissive="#0284c7"
                emissiveIntensity={0.3}
            />
        </mesh>
    );
}

// --- Main Architecture ---
function LuxuryVilla() {
    return (
        <group position={[0, -0.5, 0]}>
            {/* ========== GROUND & BASE ========== */}

            {/* Main Foundation */}
            <mesh position={[0, -0.15, 0]} receiveShadow>
                <boxGeometry args={[8, 0.1, 6]} />
                <DarkStone />
            </mesh>

            {/* Main Floor Platform */}
            <mesh position={[0, 0, 0]} receiveShadow>
                <boxGeometry args={[7, 0.25, 5]} />
                <MarbleTile />
            </mesh>

            {/* ========== FIRST FLOOR STRUCTURE ========== */}

            {/* Back Wall */}
            <mesh position={[0, 1.5, -2]} receiveShadow castShadow>
                <boxGeometry args={[6, 3, 0.3]} />
                <WhiteConcrete />
            </mesh>

            {/* Left Wall */}
            <mesh position={[-3, 1.5, 0]} receiveShadow castShadow>
                <boxGeometry args={[0.3, 3, 4]} />
                <WhiteConcrete />
            </mesh>

            {/* Front Glass Wall - Center */}
            <mesh position={[0, 1.5, 2.3]}>
                <boxGeometry args={[5, 2.8, 0.15]} />
                <PremiumGlass />
            </mesh>

            {/* Side Glass Panels */}
            <mesh position={[2.7, 1.5, 0.5]} rotation={[0, Math.PI / 2, 0]}>
                <boxGeometry args={[3, 2.8, 0.15]} />
                <PremiumGlass />
            </mesh>

            {/* ========== ARCHITECTURAL COLUMNS ========== */}

            {[-2.5, 2.5].map((x, i) => (
                <group key={i}>
                    {/* Main Column */}
                    <mesh position={[x, 1.5, 2]} castShadow>
                        <cylinderGeometry args={[0.15, 0.15, 3, 16]} />
                        <DarkStone />
                    </mesh>
                    {/* Column Capital */}
                    <mesh position={[x, 3, 2]} castShadow>
                        <cylinderGeometry args={[0.2, 0.15, 0.15, 16]} />
                        <BrushedGold />
                    </mesh>
                    {/* Column Base */}
                    <mesh position={[x, 0.1, 2]} castShadow>
                        <cylinderGeometry args={[0.15, 0.2, 0.15, 16]} />
                        <BrushedGold />
                    </mesh>
                </group>
            ))}

            {/* ========== ROOF STRUCTURE ========== */}

            {/* Main Roof Slab */}
            <mesh position={[0, 3.2, 0]} receiveShadow castShadow>
                <boxGeometry args={[7.5, 0.25, 5.5]} />
                <WhiteConcrete />
            </mesh>

            {/* Roof Overhang */}
            <mesh position={[0, 3.15, 2.8]} castShadow>
                <boxGeometry args={[7.5, 0.1, 1]} />
                <DarkStone />
            </mesh>

            {/* Gold Trim on Roof Edge */}
            <mesh position={[0, 3.4, 3.3]}>
                <boxGeometry args={[7.5, 0.08, 0.08]} />
                <BrushedGold />
            </mesh>

            {/* ========== SECOND FLOOR / BALCONY ========== */}

            {/* Balcony Floor */}
            <mesh position={[0, 3.5, 1]} receiveShadow castShadow>
                <boxGeometry args={[5, 0.2, 2]} />
                <MarbleTile />
            </mesh>

            {/* Balcony Glass Railing */}
            <mesh position={[0, 4, 2]}>
                <boxGeometry args={[4.8, 0.8, 0.1]} />
                <PremiumGlass />
            </mesh>

            {/* Balcony Side Rails */}
            {[-2.4, 2.4].map((x, i) => (
                <mesh key={i} position={[x, 4, 1]} rotation={[0, Math.PI / 2, 0]}>
                    <boxGeometry args={[2, 0.8, 0.1]} />
                    <PremiumGlass />
                </mesh>
            ))}

            {/* Upper Wall */}
            <mesh position={[0, 4.3, -0.5]} castShadow>
                <boxGeometry args={[5, 1.6, 0.3]} />
                <WhiteConcrete />
            </mesh>

            {/* Second Roof */}
            <mesh position={[0, 5.2, 0]} castShadow>
                <boxGeometry args={[5.5, 0.2, 3]} />
                <DarkStone />
            </mesh>

            {/* ========== INTERIOR ELEMENTS ========== */}

            {/* Furniture Piece 1 */}
            <mesh position={[1, 0.4, 0.5]} castShadow>
                <boxGeometry args={[1.5, 0.6, 0.8]} />
                <meshStandardMaterial color="#334155" roughness={0.6} />
            </mesh>

            {/* Furniture Piece 2 */}
            <mesh position={[-1.5, 0.3, -0.5]} castShadow>
                <cylinderGeometry args={[0.4, 0.4, 0.6, 32]} />
                <BrushedGold />
            </mesh>

            {/* Modern Sculpture */}
            <mesh position={[2, 1, -1]} castShadow>
                <torusGeometry args={[0.3, 0.08, 16, 32]} />
                <BrushedGold />
            </mesh>

            {/* ========== ENTRANCE & STEPS ========== */}

            {/* Step 1 */}
            <mesh position={[0, -0.35, 3]} receiveShadow>
                <boxGeometry args={[3, 0.15, 0.8]} />
                <DarkStone />
            </mesh>

            {/* Step 2 */}
            <mesh position={[0, -0.2, 3.4]} receiveShadow>
                <boxGeometry args={[3.2, 0.15, 0.8]} />
                <DarkStone />
            </mesh>

            {/* Door Frame */}
            <mesh position={[0, 1.2, 2.35]}>
                <boxGeometry args={[1.2, 2.4, 0.05]} />
                <meshStandardMaterial color="#1a1a1a" roughness={0.3} metalness={0.6} />
            </mesh>

            {/* ========== EXTERIOR FEATURES ========== */}

            {/* Pool */}
            <AnimatedWater position={[4, -0.08, 0]} />

            {/* Pool Edge */}
            <mesh position={[4, -0.1, -2.6]} receiveShadow>
                <boxGeometry args={[2.5, 0.1, 0.2]} />
                <MarbleTile />
            </mesh>
            <mesh position={[4, -0.1, 2.6]} receiveShadow>
                <boxGeometry args={[2.5, 0.1, 0.2]} />
                <MarbleTile />
            </mesh>

            {/* Landscaping */}
            <Tree position={[-4.5, -0.5, -2]} />
            <Tree position={[-4.5, -0.5, 2]} />
            <Plant position={[-3.5, -0.5, 0]} />
            <Plant position={[2.5, -0.5, -2.5]} />
            <Plant position={[5.5, -0.5, -2.5]} />
            <Plant position={[5.5, -0.5, 2.5]} />

            {/* Ground Accent Lights */}
            {[-2, 0, 2].map((z, i) => (
                <pointLight
                    key={i}
                    position={[3, 0.2, z]}
                    color="#d4af37"
                    intensity={0.5}
                    distance={3}
                />
            ))}

            {/* Window Glow */}
            <pointLight position={[0, 1.5, 2.5]} color="#fbbf24" intensity={1.5} distance={4} />
        </group>
    );
}

// --- Animated Particles ---
function FloatingParticles() {
    const count = 50;
    const positions = useMemo(() => {
        const pos = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            pos[i * 3] = (Math.random() - 0.5) * 20;
            pos[i * 3 + 1] = Math.random() * 10;
            pos[i * 3 + 2] = (Math.random() - 0.5) * 20;
        }
        return pos;
    }, []);

    return (
        <Sparkles
            count={count}
            scale={15}
            size={2}
            speed={0.3}
            opacity={0.6}
            color="#d4af37"
        />
    );
}

export default function House3D() {
    return (
        <div className="w-full h-[400px] md:h-[600px] cursor-grab active:cursor-grabbing relative rounded-3xl overflow-hidden shadow-2xl">
            <Canvas
                shadows
                dpr={[1, 2]}
                gl={{
                    antialias: true,
                    toneMapping: THREE.ACESFilmicToneMapping,
                    toneMappingExposure: 1.1
                }}
            >
                {/* Camera */}
                <PerspectiveCamera makeDefault position={[10, 5, 10]} fov={50} />

                {/* Controls */}
                <OrbitControls
                    enableZoom={true}
                    minDistance={8}
                    maxDistance={20}
                    autoRotate
                    autoRotateSpeed={0.8}
                    minPolarAngle={Math.PI / 6}
                    maxPolarAngle={Math.PI / 2.1}
                    enableDamping
                    dampingFactor={0.05}
                />

                {/* ========== LIGHTING ========== */}

                {/* Ambient Base */}
                <ambientLight intensity={0.4} />

                {/* Sun/Key Light */}
                <directionalLight
                    position={[15, 20, 10]}
                    intensity={1.5}
                    castShadow
                    shadow-mapSize-width={2048}
                    shadow-mapSize-height={2048}
                    shadow-camera-far={50}
                    shadow-camera-left={-15}
                    shadow-camera-right={15}
                    shadow-camera-top={15}
                    shadow-camera-bottom={-15}
                    shadow-bias={-0.0001}
                />

                {/* Fill Light */}
                <directionalLight
                    position={[-10, 10, -5]}
                    intensity={0.6}
                    color="#bfdbfe"
                />

                {/* Rim Light */}
                <spotLight
                    position={[-5, 8, -8]}
                    angle={0.5}
                    penumbra={1}
                    intensity={1.2}
                    color="#fef3c7"
                    castShadow
                />

                {/* Accent Light */}
                <pointLight position={[0, 10, 0]} intensity={0.8} color="#e0f2fe" />

                {/* Environment */}
                <Environment preset="sunset" />

                {/* Sky */}
                <Sky
                    distance={450000}
                    sunPosition={[15, 20, 10]}
                    inclination={0.6}
                    azimuth={0.25}
                />

                {/* Stars for depth */}
                <Stars radius={100} depth={50} count={1000} factor={2} saturation={0} fade speed={0.5} />

                {/* Building with Float Animation */}
                <Float
                    speed={1.5}
                    rotationIntensity={0.03}
                    floatIntensity={0.08}
                >
                    <LuxuryVilla />
                </Float>

                {/* Particles */}
                <FloatingParticles />

                {/* Ground Reflection */}
                <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.51, 0]} receiveShadow>
                    <planeGeometry args={[50, 50]} />
                    <MeshReflectorMaterial
                        blur={[300, 100]}
                        resolution={2048}
                        mixBlur={1}
                        mixStrength={40}
                        roughness={1}
                        depthScale={1.2}
                        minDepthThreshold={0.4}
                        maxDepthThreshold={1.4}
                        color="#0a0a0a"
                        metalness={0.5}
                        mirror={0.5}
                    />
                </mesh>

                {/* Enhanced Contact Shadows */}
                <ContactShadows
                    position={[0, -0.49, 0]}
                    opacity={0.5}
                    scale={20}
                    blur={2.5}
                    far={6}
                    resolution={512}
                    color="#000000"
                />
            </Canvas>

            {/* Overlay Info Badge */}
            <div className="absolute bottom-4 left-4 glass px-4 py-2 rounded-xl border border-white/20 backdrop-blur-md">
                <p className="text-xs text-white/80 font-medium">Interactive 3D Model - Drag to Rotate</p>
            </div>
        </div>
    );
}
