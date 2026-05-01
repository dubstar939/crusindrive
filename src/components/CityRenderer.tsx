/**
 * CityRenderer.tsx
 * 
 * React Three Fiber components for rendering the procedurally generated city.
 * Includes optimized instanced mesh rendering for performance.
 */

import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { BuildingDef, TreeDef, RoadSegment, ZoneType, BuildingType, TreeType } from '../utils/CityMapGenerator';

// ============================================================================
// INSTANCED BUILDING RENDERER - High performance for many buildings
// ============================================================================

interface InstancedBuildingsProps {
  buildings: BuildingDef[];
}

export function InstancedBuildings({ buildings }: InstancedBuildingsProps) {
  useRef<THREE.InstancedMesh>(null);
  
  // Group buildings by type for efficient batching
  const buildingsByType = useMemo(() => {
    const groups = new Map<BuildingType, BuildingDef[]>();
    buildings.forEach(b => {
      if (!groups.has(b.type)) groups.set(b.type, []);
      groups.get(b.type)!.push(b);
    });
    return groups;
  }, [buildings]);
  
  if (buildings.length === 0) return null;
  
  return (
    <group>
      {Array.from(buildingsByType.entries()).map(([type, typeBuildings]) => (
        <InstancedBuildingGroup key={type} type={type} buildings={typeBuildings} />
      ))}
    </group>
  );
}

function InstancedBuildingGroup({ type, buildings }: { type: BuildingType; buildings: BuildingDef[] }) {
  useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  
  // Get consistent dimensions for this building type
  const baseWidth = buildings[0]?.width ?? 10;
  const baseHeight = buildings[0]?.height ?? 10;
  const baseDepth = buildings[0]?.depth ?? 10;
  
  useMemo(() => {
    if (!meshRef.current) return;
    
    buildings.forEach((building, i) => {
      dummy.position.copy(building.position);
      dummy.rotation.y = building.rotation;
      dummy.scale.set(
        building.width / baseWidth,
        building.height / baseHeight,
        building.depth / baseDepth
      );
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
      
      // Set color
      const color = new THREE.Color(building.color);
      meshRef.current!.setColorAt(i, color);
    });
    
    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;
  }, [buildings, baseWidth, baseHeight, baseDepth, dummy]);
  
  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined, undefined, buildings.length]}
      castShadow
      receiveShadow
    >
      <boxGeometry args={[baseWidth, baseHeight, baseDepth]} />
      <meshStandardMaterial roughness={0.65} metalness={0.1} />
    </instancedMesh>
  );
}

// ============================================================================
// INDIVIDUAL BUILDING RENDERER - For special/landmark buildings
// ============================================================================

interface BuildingProps {
  building: BuildingDef;
  detailed?: boolean;
}

export function Building({ building, detailed = false }: BuildingProps) {
  const { width, height, depth, color, position, rotation } = building;
  
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {/* Main structure */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial color={color} roughness={0.65} metalness={0.1} />
      </mesh>
      
      {/* Windows for taller buildings */}
      {detailed && height > 20 && (
        <Windows width={width} height={height} depth={depth} color={color} />
      )}
      
      {/* Roof detail */}
      {height > 40 && (
        <mesh position={[0, height / 2 + 0.1, 0]}>
          <boxGeometry args={[width * 0.9, 0.2, depth * 0.9]} />
          <meshStandardMaterial color="#555" roughness={0.5} />
        </mesh>
      )}
    </group>
  );
}

function Windows({ width, height, depth, color }: { width: number; height: number; depth: number; color: string }) {
  const isLight = useMemo(() => {
    const c = new THREE.Color(color);
    return c.r + c.g + c.b > 1.5;
  }, [color]);
  
  const windowRows = Math.floor(height / 4);
  const windowCols = Math.floor(width / 5);
  
  return (
    <group>
      {Array.from({ length: windowRows }).map((_, row) =>
        Array.from({ length: windowCols }).map((_, col) => (
          <mesh
            key={`${row}-${col}`}
            position={[
              -width / 2 + 3 + col * 5,
              -height / 2 + 4 + row * 4,
              depth / 2 + 0.05,
            ]}
          >
            <planeGeometry args={[2, 2.5]} />
            <meshStandardMaterial
              color={isLight ? '#4A6FA5' : '#6B8BC4'}
              roughness={0.1}
              metalness={0.3}
              transparent
              opacity={0.7}
            />
          </mesh>
        ))
      )}
    </group>
  );
}

// ============================================================================
// TREE RENDERERS
// ============================================================================

interface TreesProps {
  trees: TreeDef[];
}

export function Trees({ trees }: TreesProps) {
  // Group trees by type for efficient rendering
  const treesByType = useMemo(() => {
    const groups = new Map<TreeType, TreeDef[]>();
    trees.forEach(t => {
      if (!groups.has(t.type)) groups.set(t.type, []);
      groups.get(t.type)!.push(t);
    });
    return groups;
  }, [trees]);
  
  return (
    <group>
      {Array.from(treesByType.entries()).map(([type, typeTrees]) => (
        <group key={type}>
          {typeTrees.map((tree, i) => (
            <Tree key={i} tree={tree} />
          ))}
        </group>
      ))}
    </group>
  );
}

function Tree({ tree }: { tree: TreeDef }) {
  const { position, scale, type } = tree;
  
  switch (type) {
    case TreeType.PALM:
      return <PalmTree position={position} scale={scale} />;
    case TreeType.OAK:
      return <OakTree position={position} scale={scale} />;
    case TreeType.PINE:
      return <PineTree position={position} scale={scale} />;
    case TreeType.MAPLE:
      return <MapleTree position={position} scale={scale} />;
    case TreeType.BUSH:
      return <Bush position={position} scale={scale} />;
    case TreeType.SHRUB:
      return <Shrub position={position} scale={scale} />;
    default:
      return <OakTree position={position} scale={scale} />;
  }
}

function PalmTree({ position, scale }: { position: THREE.Vector3; scale: number }) {
  return (
    <group position={position}>
      {/* Trunk */}
      <mesh position={[0, scale * 2, 0]} castShadow>
        <cylinderGeometry args={[0.12 * scale, 0.2 * scale, scale * 4, 6]} />
        <meshStandardMaterial color="#8B6914" roughness={0.8} />
      </mesh>
      {/* Fronds */}
      {[0, Math.PI / 2, Math.PI, Math.PI * 1.5].map((rot, i) => (
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

function OakTree({ position, scale }: { position: THREE.Vector3; scale: number }) {
  return (
    <group position={position}>
      {/* Trunk */}
      <mesh position={[0, scale * 1.5, 0]} castShadow>
        <cylinderGeometry args={[0.2 * scale, 0.3 * scale, scale * 3, 7]} />
        <meshStandardMaterial color="#4A3520" roughness={0.9} />
      </mesh>
      {/* Foliage layers */}
      <mesh position={[0, scale * 3.5, 0]} castShadow>
        <sphereGeometry args={[scale * 2, 7, 7]} />
        <meshStandardMaterial color="#3A7D34" roughness={0.7} flatShading />
      </mesh>
      <mesh position={[0, scale * 4.5, 0]} castShadow>
        <sphereGeometry args={[scale * 1.5, 6, 6]} />
        <meshStandardMaterial color="#4A8D44" roughness={0.7} flatShading />
      </mesh>
    </group>
  );
}

function PineTree({ position, scale }: { position: THREE.Vector3; scale: number }) {
  return (
    <group position={position}>
      {/* Trunk */}
      <mesh position={[0, scale * 1, 0]} castShadow>
        <cylinderGeometry args={[0.1 * scale, 0.15 * scale, scale * 2, 6]} />
        <meshStandardMaterial color="#3D2817" roughness={0.9} />
      </mesh>
      {/* Cone layers */}
      {[0, 1, 2].map((i) => (
        <mesh key={i} position={[0, scale * (2.5 + i * 1.2), 0]} castShadow>
          <coneGeometry args={[scale * (1.5 - i * 0.3), scale * 2, 7]} />
          <meshStandardMaterial color="#2D5A27" roughness={0.7} flatShading />
        </mesh>
      ))}
    </group>
  );
}

function MapleTree({ position, scale }: { position: THREE.Vector3; scale: number }) {
  return (
    <group position={position}>
      {/* Trunk */}
      <mesh position={[0, scale * 1.8, 0]} castShadow>
        <cylinderGeometry args={[0.15 * scale, 0.25 * scale, scale * 3.5, 6]} />
        <meshStandardMaterial color="#5C4030" roughness={0.85} />
      </mesh>
      {/* Rounded canopy */}
      <mesh position={[0, scale * 4, 0]} castShadow>
        <dodecahedronGeometry args={[scale * 1.8, 1]} />
        <meshStandardMaterial color="#5A8F3A" roughness={0.65} flatShading />
      </mesh>
    </group>
  );
}

function Bush({ position, scale }: { position: THREE.Vector3; scale: number }) {
  return (
    <mesh position={position} castShadow>
      <sphereGeometry args={[scale * 0.8, 6, 6]} />
      <meshStandardMaterial color="#3A6B2E" roughness={0.75} />
    </mesh>
  );
}

function Shrub({ position, scale }: { position: THREE.Vector3; scale: number }) {
  return (
    <group position={position}>
      {Array.from({ length: 3 }).map((_, i) => (
        <mesh key={i} position={[(i - 1) * 0.3 * scale, 0, 0]} castShadow>
          <sphereGeometry args={[scale * 0.4, 5, 5]} />
          <meshStandardMaterial color="#4A7B3E" roughness={0.7} />
        </mesh>
      ))}
    </group>
  );
}

// ============================================================================
// ROAD RENDERER
// ============================================================================

interface RoadsProps {
  roads: RoadSegment[];
  lineColor?: string;
  roadColor?: string;
}

export function Roads({ roads, lineColor = '#FBBF24', roadColor = '#2A2A2A' }: RoadsProps) {
  return (
    <group>
      {roads.map((road, i) => (
        <RoadSegmentMesh
          key={i}
          road={road}
          lineColor={lineColor}
          roadColor={roadColor}
        />
      ))}
    </group>
  );
}

function RoadSegmentMesh({ road, lineColor, roadColor }: { road: RoadSegment; lineColor: string; roadColor: string }) {
  const length = road.start.distanceTo(road.end);
  const midPoint = new THREE.Vector3().addVectors(road.start, road.end).multiplyScalar(0.5);
  const angle = Math.atan2(road.end.x - road.start.x, road.end.z - road.start.z);
  
  return (
    <group position={midPoint} rotation={[0, angle, 0]}>
      {/* Road surface */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} receiveShadow>
        <planeGeometry args={[road.width, length]} />
        <meshStandardMaterial color={roadColor} roughness={0.9} />
      </mesh>
      
      {/* Center line(s) */}
      {road.lanes >= 2 && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
          <planeGeometry args={[road.hasMedian ? 2 : 0.2, length * 0.9]} />
          <meshStandardMaterial color={lineColor} roughness={0.8} />
        </mesh>
      )}
      
      {/* Edge lines */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[road.width / 2 - 0.3, 0.02, 0]}>
        <planeGeometry args={[0.15, length]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.9} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-road.width / 2 + 0.3, 0.02, 0]}>
        <planeGeometry args={[0.15, length]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.9} />
      </mesh>
      
      {/* Sidewalks */}
      {road.hasSidewalk && (
        <>
          <mesh position={[road.width / 2 + 0.5, 0.05, 0]}>
            <boxGeometry args={[1, 0.1, length]} />
            <meshStandardMaterial color="#888" roughness={0.8} />
          </mesh>
          <mesh position={[-road.width / 2 - 0.5, 0.05, 0]}>
            <boxGeometry args={[1, 0.1, length]} />
            <meshStandardMaterial color="#888" roughness={0.8} />
          </mesh>
        </>
      )}
    </group>
  );
}

// ============================================================================
// ZONE VISUALIZATION (Debug/Overlay)
// ============================================================================

interface ZoneOverlayProps {
  zones: Map<string, { zoneType: ZoneType; blockSize: number }>;
  showGrid?: boolean;
}

export function ZoneOverlay({ zones, showGrid = false }: ZoneOverlayProps) {
  const zoneColors: Record<ZoneType, string> = {
    downtown: '#FF6B6B',
    commercial: '#4ECDC4',
    industrial: '#95A5A6',
    residential: '#95E1A3',
    park: '#7ED957',
    waterfront: '#74B9FF',
  };
  
  return (
    <group>
      {Array.from(zones.entries()).map(([key, zone], i) => {
        const [x, z] = key.split(',').map(Number);
        return (
          <mesh
            key={key}
            rotation={[-Math.PI / 2, 0, 0]}
            position={[x + zone.blockSize / 2, 0.5, z + zone.blockSize / 2]}
          >
            <planeGeometry args={[zone.blockSize, zone.blockSize]} />
            <meshBasicMaterial
              color={zoneColors[zone.zoneType]}
              transparent
              opacity={showGrid ? 0.15 : 0}
              side={THREE.DoubleSide}
            />
          </mesh>
        );
      })}
    </group>
  );
}

// ============================================================================
// COMPLETE CITY SCENE
// ============================================================================

interface CitySceneProps {
  buildings: BuildingDef[];
  trees: TreeDef[];
  roads: RoadSegment[];
  zones?: Map<string, { zoneType: ZoneType; blockSize: number }>;
  showZoneOverlay?: boolean;
  groundColor?: string;
  roadColor?: string;
  lineColor?: string;
}

export function CityScene({
  buildings,
  trees,
  roads,
  zones,
  showZoneOverlay = false,
  groundColor = '#4A5A3A',
  roadColor = '#252525',
  lineColor = '#FBBF24',
}: CitySceneProps) {
  // Calculate bounds for ground plane
  const groundSize = useMemo(() => {
    let minX = Infinity, maxX = -Infinity, minZ = Infinity, maxZ = -Infinity;
    
    roads.forEach(road => {
      minX = Math.min(minX, road.start.x, road.end.x);
      maxX = Math.max(maxX, road.start.x, road.end.x);
      minZ = Math.min(minZ, road.start.z, road.end.z);
      maxZ = Math.max(maxZ, road.start.z, road.end.z);
    });
    
    return Math.max(maxX - minX, maxZ - minZ) + 100;
  }, [roads]);
  
  return (
    <>
      {/* Ground plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]} receiveShadow>
        <planeGeometry args={[groundSize, groundSize]} />
        <meshStandardMaterial color={groundColor} roughness={0.95} />
      </mesh>
      
      {/* Roads */}
      <Roads roads={roads} roadColor={roadColor} lineColor={lineColor} />
      
      {/* Buildings */}
      <InstancedBuildings buildings={buildings} />
      
      {/* Trees */}
      <Trees trees={trees} />
      
      {/* Zone overlay (optional debug visualization) */}
      {zones && showZoneOverlay && <ZoneOverlay zones={zones} showGrid />}
    </>
  );
}
