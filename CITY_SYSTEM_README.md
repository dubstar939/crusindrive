# CrusinDrive - Open World City System

## Overview

This implementation adds a **modular 3D open-world city environment** for the low-poly JDM street-racing game "CrusinDrive". The system features:

- **6x6 grid-based city layout** with interconnected streets
- **4 distinct districts**: Downtown, Industrial, Coastal, Residential
- **Procedurally generated buildings, props, and decorations**
- **Road graph system** for AI navigation (ready for traffic)
- **Checkpoint/route system** with "City Loop" route
- **Drift zones** in open areas around the city
- **Low-poly art style** optimized for mobile/PC

## Architecture

### Core Systems

1. **CityBlock System** (`generateCityLayout`)
   - Creates a grid of city blocks (6x6 = 36 blocks)
   - Each block has a type: straight, intersection, or curve
   - Blocks form a connected street network with an outer loop

2. **Road Graph** (`generateRoadGraph`)
   - Nodes at each block center
   - Connections between adjacent blocks
   - Used for AI pathfinding (traffic system ready)

3. **Route System** (`createCityLoopRoute`)
   - Checkpoints around the city perimeter
   - Lap counting and completion detection
   - Extendable for multiple routes

4. **District System**
   - Downtown: High density, tall buildings, 40 km/h
   - Industrial: Medium density, 50 km/h
   - Coastal: Low density, palm trees, 60 km/h
   - Residential: Medium density, 35 km/h

## File Structure

```
src/
├── components/
│   ├── Game.tsx          # Main game component with city generation
│   └── UI.tsx            # UI overlay (speed, district, laps)
├── utils/                # (Optional) Helper utilities
└── App.tsx               # App entry point
```

## Key Data Structures

### CityBlockData
```typescript
interface CityBlockData {
  id: string;              // Unique identifier
  gridX: number;           // Grid X position (-3 to 2)
  gridZ: number;           // Grid Z position (-3 to 2)
  blockType: BlockType;    // Type of road segment
  rotation: number;        // Rotation in radians
  hasBuildings: boolean;   // Whether this block has buildings
  buildingDensity: number; // 0.0 to 1.0
  speedLimit: number;      // Speed limit in km/h
  districtName: string;    // District name
}
```

### RoadNode
```typescript
interface RoadNode {
  id: string;              // Unique identifier
  position: Vector3;       // World position
  connections: string[];   // IDs of connected nodes
  speedLimit: number;      // Speed limit
  nodeType: NodeType;      // intersection | waypoint | start_finish
}
```

### Route & Checkpoint
```typescript
interface Checkpoint {
  index: number;
  position: Vector3;
  radius: number;
  routeId: string;
  passed: boolean;
}

interface Route {
  id: string;
  name: string;
  checkpoints: Checkpoint[];
  lapDistance: number;
}
```

## How It Works

### City Generation Flow

1. **Grid Layout** → `generateCityLayout()` creates 36 blocks
2. **Block Types** → Assigned based on position from center
   - Center (dist < 2): 4-way intersections
   - Mid (dist 2-4): Mix of intersections and straights
   - Outer (dist > 4): Straights and curves forming loop
3. **Road Graph** → `generateRoadGraph()` connects adjacent blocks
4. **Route** → `createCityLoopRoute()` creates checkpoint loop
5. **Props** → Buildings, trees, lights placed per district rules
6. **Render** → All segments rendered as road pieces

### Rendering Pipeline

```
Game Component
├── Sky & Lighting (time/weather based)
├── Ground Plane
├── Road Segments (from city blocks)
├── Buildings & Props
├── Mountains (background)
├── Drift Zones
├── Checkpoints (visual markers)
└── Player Vehicle
```

### Physics Loop

Every frame (`useFrame`):
1. Read input (WASD/arrows)
2. Apply acceleration/braking
3. Calculate steering
4. Update position & rotation
5. Check drift zone collisions
6. Detect checkpoint triggers
7. Track current district
8. Update camera follow

## Customization Guide

### Adjusting City Size

```typescript
// In Game.tsx, modify:
const CITY_GRID_SIZE = 6;  // Change to 8 for larger city
const BLOCK_SIZE = 100;     // Change block spacing
```

### Adding New Districts

```typescript
// Add to DISTRICTS object:
suburban: { 
  name: 'Suburban', 
  buildingDensity: 0.4, 
  speedLimit: 45, 
  color: '#AABBCC' 
},

// Update district assignment logic in generateCityLayout()
```

### Creating New Routes

```typescript
const createCustomRoute = (nodes: RoadNode[]): Route => {
  const checkpoints: Checkpoint[] = [];
  
  // Select nodes for your route
  const routeNodes = nodes.filter(n => /* your criteria */);
  
  routeNodes.forEach((node, index) => {
    checkpoints.push({
      index,
      position: node.position.clone(),
      radius: 25,
      routeId: 'custom_route',
      passed: false,
    });
  });
  
  return {
    id: 'custom_route',
    name: 'Custom Route',
    checkpoints,
    lapDistance: routeNodes.length * BLOCK_SIZE,
  };
};
```

### Modifying Building Placement

```typescript
// In the prop generation section of useMemo():
blocks.forEach(block => {
  if (!block.hasBuildings) return;
  
  const numBuildings = Math.floor(4 * block.buildingDensity);
  // Adjust multiplier (4) for more/fewer buildings
  
  for (let i = 0; i < numBuildings; i++) {
    // Customize placement logic here
  }
});
```

## Performance Optimization

The system is optimized for low-poly rendering:

1. **Simple Geometry**: Box/cylinder/cone primitives only
2. **Batched Rendering**: Grouped by type (buildings, roads, etc.)
3. **Limited Draw Calls**: ~100-200 total objects
4. **No Textures**: Vertex colors only
5. **Simple Shadows**: Single directional light

### Mobile Considerations

- Reduce `CITY_GRID_SIZE` to 4 for smaller maps
- Lower building count multiplier
- Reduce mountain count (currently 20)
- Use simpler vehicle models

## Future Extensions

### Traffic System (Ready for Implementation)

The road graph is already set up for AI traffic:

```typescript
// Example traffic spawner (pseudo-code)
function spawnTraffic(nodes: RoadNode[]) {
  nodes.forEach(node => {
    if (Math.random() < 0.3) {
      // Spawn AI car at node
      // Follow node.connections for pathfinding
    }
  });
}
```

### Mini-map

Use the grid system for a mini-map:
```typescript
const minimapPosition = {
  x: (playerX / CITY_GRID_SIZE / BLOCK_SIZE) + 0.5,
  y: (playerZ / CITY_GRID_SIZE / BLOCK_SIZE) + 0.5,
};
```

### Dynamic Time/Weather

Already supported via props:
- `timeOfDay`: dawn, noon, sunset, midnight
- `weather`: clear, rain, fog, overcast

### Multiplayer Hooks

The modular structure supports multiplayer:
- Sync `positionRef.current` across network
- Replicate other players as additional vehicle meshes
- Use road graph for shared checkpoints

## Testing

### Run Locally

```bash
npm install
npm run dev
```

### Build for Production

```bash
npm run build
```

### Test Different Configurations

1. **Vehicle Types**: Evo, WRX, Impreza, Sportbike, Bus
2. **Environments**: Coastal, Mountain, City
3. **Time/Weather**: All combinations
4. **Camera Modes**: 3 different follow modes

## Troubleshooting

### Issue: Buildings not appearing
**Solution**: Check `hasBuildings` flag and `buildingDensity` values

### Issue: Checkpoints not triggering
**Solution**: Verify checkpoint radius (default 30) matches vehicle speed

### Issue: Performance issues
**Solution**: Reduce `CITY_GRID_SIZE`, building count, or mountain count

### Issue: Car gets stuck
**Solution**: Adjust physics params in `VEHICLE_CONFIGS`

## Code Quality Notes

- ✅ Modular functions with single responsibilities
- ✅ TypeScript interfaces for all data structures
- ✅ Clear comments explaining complex logic
- ✅ No external dependencies beyond React Three Fiber
- ✅ Serializable configuration objects
- ✅ Event hooks ready for UI/audio integration

## API Reference

### Public Events (Ready to Hook)

These can be wired to UI/audio systems:

```typescript
// District entry (called when entering new district)
setCurrentDistrict(districtName);

// Checkpoint passed (in physics loop)
if (distToCheckpoint < checkpoint.radius) {
  // Trigger: OnEnterCheckpoint(index)
}

// Lap completed
if (nextIndex === 0) {
  setLapCount(l => l + 1);
  // Trigger: OnRouteCompleted(routeId)
}
```

---

**Built with ❤️ for JDM street racing enthusiasts**
