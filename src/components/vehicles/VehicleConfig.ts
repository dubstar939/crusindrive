/**
 * Vehicle Configuration Types and Constants
 * Production-grade vehicle physics configuration system
 */

export type VehicleType = 'evo' | 'wrx' | 'impreza' | 'sportbike' | 'bus' | 'truck';

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
  wheelCount: number;
  wheelOffset: { x: number; y: number; z: number };
  bodyDimensions: { width: number; height: number; length: number };
}

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
    wheelCount: 4,
    wheelOffset: { x: 0.95, y: 0.18, z: 1.35 },
    bodyDimensions: { width: 1.85, height: 0.45, length: 4.2 },
  },
  wrx: {
    maxSpeed: 155,
    acceleration: 58,
    handling: 2.6,
    friction: 0.983,
    brakeForce: 1.7,
    driftFactor: 0.9,
    turnDamping: 0.85,
    bodyColor: '#E8E8E8',
    accentColor: '#555555',
    wheelCount: 4,
    wheelOffset: { x: 0.94, y: 0.18, z: 1.3 },
    bodyDimensions: { width: 1.82, height: 0.45, length: 4.1 },
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
    wheelCount: 4,
    wheelOffset: { x: 0.96, y: 0.18, z: 1.32 },
    bodyDimensions: { width: 1.85, height: 0.46, length: 4.15 },
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
    wheelCount: 2,
    wheelOffset: { x: 0, y: 0.28, z: 1.15 },
    bodyDimensions: { width: 0.52, height: 0.78, length: 2.4 },
  },
  bus: {
    maxSpeed: 85,
    acceleration: 28,
    handling: 1.0,
    friction: 0.99,
    brakeForce: 1.2,
    driftFactor: 0.98,
    turnDamping: 0.8,
    bodyColor: '#2563EB',
    accentColor: '#E5E7EB',
    wheelCount: 4,
    wheelOffset: { x: 1.25, y: 0.2, z: 1.8 },
    bodyDimensions: { width: 2.4, height: 1.55, length: 5.5 },
  },
  truck: {
    maxSpeed: 95,
    acceleration: 32,
    handling: 1.2,
    friction: 0.988,
    brakeForce: 1.4,
    driftFactor: 0.96,
    turnDamping: 0.82,
    bodyColor: '#8B4513',
    accentColor: '#CD853F',
    wheelCount: 6,
    wheelOffset: { x: 0.98, y: 0.22, z: 1.1 },
    bodyDimensions: { width: 1.9, height: 1.5, length: 4.5 },
  },
};

/**
 * Get vehicle configuration by type with fallback
 */
export function getVehicleConfig(type: VehicleType): VehicleConfig {
  return VEHICLE_CONFIGS[type] || VEHICLE_CONFIGS.evo;
}

/**
 * Get all available vehicle types
 */
export function getAvailableVehicles(): VehicleType[] {
  return Object.keys(VEHICLE_CONFIGS) as VehicleType[];
}
