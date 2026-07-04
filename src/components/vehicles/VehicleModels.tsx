/**
 * Vehicle Models Component Library
 * Low-poly 3D vehicle models with optimized geometry and materials
 */

import * as THREE from 'three';

// ====================================================================
// WHEEL COMPONENTS
// ====================================================================

interface WheelProps {
  position: [number, number, number];
  rimColor?: string;
  tireSize?: number;
}

export function Wheel({ position, rimColor = '#CCCCCC', tireSize = 0.32 }: WheelProps) {
  return (
    <group position={position}>
      {/* Tire */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[tireSize, tireSize, 0.22, 10]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.7} />
      </mesh>
      {/* Rim */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.2, 0.2, 0.24, 8]} />
        <meshStandardMaterial color={rimColor} roughness={0.2} metalness={0.8} />
      </mesh>
    </group>
  );
}

export function BusWheel({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.32, 0.32, 0.18, 10]} />
        <meshStandardMaterial color="#222" roughness={0.7} />
      </mesh>
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.18, 0.18, 0.2, 8]} />
        <meshStandardMaterial color="#888" roughness={0.3} metalness={0.6} />
      </mesh>
    </group>
  );
}

export function TruckWheel({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.38, 0.38, 0.28, 10]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.7} />
      </mesh>
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.24, 0.24, 0.3, 8]} />
        <meshStandardMaterial color="#666" roughness={0.3} metalness={0.7} />
      </mesh>
    </group>
  );
}

// ====================================================================
// EVO MODEL - Mitsubishi Lancer Evolution
// ====================================================================

export function EvoModel({ color }: { color: string }) {
  return (
    <group>
      {/* Main body lower */}
      <mesh position={[0, 0.32, 0]} castShadow>
        <boxGeometry args={[1.85, 0.45, 4.2]} />
        <meshStandardMaterial color={color} roughness={0.2} metalness={0.6} />
      </mesh>
      
      {/* Front bumper / splitter */}
      <mesh position={[0, 0.18, 2.15]} castShadow>
        <boxGeometry args={[1.9, 0.2, 0.35]} />
        <meshStandardMaterial color="#222" roughness={0.5} />
      </mesh>
      
      {/* Hood scoop */}
      <mesh position={[0, 0.58, 1.0]} castShadow>
        <boxGeometry args={[0.5, 0.12, 0.8]} />
        <meshStandardMaterial color="#222" roughness={0.3} />
      </mesh>
      
      {/* Cabin */}
      <mesh position={[0, 0.72, -0.15]} castShadow>
        <boxGeometry args={[1.55, 0.45, 2.0]} />
        <meshStandardMaterial color={color} roughness={0.2} metalness={0.6} />
      </mesh>
      
      {/* Windshield front */}
      <mesh position={[0, 0.75, 0.85]} castShadow rotation={[0.3, 0, 0]}>
        <boxGeometry args={[1.4, 0.42, 0.06]} />
        <meshStandardMaterial color="#1a1a2e" roughness={0.0} metalness={0.3} opacity={0.8} transparent />
      </mesh>
      
      {/* Rear window */}
      <mesh position={[0, 0.75, -1.15]} castShadow rotation={[-0.3, 0, 0]}>
        <boxGeometry args={[1.3, 0.38, 0.06]} />
        <meshStandardMaterial color="#1a1a2e" roughness={0.0} metalness={0.3} opacity={0.8} transparent />
      </mesh>
      
      {/* Side windows */}
      <mesh position={[0.78, 0.75, -0.15]} castShadow>
        <boxGeometry args={[0.06, 0.35, 1.6]} />
        <meshStandardMaterial color="#1a1a2e" roughness={0.0} opacity={0.75} transparent />
      </mesh>
      <mesh position={[-0.78, 0.75, -0.15]} castShadow>
        <boxGeometry args={[0.06, 0.35, 1.6]} />
        <meshStandardMaterial color="#1a1a2e" roughness={0.0} opacity={0.75} transparent />
      </mesh>
      
      {/* Rear spoiler */}
      <mesh position={[0.55, 0.98, -2.0]} castShadow>
        <boxGeometry args={[0.08, 0.3, 0.08]} />
        <meshStandardMaterial color={color} roughness={0.3} />
      </mesh>
      <mesh position={[-0.55, 0.98, -2.0]} castShadow>
        <boxGeometry args={[0.08, 0.3, 0.08]} />
        <meshStandardMaterial color={color} roughness={0.3} />
      </mesh>
      <mesh position={[0, 1.15, -2.0]} castShadow>
        <boxGeometry args={[1.7, 0.06, 0.35]} />
        <meshStandardMaterial color={color} roughness={0.2} metalness={0.5} />
      </mesh>
      
      {/* Headlights */}
      <mesh position={[0.65, 0.38, 2.12]}>
        <boxGeometry args={[0.35, 0.15, 0.1]} />
        <meshStandardMaterial color="#FFFDE7" emissive="#FFFDE7" emissiveIntensity={1.5} />
      </mesh>
      <mesh position={[-0.65, 0.38, 2.12]}>
        <boxGeometry args={[0.35, 0.15, 0.1]} />
        <meshStandardMaterial color="#FFFDE7" emissive="#FFFDE7" emissiveIntensity={1.5} />
      </mesh>
      
      {/* Taillights */}
      <mesh position={[0.7, 0.38, -2.1]}>
        <boxGeometry args={[0.3, 0.12, 0.06]} />
        <meshStandardMaterial color="#EF4444" emissive="#EF4444" emissiveIntensity={0.8} />
      </mesh>
      <mesh position={[-0.7, 0.38, -2.1]}>
        <boxGeometry args={[0.3, 0.12, 0.06]} />
        <meshStandardMaterial color="#EF4444" emissive="#EF4444" emissiveIntensity={0.8} />
      </mesh>
      
      {/* Front grille */}
      <mesh position={[0, 0.25, 2.12]}>
        <boxGeometry args={[1.1, 0.18, 0.08]} />
        <meshStandardMaterial color="#111" roughness={0.8} />
      </mesh>
      
      {/* Wheels */}
      <Wheel position={[0.95, 0.18, 1.35]} />
      <Wheel position={[-0.95, 0.18, 1.35]} />
      <Wheel position={[0.95, 0.18, -1.35]} />
      <Wheel position={[-0.95, 0.18, -1.35]} />
      
      {/* Side skirts */}
      <mesh position={[0.92, 0.14, 0]} castShadow>
        <boxGeometry args={[0.08, 0.12, 3.6]} />
        <meshStandardMaterial color="#222" roughness={0.5} />
      </mesh>
      <mesh position={[-0.92, 0.14, 0]} castShadow>
        <boxGeometry args={[0.08, 0.12, 3.6]} />
        <meshStandardMaterial color="#222" roughness={0.5} />
      </mesh>
    </group>
  );
}

// ====================================================================
// WRX MODEL - Subaru Impreza WRX STI
// ====================================================================

export function WrxModel({ color }: { color: string }) {
  return (
    <group>
      {/* Body lower */}
      <mesh position={[0, 0.32, 0]} castShadow>
        <boxGeometry args={[1.82, 0.45, 4.1]} />
        <meshStandardMaterial color={color} roughness={0.25} metalness={0.5} />
      </mesh>
      
      {/* Front bumper */}
      <mesh position={[0, 0.18, 2.1]} castShadow>
        <boxGeometry args={[1.85, 0.22, 0.3]} />
        <meshStandardMaterial color="#666" roughness={0.5} />
      </mesh>
      
      {/* Hood */}
      <mesh position={[0, 0.56, 0.8]} castShadow>
        <boxGeometry args={[1.7, 0.04, 2.2]} />
        <meshStandardMaterial color={color} roughness={0.2} metalness={0.5} />
      </mesh>
      
      {/* Hood scoop */}
      <mesh position={[0, 0.62, 0.6]} castShadow>
        <boxGeometry args={[0.4, 0.12, 0.7]} />
        <meshStandardMaterial color="#444" roughness={0.4} />
      </mesh>
      
      {/* Cabin */}
      <mesh position={[0, 0.72, -0.25]} castShadow>
        <boxGeometry args={[1.5, 0.42, 1.9]} />
        <meshStandardMaterial color={color} roughness={0.25} metalness={0.5} />
      </mesh>
      
      {/* Windshield */}
      <mesh position={[0, 0.74, 0.72]} rotation={[0.28, 0, 0]}>
        <boxGeometry args={[1.35, 0.4, 0.05]} />
        <meshStandardMaterial color="#1a1a2e" roughness={0.0} opacity={0.8} transparent />
      </mesh>
      
      {/* Rear window */}
      <mesh position={[0, 0.74, -1.2]} rotation={[-0.28, 0, 0]}>
        <boxGeometry args={[1.25, 0.36, 0.05]} />
        <meshStandardMaterial color="#1a1a2e" roughness={0.0} opacity={0.75} transparent />
      </mesh>
      
      {/* Side windows */}
      <mesh position={[0.76, 0.74, -0.25]}>
        <boxGeometry args={[0.05, 0.33, 1.5]} />
        <meshStandardMaterial color="#1a1a2e" opacity={0.75} transparent />
      </mesh>
      <mesh position={[-0.76, 0.74, -0.25]}>
        <boxGeometry args={[0.05, 0.33, 1.5]} />
        <meshStandardMaterial color="#1a1a2e" opacity={0.75} transparent />
      </mesh>
      
      {/* Spoiler */}
      <mesh position={[0.5, 0.96, -1.95]}>
        <boxGeometry args={[0.07, 0.28, 0.07]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[-0.5, 0.96, -1.95]}>
        <boxGeometry args={[0.07, 0.28, 0.07]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[0, 1.12, -1.95]} castShadow>
        <boxGeometry args={[1.6, 0.06, 0.32]} />
        <meshStandardMaterial color={color} roughness={0.2} metalness={0.5} />
      </mesh>
      
      {/* Headlights */}
      <mesh position={[0.6, 0.38, 2.08]}>
        <boxGeometry args={[0.4, 0.16, 0.1]} />
        <meshStandardMaterial color="#FFFDE7" emissive="#FFFDE7" emissiveIntensity={1.5} />
      </mesh>
      <mesh position={[-0.6, 0.38, 2.08]}>
        <boxGeometry args={[0.4, 0.16, 0.1]} />
        <meshStandardMaterial color="#FFFDE7" emissive="#FFFDE7" emissiveIntensity={1.5} />
      </mesh>
      
      {/* Taillights */}
      <mesh position={[0.68, 0.38, -2.06]}>
        <boxGeometry args={[0.28, 0.1, 0.06]} />
        <meshStandardMaterial color="#EF4444" emissive="#EF4444" emissiveIntensity={0.8} />
      </mesh>
      <mesh position={[-0.68, 0.38, -2.06]}>
        <boxGeometry args={[0.28, 0.1, 0.06]} />
        <meshStandardMaterial color="#EF4444" emissive="#EF4444" emissiveIntensity={0.8} />
      </mesh>
      
      {/* Grille */}
      <mesh position={[0, 0.28, 2.08]}>
        <boxGeometry args={[0.9, 0.15, 0.06]} />
        <meshStandardMaterial color="#111" />
      </mesh>
      
      {/* Wheels */}
      <Wheel position={[0.94, 0.18, 1.3]} />
      <Wheel position={[-0.94, 0.18, 1.3]} />
      <Wheel position={[0.94, 0.18, -1.3]} />
      <Wheel position={[-0.94, 0.18, -1.3]} />
    </group>
  );
}

// ====================================================================
// IMPREZA MODEL - Classic GC8
// ====================================================================

export function ImprezaModel({ color, accentColor }: { color: string; accentColor: string }) {
  return (
    <group>
      {/* Body lower */}
      <mesh position={[0, 0.32, 0]} castShadow>
        <boxGeometry args={[1.85, 0.46, 4.15]} />
        <meshStandardMaterial color={color} roughness={0.18} metalness={0.65} />
      </mesh>
      
      {/* Front bumper */}
      <mesh position={[0, 0.16, 2.12]} castShadow>
        <boxGeometry args={[1.88, 0.2, 0.32]} />
        <meshStandardMaterial color={color} roughness={0.3} />
      </mesh>
      
      {/* Hood scoop */}
      <mesh position={[0, 0.59, 0.7]} castShadow>
        <boxGeometry args={[0.45, 0.14, 0.65]} />
        <meshStandardMaterial color="#333" roughness={0.4} />
      </mesh>
      
      {/* Cabin */}
      <mesh position={[0, 0.73, -0.2]} castShadow>
        <boxGeometry args={[1.52, 0.44, 1.95]} />
        <meshStandardMaterial color={color} roughness={0.2} metalness={0.6} />
      </mesh>
      
      {/* Windshield */}
      <mesh position={[0, 0.76, 0.78]} rotation={[0.3, 0, 0]}>
        <boxGeometry args={[1.38, 0.42, 0.05]} />
        <meshStandardMaterial color="#1a1a2e" opacity={0.78} transparent />
      </mesh>
      
      {/* Rear window */}
      <mesh position={[0, 0.76, -1.18]} rotation={[-0.3, 0, 0]}>
        <boxGeometry args={[1.28, 0.38, 0.05]} />
        <meshStandardMaterial color="#1a1a2e" opacity={0.75} transparent />
      </mesh>
      
      {/* Side windows */}
      <mesh position={[0.77, 0.75, -0.2]}>
        <boxGeometry args={[0.05, 0.34, 1.55]} />
        <meshStandardMaterial color="#1a1a2e" opacity={0.75} transparent />
      </mesh>
      <mesh position={[-0.77, 0.75, -0.2]}>
        <boxGeometry args={[0.05, 0.34, 1.55]} />
        <meshStandardMaterial color="#1a1a2e" opacity={0.75} transparent />
      </mesh>
      
      {/* Rear spoiler */}
      <mesh position={[0.58, 1.0, -1.98]}>
        <boxGeometry args={[0.08, 0.35, 0.08]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[-0.58, 1.0, -1.98]}>
        <boxGeometry args={[0.08, 0.35, 0.08]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[0, 1.2, -1.98]} castShadow>
        <boxGeometry args={[1.75, 0.07, 0.38]} />
        <meshStandardMaterial color={color} roughness={0.2} metalness={0.6} />
      </mesh>
      
      {/* Headlights (round style) */}
      <mesh position={[0.62, 0.38, 2.1]}>
        <sphereGeometry args={[0.14, 8, 8]} />
        <meshStandardMaterial color="#FFFDE7" emissive="#FFFDE7" emissiveIntensity={1.8} />
      </mesh>
      <mesh position={[-0.62, 0.38, 2.1]}>
        <sphereGeometry args={[0.14, 8, 8]} />
        <meshStandardMaterial color="#FFFDE7" emissive="#FFFDE7" emissiveIntensity={1.8} />
      </mesh>
      
      {/* Front grille */}
      <mesh position={[0, 0.24, 2.1]}>
        <boxGeometry args={[1.15, 0.2, 0.08]} />
        <meshStandardMaterial color="#111" />
      </mesh>
      
      {/* Taillights */}
      <mesh position={[0.72, 0.4, -2.08]}>
        <boxGeometry args={[0.25, 0.12, 0.06]} />
        <meshStandardMaterial color="#EF4444" emissive="#EF4444" emissiveIntensity={0.8} />
      </mesh>
      <mesh position={[-0.72, 0.4, -2.08]}>
        <boxGeometry args={[0.25, 0.12, 0.06]} />
        <meshStandardMaterial color="#EF4444" emissive="#EF4444" emissiveIntensity={0.8} />
      </mesh>
      
      {/* Wheels with gold rims */}
      <Wheel position={[0.96, 0.18, 1.32]} rimColor={accentColor} />
      <Wheel position={[-0.96, 0.18, 1.32]} rimColor={accentColor} />
      <Wheel position={[0.96, 0.18, -1.32]} rimColor={accentColor} />
      <Wheel position={[-0.96, 0.18, -1.32]} rimColor={accentColor} />
    </group>
  );
}

// ====================================================================
// SPORTBIKE MODEL
// ====================================================================

export function SportbikeModel({ color }: { color: string }) {
  return (
    <group>
      {/* Main frame */}
      <mesh position={[0, 0.55, 0]} castShadow>
        <boxGeometry args={[0.45, 0.35, 2.4]} />
        <meshStandardMaterial color="#111" roughness={0.3} />
      </mesh>
      
      {/* Upper fairing */}
      <mesh position={[0, 0.78, 0.5]} castShadow>
        <boxGeometry args={[0.52, 0.32, 1.4]} />
        <meshStandardMaterial color={color} roughness={0.15} metalness={0.6} />
      </mesh>
      
      {/* Windscreen */}
      <mesh position={[0, 0.96, 1.1]} rotation={[0.5, 0, 0]}>
        <boxGeometry args={[0.4, 0.3, 0.04]} />
        <meshStandardMaterial color="#DDDDEE" roughness={0.0} opacity={0.5} transparent />
      </mesh>
      
      {/* Fuel tank */}
      <mesh position={[0, 0.82, -0.05]} castShadow>
        <boxGeometry args={[0.48, 0.22, 0.7]} />
        <meshStandardMaterial color={color} roughness={0.15} metalness={0.6} />
      </mesh>
      
      {/* Seat */}
      <mesh position={[0, 0.78, -0.65]} castShadow>
        <boxGeometry args={[0.38, 0.12, 0.8]} />
        <meshStandardMaterial color="#111" roughness={0.6} />
      </mesh>
      
      {/* Tail section */}
      <mesh position={[0, 0.72, -1.1]} castShadow>
        <boxGeometry args={[0.32, 0.18, 0.45]} />
        <meshStandardMaterial color={color} roughness={0.2} />
      </mesh>
      
      {/* Exhaust pipe */}
      <mesh position={[0.22, 0.38, -1.0]} castShadow>
        <cylinderGeometry args={[0.05, 0.06, 0.7, 6]} />
        <meshStandardMaterial color="#888" roughness={0.3} metalness={0.8} />
      </mesh>
      
      {/* Front wheel */}
      <group position={[0, 0.28, 1.15]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.28, 0.28, 0.12, 12]} />
          <meshStandardMaterial color="#222" roughness={0.6} />
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.18, 0.18, 0.14, 8]} />
          <meshStandardMaterial color="#999" roughness={0.3} metalness={0.7} />
        </mesh>
      </group>
      
      {/* Front fork */}
      <mesh position={[0, 0.52, 0.9]} rotation={[0.2, 0, 0]}>
        <boxGeometry args={[0.08, 0.5, 0.08]} />
        <meshStandardMaterial color="#999" roughness={0.3} metalness={0.7} />
      </mesh>
      
      {/* Rear wheel */}
      <group position={[0, 0.28, -1.0]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.3, 0.3, 0.16, 12]} />
          <meshStandardMaterial color="#222" roughness={0.6} />
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.2, 0.2, 0.18, 8]} />
          <meshStandardMaterial color="#999" roughness={0.3} metalness={0.7} />
        </mesh>
      </group>
      
      {/* Headlight */}
      <mesh position={[0, 0.85, 1.22]}>
        <boxGeometry args={[0.2, 0.12, 0.06]} />
        <meshStandardMaterial color="#FFFDE7" emissive="#FFFDE7" emissiveIntensity={2.0} />
      </mesh>
      
      {/* Taillight */}
      <mesh position={[0, 0.76, -1.32]}>
        <boxGeometry args={[0.18, 0.06, 0.04]} />
        <meshStandardMaterial color="#EF4444" emissive="#EF4444" emissiveIntensity={1.0} />
      </mesh>
      
      {/* Lower fairing */}
      <mesh position={[0, 0.38, 0.3]} castShadow>
        <boxGeometry args={[0.5, 0.15, 1.2]} />
        <meshStandardMaterial color={color} roughness={0.2} />
      </mesh>
    </group>
  );
}

// ====================================================================
// BUS MODEL
// ====================================================================

export function BusModel({ color, accentColor }: { color: string; accentColor: string }) {
  const windowPositions = [-1.5, -0.5, 0.5, 1.5];
  
  return (
    <group>
      {/* Lower body */}
      <mesh position={[0, 0.5, 0]} castShadow>
        <boxGeometry args={[2.4, 0.6, 5.5]} />
        <meshStandardMaterial color={color} roughness={0.35} metalness={0.3} />
      </mesh>
      
      {/* Upper body */}
      <mesh position={[0, 1.15, -0.15]} castShadow>
        <boxGeometry args={[2.35, 0.7, 5.2]} />
        <meshStandardMaterial color={color} roughness={0.35} metalness={0.3} />
      </mesh>
      
      {/* Roof */}
      <mesh position={[0, 1.55, -0.15]} castShadow>
        <boxGeometry args={[2.3, 0.12, 5.0]} />
        <meshStandardMaterial color={accentColor} roughness={0.4} />
      </mesh>
      
      {/* Roof vents */}
      <mesh position={[0.4, 1.62, 0.5]}>
        <boxGeometry args={[0.5, 0.04, 0.7]} />
        <meshStandardMaterial color="#999" roughness={0.5} />
      </mesh>
      <mesh position={[-0.4, 1.62, -0.8]}>
        <boxGeometry args={[0.5, 0.04, 0.7]} />
        <meshStandardMaterial color="#999" roughness={0.5} />
      </mesh>
      
      {/* Windows - left side */}
      {windowPositions.map((z, i) => (
        <mesh key={`wl${i}`} position={[1.18, 1.1, z]}>
          <boxGeometry args={[0.06, 0.5, 0.85]} />
          <meshStandardMaterial color="#3B6E8F" roughness={0.0} opacity={0.7} transparent />
        </mesh>
      ))}
      
      {/* Windows - right side */}
      {windowPositions.map((z, i) => (
        <mesh key={`wr${i}`} position={[-1.18, 1.1, z]}>
          <boxGeometry args={[0.06, 0.5, 0.85]} />
          <meshStandardMaterial color="#3B6E8F" roughness={0.0} opacity={0.7} transparent />
        </mesh>
      ))}
      
      {/* Front windshield */}
      <mesh position={[0, 1.1, 2.78]} rotation={[0.15, 0, 0]}>
        <boxGeometry args={[2.1, 0.6, 0.06]} />
        <meshStandardMaterial color="#3B6E8F" roughness={0.0} opacity={0.65} transparent />
      </mesh>
      
      {/* Front bumper */}
      <mesh position={[0, 0.35, 2.8]}>
        <boxGeometry args={[2.4, 0.3, 0.15]} />
        <meshStandardMaterial color="#555" roughness={0.5} />
      </mesh>
      
      {/* Headlights */}
      <mesh position={[0.8, 0.45, 2.78]}>
        <sphereGeometry args={[0.1, 8, 8]} />
        <meshStandardMaterial color="#FFFDE7" emissive="#FFFDE7" emissiveIntensity={1.5} />
      </mesh>
      <mesh position={[-0.8, 0.45, 2.78]}>
        <sphereGeometry args={[0.1, 8, 8]} />
        <meshStandardMaterial color="#FFFDE7" emissive="#FFFDE7" emissiveIntensity={1.5} />
      </mesh>
      <mesh position={[0.4, 0.45, 2.78]}>
        <sphereGeometry args={[0.06, 6, 6]} />
        <meshStandardMaterial color="#FFFDE7" emissive="#FFFDE7" emissiveIntensity={1.0} />
      </mesh>
      
      {/* Taillights */}
      <mesh position={[0.9, 0.5, -2.78]}>
        <boxGeometry args={[0.3, 0.15, 0.06]} />
        <meshStandardMaterial color="#EF4444" emissive="#EF4444" emissiveIntensity={0.8} />
      </mesh>
      <mesh position={[-0.9, 0.5, -2.78]}>
        <boxGeometry args={[0.3, 0.15, 0.06]} />
        <meshStandardMaterial color="#EF4444" emissive="#EF4444" emissiveIntensity={0.8} />
      </mesh>
      
      {/* Side stripe */}
      <mesh position={[1.21, 0.65, 0]}>
        <boxGeometry args={[0.02, 0.15, 5.0]} />
        <meshStandardMaterial color={accentColor} roughness={0.4} />
      </mesh>
      <mesh position={[-1.21, 0.65, 0]}>
        <boxGeometry args={[0.02, 0.15, 5.0]} />
        <meshStandardMaterial color={accentColor} roughness={0.4} />
      </mesh>
      
      {/* Wheels */}
      <BusWheel position={[1.25, 0.2, 1.8]} />
      <BusWheel position={[-1.25, 0.2, 1.8]} />
      <BusWheel position={[1.25, 0.2, -1.8]} />
      <BusWheel position={[-1.25, 0.2, -1.8]} />
    </group>
  );
}

// ====================================================================
// TRUCK MODEL
// ====================================================================

export function TruckModel({ color, accentColor }: { color: string; accentColor: string }) {
  return (
    <group>
      {/* Main body/cab */}
      <mesh position={[0, 0.55, 0.3]} castShadow>
        <boxGeometry args={[1.9, 0.65, 2.2]} />
        <meshStandardMaterial color={color} roughness={0.25} metalness={0.5} />
      </mesh>

      {/* Truck bed */}
      <mesh position={[0, 0.45, -1.8]} castShadow>
        <boxGeometry args={[1.85, 0.4, 1.8]} />
        <meshStandardMaterial color={color} roughness={0.3} metalness={0.4} />
      </mesh>

      {/* Bed interior */}
      <mesh position={[0, 0.52, -1.8]} castShadow>
        <boxGeometry args={[1.7, 0.05, 1.6]} />
        <meshStandardMaterial color="#2a2a2a" roughness={0.7} />
      </mesh>

      {/* Front bumper */}
      <mesh position={[0, 0.28, 1.45]} castShadow>
        <boxGeometry args={[1.95, 0.25, 0.2]} />
        <meshStandardMaterial color="#333" roughness={0.5} metalness={0.3} />
      </mesh>

      {/* Rear bumper */}
      <mesh position={[0, 0.28, -2.75]} castShadow>
        <boxGeometry args={[1.9, 0.2, 0.15]} />
        <meshStandardMaterial color="#333" roughness={0.5} metalness={0.3} />
      </mesh>

      {/* Hood */}
      <mesh position={[0, 0.88, 1.2]} castShadow>
        <boxGeometry args={[1.85, 0.15, 1.0]} />
        <meshStandardMaterial color={color} roughness={0.2} metalness={0.55} />
      </mesh>

      {/* Cabin top */}
      <mesh position={[0, 0.95, -0.15]} castShadow>
        <boxGeometry args={[1.8, 0.55, 1.7]} />
        <meshStandardMaterial color={color} roughness={0.2} metalness={0.5} />
      </mesh>

      {/* Windshield */}
      <mesh position={[0, 0.92, 0.78]} rotation={[0.25, 0, 0]}>
        <boxGeometry args={[1.7, 0.5, 0.05]} />
        <meshStandardMaterial color="#1a1a2e" opacity={0.75} transparent />
      </mesh>

      {/* Rear window */}
      <mesh position={[0, 0.92, -1.05]} rotation={[-0.2, 0, 0]}>
        <boxGeometry args={[1.6, 0.45, 0.05]} />
        <meshStandardMaterial color="#1a1a2e" opacity={0.7} transparent />
      </mesh>

      {/* Side windows */}
      <mesh position={[0.96, 0.9, -0.15]}>
        <boxGeometry args={[0.05, 0.45, 1.5]} />
        <meshStandardMaterial color="#1a1a2e" opacity={0.7} transparent />
      </mesh>
      <mesh position={[-0.96, 0.9, -0.15]}>
        <boxGeometry args={[0.05, 0.45, 1.5]} />
        <meshStandardMaterial color="#1a1a2e" opacity={0.7} transparent />
      </mesh>

      {/* Headlights */}
      <mesh position={[0.7, 0.45, 1.44]}>
        <boxGeometry args={[0.35, 0.2, 0.08]} />
        <meshStandardMaterial color="#FFFDE7" emissive="#FFFDE7" emissiveIntensity={1.5} />
      </mesh>
      <mesh position={[-0.7, 0.45, 1.44]}>
        <boxGeometry args={[0.35, 0.2, 0.08]} />
        <meshStandardMaterial color="#FFFDE7" emissive="#FFFDE7" emissiveIntensity={1.5} />
      </mesh>

      {/* Taillights */}
      <mesh position={[0.75, 0.45, -2.74]}>
        <boxGeometry args={[0.2, 0.15, 0.06]} />
        <meshStandardMaterial color="#EF4444" emissive="#EF4444" emissiveIntensity={0.8} />
      </mesh>
      <mesh position={[-0.75, 0.45, -2.74]}>
        <boxGeometry args={[0.2, 0.15, 0.06]} />
        <meshStandardMaterial color="#EF4444" emissive="#EF4444" emissiveIntensity={0.8} />
      </mesh>

      {/* Side mirrors */}
      <mesh position={[1.05, 0.85, 0.8]}>
        <boxGeometry args={[0.15, 0.2, 0.1]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[-1.05, 0.85, 0.8]}>
        <boxGeometry args={[0.15, 0.2, 0.1]} />
        <meshStandardMaterial color={color} />
      </mesh>

      {/* Decorative stripe */}
      <mesh position={[0, 0.55, -0.8]}>
        <boxGeometry args={[1.92, 0.08, 1.2]} />
        <meshStandardMaterial color={accentColor} roughness={0.4} />
      </mesh>

      {/* Wheels */}
      <TruckWheel position={[0.98, 0.22, 1.1]} />
      <TruckWheel position={[-0.98, 0.22, 1.1]} />
      <TruckWheel position={[0.98, 0.22, -1.0]} />
      <TruckWheel position={[-0.98, 0.22, -1.0]} />
      <TruckWheel position={[0.98, 0.22, -2.3]} />
      <TruckWheel position={[-0.98, 0.22, -2.3]} />
    </group>
  );
}

// ====================================================================
// VEHICLE FACTORY
// ====================================================================

import type { VehicleType } from './VehicleConfig';

interface VehicleModelProps {
  type: VehicleType;
  color: string;
  accentColor?: string;
}

export function VehicleModel({ type, color, accentColor = '#CCCCCC' }: VehicleModelProps) {
  switch (type) {
    case 'evo':
      return <EvoModel color={color} />;
    case 'wrx':
      return <WrxModel color={color} />;
    case 'impreza':
      return <ImprezaModel color={color} accentColor={accentColor} />;
    case 'sportbike':
      return <SportbikeModel color={color} />;
    case 'bus':
      return <BusModel color={color} accentColor={accentColor} />;
    case 'truck':
      return <TruckModel color={color} accentColor={accentColor} />;
    default:
      return <EvoModel color={color} />;
  }
}
