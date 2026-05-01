# Cyberpunk City Asset Generation System

## Complete Documentation for Low-Poly Futuristic City Assets

Based on real U.S. city patterns from: **Pensacola, Tampa, Houston, Atlanta, Dallas, Los Angeles**

---

## A. ASSET LIST

### Buildings (30+ Types)

#### Downtown Zone
| Type | Dimensions (W×H×D) | Roof Type | Neon Colors | Description |
|------|-------------------|-----------|-------------|-------------|
| Skyscraper | 25-40 × 80-150 × 25-40 | Flat | Cyan, Magenta, Green | Tall glass towers |
| Office Tower | 20-35 × 40-80 × 20-35 | Flat | Cyan, Blue | Mid-rise offices |
| High-Rise Apt | 25-40 × 50-100 × 20-30 | Flat | Orange, Amber | Residential towers |
| Park Structure | 40-80 × 30-50 × 40-80 | Flat | Green, Yellow | Multi-level parking |
| Landmark Tower | 40-80 × 100-180 × 40-80 | Curved | Magenta, Cyan, Red | Iconic buildings |

#### Commercial Zone
| Type | Dimensions (W×H×D) | Roof Type | Neon Colors | Description |
|------|-------------------|-----------|-------------|-------------|
| Strip Mall | 80-150 × 12-20 × 25-40 | Flat | Red, Yellow, Green | Row of shops |
| Big Box Store | 100-200 × 20-35 × 60-100 | Flat | Red, Blue | Large retail |
| Gas Station | 40-60 × 8-12 × 40-60 | Shed | Red, Yellow, Green | Fuel station |
| Fast Food | 25-40 × 10-15 × 25-35 | Gabled | Red, Yellow | Quick service |
| Restaurant | 30-50 × 12-25 × 30-50 | Hip | Orange, Pink, Cyan | Dining |
| Motel | 60-100 × 15-25 × 30-45 | Flat | Cyan, Magenta, Yellow | Budget lodging |
| Convenience Store | 30-50 × 10-15 × 25-35 | Flat | Green, Yellow, Red | Corner store |
| Auto Dealer | 60-100 × 12-20 × 40-60 | Shed | Red, Blue | Car sales |
| Coffee Shop | 20-35 × 10-15 × 20-30 | Gabled | Green, Orange | Cafe |

#### Industrial Zone
| Type | Dimensions (W×H×D) | Roof Type | Neon Colors | Description |
|------|-------------------|-----------|-------------|-------------|
| Warehouse | 60-120 × 20-40 × 60-120 | Gabled | Yellow, Red | Storage |
| Factory | 80-150 × 30-60 × 60-100 | Gabled | Orange, Yellow | Manufacturing |
| Distribution Center | 100-200 × 25-45 × 80-150 | Flat | Yellow, Green | Logistics |
| Loading Dock | 40-80 × 15-25 × 30-50 | Flat | Yellow | Shipping |
| Storage Unit | 30-60 × 10-15 × 30-60 | Shed | Red | Self-storage |

#### Residential Zone
| Type | Dimensions (W×H×D) | Roof Type | Neon | Description |
|------|-------------------|-----------|------|-------------|
| Single Family | 12-20 × 8-15 × 12-20 | Gabled | No | House |
| Duplex | 20-30 × 10-18 × 15-25 | Gabled | No | Two-unit |
| Apartment Low | 30-50 × 20-35 × 20-35 | Flat | Cyan | Small complex |
| Apartment Mid | 35-55 × 35-55 × 25-40 | Flat | Cyan, Magenta | Medium complex |
| Townhouse | 15-25 × 15-25 × 15-25 | Hip | No | Row house |
| Mansion | 35-55 × 20-35 × 30-50 | Hip | No | Luxury home |
| Trailer | 8-12 × 6-8 × 20-30 | Curved | No | Mobile home |

#### Special/Infrastructure
| Type | Dimensions (W×H×D) | Roof Type | Neon Colors | Description |
|------|-------------------|-----------|-------------|-------------|
| Stadium | 150-250 × 40-60 × 150-250 | Curved | Green, Yellow, Blue | Sports venue |
| Mall | 150-300 × 25-40 × 100-200 | Flat | Magenta, Cyan, Yellow | Shopping center |
| Hospital | 80-150 × 40-80 × 50-100 | Flat | Red | Medical center |
| School | 60-120 × 20-40 × 40-80 | Flat | None | Education |
| Police Station | 40-70 × 15-25 × 30-50 | Flat | Blue, Red | Law enforcement |
| Fire Station | 40-70 × 15-25 × 30-50 | Flat | Red | Emergency services |
| Parking Lot | 50-100 × 1 × 50-100 | Flat | None | Surface parking |

---

### Vegetation (7 Types)

| Type | Scale Range | Regions | Description |
|------|-------------|---------|-------------|
| Palm | 0.7-1.3 | FL, TX, CA coastal | Tropical palms |
| Oak | 0.7-1.3 | Atlanta, Houston | Large shade trees |
| Pine | 0.7-1.3 | Tampa, Pensacola | Evergreen pines |
| Maple | 0.7-1.3 | Northern cities | Deciduous |
| Cypress | 0.7-1.3 | Southern wetlands | Swamp trees |
| Bush | 0.7-1.3 | All zones | Shrubs |
| Shrub | 0.7-1.3 | All zones | Low vegetation |

---

### Street Props (16 Types)

| Prop | Zones | Description |
|------|-------|-------------|
| Streetlight | All | Basic illumination |
| Neon Sign | Downtown, Commercial, Waterfront | Glowing signs |
| Billboard | Downtown, Commercial | Large advertisements |
| Bench | Parks, Downtown, Waterfront | Seating |
| Trash Can | All | Waste disposal |
| Bus Stop | Downtown, Commercial | Transit shelter |
| Vending Machine | Commercial | Automated retail |
| Power Transformer | Industrial | Electrical equipment |
| Fire Hydrant | All | Emergency water |
| Mailbox | Residential | Postal service |
| Traffic Light | All intersections | Signal control |
| Stop Sign | Residential | Traffic control |
| Hologram Projector | Downtown | Futuristic ads |
| Security Camera | Downtown, Industrial | Surveillance |
| Bike Rack | Parks, Downtown, Residential | Bicycle parking |
| Basketball Hoop | Residential | Recreation |

---

### Vehicles (10 Types)

| Vehicle | Polycount | Description |
|---------|-----------|-------------|
| Sedan | 300-500 | Standard car |
| SUV | 400-600 | Sport utility |
| Truck | 500-800 | Pickup truck |
| Van | 400-600 | Cargo/passenger van |
| Bus | 800-1200 | Public transit |
| Delivery Truck | 600-900 | Package delivery |
| Taxi | 300-500 | Cab service |
| Police Car | 300-500 | Law enforcement |
| Cyberpunk Hover | 400-700 | Futuristic vehicle |
| Drone | 100-200 | Flying drone |

---

## B. DETAILED GENERATION RULES

### Zoning Rules

```typescript
enum ZoneType {
  DOWNTOWN = 'downtown',      // Dense urban core
  COMMERCIAL = 'commercial',  // Retail corridors
  INDUSTRIAL = 'industrial',  // Warehouses, factories
  RESIDENTIAL = 'residential',// Housing areas
  PARK = 'park',              // Green spaces
  WATERFRONT = 'waterfront',  // Coastal/river areas
}
```

### Zone Placement Logic (Based on Real Cities)

1. **Downtown Core** (Like Houston Downtown, Atlanta Midtown)
   - Center of map
   - Tight grid pattern (80-120 unit blocks)
   - Building density: 70-90%
   - Tree density: 15-30%
   - Road types: Boulevards, Main Streets

2. **Commercial Corridors** (Like LA's Wilshire, Tampa's Dale Mabry)
   - Radiating from downtown along major roads
   - Larger blocks (120-200 units)
   - Building density: 50-70%
   - Tree density: 10-20%
   - Strip malls, gas stations, restaurants

3. **Industrial Zone** (Like Houston Ship Channel area)
   - One side of city (configurable N/S/E/W)
   - Largest blocks (150-300 units)
   - Building density: 40-60%
   - Tree density: 5-10%
   - Near highways/rail lines

4. **Residential Neighborhoods** (Like Atlanta suburbs, Houston Bellaire)
   - Surrounding commercial zones
   - Medium blocks (100-180 units)
   - Building density: 30-50%
   - Tree density: 40-70%
   - Cul-de-sacs, side streets

5. **Parks** (Scattered like city parks)
   - Random placement in residential areas
   - Large blocks (200-400 units)
   - Minimal buildings (parking only)
   - High tree density: 60-90%

6. **Waterfront** (Like Pensacola Beach, Tampa Bay)
   - Map edge (configurable N/S/E/W)
   - Medium blocks (100-200 units)
   - Restaurants, hotels, parking
   - Palm trees, boardwalks

---

### Building Placement Rules

1. **NO OVERLAPPING** - Strict bounding box collision detection
2. **NO TREES ON ROADS** - Check road proximity before placing vegetation
3. **ALIGN WITH STREETS** - Buildings face roads (90% aligned, 10% varied)
4. **ZONE-APPROPRIATE** - Only place building types allowed in zone
5. **REALISTIC SPACING** - Setbacks from road edges (5-10 units)

```typescript
// Building placement algorithm
tryPlaceBuilding(blockX, blockZ, blockConfig, zoneConfig):
  maxAttempts = 10
  for attempt in 0..maxAttempts:
    buildingType = weightedRandom(zoneConfig.buildingTypes, weights)
    dimensions = BUILDING_DIMENSIONS[buildingType]
    
    width = random(dimensions.width.min, dimensions.width.max)
    height = random(dimensions.height.min, dimensions.height.max)
    depth = random(dimensions.depth.min, dimensions.depth.max)
    
    posX = blockX + margin + random(availableWidth - width)
    posZ = blockZ + margin + random(availableDepth - depth)
    
    footprint = Box3(posX - w/2, 0, posZ - d/2, posX + w/2, height, posZ + d/2)
    
    if checkCollision(footprint): continue
    if isOnRoad(posX, posZ, width, depth): continue
    
    placeBuilding(buildingType, width, height, depth, color, position, rotation)
    markOccupied(footprint)
    break
```

---

### Tree Placement Rules (CRITICAL: NO TREES IN ROADS!)

```typescript
generateTrees():
  for each zone block:
    // 1. Trees ALONG SIDEWALKS (not in road!)
    placeTreesAlongRoads(blockX, blockZ, blockConfig):
      sidewalkOffset = 8 units from road edge
      treeSpacing = 12 units
      for each side of block:
        place trees at intervals, skip corners
      
    // 2. Trees in OPEN AREAS (yards, gaps)
    placeTreesInOpenAreas(blockX, blockZ, blockConfig):
      numTrees = blockSize * treeDensity
      for each tree:
        position = random within block
        if isOnRoad(position): SKIP
        if tooCloseToBuilding(position, minDistance=5): SKIP
        placeTree(position)
    
    // 3. PARK TREES (dense, natural)
    if zoneType == PARK:
      numTrees = blockSize * treeDensity * 2
      place with variation, allow clustering
```

**Tree Placement Locations:**
- ✅ Along sidewalks (8 units from road)
- ✅ In medians (only on boulevards with medians)
- ✅ In parks (dense, natural clusters)
- ✅ In residential yards
- ❌ NEVER in road surface
- ❌ NEVER blocking intersections (skip first/last positions)
- ❌ NEVER too close to buildings (<5 units)

---

## C. LOW-POLY MODELING CONSTRAINTS

### Polygon Budgets

| Asset Category | Min Tris | Max Tris | Target |
|---------------|----------|----------|--------|
| Small Props | 50 | 300 | 150 |
| Vegetation | 100 | 500 | 250 |
| Vehicles | 300 | 1,200 | 600 |
| Small Buildings | 300 | 1,500 | 800 |
| Large Buildings | 1,500 | 4,000 | 2,500 |
| Landmarks | 2,000 | 5,000 | 3,500 |

### Topology Rules

1. **Quad-Dominant** - Use quads where possible, triangles only where necessary
2. **No Ngons** - Avoid n-gons (>4 vertices per face)
3. **Clean Edge Flow** - Follow form contours
4. **Minimal Subdivision** - Base mesh should be final resolution
5. **No Micro-Detail** - Bake details into textures when needed

### UV Mapping Rules

1. **No Stretching** - Maintain uniform texel density
2. **Efficient Packing** - 80%+ UV space utilization
3. **Consistent Orientation** - UV islands aligned to texture axes
4. **Shared UVs** - Similar elements share UV space for consistency
5. **Power-of-2 Textures** - 512×512, 1024×1024, 2048×2048

### Material Constraints

1. **1-3 Materials Max** per asset
2. **Shared Materials** across asset categories
3. **No Unique Textures** per-instance (use vertex colors or material variants)
4. **PBR Workflow**: Albedo + Roughness only (no metallic for most buildings)
5. **No Baked Lighting** - All lighting is dynamic

---

## D. CYBERPUNK NEON STYLE GUIDE

### Color Palette

#### Primary Neon Colors
| Name | Hex | Usage |
|------|-----|-------|
| Cyan | #00FFFF | Tech, corporate, futuristic |
| Magenta | #FF00FF | Entertainment, nightlife |
| Green | #00FF00 | Eco, bio, matrix-style |
| Yellow | #FFFF00 | Warning, industrial, caution |
| Orange | #FF6600 | Food, warmth, energy |
| Red | #FF0000 | Danger, emergency, passion |
| Blue | #0066FF | Corporate, police, official |
| Purple | #AA00FF | Luxury, mystery, premium |

#### Base Materials
| Material | Color Range | Roughness | Metalness |
|----------|-------------|-----------|-----------|
| Concrete | #5A5A5A - #8A8A8A | 0.8-0.95 | 0.0-0.1 |
| Glass | Tinted variants | 0.05-0.2 | 0.0-0.1 |
| Metal | #4A5568 - #A0AEC0 | 0.3-0.6 | 0.5-0.8 |
| Asphalt | #2A2A2A - #3D3D3D | 0.9-0.95 | 0.0 |
| Brick | #8B4513 - #CD853F | 0.7-0.85 | 0.0 |

### Emissive Guidelines

1. **Neon Strips** - 0.1-0.3 unit wide emissive bands
2. **Signage** - Full emissive material with neon color
3. **Windows** - Subtle emissive (0.1 intensity) for lit windows
4. **Vehicle Lights** - Bright emissive for headlights/taillights
5. **Intensity Values**:
   - Subtle accent: 0.5-1.0
   - Standard neon: 1.0-2.0
   - Bright signage: 2.0-3.0

### Styling by Zone

#### Downtown
- Heavy neon usage
- Cyan, magenta, green dominant
- Holographic projections
- Glass and steel materials
- Vertical neon strips on skyscrapers

#### Commercial
- Mixed neon (signage-focused)
- Red, yellow, orange for food
- Blue, cyan for retail
- Neon signs above storefronts
- Gas station canopy lighting

#### Industrial
- Minimal neon (yellow warning lights)
- Dark, weathered materials
- Functional lighting only
- Orange/yellow hazard stripes

#### Residential
- NO neon (except apartment accents)
- Warm interior lighting
- Subtle, realistic materials
- Porch lights, streetlights

#### Waterfront
- Cyan, blue, purple neon
- Reflective wet surfaces
- Boardwalk string lights
- Marina boat lights

---

## E. ASSET DEFINITION DATA STRUCTURE

### JSON Schema for Buildings

```json
{
  "buildingDefinitions": [
    {
      "type": "strip_mall",
      "zoneAllowlist": ["commercial", "waterfront"],
      "dimensions": {
        "width": {"min": 80, "max": 150},
        "height": {"min": 12, "max": 20},
        "depth": {"min": 25, "max": 40}
      },
      "colors": ["#D4A574", "#C49564", "#B88554", "#E0B080"],
      "roofType": "flat",
      "neonColors": ["#FF0000", "#FFFF00", "#00FF00"],
      "materialVariants": ["brick", "stucco", "concrete"],
      "propAttachments": ["neon_sign", "parking_lot", "landscaping"],
      "polyCount": {"target": 800, "max": 1500},
      "lodLevels": [
        {"distance": 0, "polyCount": 800},
        {"distance": 50, "polyCount": 400},
        {"distance": 100, "polyCount": 200}
      ]
    }
  ],
  
  "vegetationDefinitions": [
    {
      "type": "palm",
      "zones": ["waterfront", "commercial", "residential"],
      "scaleRange": {"min": 0.7, "max": 1.3},
      "placementRules": {
        "sidewalks": true,
        "medians": true,
        "parks": true,
        "roads": false
      },
      "polyCount": {"target": 250, "max": 500}
    }
  ],
  
  "propDefinitions": [
    {
      "type": "neon_sign",
      "zones": ["downtown", "commercial", "waterfront"],
      "emissiveColor": ["#FF00FF", "#00FFFF", "#FF0000"],
      "emissiveIntensity": 2.0,
      "polyCount": {"target": 150, "max": 300}
    }
  ]
}
```

---

## F. PROCEDURAL VARIATION RULES

### Building Variation

```typescript
generateBuildingVariation(baseType: BuildingType): BuildingDef {
  const base = BUILDING_DIMENSIONS[baseType];
  
  // Dimensional variation (±10%)
  const width = lerp(base.width[0], base.width[1], rng.next());
  const height = lerp(base.height[0], base.height[1], rng.next());
  const depth = lerp(base.depth[0], base.depth[1], rng.next());
  
  // Color variation
  const baseColor = rng.pick(base.colors);
  const colorVariation = rng.range(-0.1, 0.1);
  const finalColor = adjustBrightness(baseColor, colorVariation);
  
  // Roof type variation
  const roofType = base.defaultRoof ?? rng.pick([FLAT, GABLED, HIP]);
  
  // Neon accent (if applicable)
  let neonAccent = null;
  if (base.neonColors && base.neonColors.length > 0 && rng.chance(0.7)) {
    neonAccent = rng.pick(base.neonColors);
  }
  
  // Floor count (for visual detail)
  const floors = Math.floor(height / 10);
  
  return {
    type: baseType,
    width, height, depth,
    color: finalColor,
    roofType,
    neonAccent,
    floors,
    position: calculatePosition(),
    rotation: calculateRotation(),
    footprint: calculateFootprint()
  };
}
```

### Prop Scatter Variation

```typescript
generatePropScatter(zone: ZoneType, blockBounds: Box3): PropDef[] {
  const props: PropDef[] = [];
  const zoneProps = ZONE_CONFIGS[zone].propTypes ?? [];
  
  // Sidewalk props (benches, trash cans, etc.)
  const sidewalkPoints = generateSidewalkPoints(blockBounds, spacing: 20);
  sidewalkPoints.forEach(point => {
    if (rng.chance(0.3)) {
      const propType = rng.pick(zoneProps.filter(p => 
        ['bench', 'trash_can', 'streetlight'].includes(p)
      ));
      props.push({
        type: propType,
        position: point,
        rotation: rng.pick([0, Math.PI/2, Math.PI, -Math.PI/2]),
        scale: rng.range(0.9, 1.1),
      });
    }
  });
  
  // Commercial signage
  if (zone === ZoneType.COMMERCIAL || zone === ZoneType.DOWNTOWN) {
    const buildingFronts = getBuildingFrontPositions(blockBounds);
    buildingFronts.forEach(front => {
      if (rng.chance(0.5)) {
        props.push({
          type: rng.pick([PropType.NEON_SIGN, PropType.BILLBOARD]),
          position: front,
          rotation: front.rotation,
          scale: rng.range(0.8, 1.2),
          color: rng.pick(['#FF00FF', '#00FFFF', '#FF0000', '#FFFF00'])
        });
      }
    });
  }
  
  return props;
}
```

### Vehicle Traffic Generation

```typescript
generateTraffic(roads: RoadSegment[], timeOfDay: number): VehicleDef[] {
  const vehicles: VehicleDef[] = [];
  
  roads.forEach(road => {
    if (road.type === RoadType.HIGHWAY) {
      // Heavy traffic on highways
      const vehicleCount = Math.floor(road.start.distanceTo(road.end) / 30);
      for (let i = 0; i < vehicleCount; i++) {
        const t = i / vehicleCount;
        const position = lerp(road.start, road.end, t);
        position.x += rng.range(-road.width/4, road.width/4);
        
        vehicles.push({
          type: rng.pick([VehicleType.SEDAN, VehicleType.SUV, VehicleType.TRUCK]),
          position,
          rotation: Math.atan2(road.end.x - road.start.x, road.end.z - road.start.z),
          color: getRandomVehicleColor()
        });
      }
    } else if (road.type === RoadType.MAIN_STREET) {
      // Moderate traffic
      // ... similar logic
    }
  });
  
  // Time-based variations
  if (timeOfDay > 6 && timeOfDay < 9) {
    // Rush hour - more vehicles
    increaseVehicleDensity(vehicles, 1.5);
  } else if (timeOfDay > 22 || timeOfDay < 5) {
    // Night - fewer vehicles, more cyberpunk hover cars
    decreaseVehicleDensity(vehicles, 0.5);
    addCyberpunkVehicles(vehicles);
  }
  
  return vehicles;
}
```

---

## PERFORMANCE OPTIMIZATIONS

### Instancing Strategy

1. **InstancedMesh for Repetitive Assets**
   - All trees of same type → single InstancedMesh
   - Buildings grouped by type → InstancedMesh per type
   - Props batched by material

2. **LOD System**
   ```typescript
   const lodConfigs = {
     LOD0: { distance: 0, reduction: 1.0 },      // Full quality
     LOD1: { distance: 50, reduction: 0.5 },     // 50% polygons
     LOD2: { distance: 100, reduction: 0.25 },   // 25% polygons
     LOD3: { distance: 200, reduction: 0.1 },    // Billboards
   };
   ```

3. **Frustum Culling** - Built-in Three.js culling
4. **Occlusion Culling** - For dense downtown areas

### Memory Optimization

1. **Shared Geometries** - Reuse base geometries with scaling
2. **Texture Atlasing** - Combine textures where possible
3. **Dispose Unused** - Clean up off-screen assets
4. **Pool Objects** - Reuse vehicle/prop instances

### Draw Call Reduction

1. **Material Batching** - Group by material
2. **Merge Static Meshes** - Combine non-moving props
3. **Instanced Rendering** - Maximum use of instancing
4. **Target: <100 draw calls** for full city view

---

## USAGE EXAMPLE

```typescript
import { CityMapGenerator, getDefaultConfig, ZoneType } from './CityMapGenerator';

// Generate city
const config = {
  ...getDefaultConfig(),
  seed: 12345,  // Deterministic seed
  mapSize: 400,
  downtownSize: 100,
  waterPresent: true,
  waterSide: 'south',
  industrialZone: 'north',
};

const generator = new CityMapGenerator(config);
const cityData = generator.generate();

// cityData contains:
// - buildings: BuildingDef[]
// - trees: TreeDef[]
// - roads: RoadSegment[]
// - zones: Map<string, BlockConfig>
// - props: PropDef[] (optional)
// - vehicles: VehicleDef[] (optional)

// Render with React Three Fiber
function CityScene() {
  return (
    <>
      <InstancedBuildings buildings={cityData.buildings} />
      <Trees trees={cityData.trees} />
      <Roads roads={cityData.roads} />
      <Props props={cityData.props} />
      <Vehicles vehicles={cityData.vehicles} />
    </>
  );
}
```

---

This system provides a complete, production-ready framework for generating realistic cyberpunk cities based on actual U.S. urban planning patterns while maintaining strict performance budgets and visual consistency.
