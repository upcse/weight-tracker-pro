import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useSpring } from '@react-spring/three';
import * as THREE from 'three';
import { Sphere } from '@react-three/drei';

// Animated sphere component with physics-based movement
const AnimatedSphere = ({ mousePosition }: { mousePosition: { x: number; y: number } }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const { viewport } = useThree();

  // Convert mouse coordinates to 3D space
  const x = (mousePosition.x * viewport.width) / 2;
  const y = (mousePosition.y * viewport.height) / 2;

  // Spring animation for smooth movement
  const [spring, api] = useSpring(() => ({
    position: [0, 0, 0],
    config: { mass: 1, tension: 120, friction: 14 }
  }));

  useEffect(() => {
    api.start({ position: [x, -y, 0] });
  }, [x, y, api]);

  useFrame((state) => {
    if (meshRef.current) {
      // Add subtle floating animation
      meshRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.1;
      meshRef.current.rotation.y = Math.cos(state.clock.getElapsedTime() * 0.5) * 0.1;
    }
  });

  return (
    <Sphere
      ref={meshRef}
      position={spring.position as any}
      args={[1, 32, 32]}
    >
      <meshPhongMaterial
        color="#3B82F6"
        transparent
        opacity={0.2}
        wireframe
      />
    </Sphere>
  );
};

// Main background scene component
const BackgroundScene: React.FC = () => {
  const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 });

  const handleMouseMove = (event: MouseEvent) => {
    setMousePosition({
      x: (event.clientX / window.innerWidth) * 2 - 1,
      y: -(event.clientY / window.innerHeight) * 2 + 1
    });
  };

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="fixed inset-0 -z-10 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 45 }}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <AnimatedSphere mousePosition={mousePosition} />
      </Canvas>
    </div>
  );
};

export default BackgroundScene;