// Vehicle types for the game
export type VehicleType = 'evo' | 'wrx' | 'impreza' | 'sportbike' | 'bus';
export type EnvironmentType = 'coastal' | 'mountain' | 'city';
export type TimeOfDayType = 'dawn' | 'noon' | 'sunset' | 'midnight';
export type WeatherType = 'clear' | 'rain' | 'fog' | 'overcast';

// Vehicle configuration interface
export interface VehicleConfig {
  maxSpeed: number;
  acceleration: number;
  handling: number;
  friction: number;
  brakeForce: number;
  driftFactor: number;
  turnDamping: number;
  bodyColor: string;
  accentColor: string;
}

// Vehicle configurations per type
export const VEHICLE_CONFIGS: Record<VehicleType, VehicleConfig> = {
  evo: {
    maxSpeed: 170,
    acceleration: 65,
    handling: 2.2,
    friction: 0.985,
    brakeForce: 1.8,
    driftFactor: 0.92,
    turnDamping: 0.88,
    bodyColor: '#CC2222',
    accentColor: '#333333',
  },
  wrx: {
    maxSpeed: 155,
    acceleration: 58,
    handling: 2.6,
    friction: 0.983,
    brakeForce: 1.7,
    driftFactor: 0.90,
    turnDamping: 0.85,
    bodyColor: '#E8E8E8',
    accentColor: '#555555',
  },
  impreza: {
    maxSpeed: 165,
    acceleration: 62,
    handling: 2.4,
    friction: 0.984,
    brakeForce: 1.9,
    driftFactor: 0.88,
    turnDamping: 0.86,
    bodyColor: '#1E3A8A',
    accentColor: '#D4A017',
  },
  sportbike: {
    maxSpeed: 195,
    acceleration: 80,
    handling: 3.6,
    friction: 0.978,
    brakeForce: 2.2,
    driftFactor: 0.95,
    turnDamping: 0.92,
    bodyColor: '#CC2222',
    accentColor: '#111111',
  },
  bus: {
    maxSpeed: 85,
    acceleration: 28,
    handling: 1.0,
    friction: 0.990,
    brakeForce: 1.2,
    driftFactor: 0.98,
    turnDamping: 0.80,
    bodyColor: '#2563EB',
    accentColor: '#E5E7EB',
  },
};

// City block data for open world system
export interface CityBlockData {
  id: string;
  gridX: number;
  gridZ: number;
  blockType: 'straight_ns' | 'straight_ew' | 'intersection_4way' | 'curve_ne' | 'curve_nw' | 'curve_se' | 'curve_sw' | 'plaza';
  rotation: number;
  hasBuildings: boolean;
  buildingDensity: number;
  speedLimit: number;
  districtName: string;
}

// Road node for navigation graph
export interface RoadNode {
  id: string;
  position: THREE.Vector3;
  connections: string[];
  speedLimit: number;
  nodeType: 'intersection' | 'waypoint' | 'start_finish';
}

// Checkpoint for routes
export interface Checkpoint {
  index: number;
  position: THREE.Vector3;
  radius: number;
  routeId: string;
  passed: boolean;
}

// Route definition
export interface Route {
  id: string;
  name: string;
  checkpoints: Checkpoint[];
  lapDistance: number;
}

// District configurations
export const DISTRICTS = {
  downtown: { name: 'Downtown', buildingDensity: 0.9, speedLimit: 40, color: '#8899AA' },
  industrial: { name: 'Industrial', buildingDensity: 0.5, speedLimit: 50, color: '#6B7B6B' },
  coastal: { name: 'Coastal', buildingDensity: 0.3, speedLimit: 60, color: '#E8C07A' },
  residential: { name: 'Residential', buildingDensity: 0.6, speedLimit: 35, color: '#D4A07A' },
};

// City grid constants
export const CITY_GRID_SIZE = 6;
export const BLOCK_SIZE = 100;
export const CITY_ROAD_WIDTH = 14;
export const LANE_WIDTH = 3.5;
