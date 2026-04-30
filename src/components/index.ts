/**
 * Component Library Exports
 * Centralized export point for all game components and systems
 */

// Vehicle Components
export { VEHICLE_CONFIGS, getVehicleConfig, getAvailableVehicles } from './vehicles/VehicleConfig';
export type { VehicleType, VehicleConfig } from './vehicles/VehicleConfig';
export { 
  Wheel, BusWheel, TruckWheel,
  EvoModel, WrxModel, ImprezaModel, SportbikeModel, BusModel, TruckModel,
  VehicleModel 
} from './vehicles/VehicleModels';

// Environment Components
export { 
  ENVIRONMENTS, getSkyConfig, getTerrainConfig, getWeatherFogColor,
  getAvailableEnvironments, getAvailableTimes, getAvailableWeathers
} from './environment/EnvironmentConfig';
export type { 
  EnvironmentType, TimeOfDayType, WeatherType, 
  TerrainConfig, SkyConfig 
} from './environment/EnvironmentConfig';
export {
  PalmTree, PineTree, Building, Mountain, StreetLight, Rock,
  GuardRail, TrafficCone, Barrier, Prop, PropBatch
} from './environment/EnvironmentProps';
export type { PropData } from './environment/EnvironmentProps';

// Track Components
export {
  DEFAULT_TRACK_DESIGN, ROAD_WIDTH, SEGMENT_LENGTH,
  generateRoadSegments, createCheckpoints, calculateLapDistance,
  getSegmentAtDistance, findNearestSegment, isOnRoad, isInDriftZone
} from './track/TrackDesign';
export type {
  TrackSegment, DriftZone, Checkpoint, Route, GeneratedRoadSegment
} from './track/TrackDesign';

// Systems
export { VehiclePhysics, detectSurface } from './systems/VehiclePhysics';
export type { PhysicsState, PhysicsInput, PhysicsConfig, SurfaceEffect } from './systems/VehiclePhysics';

export { CameraController, CAMERA_CONFIGS } from './systems/CameraSystem';
export type { CameraMode, CameraConfig } from './systems/CameraSystem';

export { InputHandler, DEFAULT_KEY_BINDINGS, createInputHandlerRef } from './systems/InputHandler';
export type { KeyAction, KeyBinding } from './systems/InputHandler';

export { ObjectPool, GroupPool, ParticlePool } from './systems/ObjectPool';
export type { PoolItem } from './systems/ObjectPool';

// UI Components
export { default as UI } from './UI';
export { default as Game } from './Game';
