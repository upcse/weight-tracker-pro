import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useSpring } from '@react-spring/three';
import * as THREE from 'three';
import { Sphere } from '@react-three/drei';

const CursorSphere = ({ mousePosition }: { mousePosition: { x: number; y: number } }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const { viewport } = useThree();

  const [spring, api] = useSpring(() => ({
    position: [0, 0, 0],
    config: { mass: 1, tension: 170, friction: 26, precision: 0.001 }
  }));

  useEffect(() => {
    const x = (mousePosition.x * viewport.width) / 2;
    const y = (mousePosition.y * viewport.height) / 2;
    api.start({ position: [x, -y, 0] });
  }, [mousePosition.x, mousePosition.y, viewport.width, viewport.height, api]);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.3) * 0.1;
      meshRef.current.rotation.y = Math.cos(state.clock.getElapsedTime() * 0.2) * 0.1;
    }
  });

  return (
    <group>
      <Sphere
        ref={meshRef}
        position={spring.position as any}
        args={[0.8, 32, 32]}
      >
        <meshPhongMaterial
          color="#3B82F6"
          transparent
          opacity={0.15}
          wireframe
        />
      </Sphere>
      <Sphere
        position={spring.position as any}
        args={[0.4, 24, 24]}
      >
        <meshPhongMaterial
          color="#3B82F6"
          transparent
          opacity={0.3}
        />
      </Sphere>
    </group>
  );
};

const CursorFollower: React.FC = () => {
  const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setMousePosition({
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: -(event.clientY / window.innerHeight) * 2 + 1
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 -z-10 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 45 }}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <CursorSphere mousePosition={mousePosition} />
      </Canvas>
    </div>
  );
};

export default CursorFollower;