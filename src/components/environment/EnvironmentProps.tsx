/**
 * Environment Props Component Library
 * Low-poly buildings, trees, mountains, and street furniture
 */

import * as THREE from 'three';

// ====================================================================
// PALM TREE
// ====================================================================

export function PalmTree({ position, scale = 1 }: { position: THREE.Vector3; scale?: number }) {
  const frondAngles = [0, Math.PI / 2, Math.PI, Math.PI * 1.5];
  
  return (
    <group position={position}>
      {/* Trunk - curved using two segments */}
      <mesh position={[0, scale * 2, 0]} castShadow>
        <cylinderGeometry args={[0.12 * scale, 0.2 * scale, scale * 4, 6]} />
        <meshStandardMaterial color="#8B6914" roughness={0.8} />
      </mesh>
      
      {/* Fronds (4 leaf clusters) */}
      {frondAngles.map((rot, i) => (
        <mesh 
          key={i} 
          position={[Math.sin(rot) * 0.6 * scale, scale * 4.2, Math.cos(rot) * 0.6 * scale]}
          rotation={[Math.sin(rot) * 0.5, rot, Math.cos(rot) * 0.3]} 
          castShadow
        >
          <boxGeometry args={[0.15 * scale, 0.04 * scale, 1.8 * scale]} />
          <meshStandardMaterial color="#2D5A27" roughness={0.7} />
        </mesh>
      ))}
      
      {/* Top cluster */}
      <mesh position={[0, scale * 4.1, 0]} castShadow>
        <sphereGeometry args={[0.4 * scale, 6, 6]} />
        <meshStandardMaterial color="#3A7D34" roughness={0.6} />
      </mesh>
    </group>
  );
}

// ====================================================================
// PINE TREE
// ====================================================================

export function PineTree({ position, scale = 1 }: { position: THREE.Vector3; scale?: number }) {
  return (
    <group position={position}>
      {/* Trunk */}
      <mesh position={[0, scale * 1.5, 0]} castShadow>
        <cylinderGeometry args={[0.15 * scale, 0.22 * scale, scale * 3, 6]} />
        <meshStandardMaterial color="#6B4423" roughness={0.8} />
      </mesh>
      
      {/* Lower foliage */}
      <mesh position={[0, scale * 3.2, 0]} castShadow>
        <coneGeometry args={[scale * 1.4, scale * 3, 7]} />
        <meshStandardMaterial color="#2D5A27" roughness={0.7} flatShading />
      </mesh>
      
      {/* Upper foliage */}
      <mesh position={[0, scale * 4.5, 0]} castShadow>
        <coneGeometry args={[scale * 1.0, scale * 2.2, 7]} />
        <meshStandardMaterial color="#3A7D34" roughness={0.7} flatShading />
      </mesh>
    </group>
  );
}

// ====================================================================
// BUILDING
// ====================================================================

interface BuildingProps {
  position: THREE.Vector3;
  width: number;
  height: number;
  depth: number;
  color: string;
  windowRows?: number;
  windowCols?: number;
}

export function Building({ 
  position, 
  width, 
  height, 
  depth, 
  color,
  windowRows,
  windowCols 
}: BuildingProps) {
  const rows = windowRows ?? Math.floor(height / 1.8);
  const cols = windowCols ?? Math.floor(width / 1.5);
  
  const windows = [];
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      windows.push(
        <mesh 
          key={`w${row}${col}`}
          position={[
            -width / 2 + 0.8 + col * 1.5,
            1.2 + row * 1.8,
            depth / 2 + 0.02,
          ]}
        >
          <boxGeometry args={[0.6, 0.8, 0.04]} />
          <meshStandardMaterial color="#5A8FA8" roughness={0.1} opacity={0.7} transparent />
        </mesh>
      );
    }
  }
  
  return (
    <group position={position}>
      {/* Main structure */}
      <mesh position={[0, height / 2, 0]} castShadow>
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial color={color} roughness={0.65} />
      </mesh>
      
      {/* Windows */}
      {windows}
      
      {/* Roof accent */}
      <mesh position={[0, height + 0.08, 0]}>
        <boxGeometry args={[width + 0.1, 0.15, depth + 0.1]} />
        <meshStandardMaterial color="#777" roughness={0.5} />
      </mesh>
    </group>
  );
}

// ====================================================================
// MOUNTAIN
// ====================================================================

interface MountainProps {
  position: THREE.Vector3;
  radius: number;
  height: number;
  color: string;
}

export function Mountain({ position, radius, height, color }: MountainProps) {
  return (
    <mesh position={position} castShadow>
      <coneGeometry args={[radius, height, 7]} />
      <meshStandardMaterial color={color} roughness={0.8} flatShading />
    </mesh>
  );
}

// ====================================================================
// STREET LIGHT / POLE
// ====================================================================

interface StreetLightProps {
  position: THREE.Vector3;
  timeOfDay: 'dawn' | 'noon' | 'sunset' | 'midnight';
  height?: number;
}

export function StreetLight({ position, timeOfDay, height = 6 }: StreetLightProps) {
  const isNight = timeOfDay === 'midnight';
  const isEvening = timeOfDay === 'sunset';
  const emissiveIntensity = isNight ? 3 : isEvening ? 1.5 : 0.2;
  
  return (
    <group position={position}>
      {/* Pole */}
      <mesh position={[0, height / 2, 0]} castShadow>
        <cylinderGeometry args={[0.06, 0.08, height, 6]} />
        <meshStandardMaterial color="#666" roughness={0.5} metalness={0.3} />
      </mesh>
      
      {/* Arm */}
      <mesh position={[1, height - 0.2, 0]}>
        <boxGeometry args={[2.2, 0.08, 0.08]} />
        <meshStandardMaterial color="#666" />
      </mesh>
      
      {/* Light fixture */}
      <mesh position={[2, height - 0.35, 0]}>
        <boxGeometry args={[0.4, 0.1, 0.25]} />
        <meshStandardMaterial
          color="#FEF3C7"
          emissive="#F59E0B"
          emissiveIntensity={emissiveIntensity}
        />
      </mesh>
    </group>
  );
}

// ====================================================================
// ROCK
// ====================================================================

export function Rock({ position, scale = 1, color = '#7A7A6A' }: { 
  position: THREE.Vector3; 
  scale?: number;
  color?: string;
}) {
  return (
    <mesh position={position} castShadow>
      <dodecahedronGeometry args={[scale * 0.8, 0]} />
      <meshStandardMaterial color={color} roughness={0.9} flatShading />
    </mesh>
  );
}

// ====================================================================
// GUARD RAIL
// ====================================================================

export function GuardRail({ position, rotation = 0, length = 6 }: { 
  position: THREE.Vector3; 
  rotation?: number;
  length?: number;
}) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {/* Rail */}
      <mesh position={[0, 0.4, 0]} castShadow>
        <boxGeometry args={[0.15, 0.1, length]} />
        <meshStandardMaterial color="#888" roughness={0.5} metalness={0.6} />
      </mesh>
      
      {/* Posts */}
      <mesh position={[0, 0.2, -length / 2 + 0.3]} castShadow>
        <boxGeometry args={[0.12, 0.4, 0.12]} />
        <meshStandardMaterial color="#666" roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.2, length / 2 - 0.3]} castShadow>
        <boxGeometry args={[0.12, 0.4, 0.12]} />
        <meshStandardMaterial color="#666" roughness={0.6} />
      </mesh>
    </group>
  );
}

// ====================================================================
// TRAFFIC CONE
// ====================================================================

export function TrafficCone({ position }: { position: THREE.Vector3 }) {
  return (
    <mesh position={position} castShadow>
      <coneGeometry args={[0.2, 0.6, 8]} />
      <meshStandardMaterial color="#FF6B35" roughness={0.6} />
    </mesh>
  );
}

// ====================================================================
// BARRIER
// ====================================================================

export function Barrier({ position, rotation = 0 }: { 
  position: THREE.Vector3; 
  rotation?: number;
}) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {/* Base */}
      <mesh position={[0, 0.15, 0]} castShadow>
        <boxGeometry args={[0.3, 0.3, 1.8]} />
        <meshStandardMaterial color="#F59E0B" roughness={0.7} />
      </mesh>
      
      {/* Stripes */}
      <mesh position={[0, 0.35, 0]}>
        <boxGeometry args={[0.32, 0.15, 1.82]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.55, 0]}>
        <boxGeometry args={[0.32, 0.15, 1.82]} />
        <meshStandardMaterial color="#F59E0B" roughness={0.7} />
      </mesh>
    </group>
  );
}

// ====================================================================
// PROP FACTORY
// ====================================================================

export interface PropData {
  type: 'palm' | 'tree' | 'building' | 'pole' | 'rock' | 'guardrail' | 'cone' | 'barrier';
  position: THREE.Vector3;
  scale?: number;
  color?: string;
  width?: number;
  height?: number;
  depth?: number;
  rotation?: number;
  timeOfDay?: 'dawn' | 'noon' | 'sunset' | 'midnight';
}

export function Prop({ data }: { data: PropData }) {
  switch (data.type) {
    case 'palm':
      return <PalmTree position={data.position} scale={data.scale} />;
    
    case 'tree':
      return <PineTree position={data.position} scale={data.scale} />;
    
    case 'building':
      return (
        <Building
          position={data.position}
          width={data.width || 6}
          height={data.height || 10}
          depth={data.depth || 6}
          color={data.color || '#8899AA'}
        />
      );
    
    case 'pole':
      return <StreetLight position={data.position} timeOfDay={data.timeOfDay || 'noon'} />;
    
    case 'rock':
      return <Rock position={data.position} scale={data.scale} color={data.color} />;
    
    case 'guardrail':
      return <GuardRail position={data.position} rotation={data.rotation} length={data.scale} />;
    
    case 'cone':
      return <TrafficCone position={data.position} />;
    
    case 'barrier':
      return <Barrier position={data.position} rotation={data.rotation} />;
    
    default:
      return null;
  }
}

// ====================================================================
// PROP BATCH RENDERER
// ====================================================================

export function PropBatch({ props }: { props: PropData[] }) {
  return (
    <group>
      {props.map((prop, i) => (
        <Prop key={i} data={prop} />
      ))}
    </group>
  );
}
