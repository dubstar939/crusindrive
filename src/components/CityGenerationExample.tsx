/**
 * CityGenerationExample.tsx
 * 
 * Example demonstrating how to use the CityMapGenerator with React Three Fiber.
 * This shows a complete integration of the procedural city generation system.
 */

import { useMemo, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment } from '@react-three/drei';
import { CityMapGenerator, CityConfig, getDefaultConfig, BuildingDef } from '../utils/CityMapGenerator';
import { CityScene } from './CityRenderer';

// ============================================================================
// EXAMPLE CITY GENERATOR COMPONENT
// ============================================================================

interface CityGenerationExampleProps {
  seed?: number;
  showDebugOverlay?: boolean;
}

export function CityGenerationExample({ 
  seed = 12345, 
  showDebugOverlay = false 
}: CityGenerationExampleProps) {
  const waterPresent = true;
  
  // Generate city data (memoized to avoid regeneration on re-renders)
  const cityData = useMemo(() => {
    const config: CityConfig = {
      ...getDefaultConfig(),
      seed,
      mapSize: 500,
      downtownSize: 120,
      waterPresent,
      waterSide: 'south' as const,
      industrialZone: 'north' as const,
    };
    
    const generator = new CityMapGenerator(config);
    return generator.generate();
  }, [seed]);
  
  console.log('Generated city:', {
    buildings: cityData.buildings.length,
    trees: cityData.trees.length,
    roads: cityData.roads.length,
    zones: cityData.zones.size,
  });
  
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Canvas shadows>
        <PerspectiveCamera makeDefault position={[100, 80, 100]} fov={60} />
        <OrbitControls 
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          maxPolarAngle={Math.PI / 2 - 0.05}
          minDistance={20}
          maxDistance={500}
        />
        
        {/* Lighting */}
        <ambientLight intensity={0.4} />
        <directionalLight
          position={[100, 150, 50]}
          intensity={1.2}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-left={-200}
          shadow-camera-right={200}
          shadow-camera-top={200}
          shadow-camera-bottom={-200}
        />
        
        {/* Sky/Environment */}
        <Environment preset="city" />
        
        {/* Generated City */}
        <CityScene
          buildings={cityData.buildings}
          trees={cityData.trees}
          roads={cityData.roads}
          zones={cityData.zones}
          showZoneOverlay={showDebugOverlay}
          groundColor="#4A5A3A"
          roadColor="#252525"
          lineColor="#FBBF24"
        />
        
        {/* Water (if present) */}
        {waterPresent && (
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.2, 300]}>
            <planeGeometry args={[1000, 200]} />
            <meshStandardMaterial 
              color="#4A90D9" 
              roughness={0.2} 
              metalness={0.8}
              transparent
              opacity={0.8}
            />
          </mesh>
        )}
      </Canvas>
    </div>
  );
}

// ============================================================================
// INTERACTIVE CITY BUILDER WITH CONTROLS
// ============================================================================

interface InteractiveCityBuilderProps {
  initialSeed?: number;
}

export function InteractiveCityBuilder({ initialSeed = 42 }: InteractiveCityBuilderProps) {
  const [seed, setSeed] = useState(initialSeed);
  const [mapSize, setMapSize] = useState(400);
  const [downtownSize, setDowntownSize] = useState(100);
  const [waterPresent, setWaterPresent] = useState(true);
  const [showZones, setShowZones] = useState(false);
  const [buildingCount, setBuildingCount] = useState(0);
  const [treeCount, setTreeCount] = useState(0);
  
  const cityData = useMemo(() => {
    const config: CityConfig = {
      seed,
      mapSize,
      downtownSize,
      waterPresent,
      waterSide: 'south' as const,
      industrialZone: 'north' as const,
    };
    
    const generator = new CityMapGenerator(config);
    const data = generator.generate();
    
    setBuildingCount(data.buildings.length);
    setTreeCount(data.trees.length);
    
    return data;
  }, [seed, mapSize, downtownSize, waterPresent]);
  
  const handleRandomize = () => {
    setSeed(Math.floor(Math.random() * 2147483647));
  };
  
  return (
    <>
      {/* Control Panel */}
      <div style={{
        position: 'absolute',
        top: 20,
        left: 20,
        background: 'rgba(0,0,0,0.7)',
        color: 'white',
        padding: '20px',
        borderRadius: '8px',
        fontFamily: 'Quicksand, sans-serif',
        minWidth: '250px',
        zIndex: 100,
      }}>
        <h2 style={{ margin: '0 0 15px 0', fontSize: '18px' }}>🏙️ City Generator</h2>
        
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px' }}>
            Seed: {seed}
          </label>
          <button
            onClick={handleRandomize}
            style={{
              width: '100%',
              padding: '8px',
              background: '#4A90D9',
              border: 'none',
              borderRadius: '4px',
              color: 'white',
              cursor: 'pointer',
              fontSize: '14px',
            }}
          >
            🎲 Randomize
          </button>
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px' }}>
            Map Size: {mapSize}m
          </label>
          <input
            type="range"
            min="200"
            max="800"
            step="50"
            value={mapSize}
            onChange={(e) => setMapSize(Number(e.target.value))}
            style={{ width: '100%' }}
          />
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px' }}>
            Downtown Size: {downtownSize}m
          </label>
          <input
            type="range"
            min="50"
            max="200"
            step="10"
            value={downtownSize}
            onChange={(e) => setDowntownSize(Number(e.target.value))}
            style={{ width: '100%' }}
          />
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'flex', alignItems: 'center', fontSize: '12px' }}>
            <input
              type="checkbox"
              checked={waterPresent}
              onChange={(e) => setWaterPresent(e.target.checked)}
              style={{ marginRight: '8px' }}
            />
            Waterfront
          </label>
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'flex', alignItems: 'center', fontSize: '12px' }}>
            <input
              type="checkbox"
              checked={showZones}
              onChange={(e) => setShowZones(e.target.checked)}
              style={{ marginRight: '8px' }}
            />
            Show Zone Overlay
          </label>
        </div>
        
        <div style={{ 
          borderTop: '1px solid rgba(255,255,255,0.2)', 
          paddingTop: '10px',
          fontSize: '11px',
        }}>
          <div>🏢 Buildings: {buildingCount}</div>
          <div>🌳 Trees: {treeCount}</div>
          <div>🛣️ Roads: {cityData.roads.length}</div>
          <div>📍 Zones: {cityData.zones.size}</div>
        </div>
      </div>
      
      {/* 3D Canvas */}
      <div style={{ width: '100vw', height: '100vh' }}>
        <Canvas shadows>
          <PerspectiveCamera makeDefault position={[150, 100, 150]} fov={55} />
          <OrbitControls 
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            maxPolarAngle={Math.PI / 2 - 0.05}
            minDistance={30}
            maxDistance={600}
          />
          
          <ambientLight intensity={0.5} />
          <directionalLight
            position={[150, 200, 100]}
            intensity={1.3}
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
            shadow-camera-left={-300}
            shadow-camera-right={300}
            shadow-camera-top={300}
            shadow-camera-bottom={-300}
          />
          
          <Environment preset="city" />
          
          <CityScene
            buildings={cityData.buildings}
            trees={cityData.trees}
            roads={cityData.roads}
            zones={cityData.zones}
            showZoneOverlay={showZones}
          />
          
          {/* Water plane */}
          {waterPresent && (
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.2, mapSize / 2 + 20]}>
              <planeGeometry args={[mapSize * 2, 150]} />
              <meshStandardMaterial 
                color="#4A90D9" 
                roughness={0.2} 
                metalness={0.8}
                transparent
                opacity={0.85}
              />
            </mesh>
          )}
        </Canvas>
      </div>
    </>
  );
}

// ============================================================================
// BUILDING TYPE SHOWCASE - Demonstrates variety
// ============================================================================

export function BuildingTypeShowcase() {
  const showcaseBuildings = useMemo(() => {
    // Create example buildings of each type for demonstration
    const types = [
      { type: 'skyscraper', w: 30, h: 100, d: 30, color: '#4A5568' },
      { type: 'office_tower', w: 25, h: 60, d: 25, color: '#5A6B7C' },
      { type: 'strip_mall', w: 100, h: 15, d: 30, color: '#D4A574' },
      { type: 'gas_station', w: 50, h: 10, d: 50, color: '#CC3333' },
      { type: 'warehouse', w: 80, h: 25, d: 80, color: '#6B7B8B' },
      { type: 'single_family', w: 15, h: 10, d: 15, color: '#F5E6D3' },
      { type: 'apartment_mid', w: 40, h: 40, d: 30, color: '#B89564' },
      { type: 'restaurant', w: 35, h: 18, d: 35, color: '#8B4513' },
    ];
    
    return types.map((t, i) => ({
      type: t.type as any,
      width: t.w,
      height: t.h,
      depth: t.d,
      color: t.color,
      position: { x: (i % 4) * 60 - 90, y: t.h / 2, z: Math.floor(i / 4) * 60 - 30 },
      rotation: 0,
      footprint: null,
    })) as unknown as BuildingDef[];
  }, []);
  
  return (
    <Canvas camera={{ position: [100, 80, 100], fov: 50 }}>
      <OrbitControls enablePan enableZoom enableRotate />
      <ambientLight intensity={0.6} />
      <directionalLight position={[50, 100, 50]} intensity={1} castShadow />
      
      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[300, 100]} />
        <meshStandardMaterial color="#4A5A3A" />
      </mesh>
      
      {/* Showcase buildings */}
      {showcaseBuildings.map((b, i) => (
        <group key={i} position={[b.position.x, b.position.y, b.position.z]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[b.width, b.height, b.depth]} />
            <meshStandardMaterial color={b.color} />
          </mesh>
          {/* Label */}
          <mesh position={[0, -5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[40, 8]} />
            <meshBasicMaterial color="#333" />
          </mesh>
        </group>
      ))}
    </Canvas>
  );
}

export default CityGenerationExample;
