import { useRef, useMemo, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

export type VehicleType = 'evo' | 'wrx' | 'impreza' | 'sportbike' | 'bus';
export type EnvironmentType = 'coastal' | 'mountain' | 'city';
export type TimeOfDayType = 'dawn' | 'noon' | 'sunset' | 'midnight';
export type WeatherType = 'clear' | 'rain' | 'fog' | 'overcast';

interface GameProps {
  vehicle: VehicleType;
  environment: EnvironmentType;
  timeOfDay: TimeOfDayType;
  weather: WeatherType;
  autoDrive: boolean;
  cameraMode: number;
  keysPressed: React.MutableRefObject<Set<string>>;
  onSpeedChange: (speed: number) => void;
  onOffRoadChange: (offRoad: boolean) => void;
}

interface RoadSegment {
  position: THREE.Vector3;
  rotation: number;
  curve: number;
}

// --- Vehicle physics configs per type ---
const VEHICLE_CONFIGS = {
  evo: {
    maxSpeed: 170, acceleration: 65, handling: 2.2, friction: 0.985, brakeForce: 1.8,
    driftFactor: 0.92, turnDamping: 0.88, bodyColor: '#CC2222', accentColor: '#333333',
  },
  wrx: {
    maxSpeed: 155, acceleration: 58, handling: 2.6, friction: 0.983, brakeForce: 1.7,
    driftFactor: 0.90, turnDamping: 0.85, bodyColor: '#E8E8E8', accentColor: '#555555',
  },
  impreza: {
    maxSpeed: 165, acceleration: 62, handling: 2.4, friction: 0.984, brakeForce: 1.9,
    driftFactor: 0.88, turnDamping: 0.86, bodyColor: '#1E3A8A', accentColor: '#D4A017',
  },
  sportbike: {
    maxSpeed: 195, acceleration: 80, handling: 3.6, friction: 0.978, brakeForce: 2.2,
    driftFactor: 0.95, turnDamping: 0.92, bodyColor: '#CC2222', accentColor: '#111111',
  },
  bus: {
    maxSpeed: 85, acceleration: 28, handling: 1.0, friction: 0.990, brakeForce: 1.2,
    driftFactor: 0.98, turnDamping: 0.80, bodyColor: '#2563EB', accentColor: '#E5E7EB',
  },
};

const ROAD_WIDTH = 14;
const SEGMENT_LENGTH = 6;
const VISIBLE_SEGMENTS = 180;
const ROAD_PIECES = 50;

// Open city track design with outer drift zones and rally areas
const TRACK_DESIGN = {
  // Circuit layout: defines the track path as segments with turn radii
  // Optimized for 45-90 second laps at typical speeds
  circuit: [
    { type: 'straight', length: 28 },      // Main straight - longer for speed buildup
    { type: 'curve', radius: 1.4, angle: 90 },   // Turn 1 - wide hairpin for drift entry
    { type: 'straight', length: 22 },      // Back section
    { type: 'curve', radius: 0.9, angle: 75 },   // Turn 2 - tight technical corner
    { type: 'straight', length: 16 },      // Short straight to rally zone
    { type: 'curve', radius: 1.8, angle: 135 },  // Turn 3 - long sweeping drift corner
    { type: 'straight', length: 24 },      // Riverside straight
    { type: 'curve', radius: 1.1, angle: 90 },   // Turn 4 - city corner with runoff
    { type: 'straight', length: 18 },      // Final straight back to start/finish
  ],
  // Drift zones on the outer perimeter - larger areas for extended drifts
  driftZones: [
    { x: -90, z: 120, radius: 45, surface: 'gravel' },   // NW gravel drift pad
    { x: 95, z: 220, radius: 38, surface: 'dirt' },      // NE dirt rally circle
    { x: 10, z: 420, radius: 50, surface: 'gravel' },    // N large gravel arena
    { x: -75, z: 530, radius: 32, surface: 'dirt' },     // NW dirt skid pad
    { x: 110, z: 80, radius: 28, surface: 'gravel' },    // E technical gravel zone
    { x: -110, z: 350, radius: 35, surface: 'dirt' },    // W dirt drift course
  ],
  // Rally shortcuts cutting through the city - alternative paths
  shortcuts: [
    { from: 40, to: 60, difficulty: 'hard', surface: 'dirt' },
    { from: 110, to: 130, difficulty: 'medium', surface: 'gravel' },
    { from: 170, to: 185, difficulty: 'easy', surface: 'dirt' },
  ],
};

// ====================================================================
// VEHICLE MESHES — detailed low-poly models based on reference images
// ====================================================================
function EvoModel({ color }: { color: string }) {
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
      {/* Side windows left */}
      <mesh position={[0.78, 0.75, -0.15]} castShadow>
        <boxGeometry args={[0.06, 0.35, 1.6]} />
        <meshStandardMaterial color="#1a1a2e" roughness={0.0} opacity={0.75} transparent />
      </mesh>
      {/* Side windows right */}
      <mesh position={[-0.78, 0.75, -0.15]} castShadow>
        <boxGeometry args={[0.06, 0.35, 1.6]} />
        <meshStandardMaterial color="#1a1a2e" roughness={0.0} opacity={0.75} transparent />
      </mesh>
      {/* Rear spoiler - wing supports */}
      <mesh position={[0.55, 0.98, -2.0]} castShadow>
        <boxGeometry args={[0.08, 0.3, 0.08]} />
        <meshStandardMaterial color={color} roughness={0.3} />
      </mesh>
      <mesh position={[-0.55, 0.98, -2.0]} castShadow>
        <boxGeometry args={[0.08, 0.3, 0.08]} />
        <meshStandardMaterial color={color} roughness={0.3} />
      </mesh>
      {/* Spoiler wing */}
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
      {/* Front grille / intake */}
      <mesh position={[0, 0.25, 2.12]}>
        <boxGeometry args={[1.1, 0.18, 0.08]} />
        <meshStandardMaterial color="#111" roughness={0.8} />
      </mesh>
      {/* Wheels FL, FR, RL, RR */}
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

function WrxModel({ color }: { color: string }) {
  return (
    <group>
      {/* Body lower */}
      <mesh position={[0, 0.32, 0]} castShadow>
        <boxGeometry args={[1.82, 0.45, 4.1]} />
        <meshStandardMaterial color={color} roughness={0.25} metalness={0.5} />
      </mesh>
      {/* Front bumper with fog light cutouts */}
      <mesh position={[0, 0.18, 2.1]} castShadow>
        <boxGeometry args={[1.85, 0.22, 0.3]} />
        <meshStandardMaterial color="#666" roughness={0.5} />
      </mesh>
      {/* Hood */}
      <mesh position={[0, 0.56, 0.8]} castShadow>
        <boxGeometry args={[1.7, 0.04, 2.2]} />
        <meshStandardMaterial color={color} roughness={0.2} metalness={0.5} />
      </mesh>
      {/* Hood scoop / intake */}
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
      {/* Spoiler supports */}
      <mesh position={[0.5, 0.96, -1.95]}>
        <boxGeometry args={[0.07, 0.28, 0.07]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[-0.5, 0.96, -1.95]}>
        <boxGeometry args={[0.07, 0.28, 0.07]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* Spoiler */}
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

function ImprezaModel({ color, accentColor }: { color: string; accentColor: string }) {
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
      {/* Hood scoop (Subaru signature) */}
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
      {/* Rear spoiler - tall rally style */}
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
      {/* Front grille / intake */}
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
      {/* Wheels — gold rims for Impreza */}
      <Wheel position={[0.96, 0.18, 1.32]} rimColor={accentColor} />
      <Wheel position={[-0.96, 0.18, 1.32]} rimColor={accentColor} />
      <Wheel position={[0.96, 0.18, -1.32]} rimColor={accentColor} />
      <Wheel position={[-0.96, 0.18, -1.32]} rimColor={accentColor} />
    </group>
  );
}

function SportbikeModel({ color }: { color: string }) {
  return (
    <group>
      {/* Main frame / chassis */}
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
      {/* Lower fairing / belly pan */}
      <mesh position={[0, 0.38, 0.3]} castShadow>
        <boxGeometry args={[0.5, 0.15, 1.2]} />
        <meshStandardMaterial color={color} roughness={0.2} />
      </mesh>
    </group>
  );
}

function BusModel({ color, accentColor }: { color: string; accentColor: string }) {
  return (
    <group>
      {/* Lower body / chassis */}
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
      {/* Windows - left side row */}
      {[-1.5, -0.5, 0.5, 1.5].map((z, i) => (
        <mesh key={`wl${i}`} position={[1.18, 1.1, z]}>
          <boxGeometry args={[0.06, 0.5, 0.85]} />
          <meshStandardMaterial color="#3B6E8F" roughness={0.0} opacity={0.7} transparent />
        </mesh>
      ))}
      {/* Windows - right side row */}
      {[-1.5, -0.5, 0.5, 1.5].map((z, i) => (
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

function Wheel({ position, rimColor = '#CCCCCC' }: { position: [number, number, number]; rimColor?: string }) {
  return (
    <group position={position}>
      {/* Tire */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.32, 0.32, 0.22, 10]} />
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

function BusWheel({ position }: { position: [number, number, number] }) {
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

// ====================================================================
// ENVIRONMENT PROPS — buildings, palm trees, mountains, guardrails
// ====================================================================
function PalmTree({ position, scale = 1 }: { position: THREE.Vector3; scale?: number }) {
  return (
    <group position={position}>
      {/* Trunk — curved using two segments */}
      <mesh position={[0, scale * 2, 0]} castShadow>
        <cylinderGeometry args={[0.12 * scale, 0.2 * scale, scale * 4, 6]} />
        <meshStandardMaterial color="#8B6914" roughness={0.8} />
      </mesh>
      {/* Fronds (4 leaf clusters) */}
      {[0, Math.PI / 2, Math.PI, Math.PI * 1.5].map((rot, i) => (
        <mesh key={i} position={[Math.sin(rot) * 0.6 * scale, scale * 4.2, Math.cos(rot) * 0.6 * scale]}
          rotation={[Math.sin(rot) * 0.5, rot, Math.cos(rot) * 0.3]} castShadow>
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

function Building({ position, width, height, depth, color }: {
  position: THREE.Vector3; width: number; height: number; depth: number; color: string;
}) {
  return (
    <group position={position}>
      {/* Main structure */}
      <mesh position={[0, height / 2, 0]} castShadow>
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial color={color} roughness={0.65} />
      </mesh>
      {/* Windows */}
      {Array.from({ length: Math.floor(height / 1.8) }).map((_, row) =>
        Array.from({ length: Math.floor(width / 1.5) }).map((_, col) => (
          <mesh key={`w${row}${col}`}
            position={[
              -width / 2 + 0.8 + col * 1.5,
              1.2 + row * 1.8,
              depth / 2 + 0.02,
            ]}>
            <boxGeometry args={[0.6, 0.8, 0.04]} />
            <meshStandardMaterial color="#5A8FA8" roughness={0.1} opacity={0.7} transparent />
          </mesh>
        ))
      )}
      {/* Roof accent */}
      <mesh position={[0, height + 0.08, 0]}>
        <boxGeometry args={[width + 0.1, 0.15, depth + 0.1]} />
        <meshStandardMaterial color="#777" roughness={0.5} />
      </mesh>
    </group>
  );
}

function Mountain({ position, radius, height, color }: {
  position: THREE.Vector3; radius: number; height: number; color: string;
}) {
  return (
    <mesh position={position} castShadow>
      <coneGeometry args={[radius, height, 7]} />
      <meshStandardMaterial color={color} roughness={0.8} flatShading />
    </mesh>
  );
}

// ====================================================================
// RAIN PARTICLES
// ====================================================================
function RainParticles({ count, playerPos }: { count: number; playerPos: React.MutableRefObject<THREE.Vector3> }) {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 80;
      arr[i * 3 + 1] = Math.random() * 30;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 80;
    }
    return arr;
  }, [count]);

  useFrame((_, delta) => {
    if (!ref.current) return;
    const geo = ref.current.geometry;
    const pos = geo.attributes.position as THREE.BufferAttribute;
    const pPos = playerPos.current;
    for (let i = 0; i < count; i++) {
      pos.array[i * 3 + 1] -= 30 * delta;
      if (pos.array[i * 3 + 1] < -1) {
        pos.array[i * 3 + 1] = 25 + Math.random() * 10;
        pos.array[i * 3] = pPos.x + (Math.random() - 0.5) * 80;
        pos.array[i * 3 + 2] = pPos.z + (Math.random() - 0.5) * 80;
      }
    }
    pos.needsUpdate = true;
    ref.current.position.set(0, 0, 0);
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#AAC4D8" size={0.08} transparent opacity={0.6} />
    </points>
  );
}

// ====================================================================
// MAIN GAME COMPONENT
// ====================================================================
export default function Game({
  vehicle,
  environment,
  timeOfDay,
  weather,
  autoDrive,
  cameraMode,
  keysPressed,
  onSpeedChange,
  onOffRoadChange,
}: GameProps) {
  const { camera } = useThree();
  const vehicleRef = useRef<THREE.Group>(null);
  const positionRef = useRef(new THREE.Vector3(0, 0, 0));
  const rotationRef = useRef(0);
  const speedRef = useRef(0);
  const steerAngleRef = useRef(0);
  const roadSegmentsRef = useRef<RoadSegment[]>([]);
  const roadPiecesRef = useRef<THREE.Group>(null);
  const propsRef = useRef<THREE.Group>(null);
  const mountainsRef = useRef<THREE.Group>(null);
  const driftZoneRef = useRef<THREE.Group>(null);
  const driftZonePositionsRef = useRef<Array<{ x: number; z: number; radius: number; surface: string }>>([]);

  const config = VEHICLE_CONFIGS[vehicle];

  // --- SKY & LIGHTING CONFIG ---
  const skyConfig = useMemo(() => {
    const base = (() => {
      switch (timeOfDay) {
        case 'dawn':
          return { top: '#3B4D6E', bottom: '#E8A87C', fogColor: '#D4956E', lightIntensity: 0.75, ambient: '#4A3D52', sunColor: '#FFD4A0' };
        case 'noon':
          return { top: '#4A90D9', bottom: '#D4E8FC', fogColor: '#B8D4F0', lightIntensity: 1.3, ambient: '#8899AA', sunColor: '#FFFFFF' };
        case 'sunset':
          return { top: '#1F2840', bottom: '#E05A30', fogColor: '#C04D2A', lightIntensity: 0.85, ambient: '#5A3328', sunColor: '#FF9060' };
        case 'midnight':
        default:
          return { top: '#060A12', bottom: '#0E1525', fogColor: '#0A0F1A', lightIntensity: 0.18, ambient: '#141A28', sunColor: '#556688' };
      }
    })();

    // Weather modifiers
    let fogNear = 80;
    let fogFar = 400;
    if (weather === 'fog') { fogNear = 15; fogFar = 120; }
    else if (weather === 'rain') { fogNear = 40; fogFar = 220; }
    else if (weather === 'overcast') { fogNear = 60; fogFar = 300; }

    return { ...base, fogNear, fogFar };
  }, [timeOfDay, weather]);

  // --- ENVIRONMENT TERRAIN COLOR ---
  const terrainConfig = useMemo(() => {
    switch (environment) {
      case 'coastal':
        return {
          groundColor: '#5A8C3E', roadColor: '#2A2A2A', lineColor: '#FBBF24',
          propTypes: ['palm', 'building', 'palm', 'palm'] as string[],
          buildingColors: ['#E8C07A', '#D4775A', '#E09B6B', '#C4654A', '#E8D5A0'],
          curveIntensity: 0.6,
        };
      case 'mountain':
        return {
          groundColor: '#3A5A2E', roadColor: '#1F1F1F', lineColor: '#FFFFFF',
          propTypes: ['tree', 'tree', 'tree', 'rock'] as string[],
          buildingColors: ['#5A6B5A', '#6B7B6B', '#4A5B4A'],
          curveIntensity: 1.5,
        };
      case 'city':
      default:
        return {
          groundColor: '#4A5A3A', roadColor: '#252525', lineColor: '#FBBF24',
          propTypes: ['building', 'building', 'pole', 'building'] as string[],
          buildingColors: ['#8899AA', '#99AABB', '#778899', '#AABBCC', '#BBCCDD'],
          curveIntensity: 0.25,
        };
    }
  }, [environment]);

  // --- ROAD GENERATION: OPEN CITY CIRCUIT WITH DRIFT ZONES ---
  const { roadSegments, propData, mountainData, driftZoneData, driftZonePositions } = useMemo(() => {
    const segments: RoadSegment[] = [];
    let x = 0;
    let z = 0;
    let rot = 0;
    let curve = 0;
    
    // Build complete circuit path from track design for smoother transitions
    const circuitPath: Array<{ type: string; radius?: number; turnAmount?: number; curveVar?: number }> = [];
    TRACK_DESIGN.circuit.forEach((part) => {
      if (part.type === 'straight') {
        for (let s = 0; s < part.length; s++) {
          circuitPath.push({ type: 'straight', curveVar: (Math.random() - 0.5) * 0.12 });
        }
      } else if (part.type === 'curve') {
        const turnPerSegment = (part.angle! * Math.PI / 180) / part.length;
        for (let s = 0; s < part.length; s++) {
          circuitPath.push({ type: 'curve', radius: part.radius, turnAmount: turnPerSegment });
        }
      }
    });
    
    // Generate segments following the circuit path, looping as needed
    let pathIndex = 0;
    for (let i = 0; i < VISIBLE_SEGMENTS; i++) {
      const pathPart = circuitPath[pathIndex % circuitPath.length];
      
      if (pathPart.type === 'curve' && pathPart.turnAmount) {
        curve = (pathPart.radius || 1.0) * 0.7;
        rot += pathPart.turnAmount;
      } else {
        // Straight sections with subtle variation for natural feel
        curve = pathPart.curveVar || 0;
        rot += curve * 0.008;
      }
      
      x += Math.sin(rot) * SEGMENT_LENGTH;
      z += Math.cos(rot) * SEGMENT_LENGTH;
      segments.push({ position: new THREE.Vector3(x, 0, z), rotation: rot, curve });
      pathIndex++;
    }

    // Props - placed along the circuit with clear sightlines for mobile readability
    const props: Array<{ position: THREE.Vector3; scale: number; type: string; color: string; width: number; height: number; depth: number }> = [];
    for (let i = 0; i < 160; i++) {
      const segIndex = Math.floor(Math.random() * VISIBLE_SEGMENTS);
      const seg = segments[segIndex];
      if (!seg) continue;
      const side = Math.random() > 0.5 ? 1 : -1;
      // Wider spacing for open city feel and clear corner telegraphing
      const dist = 22 + Math.random() * 40;
      const zOff = (Math.random() - 0.5) * SEGMENT_LENGTH * 3;
      const typeArr = terrainConfig.propTypes;
      const type = typeArr[Math.floor(Math.random() * typeArr.length)];
      const color = type === 'building'
        ? terrainConfig.buildingColors[Math.floor(Math.random() * terrainConfig.buildingColors.length)]
        : type === 'tree' ? '#2D5A27' : type === 'palm' ? '#8B6914' : '#666';

      // Simplified building sizes for clean silhouettes
      const w = type === 'building' ? 4 + Math.random() * 3 : 1;
      const h = type === 'building' ? 6 + Math.random() * 8 : 1;
      const d = type === 'building' ? 4 + Math.random() * 3 : 1;

      props.push({
        position: new THREE.Vector3(
          seg.position.x + Math.cos(seg.rotation) * dist * side,
          0,
          seg.position.z + zOff,
        ),
        scale: 0.9 + Math.random() * 0.4,
        type,
        color,
        width: w, height: h, depth: d,
      });
    }

    // Mountains (background) - reduced count for mobile, larger shapes for clear silhouettes
    const mountains: Array<{ position: THREE.Vector3; radius: number; height: number; color: string }> = [];
    for (let i = 0; i < 16; i++) {
      const segIndex = Math.floor((i / 16) * VISIBLE_SEGMENTS);
      const seg = segments[segIndex] || segments[0];
      const side = i % 2 === 0 ? 1 : -1;
      mountains.push({
        position: new THREE.Vector3(
          seg.position.x + side * (120 + Math.random() * 80),
          0,
          seg.position.z + (Math.random() - 0.5) * 60,
        ),
        radius: 25 + Math.random() * 35,
        height: 40 + Math.random() * 45,
        color: environment === 'coastal' ? '#5A7A4A' : environment === 'mountain' ? '#6B7B6B' : '#889988',
      });
    }
    
    // Drift zone markers - positioned on outer perimeter for rally/drifting
    const driftZones: Array<{ position: THREE.Vector3; radius: number; surface: string }> = [];
    const driftZonePositions: Array<{ x: number; z: number; radius: number; surface: string }> = [];
    TRACK_DESIGN.driftZones.forEach(zone => {
      const pos = new THREE.Vector3(zone.x, 0, zone.z);
      driftZones.push({
        position: pos,
        radius: zone.radius,
        surface: zone.surface,
      });
      driftZonePositions.push({
        x: zone.x,
        z: zone.z,
        radius: zone.radius,
        surface: zone.surface,
      });
    });

    return { roadSegments: segments, propData: props, mountainData: mountains, driftZoneData: driftZones, driftZonePositions };
  }, [environment, terrainConfig]);

  useEffect(() => {
    roadSegmentsRef.current = roadSegments;
  }, [roadSegments]);

  useEffect(() => {
    driftZonePositionsRef.current = driftZonePositions;
  }, [driftZonePositions]);

  // --- IMPROVED PHYSICS / FRAME LOOP ---
  useFrame((_, rawDelta) => {
    const delta = Math.min(rawDelta, 0.05);
    const keys = keysPressed.current;
    let accelerating = keys.has('w') || keys.has('arrowup');
    let braking = keys.has('s') || keys.has('arrowdown') || keys.has(' ');
    const steeringLeft = keys.has('a') || keys.has('arrowleft');
    const steeringRight = keys.has('d') || keys.has('arrowright');
    const boosting = keys.has('shift');

    if (autoDrive) accelerating = true;

    const spd = speedRef.current;
    const maxSpd = boosting ? config.maxSpeed * 1.2 : config.maxSpeed;

    // Acceleration / braking
    if (accelerating) {
      const accelCurve = 1 - (spd / maxSpd) * 0.6; // Less accel at high speed
      speedRef.current = Math.min(spd + config.acceleration * accelCurve * delta, maxSpd);
    } else if (braking) {
      speedRef.current = Math.max(spd - config.acceleration * config.brakeForce * delta, -config.maxSpeed * 0.3);
    } else {
      speedRef.current *= config.friction;
      if (Math.abs(speedRef.current) < 0.2) speedRef.current = 0;
    }

    // --- IMPROVED STEERING ---
    // Speed-dependent sensitivity: low speed = tight turn, high speed = less sensitive
    const speedRatio = Math.abs(speedRef.current) / config.maxSpeed;
    const speedFactor = Math.max(0.1, Math.min(1.0, speedRatio));
    const steerSensitivity = config.handling * (0.4 + speedFactor * 0.6);
    // At very high speed reduce turning radius for stability
    const highSpeedDamping = speedRatio > 0.7 ? 1 - (speedRatio - 0.7) * 0.8 : 1;

    let targetSteer = 0;
    if (steeringLeft) targetSteer = 1;
    if (steeringRight) targetSteer = -1;

    // Smooth steering interpolation
    steerAngleRef.current = THREE.MathUtils.lerp(
      steerAngleRef.current,
      targetSteer,
      config.turnDamping * delta * 8
    );

    const actualSteer = steerAngleRef.current * steerSensitivity * highSpeedDamping * delta * 3.0;
    rotationRef.current += actualSteer * (speedRef.current > 0 ? 1 : speedRef.current < -1 ? -0.5 : 0);

    // Movement
    positionRef.current.x += Math.sin(rotationRef.current) * speedRef.current * delta * 0.28;
    positionRef.current.z += Math.cos(rotationRef.current) * speedRef.current * delta * 0.28;

    // Off-road and drift zone detection with enhanced rally physics
    const roadData = roadSegmentsRef.current;
    let inDriftZone = false;
    let currentDriftSurface = '';
    
    // Check if player is in any drift zone - outer perimeter areas
    for (const dz of driftZonePositionsRef.current) {
      const dx = positionRef.current.x - dz.x;
      const ddz = positionRef.current.z - dz.z;
      const distToDriftCenter = Math.sqrt(dx * dx + ddz * ddz);
      if (distToDriftCenter < dz.radius) {
        inDriftZone = true;
        currentDriftSurface = dz.surface;
        break;
      }
    }
    
    if (roadData.length > 0) {
      let onRoad = false;
      for (const seg of roadData) {
        const dx = positionRef.current.x - seg.position.x;
        const dz = positionRef.current.z - seg.position.z;
        const dist = Math.sqrt(dx * dx + dz * dz);
        if (dist < ROAD_WIDTH / 2 + 1.5) { onRoad = true; break; }
      }
      
      // In drift zones: enhanced drift physics with surface-specific handling
      if (inDriftZone) {
        onOffRoadChange(false);
        // Gravel offers more slide, dirt is slightly more grippy
        const surfaceDriftFactor = currentDriftSurface === 'gravel' ? config.driftFactor * 0.97 : config.driftFactor;
        speedRef.current *= surfaceDriftFactor; // Better slide in drift zones
      } else {
        onOffRoadChange(!onRoad && Math.abs(speedRef.current) > 8);
        // Slow down off-road (but not in drift zones)
        if (!onRoad) {
          speedRef.current *= 0.993;
        }
      }
    }

    // Autodrive AI
    if (autoDrive && roadData.length > 0) {
      let bestSeg: RoadSegment | null = null;
      let bestDist = Infinity;
      for (const seg of roadData) {
        const ahead = seg.position.z - positionRef.current.z;
        if (ahead > 15 && ahead < 80) {
          const d = Math.abs(ahead - 40);
          if (d < bestDist) { bestDist = d; bestSeg = seg; }
        }
      }
      if (bestSeg) {
        const dx = bestSeg.position.x - positionRef.current.x;
        const targetAngle = Math.atan2(dx, bestSeg.position.z - positionRef.current.z);
        const diff = targetAngle - rotationRef.current;
        rotationRef.current += diff * 3.0 * delta;
      }
    }

    // Apply vehicle transform
    if (vehicleRef.current) {
      vehicleRef.current.position.copy(positionRef.current);
      vehicleRef.current.rotation.y = rotationRef.current;
      // Body roll on steering
      const targetRoll = steerAngleRef.current * (vehicle === 'sportbike' ? 0.25 : 0.06);
      vehicleRef.current.rotation.z = THREE.MathUtils.lerp(vehicleRef.current.rotation.z, targetRoll, 0.12);
    }

    // Camera
    const camCfg = [
      { height: 3.5, dist: 9, fovOff: 0 },
      { height: 7, dist: 16, fovOff: -5 },
      { height: 1.5, dist: 1.2, fovOff: 8 },
    ][cameraMode] || { height: 3.5, dist: 9, fovOff: 0 };

    const speedFov = speedRatio * 6;
    (camera as THREE.PerspectiveCamera).fov = THREE.MathUtils.lerp(
      (camera as THREE.PerspectiveCamera).fov,
      60 + camCfg.fovOff + speedFov,
      0.05
    );
    (camera as THREE.PerspectiveCamera).updateProjectionMatrix();

    const targetCamX = positionRef.current.x - Math.sin(rotationRef.current) * camCfg.dist;
    const targetCamZ = positionRef.current.z - Math.cos(rotationRef.current) * camCfg.dist;
    camera.position.x += (targetCamX - camera.position.x) * 0.07;
    camera.position.z += (targetCamZ - camera.position.z) * 0.07;
    camera.position.y += (camCfg.height - camera.position.y) * 0.07;

    camera.lookAt(
      positionRef.current.x + Math.sin(rotationRef.current) * 12,
      positionRef.current.y + (cameraMode === 2 ? 0.8 : 1.2),
      positionRef.current.z + Math.cos(rotationRef.current) * 12,
    );

    onSpeedChange(Math.abs(speedRef.current));

    // Update road pieces
    if (roadPiecesRef.current) {
      const playerZ = positionRef.current.z;
      const baseIndex = Math.floor(playerZ / SEGMENT_LENGTH);
      roadPiecesRef.current.children.forEach((piece, i) => {
        const segIndex = (baseIndex + i - 12) % roadData.length;
        if (segIndex >= 0 && segIndex < roadData.length) {
          const seg = roadData[segIndex];
          piece.position.set(seg.position.x, 0, seg.position.z);
          piece.rotation.y = seg.rotation;
        }
      });
    }

    // Recycle props
    if (propsRef.current) {
      const playerZ = positionRef.current.z;
      propsRef.current.children.forEach((_prop, i) => {
        const pd = propData[i];
        if (pd && pd.position.z - playerZ < -40) {
          pd.position.z += VISIBLE_SEGMENTS * SEGMENT_LENGTH;
        }
      });
    }

    // Recycle mountains
    if (mountainsRef.current) {
      const playerZ = positionRef.current.z;
      mountainsRef.current.children.forEach((_m, i) => {
        const md = mountainData[i];
        if (md && md.position.z - playerZ < -100) {
          md.position.z += VISIBLE_SEGMENTS * SEGMENT_LENGTH;
        }
      });
    }
    
    // Recycle drift zones (loop them around the track)
    if (driftZoneRef.current && driftZonePositionsRef.current.length > 0) {
      const playerZ = positionRef.current.z;
      const trackLength = VISIBLE_SEGMENTS * SEGMENT_LENGTH;
      
      driftZoneRef.current.children.forEach((dz, i) => {
        const zd = driftZonePositionsRef.current[i];
        if (zd) {
          const relZ = zd.z - playerZ;
          // Wrap drift zone positions when player passes them
          if (relZ < -200) {
            zd.z += trackLength;
            dz.position.z = zd.z;
          } else if (relZ > trackLength + 200) {
            zd.z -= trackLength;
            dz.position.z = zd.z;
          }
        }
      });
    }
  });

  // --- Weather-dependent fog overlay color ---
  const weatherFogColor = weather === 'fog' ? '#C8C8C8' : weather === 'rain' ? '#7A8A9A' : skyConfig.fogColor;

  return (
    <>
      <color attach="background" args={[weather === 'overcast' ? '#5A6A7A' : skyConfig.top]} />
      <fog attach="fog" args={[weatherFogColor, skyConfig.fogNear, skyConfig.fogFar]} />

      {/* Ambient */}
      <ambientLight
        intensity={weather === 'overcast' ? 0.65 : weather === 'rain' ? 0.45 : skyConfig.lightIntensity * 0.45}
        color={skyConfig.ambient}
      />

      {/* Main directional light */}
      <directionalLight
        position={[50, 100, 50]}
        intensity={weather === 'overcast' ? 0.5 : weather === 'rain' ? 0.35 : skyConfig.lightIntensity * 1.1}
        color={skyConfig.sunColor}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={200}
        shadow-camera-left={-50}
        shadow-camera-right={50}
        shadow-camera-top={50}
        shadow-camera-bottom={-50}
      />

      {/* Fill light */}
      <directionalLight position={[-40, 25, -40]} intensity={0.3} color="#6688AA" />

      {/* Hemisphere light for ground bounce */}
      <hemisphereLight args={[skyConfig.top, terrainConfig.groundColor, 0.25]} />

      {/* Ground plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]} receiveShadow>
        <planeGeometry args={[2000, 2000]} />
        <meshStandardMaterial color={terrainConfig.groundColor} roughness={0.92} />
      </mesh>

      {/* Ocean plane (coastal) */}
      {environment === 'coastal' && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[120, -0.2, 400]} receiveShadow>
          <planeGeometry args={[400, 800]} />
          <meshStandardMaterial color="#2B7A9E" roughness={0.1} metalness={0.3} opacity={0.85} transparent />
        </mesh>
      )}

      {/* Road pieces */}
      <group ref={roadPiecesRef}>
        {Array.from({ length: ROAD_PIECES }).map((_, i) => (
          <group key={i}>
            {/* Asphalt */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} receiveShadow>
              <planeGeometry args={[ROAD_WIDTH, SEGMENT_LENGTH + 0.15]} />
              <meshStandardMaterial color={terrainConfig.roadColor} roughness={0.7} metalness={0.05} />
            </mesh>
            {/* Center line */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
              <planeGeometry args={[0.18, SEGMENT_LENGTH * 0.6]} />
              <meshStandardMaterial color={terrainConfig.lineColor} roughness={0.9} />
            </mesh>
            {/* Road edge lines */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[ROAD_WIDTH / 2 - 0.3, 0.02, 0]}>
              <planeGeometry args={[0.12, SEGMENT_LENGTH]} />
              <meshStandardMaterial color="#FFFFFF" roughness={0.9} />
            </mesh>
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-ROAD_WIDTH / 2 + 0.3, 0.02, 0]}>
              <planeGeometry args={[0.12, SEGMENT_LENGTH]} />
              <meshStandardMaterial color="#FFFFFF" roughness={0.9} />
            </mesh>
            {/* Curb / road edge (left) */}
            <mesh position={[ROAD_WIDTH / 2, 0.06, 0]} castShadow>
              <boxGeometry args={[0.3, 0.12, SEGMENT_LENGTH]} />
              <meshStandardMaterial color="#888" roughness={0.7} />
            </mesh>
            {/* Curb / road edge (right) */}
            <mesh position={[-ROAD_WIDTH / 2, 0.06, 0]} castShadow>
              <boxGeometry args={[0.3, 0.12, SEGMENT_LENGTH]} />
              <meshStandardMaterial color="#888" roughness={0.7} />
            </mesh>
          </group>
        ))}
      </group>

      {/* Mountains background */}
      <group ref={mountainsRef}>
        {mountainData.map((m, i) => (
          <Mountain key={i} position={m.position} radius={m.radius} height={m.height} color={m.color} />
        ))}
      </group>

      {/* Drift zones - outer perimeter areas for drifting and rally with high-contrast markers */}
      <group ref={driftZoneRef}>
        {driftZoneData.map((dz, i) => (
          <group key={i} position={dz.position}>
            {/* Drift zone surface - gravel/dirt with distinct high-contrast color */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} receiveShadow>
              <circleGeometry args={[dz.radius, 8]} />
              <meshStandardMaterial 
                color={dz.surface === 'gravel' ? '#9A7B4F' : '#7D5A3E'} 
                roughness={0.92} 
                metalness={0.0}
              />
            </mesh>
            {/* Outer ring marker for clear telegraphing */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]}>
              <ringGeometry args={[dz.radius * 0.92, dz.radius, 8]} />
              <meshBasicMaterial color="#FFFFFF" transparent opacity={0.6} side={2} />
            </mesh>
            {/* Drift zone marker cones - evenly spaced around perimeter */}
            {Array.from({ length: 10 }).map((_, j) => {
              const angle = (j / 10) * Math.PI * 2;
              const coneX = Math.cos(angle) * dz.radius * 0.95;
              const coneZ = Math.sin(angle) * dz.radius * 0.95;
              return (
                <mesh key={j} position={[coneX, 0.7, coneZ]} castShadow>
                  <coneGeometry args={[0.35, 1.4, 4]} />
                  <meshStandardMaterial color="#FF6B35" emissive="#FF6B35" emissiveIntensity={0.4} />
                </mesh>
              );
            })}
          </group>
        ))}
      </group>

      {/* Props: trees, buildings, palms, poles */}
      <group ref={propsRef}>
        {propData.map((prop, i) => (
          <group key={i} position={prop.position}>
            {prop.type === 'palm' && <PalmTree position={new THREE.Vector3(0, 0, 0)} scale={prop.scale} />}
            {prop.type === 'tree' && (
              <>
                <mesh position={[0, prop.scale * 1.5, 0]} castShadow>
                  <cylinderGeometry args={[0.15, 0.22, prop.scale * 3, 6]} />
                  <meshStandardMaterial color="#6B4423" roughness={0.8} />
                </mesh>
                <mesh position={[0, prop.scale * 3.2, 0]} castShadow>
                  <coneGeometry args={[prop.scale * 1.4, prop.scale * 3, 7]} />
                  <meshStandardMaterial color="#2D5A27" roughness={0.7} flatShading />
                </mesh>
                <mesh position={[0, prop.scale * 4.5, 0]} castShadow>
                  <coneGeometry args={[prop.scale * 1.0, prop.scale * 2.2, 7]} />
                  <meshStandardMaterial color="#3A7D34" roughness={0.7} flatShading />
                </mesh>
              </>
            )}
            {prop.type === 'building' && (
              <Building
                position={new THREE.Vector3(0, 0, 0)}
                width={prop.width}
                height={prop.height}
                depth={prop.depth}
                color={prop.color}
              />
            )}
            {prop.type === 'pole' && (
              <group>
                <mesh position={[0, 3, 0]} castShadow>
                  <cylinderGeometry args={[0.06, 0.08, 6, 6]} />
                  <meshStandardMaterial color="#666" roughness={0.5} metalness={0.3} />
                </mesh>
                <mesh position={[1, 5.8, 0]}>
                  <boxGeometry args={[2.2, 0.08, 0.08]} />
                  <meshStandardMaterial color="#666" />
                </mesh>
                <mesh position={[2, 5.65, 0]}>
                  <boxGeometry args={[0.4, 0.1, 0.25]} />
                  <meshStandardMaterial
                    color="#FEF3C7"
                    emissive="#F59E0B"
                    emissiveIntensity={timeOfDay === 'midnight' ? 3 : timeOfDay === 'sunset' ? 1.5 : 0.2}
                  />
                </mesh>
              </group>
            )}
            {prop.type === 'rock' && (
              <mesh position={[0, prop.scale * 0.4, 0]} castShadow>
                <dodecahedronGeometry args={[prop.scale * 0.8, 0]} />
                <meshStandardMaterial color="#7A7A6A" roughness={0.9} flatShading />
              </mesh>
            )}
          </group>
        ))}
      </group>

      {/* Rain particles */}
      {weather === 'rain' && (
        <RainParticles count={2000} playerPos={positionRef} />
      )}

      {/* Vehicle */}
      <group ref={vehicleRef}>
        {vehicle === 'evo' && <EvoModel color={config.bodyColor} />}
        {vehicle === 'wrx' && <WrxModel color={config.bodyColor} />}
        {vehicle === 'impreza' && <ImprezaModel color={config.bodyColor} accentColor={config.accentColor} />}
        {vehicle === 'sportbike' && <SportbikeModel color={config.bodyColor} />}
        {vehicle === 'bus' && <BusModel color={config.bodyColor} accentColor={config.accentColor} />}
      </group>
    </>
  );
}
