/**
 * CityMapGenerator.ts
 * 
 * Advanced procedural city map generation system based on real U.S. city patterns.
 * Inspired by: Pensacola, Tampa, Houston, Atlanta, Dallas, Los Angeles
 * 
 * Features:
 * - Realistic zoning (Downtown, Commercial, Industrial, Residential, Park)
 * - Proper road hierarchy (Highways, Boulevards, Streets, Alleys)
 * - Building variety with no overlapping (NO PYRAMIDS - realistic shapes only)
 * - Tree/vegetation placement rules (NEVER on roads)
 * - Deterministic seed-based generation
 * - Cyberpunk neon styling support
 * - Low-poly optimized asset definitions
 */

import * as THREE from 'three';

// ============================================================================
// TYPES & ENUMS
// ============================================================================

export enum ZoneType {
  DOWNTOWN = 'downtown',
  COMMERCIAL = 'commercial',
  INDUSTRIAL = 'industrial',
  RESIDENTIAL = 'residential',
  PARK = 'park',
  WATERFRONT = 'waterfront',
}

export enum RoadType {
  HIGHWAY = 'highway',
  BOULEVARD = 'boulevard',
  MAIN_STREET = 'main_street',
  SIDE_STREET = 'side_street',
  ALLEY = 'alley',
  CUL_DE_SAC = 'cul_de_sac',
}

export enum BuildingType {
  // Downtown - Tall buildings, dense grid
  SKYSCRAPER = 'skyscraper',
  OFFICE_TOWER = 'office_tower',
  HIGH_RISE_APT = 'high_rise_apt',
  PARK_STRUCTURE = 'park_structure',
  LANDMARK_TOWER = 'landmark_tower',
  
  // Commercial - Strip malls, retail, restaurants
  STRIP_MALL = 'strip_mall',
  BIG_BOX_STORE = 'big_box_store',
  GAS_STATION = 'gas_station',
  FAST_FOOD = 'fast_food',
  RESTAURANT = 'restaurant',
  MOTEL = 'motel',
  CONVENIENCE_STORE = 'convenience_store',
  AUTO_DEALER = 'auto_dealer',
  COFFEE_SHOP = 'coffee_shop',
  
  // Industrial - Warehouses, factories
  WAREHOUSE = 'warehouse',
  FACTORY = 'factory',
  DISTRIBUTION_CENTER = 'distribution_center',
  LOADING_DOCK = 'loading_dock',
  STORAGE_UNIT = 'storage_unit',
  
  // Residential - Houses, apartments
  SINGLE_FAMILY = 'single_family',
  DUPLEX = 'duplex',
  APARTMENT_LOW = 'apartment_low',
  APARTMENT_MID = 'apartment_mid',
  TOWNHOUSE = 'townhouse',
  MANSION = 'mansion',
  TRAILER = 'trailer',
  
  // Special - Landmarks, infrastructure
  STADIUM = 'stadium',
  MALL = 'mall',
  PARKING_LOT = 'parking_lot',
  HOSPITAL = 'hospital',
  SCHOOL = 'school',
  POLICE_STATION = 'police_station',
  FIRE_STATION = 'fire_station',
}

// Roof types for variety (NO PYRAMIDS - flat, gabled, hip only)
export enum RoofType {
  FLAT = 'flat',
  GABLED = 'gabled',
  HIP = 'hip',
  SHED = 'shed',
  CURVED = 'curved',
}

export enum TreeType {
  PALM = 'palm',      // Florida/Texas coastal cities
  OAK = 'oak',        // Atlanta, Houston
  PINE = 'pine',      // Tampa, Pensacola
  MAPLE = 'maple',    // Northern cities
  BUSH = 'bush',
  SHRUB = 'shrub',
  CYPRESS = 'cypress', // Southern wetlands
}

// Prop types for street furniture and details
export enum PropType {
  STREETLIGHT = 'streetlight',
  NEON_SIGN = 'neon_sign',
  BILLBOARD = 'billboard',
  BENCH = 'bench',
  TRASH_CAN = 'trash_can',
  BUS_STOP = 'bus_stop',
  VENDING_MACHINE = 'vending_machine',
  POWER_TRANSFORMER = 'power_transformer',
  FIRE_HYDRANT = 'fire_hydrant',
  MAILBOX = 'mailbox',
  TRAFFIC_LIGHT = 'traffic_light',
  STOP_SIGN = 'stop_sign',
  HOLOGRAM_PROJECTOR = 'hologram_projector',
  SECURITY_CAMERA = 'security_camera',
  BIKE_RACK = 'bike_rack',
  BASKETBALL_HOOP = 'basketball_hoop',
}

// Vehicle types for traffic
export enum VehicleType {
  SEDAN = 'sedan',
  SUV = 'suv',
  TRUCK = 'truck',
  VAN = 'van',
  BUS = 'bus',
  DELIVERY_TRUCK = 'delivery_truck',
  TAXI = 'taxi',
  POLICE_CAR = 'police_car',
  CYBERPUNK_HOVER = 'cyberpunk_hover',
  DRONE = 'drone',
}

// ============================================================================
// CONFIGURATION
// ============================================================================

export interface CityConfig {
  seed: number;
  mapSize: number;          // Total map size in blocks
  downtownSize: number;     // Size of downtown core
  waterPresent: boolean;    // Is there a waterfront?
  waterSide: 'north' | 'south' | 'east' | 'west';
  industrialZone: 'north' | 'south' | 'east' | 'west';
}

export interface BlockConfig {
  zoneType: ZoneType;
  blockSize: number;
  roadSurrounding: RoadType;
  buildingDensity: number;  // 0-1
  treeDensity: number;      // 0-1
}

export interface BuildingDef {
  type: BuildingType;
  width: number;
  height: number;
  depth: number;
  color: string;
  position: THREE.Vector3;
  rotation: number;
  footprint: THREE.Box3;
  roofType?: RoofType;
  neonAccent?: string;
  floors?: number;
}

export interface TreeDef {
  type: TreeType;
  position: THREE.Vector3;
  scale: number;
}

export interface PropDef {
  type: PropType;
  position: THREE.Vector3;
  rotation: number;
  scale: number;
  color?: string;
}

export interface VehicleDef {
  type: VehicleType;
  position: THREE.Vector3;
  rotation: number;
  color: string;
}

export interface RoadSegment {
  type: RoadType;
  start: THREE.Vector3;
  end: THREE.Vector3;
  width: number;
  lanes: number;
  hasMedian: boolean;
  hasSidewalk: boolean;
}

// ============================================================================
// SEEDED RANDOM NUMBER GENERATOR
// ============================================================================

class SeededRandom {
  private seed: number;
  
  constructor(seed: number) {
    this.seed = seed;
  }
  
  // Mulberry32 PRNG
  next(): number {
    let t = (this.seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }
  
  range(min: number, max: number): number {
    return min + this.next() * (max - min);
  }
  
  int(min: number, max: number): number {
    return Math.floor(this.range(min, max + 1));
  }
  
  pick<T>(array: T[]): T {
    return array[this.int(0, array.length - 1)];
  }
  
  chance(probability: number): boolean {
    return this.next() < probability;
  }
}

// ============================================================================
// ZONE DEFINITIONS - Based on Real U.S. City Patterns
// ============================================================================

const ZONE_CONFIGS: Record<ZoneType, {
  buildingTypes: BuildingType[];
  buildingWeights: number[];
  blockSizes: [number, number];
  roadTypes: RoadType[];
  treeDensity: [number, number];
  allowedTreeTypes: TreeType[];
  propTypes?: PropType[];
  description: string;
}> = {
  [ZoneType.DOWNTOWN]: {
    buildingTypes: [
      BuildingType.SKYSCRAPER,
      BuildingType.OFFICE_TOWER,
      BuildingType.HIGH_RISE_APT,
      BuildingType.PARK_STRUCTURE,
      BuildingType.LANDMARK_TOWER,
    ],
    buildingWeights: [30, 25, 20, 15, 10],
    blockSizes: [80, 120],
    roadTypes: [RoadType.BOULEVARD, RoadType.MAIN_STREET],
    treeDensity: [0.15, 0.3],
    allowedTreeTypes: [TreeType.MAPLE, TreeType.OAK],
    propTypes: [PropType.STREETLIGHT, PropType.NEON_SIGN, PropType.BILLBOARD, 
                PropType.BENCH, PropType.TRASH_CAN, PropType.BUS_STOP, 
                PropType.HOLOGRAM_PROJECTOR, PropType.SECURITY_CAMERA],
    description: 'Dense urban core with tall buildings, tight grid pattern',
  },
  
  [ZoneType.COMMERCIAL]: {
    buildingTypes: [
      BuildingType.STRIP_MALL,
      BuildingType.BIG_BOX_STORE,
      BuildingType.GAS_STATION,
      BuildingType.FAST_FOOD,
      BuildingType.RESTAURANT,
      BuildingType.MOTEL,
      BuildingType.CONVENIENCE_STORE,
      BuildingType.AUTO_DEALER,
      BuildingType.COFFEE_SHOP,
      BuildingType.PARKING_LOT,
    ],
    buildingWeights: [25, 15, 20, 15, 10, 5, 15, 10, 10, 10],
    blockSizes: [120, 200],
    roadTypes: [RoadType.MAIN_STREET, RoadType.BOULEVARD],
    treeDensity: [0.1, 0.2],
    allowedTreeTypes: [TreeType.PALM, TreeType.OAK, TreeType.BUSH],
    propTypes: [PropType.STREETLIGHT, PropType.NEON_SIGN, PropType.BILLBOARD,
                PropType.VENDING_MACHINE, PropType.TRAFFIC_LIGHT, PropType.BUS_STOP],
    description: 'Commercial corridors with strip malls, retail, restaurants',
  },
  
  [ZoneType.INDUSTRIAL]: {
    buildingTypes: [
      BuildingType.WAREHOUSE,
      BuildingType.FACTORY,
      BuildingType.DISTRIBUTION_CENTER,
      BuildingType.LOADING_DOCK,
      BuildingType.STORAGE_UNIT,
    ],
    buildingWeights: [35, 25, 25, 15, 20],
    blockSizes: [150, 300],
    roadTypes: [RoadType.MAIN_STREET, RoadType.SIDE_STREET],
    treeDensity: [0.05, 0.1],
    allowedTreeTypes: [TreeType.PINE, TreeType.BUSH],
    propTypes: [PropType.STREETLIGHT, PropType.POWER_TRANSFORMER, PropType.SECURITY_CAMERA],
    description: 'Industrial zone with warehouses, factories, rail access',
  },
  
  [ZoneType.RESIDENTIAL]: {
    buildingTypes: [
      BuildingType.SINGLE_FAMILY,
      BuildingType.DUPLEX,
      BuildingType.APARTMENT_LOW,
      BuildingType.APARTMENT_MID,
      BuildingType.TOWNHOUSE,
      BuildingType.MANSION,
      BuildingType.TRAILER,
    ],
    buildingWeights: [40, 15, 15, 10, 15, 5, 5],
    blockSizes: [100, 180],
    roadTypes: [RoadType.SIDE_STREET, RoadType.CUL_DE_SAC],
    treeDensity: [0.4, 0.7],
    allowedTreeTypes: [TreeType.OAK, TreeType.MAPLE, TreeType.PINE, TreeType.BUSH, TreeType.SHRUB, TreeType.CYPRESS],
    propTypes: [PropType.STREETLIGHT, PropType.MAILBOX, PropType.BASKETBALL_HOOP, PropType.BIKE_RACK],
    description: 'Residential neighborhoods with houses, trees, cul-de-sacs',
  },
  
  [ZoneType.PARK]: {
    buildingTypes: [
      BuildingType.PARKING_LOT,
    ],
    buildingWeights: [100],
    blockSizes: [200, 400],
    roadTypes: [RoadType.SIDE_STREET],
    treeDensity: [0.6, 0.9],
    allowedTreeTypes: [TreeType.OAK, TreeType.MAPLE, TreeType.PINE, TreeType.BUSH, TreeType.CYPRESS],
    propTypes: [PropType.BENCH, PropType.TRASH_CAN, PropType.STREETLIGHT, PropType.BIKE_RACK],
    description: 'Green spaces, parks, recreational areas',
  },
  
  [ZoneType.WATERFRONT]: {
    buildingTypes: [
      BuildingType.RESTAURANT,
      BuildingType.PARKING_LOT,
      BuildingType.MOTEL,
    ],
    buildingWeights: [40, 30, 30],
    blockSizes: [100, 200],
    roadTypes: [RoadType.BOULEVARD, RoadType.MAIN_STREET],
    treeDensity: [0.2, 0.4],
    allowedTreeTypes: [TreeType.PALM, TreeType.PINE, TreeType.CYPRESS],
    propTypes: [PropType.STREETLIGHT, PropType.BENCH, PropType.NEON_SIGN],
    description: 'Waterfront area with piers, marinas, boardwalks',
  },
};

// ============================================================================
// BUILDING DIMENSIONS - Realistic shapes (NO PYRAMIDS)
// All buildings use box/rectangular footprints with varied roof types
// ============================================================================

const BUILDING_DIMENSIONS: Record<BuildingType, {
  width: [number, number];
  height: [number, number];
  depth: [number, number];
  colors: string[];
  defaultRoof?: RoofType;
  neonColors?: string[];  // Cyberpunk accent colors
}> = {
  // Downtown buildings - Tall, dense, modern
  [BuildingType.SKYSCRAPER]: {
    width: [25, 40],
    height: [80, 150],
    depth: [25, 40],
    colors: ['#4A5568', '#2D3748', '#718096', '#A0AEC0', '#E2E8F0'],
    defaultRoof: RoofType.FLAT,
    neonColors: ['#00FFFF', '#FF00FF', '#00FF00'],  // Cyan, Magenta, Green
  },
  [BuildingType.OFFICE_TOWER]: {
    width: [20, 35],
    height: [40, 80],
    depth: [20, 35],
    colors: ['#4A5568', '#2D3748', '#5A6B7C', '#8B9DC3'],
    defaultRoof: RoofType.FLAT,
    neonColors: ['#00FFFF', '#0088FF'],
  },
  [BuildingType.HIGH_RISE_APT]: {
    width: [25, 40],
    height: [50, 100],
    depth: [20, 30],
    colors: ['#C4A574', '#D4B896', '#E8D5B5', '#A67C52'],
    defaultRoof: RoofType.FLAT,
    neonColors: ['#FFAA00', '#FF6600'],
  },
  [BuildingType.PARK_STRUCTURE]: {
    width: [40, 80],
    height: [30, 50],
    depth: [40, 80],
    colors: ['#5A5A5A', '#656565', '#707070'],
    defaultRoof: RoofType.FLAT,
    neonColors: ['#00FF00', '#FFFF00'],
  },
  [BuildingType.LANDMARK_TOWER]: {
    width: [40, 80],
    height: [100, 180],
    depth: [40, 80],
    colors: ['#D4AF37', '#C0A060', '#E8C878', '#F0D080', '#A0A0A0'],
    defaultRoof: RoofType.CURVED,
    neonColors: ['#FF00FF', '#00FFFF', '#FF0000'],
  },
  
  // Commercial buildings - Strip malls, retail, restaurants
  [BuildingType.STRIP_MALL]: {
    width: [80, 150],
    height: [12, 20],
    depth: [25, 40],
    colors: ['#D4A574', '#C49564', '#B88554', '#E0B080'],
    defaultRoof: RoofType.FLAT,
    neonColors: ['#FF0000', '#FFFF00', '#00FF00'],
  },
  [BuildingType.BIG_BOX_STORE]: {
    width: [100, 200],
    height: [20, 35],
    depth: [60, 100],
    colors: ['#8B7355', '#9C8466', '#AD9577', '#7A6545'],
    defaultRoof: RoofType.FLAT,
    neonColors: ['#FF0000', '#0066FF'],
  },
  [BuildingType.GAS_STATION]: {
    width: [40, 60],
    height: [8, 12],
    depth: [40, 60],
    colors: ['#CC3333', '#3366CC', '#33AA33', '#FF9900'],
    defaultRoof: RoofType.SHED,
    neonColors: ['#FF0000', '#FFFF00', '#00FF00'],
  },
  [BuildingType.FAST_FOOD]: {
    width: [25, 40],
    height: [10, 15],
    depth: [25, 35],
    colors: ['#CC0000', '#FFCC00', '#0066CC', '#009900'],
    defaultRoof: RoofType.GABLED,
    neonColors: ['#FF0000', '#FFFF00'],
  },
  [BuildingType.RESTAURANT]: {
    width: [30, 50],
    height: [12, 25],
    depth: [30, 50],
    colors: ['#8B4513', '#A0522D', '#CD853F', '#DEB887'],
    defaultRoof: RoofType.HIP,
    neonColors: ['#FF6600', '#FF0066', '#00FFFF'],
  },
  [BuildingType.MOTEL]: {
    width: [60, 100],
    height: [15, 25],
    depth: [30, 45],
    colors: ['#5C8DA8', '#7BA0B8', '#9AB8D0', '#4A7D8E'],
    defaultRoof: RoofType.FLAT,
    neonColors: ['#00FFFF', '#FF00FF', '#FFFF00'],
  },
  [BuildingType.CONVENIENCE_STORE]: {
    width: [30, 50],
    height: [10, 15],
    depth: [25, 35],
    colors: ['#CC6600', '#009933', '#CC0000', '#0066CC'],
    defaultRoof: RoofType.FLAT,
    neonColors: ['#00FF00', '#FFFF00', '#FF0000'],
  },
  [BuildingType.AUTO_DEALER]: {
    width: [60, 100],
    height: [12, 20],
    depth: [40, 60],
    colors: ['#CC0000', '#0066CC', '#FFFFFF', '#333333'],
    defaultRoof: RoofType.SHED,
    neonColors: ['#FF0000', '#0066FF'],
  },
  [BuildingType.COFFEE_SHOP]: {
    width: [20, 35],
    height: [10, 15],
    depth: [20, 30],
    colors: ['#6F4E37', '#8B6B4E', '#A08060', '#4A3525'],
    defaultRoof: RoofType.GABLED,
    neonColors: ['#00FF00', '#FFAA00'],
  },
  
  // Industrial buildings - Warehouses, factories
  [BuildingType.WAREHOUSE]: {
    width: [60, 120],
    height: [20, 40],
    depth: [60, 120],
    colors: ['#6B7B8B', '#7C8C9C', '#8D9DAD', '#5A6A7A'],
    defaultRoof: RoofType.GABLED,
    neonColors: ['#FFFF00', '#FF0000'],
  },
  [BuildingType.FACTORY]: {
    width: [80, 150],
    height: [30, 60],
    depth: [60, 100],
    colors: ['#5A6B7C', '#6B7C8D', '#7C8D9E', '#4A5B6C'],
    defaultRoof: RoofType.GABLED,
    neonColors: ['#FF6600', '#FFFF00'],
  },
  [BuildingType.DISTRIBUTION_CENTER]: {
    width: [100, 200],
    height: [25, 45],
    depth: [80, 150],
    colors: ['#7A8B9C', '#8B9CAD', '#9CADBE', '#6A7B8C'],
    defaultRoof: RoofType.FLAT,
    neonColors: ['#FFFF00', '#00FF00'],
  },
  [BuildingType.LOADING_DOCK]: {
    width: [40, 80],
    height: [15, 25],
    depth: [30, 50],
    colors: ['#6B7B8B', '#7C8C9C', '#8D9DAD'],
    defaultRoof: RoofType.FLAT,
    neonColors: ['#FFFF00'],
  },
  [BuildingType.STORAGE_UNIT]: {
    width: [30, 60],
    height: [10, 15],
    depth: [30, 60],
    colors: ['#7A7A7A', '#858585', '#909090'],
    defaultRoof: RoofType.SHED,
    neonColors: ['#FF0000'],
  },
  
  // Residential buildings - Houses, apartments
  [BuildingType.SINGLE_FAMILY]: {
    width: [12, 20],
    height: [8, 15],
    depth: [12, 20],
    colors: ['#F5E6D3', '#E8D5C4', '#D4C4B0', '#C4B09C', '#B09C88'],
    defaultRoof: RoofType.GABLED,
    neonColors: [],  // No neon in residential
  },
  [BuildingType.DUPLEX]: {
    width: [20, 30],
    height: [10, 18],
    depth: [15, 25],
    colors: ['#E8D5C4', '#D4C4B0', '#C4B09C', '#B09C88'],
    defaultRoof: RoofType.GABLED,
    neonColors: [],
  },
  [BuildingType.APARTMENT_LOW]: {
    width: [30, 50],
    height: [20, 35],
    depth: [20, 35],
    colors: ['#C4A574', '#D4B896', '#B89564', '#A88554'],
    defaultRoof: RoofType.FLAT,
    neonColors: ['#00FFFF'],
  },
  [BuildingType.APARTMENT_MID]: {
    width: [35, 55],
    height: [35, 55],
    depth: [25, 40],
    colors: ['#B89564', '#C4A574', '#A88554', '#987544'],
    defaultRoof: RoofType.FLAT,
    neonColors: ['#00FFFF', '#FF00FF'],
  },
  [BuildingType.TOWNHOUSE]: {
    width: [15, 25],
    height: [15, 25],
    depth: [15, 25],
    colors: ['#C44444', '#B83838', '#A82828', '#8B4513'],
    defaultRoof: RoofType.HIP,
    neonColors: [],
  },
  [BuildingType.MANSION]: {
    width: [35, 55],
    height: [20, 35],
    depth: [30, 50],
    colors: ['#F5E6D3', '#E8D5C4', '#FFFFFF', '#F0E0D0'],
    defaultRoof: RoofType.HIP,
    neonColors: [],
  },
  [BuildingType.TRAILER]: {
    width: [8, 12],
    height: [6, 8],
    depth: [20, 30],
    colors: ['#CCCCCC', '#D0D0D0', '#E0E0E0', '#B0B0B0'],
    defaultRoof: RoofType.CURVED,
    neonColors: [],
  },
  
  // Special buildings - Landmarks, infrastructure
  [BuildingType.STADIUM]: {
    width: [150, 250],
    height: [40, 60],
    depth: [150, 250],
    colors: ['#4A5568', '#5A6578', '#6A7588'],
    defaultRoof: RoofType.CURVED,
    neonColors: ['#00FF00', '#FFFF00', '#0066FF'],
  },
  [BuildingType.MALL]: {
    width: [150, 300],
    height: [25, 40],
    depth: [100, 200],
    colors: ['#C4B8A8', '#D4C8B8', '#E0D0C0'],
    defaultRoof: RoofType.FLAT,
    neonColors: ['#FF00FF', '#00FFFF', '#FFFF00'],
  },
  [BuildingType.PARKING_LOT]: {
    width: [50, 100],
    height: [1, 1],
    depth: [50, 100],
    colors: ['#3D3D3D', '#454545', '#353535'],
    defaultRoof: RoofType.FLAT,
    neonColors: [],
  },
  [BuildingType.HOSPITAL]: {
    width: [80, 150],
    height: [40, 80],
    depth: [50, 100],
    colors: ['#F0F0F0', '#E8E8E8', '#FFFFFF'],
    defaultRoof: RoofType.FLAT,
    neonColors: ['#FF0000'],
  },
  [BuildingType.SCHOOL]: {
    width: [60, 120],
    height: [20, 40],
    depth: [40, 80],
    colors: ['#B89564', '#C4A574', '#A88554'],
    defaultRoof: RoofType.FLAT,
    neonColors: [],
  },
  [BuildingType.POLICE_STATION]: {
    width: [40, 70],
    height: [15, 25],
    depth: [30, 50],
    colors: ['#4A5568', '#5A6578', '#3A4558'],
    defaultRoof: RoofType.FLAT,
    neonColors: ['#0000FF', '#FF0000'],
  },
  [BuildingType.FIRE_STATION]: {
    width: [40, 70],
    height: [15, 25],
    depth: [30, 50],
    colors: ['#CC3333', '#BB2222', '#AA1111'],
    defaultRoof: RoofType.FLAT,
    neonColors: ['#FF0000'],
  },
};

// ============================================================================
// CITY MAP GENERATOR CLASS
// ============================================================================

export class CityMapGenerator {
  private rng: SeededRandom;
  private config: CityConfig;
  private zones: Map<string, BlockConfig>;
  private buildings: BuildingDef[];
  private trees: TreeDef[];
  private roads: RoadSegment[];
  private occupiedSpaces: Set<string>;
  
  constructor(config: CityConfig) {
    this.config = config;
    this.rng = new SeededRandom(config.seed);
    this.zones = new Map();
    this.buildings = [];
    this.trees = [];
    this.roads = [];
    this.occupiedSpaces = new Set();
  }
  
  // Generate the complete city layout
  generate(): {
    buildings: BuildingDef[];
    trees: TreeDef[];
    roads: RoadSegment[];
    zones: Map<string, BlockConfig>;
  } {
    this.generateZoning();
    this.generateRoadNetwork();
    this.generateBuildings();
    this.generateTrees();
    
    return {
      buildings: this.buildings,
      trees: this.trees,
      roads: this.roads,
      zones: this.zones,
    };
  }
  
  // ==========================================================================
  // ZONING SYSTEM - Creates realistic city zones based on U.S. patterns
  // ==========================================================================
  
  private generateZoning(): void {
    const { mapSize, downtownSize, industrialZone, waterPresent, waterSide } = this.config;
    const halfMap = mapSize / 2;
    const halfDowntown = downtownSize / 2;
    
    // Create grid of blocks
    for (let x = -halfMap; x < halfMap; x += 20) {
      for (let z = -halfMap; z < halfMap; z += 20) {
        const blockKey = `${Math.round(x)},${Math.round(z)}`;
        
        // Determine zone type based on position and real city patterns
        let zoneType: ZoneType;
        
        // Downtown core - dense, tall buildings in center
        if (Math.abs(x) < halfDowntown && Math.abs(z) < halfDowntown) {
          zoneType = ZoneType.DOWNTOWN;
        }
        // Waterfront zone
        else if (waterPresent && this.isNearWater(x, z, waterSide)) {
          zoneType = ZoneType.WATERFRONT;
        }
        // Industrial zone - typically on one side of city, near transportation
        else if (this.isInIndustrialZone(x, z, industrialZone, halfMap)) {
          zoneType = ZoneType.INDUSTRIAL;
        }
        // Parks - scattered throughout, often near residential or waterfront
        else if (this.rng.chance(0.08) && Math.abs(x) > halfDowntown + 20) {
          zoneType = ZoneType.PARK;
        }
        // Commercial corridors - along main roads radiating from downtown
        else if (this.isAlongCorridor(x, z, downtownSize)) {
          zoneType = ZoneType.COMMERCIAL;
        }
        // Residential - most common, fills remaining areas
        else {
          zoneType = ZoneType.RESIDENTIAL;
        }
        
        const zoneConfig = ZONE_CONFIGS[zoneType];
        const blockSize = this.rng.range(zoneConfig.blockSizes[0], zoneConfig.blockSizes[1]);
        
        this.zones.set(blockKey, {
          zoneType,
          blockSize,
          roadSurrounding: this.rng.pick(zoneConfig.roadTypes),
          buildingDensity: this.getBuildingDensity(zoneType),
          treeDensity: this.rng.range(zoneConfig.treeDensity[0], zoneConfig.treeDensity[1]),
        });
      }
    }
  }
  
  private isNearWater(x: number, z: number, waterSide: string): boolean {
    const threshold = 40;
    switch (waterSide) {
      case 'north': return z < -this.config.mapSize / 2 + threshold;
      case 'south': return z > this.config.mapSize / 2 - threshold;
      case 'east': return x > this.config.mapSize / 2 - threshold;
      case 'west': return x < -this.config.mapSize / 2 + threshold;
      default: return false;
    }
  }
  
  private isInIndustrialZone(x: number, z: number, zone: string, halfMap: number): boolean {
    const industrialBand = 60;
    switch (zone) {
      case 'north': return z < -halfMap + industrialBand && Math.abs(x) < halfMap - 20;
      case 'south': return z > halfMap - industrialBand && Math.abs(x) < halfMap - 20;
      case 'east': return x > halfMap - industrialBand && Math.abs(z) < halfMap - 20;
      case 'west': return x < -halfMap + industrialBand && Math.abs(z) < halfMap - 20;
      default: return false;
    }
  }
  
  private isAlongCorridor(x: number, z: number, downtownSize: number): boolean {
    // Commercial strips along major roads radiating from downtown
    const corridorWidth = 30;
    const halfDowntown = downtownSize / 2;
    
    // North-south corridors
    if (Math.abs(x) < corridorWidth && Math.abs(z) > halfDowntown) return true;
    // East-west corridors
    if (Math.abs(z) < corridorWidth && Math.abs(x) > halfDowntown) return true;
    // Diagonal corridors (like LA's Wilshire Blvd)
    if (Math.abs(Math.abs(x) - Math.abs(z)) < corridorWidth && Math.abs(x) > halfDowntown) return true;
    
    return false;
  }
  
  private getBuildingDensity(zoneType: ZoneType): number {
    switch (zoneType) {
      case ZoneType.DOWNTOWN: return this.rng.range(0.7, 0.9);
      case ZoneType.COMMERCIAL: return this.rng.range(0.5, 0.7);
      case ZoneType.INDUSTRIAL: return this.rng.range(0.4, 0.6);
      case ZoneType.RESIDENTIAL: return this.rng.range(0.3, 0.5);
      case ZoneType.PARK: return this.rng.range(0.05, 0.15);
      case ZoneType.WATERFRONT: return this.rng.range(0.3, 0.5);
      default: return 0.4;
    }
  }
  
  // ==========================================================================
  // ROAD NETWORK GENERATION - Hierarchical road system
  // ==========================================================================
  
  private generateRoadNetwork(): void {
    const { mapSize, downtownSize } = this.config;
    const halfMap = mapSize / 2;
    
    // Highway ring around downtown (like I-285 in Atlanta, Loop 610 in Houston)
    this.createHighwayRing(downtownSize + 40);
    
    // Grid roads in downtown
    this.createGridRoads(-downtownSize / 2, downtownSize / 2, 20, RoadType.MAIN_STREET);
    
    // Boulevards radiating from downtown
    this.createRadialBoulevards(halfMap);
    
    // Suburban street grid
    this.createSuburbanStreets(halfMap, downtownSize);
  }
  
  private createHighwayRing(radius: number): void {
    const segments = 32;
    for (let i = 0; i < segments; i++) {
      const angle1 = (i / segments) * Math.PI * 2;
      const angle2 = ((i + 1) / segments) * Math.PI * 2;
      
      this.roads.push({
        type: RoadType.HIGHWAY,
        start: new THREE.Vector3(
          Math.cos(angle1) * radius,
          0,
          Math.sin(angle1) * radius
        ),
        end: new THREE.Vector3(
          Math.cos(angle2) * radius,
          0,
          Math.sin(angle2) * radius
        ),
        width: 24,
        lanes: 6,
        hasMedian: true,
        hasSidewalk: false,
      });
    }
  }
  
  private createGridRoads(xMin: number, xMax: number, spacing: number, roadType: RoadType): void {
    for (let x = xMin; x <= xMax; x += spacing) {
      // Vertical roads
      this.roads.push({
        type: roadType,
        start: new THREE.Vector3(x, 0, xMin),
        end: new THREE.Vector3(x, 0, xMax),
        width: roadType === RoadType.BOULEVARD ? 20 : 14,
        lanes: roadType === RoadType.BOULEVARD ? 4 : 2,
        hasMedian: roadType === RoadType.BOULEVARD,
        hasSidewalk: true,
      });
      
      // Horizontal roads
      this.roads.push({
        type: roadType,
        start: new THREE.Vector3(xMin, 0, x),
        end: new THREE.Vector3(xMax, 0, x),
        width: roadType === RoadType.BOULEVARD ? 20 : 14,
        lanes: roadType === RoadType.BOULEVARD ? 4 : 2,
        hasMedian: roadType === RoadType.BOULEVARD,
        hasSidewalk: true,
      });
    }
  }
  
  private createRadialBoulevards(maxRadius: number): void {
    const numRadials = 8;
    for (let i = 0; i < numRadials; i++) {
      const angle = (i / numRadials) * Math.PI * 2;
      const startX = Math.cos(angle) * (this.config.downtownSize / 2);
      const startZ = Math.sin(angle) * (this.config.downtownSize / 2);
      const endX = Math.cos(angle) * maxRadius;
      const endZ = Math.sin(angle) * maxRadius;
      
      this.roads.push({
        type: RoadType.BOULEVARD,
        start: new THREE.Vector3(startX, 0, startZ),
        end: new THREE.Vector3(endX, 0, endZ),
        width: 20,
        lanes: 4,
        hasMedian: true,
        hasSidewalk: true,
      });
    }
  }
  
  private createSuburbanStreets(maxRadius: number, downtownRadius: number): void {
    const spacing = 40;
    
    // Create streets outside downtown area
    for (let x = -maxRadius; x <= maxRadius; x += spacing) {
      // Skip if too close to downtown
      if (Math.abs(x) < downtownRadius / 2) continue;
      
      for (let z = -maxRadius; z <= maxRadius; z += spacing) {
        if (Math.abs(z) < downtownRadius / 2) continue;
        
        // Only create street segments where needed
        if (this.rng.chance(0.7)) {
          this.roads.push({
            type: RoadType.SIDE_STREET,
            start: new THREE.Vector3(x, 0, z),
            end: new THREE.Vector3(x + spacing, 0, z),
            width: 10,
            lanes: 2,
            hasMedian: false,
            hasSidewalk: true,
          });
        }
        
        if (this.rng.chance(0.7)) {
          this.roads.push({
            type: RoadType.SIDE_STREET,
            start: new THREE.Vector3(x, 0, z),
            end: new THREE.Vector3(x, 0, z + spacing),
            width: 10,
            lanes: 2,
            hasMedian: false,
            hasSidewalk: true,
          });
        }
      }
    }
  }
  
  // ==========================================================================
  // BUILDING PLACEMENT - With collision detection and zone rules
  // ==========================================================================
  
  private generateBuildings(): void {
    this.zones.forEach((blockConfig, blockKey) => {
      const [blockX, blockZ] = blockKey.split(',').map(Number);
      const zoneConfig = ZONE_CONFIGS[blockConfig.zoneType];
      
      // Calculate available area in block (subtract road margins)
      const roadMargin = 10;
      const availableWidth = blockConfig.blockSize - roadMargin * 2;
      const availableDepth = blockConfig.blockSize - roadMargin * 2;
      
      // Number of buildings based on density
      const numBuildings = Math.floor(
        (availableWidth * availableDepth / 1000) * blockConfig.buildingDensity
      );
      
      for (let i = 0; i < numBuildings; i++) {
        this.tryPlaceBuilding(blockX, blockZ, blockConfig, zoneConfig);
      }
    });
  }
  
  private tryPlaceBuilding(
    blockX: number,
    blockZ: number,
    blockConfig: BlockConfig,
    zoneConfig: typeof ZONE_CONFIGS[ZoneType]
  ): void {
    const maxAttempts = 10;
    
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      // Pick building type based on weights
      const buildingType = this.weightedPickBuilding(zoneConfig);
      const dimensions = BUILDING_DIMENSIONS[buildingType];
      
      // Random dimensions within range
      const width = this.rng.range(dimensions.width[0], dimensions.width[1]);
      const height = this.rng.range(dimensions.height[0], dimensions.height[1]);
      const depth = this.rng.range(dimensions.depth[0], dimensions.depth[1]);
      
      // Position within block
      const margin = 5;
      const posX = blockX + margin + this.rng.next() * (blockConfig.blockSize - margin * 2 - width);
      const posZ = blockZ + margin + this.rng.next() * (blockConfig.blockSize - margin * 2 - depth);
      
      // Create footprint for collision check
      const footprint = new THREE.Box3(
        new THREE.Vector3(posX - width / 2, 0, posZ - depth / 2),
        new THREE.Vector3(posX + width / 2, height, posZ + depth / 2)
      );
      
      // Check for collisions
      if (this.checkCollision(footprint)) continue;
      
      // Check if on road
      if (this.isOnRoad(posX, posZ, width, depth)) continue;
      
      // Place building
      const color = this.rng.pick(dimensions.colors);
      const rotation = this.rng.chance(0.9) ? 0 : (this.rng.chance(0.5) ? Math.PI / 2 : -Math.PI / 2);
      
      this.buildings.push({
        type: buildingType,
        width,
        height,
        depth,
        color,
        position: new THREE.Vector3(posX, height / 2, posZ),
        rotation,
        footprint,
      });
      
      // Mark space as occupied
      this.markOccupied(footprint);
      break;
    }
  }
  
  private weightedPickBuilding(zoneConfig: typeof ZONE_CONFIGS[ZoneType]): BuildingType {
    const totalWeight = zoneConfig.buildingWeights.reduce((a, b) => a + b, 0);
    let random = this.rng.next() * totalWeight;
    
    for (let i = 0; i < zoneConfig.buildingTypes.length; i++) {
      random -= zoneConfig.buildingWeights[i];
      if (random <= 0) {
        return zoneConfig.buildingTypes[i];
      }
    }
    
    return zoneConfig.buildingTypes[0];
  }
  
  private checkCollision(newFootprint: THREE.Box3): boolean {
    for (const building of this.buildings) {
      if (newFootprint.intersectsBox(building.footprint)) {
        return true;
      }
    }
    return false;
  }
  
  private isOnRoad(x: number, z: number, width: number, depth: number): boolean {
    const buildingBox = new THREE.Box3(
      new THREE.Vector3(x - width / 2 - 2, 0, z - depth / 2 - 2),
      new THREE.Vector3(x + width / 2 + 2, 0, z + depth / 2 + 2)
    );
    
    for (const road of this.roads) {
      // Simple road collision check using bounding box
      const roadBox = new THREE.Box3(
        new THREE.Vector3(
          Math.min(road.start.x, road.end.x) - road.width / 2,
          0,
          Math.min(road.start.z, road.end.z) - road.width / 2
        ),
        new THREE.Vector3(
          Math.max(road.start.x, road.end.x) + road.width / 2,
          0,
          Math.max(road.start.z, road.end.z) + road.width / 2
        )
      );
      
      if (buildingBox.intersectsBox(roadBox)) {
        return true;
      }
    }
    return false;
  }
  
  private markOccupied(footprint: THREE.Box3): void {
    const key = `${Math.round(footprint.min.x)},${Math.round(footprint.min.z)}`;
    this.occupiedSpaces.add(key);
  }
  
  // ==========================================================================
  // TREE PLACEMENT - Following realistic rules (no trees in roads!)
  // ==========================================================================
  
  private generateTrees(): void {
    this.zones.forEach((blockConfig, blockKey) => {
      const [blockX, blockZ] = blockKey.split(',').map(Number);
      const zoneConfig = ZONE_CONFIGS[blockConfig.zoneType];
      
      // Trees along sidewalks
      this.placeTreesAlongRoads(blockX, blockZ, blockConfig, zoneConfig);
      
      // Trees in yards/open areas (not in residential parking spots)
      this.placeTreesInOpenAreas(blockX, blockZ, blockConfig, zoneConfig);
      
      // Special placements for parks
      if (blockConfig.zoneType === ZoneType.PARK) {
        this.placeParkTrees(blockX, blockZ, blockConfig, zoneConfig);
      }
    });
  }
  
  private placeTreesAlongRoads(
    blockX: number,
    blockZ: number,
    blockConfig: BlockConfig,
    zoneConfig: typeof ZONE_CONFIGS[ZoneType]
  ): void {
    const sidewalkOffset = 8; // Distance from road edge
    const treeSpacing = 12;   // Space between trees
    
    // Place trees along each side of the block
    const sides = [
      { dx: sidewalkOffset, dz: 0, axis: 'z' },
      { dx: -sidewalkOffset, dz: blockConfig.blockSize, axis: 'z' },
      { dx: 0, dz: sidewalkOffset, axis: 'x' },
      { dx: blockConfig.blockSize, dz: 0, axis: 'x' },
    ];
    
    sides.forEach(side => {
      const length = blockConfig.blockSize;
      const numTrees = Math.floor(length / treeSpacing);
      
      for (let i = 0; i < numTrees; i++) {
        const pos = side.axis === 'x' 
          ? new THREE.Vector3(blockX + i * treeSpacing, 0, blockZ + side.dz)
          : new THREE.Vector3(blockX + side.dx, 0, blockZ + i * treeSpacing);
        
        // Don't place at corners (intersection visibility)
        if (i === 0 || i === numTrees - 1) continue;
        
        // Check not on road
        if (!this.isOnRoad(pos.x, pos.z, 1, 1)) {
          this.placeTree(pos, zoneConfig);
        }
      }
    });
  }
  
  private placeTreesInOpenAreas(
    blockX: number,
    blockZ: number,
    blockConfig: BlockConfig,
    zoneConfig: typeof ZONE_CONFIGS[ZoneType]
  ): void {
    const numTrees = Math.floor(blockConfig.blockSize * blockConfig.treeDensity);
    
    for (let i = 0; i < numTrees; i++) {
      const margin = 3;
      const posX = blockX + margin + this.rng.next() * (blockConfig.blockSize - margin * 2);
      const posZ = blockZ + margin + this.rng.next() * (blockConfig.blockSize - margin * 2);
      const pos = new THREE.Vector3(posX, 0, posZ);
      
      // Skip if on road or too close to building
      if (this.isOnRoad(posX, posZ, 1, 1)) continue;
      if (this.isTooCloseToBuilding(posX, posZ, 5)) continue;
      
      this.placeTree(pos, zoneConfig);
    }
  }
  
  private placeParkTrees(
    blockX: number,
    blockZ: number,
    blockConfig: BlockConfig,
    zoneConfig: typeof ZONE_CONFIGS[ZoneType]
  ): void {
    // Parks have denser, more varied tree placement
    const numTrees = Math.floor(blockConfig.blockSize * blockConfig.treeDensity * 2);
    
    for (let i = 0; i < numTrees; i++) {
      const margin = 5;
      const posX = blockX + margin + this.rng.next() * (blockConfig.blockSize - margin * 2);
      const posZ = blockZ + margin + this.rng.next() * (blockConfig.blockSize - margin * 2);
      const pos = new THREE.Vector3(posX, 0, posZ);
      
      // Parks can have trees closer together
      if (!this.isOnRoad(posX, posZ, 1, 1)) {
        this.placeTree(pos, zoneConfig, this.rng.range(0.8, 1.5));
      }
    }
  }
  
  private placeTree(position: THREE.Vector3, zoneConfig: typeof ZONE_CONFIGS[ZoneType], scale?: number): void {
    const treeType = this.rng.pick(zoneConfig.allowedTreeTypes);
    const treeScale = scale ?? this.rng.range(0.7, 1.3);
    
    this.trees.push({
      type: treeType,
      position,
      scale: treeScale,
    });
  }
  
  private isTooCloseToBuilding(x: number, z: number, minDistance: number): boolean {
    const point = new THREE.Vector3(x, 0, z);
    
    for (const building of this.buildings) {
      // Find closest point on building footprint to the tree position
      const minX = building.footprint.min.x;
      const maxX = building.footprint.max.x;
      const minZ = building.footprint.min.z;
      const maxZ = building.footprint.max.z;
      
      const closestX = Math.max(minX, Math.min(point.x, maxX));
      const closestZ = Math.max(minZ, Math.min(point.z, maxZ));
      const closestPoint = new THREE.Vector3(closestX, 0, closestZ);
      
      if (point.distanceTo(closestPoint) < minDistance) {
        return true;
      }
    }
    return false;
  }
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

export function generateCitySeed(): number {
  return Math.floor(Math.random() * 2147483647);
}

export function getDefaultConfig(): CityConfig {
  return {
    seed: generateCitySeed(),
    mapSize: 400,
    downtownSize: 100,
    waterPresent: true,
    waterSide: 'south',
    industrialZone: 'north',
  };
}
