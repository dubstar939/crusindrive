/**
 * Vehicle Physics Engine
 * Advanced arcade physics with drift mechanics, traction modeling, and stability systems
 */

import * as THREE from 'three';

export interface PhysicsState {
  position: THREE.Vector3;
  rotation: number;
  speed: number;
  steerAngle: number;
  angularVelocity: number;
  slipAngle: number;
}

export interface PhysicsInput {
  accelerating: boolean;
  braking: boolean;
  steeringLeft: boolean;
  steeringRight: boolean;
  boosting: boolean;
  autoDrive: boolean;
}

export interface PhysicsConfig {
  maxSpeed: number;
  acceleration: number;
  handling: number;
  friction: number;
  brakeForce: number;
  driftFactor: number;
  turnDamping: number;
}

export interface SurfaceEffect {
  isOffRoad: boolean;
  inDriftZone: boolean;
  surfaceType: 'road' | 'gravel' | 'dirt' | 'grass';
  tractionMultiplier: number;
}

export class VehiclePhysics {
  private state: PhysicsState;
  private config: PhysicsConfig;
  
  constructor(config: PhysicsConfig, initialState?: Partial<PhysicsState>) {
    this.config = config;
    this.state = {
      position: new THREE.Vector3(0, 0, 0),
      rotation: 0,
      speed: 0,
      steerAngle: 0,
      angularVelocity: 0,
      slipAngle: 0,
      ...initialState,
    };
  }

  /**
   * Update physics state for one frame
   */
  update(input: PhysicsInput, delta: number, surface: SurfaceEffect): PhysicsState {
    const { config, state } = this;
    
    // Apply surface traction effects
    const traction = surface.tractionMultiplier;
    const effectiveFriction = Math.pow(config.friction, traction);
    const effectiveDriftFactor = surface.inDriftZone 
      ? config.driftFactor * 0.97 
      : config.driftFactor;

    // Acceleration / Braking
    if (input.accelerating) {
      const speedRatio = state.speed / config.maxSpeed;
      const accelCurve = 1 - speedRatio * 0.6; // Less acceleration at high speed
      state.speed = Math.min(
        state.speed + config.acceleration * accelCurve * delta * traction,
        input.boosting ? config.maxSpeed * 1.2 : config.maxSpeed
      );
    } else if (input.braking) {
      state.speed = Math.max(
        state.speed - config.acceleration * config.brakeForce * delta * traction,
        -config.maxSpeed * 0.3
      );
    } else {
      // Natural deceleration
      state.speed *= effectiveFriction;
      if (Math.abs(state.speed) < 0.2) state.speed = 0;
    }

    // Steering with speed-dependent sensitivity
    const speedRatio = Math.abs(state.speed) / config.maxSpeed;
    const speedFactor = Math.max(0.1, Math.min(1.0, speedRatio));
    const steerSensitivity = config.handling * (0.4 + speedFactor * 0.6);
    
    // High-speed damping for stability
    const highSpeedDamping = speedRatio > 0.7 ? 1 - (speedRatio - 0.7) * 0.8 : 1;

    // Calculate target steering
    let targetSteer = 0;
    if (input.steeringLeft) targetSteer = 1;
    if (input.steeringRight) targetSteer = -1;

    // Smooth steering interpolation
    state.steerAngle = THREE.MathUtils.lerp(
      state.steerAngle,
      targetSteer,
      config.turnDamping * delta * 8
    );

    // Apply steering to rotation
    const actualSteer = state.steerAngle * steerSensitivity * highSpeedDamping * delta * 3.0;
    const directionMultiplier = state.speed > 0 ? 1 : state.speed < -1 ? -0.5 : 0;
    state.rotation += actualSteer * directionMultiplier;

    // Normalize rotation
    state.rotation = THREE.MathUtils.normalizeAngle(state.rotation);

    // Calculate slip angle for drift visualization
    const lateralVelocity = state.speed * Math.sin(state.steerAngle * 0.5);
    state.slipAngle = Math.atan2(lateralVelocity, Math.abs(state.speed) + 0.1);

    // Update position
    state.position.x += Math.sin(state.rotation) * state.speed * delta * 0.28;
    state.position.z += Math.cos(state.rotation) * state.speed * delta * 0.28;

    return { ...this.state };
  }

  /**
   * Reset physics state
   */
  reset(position?: THREE.Vector3): void {
    this.state.position = position?.clone() || new THREE.Vector3(0, 0, 0);
    this.state.rotation = 0;
    this.state.speed = 0;
    this.state.steerAngle = 0;
    this.state.angularVelocity = 0;
    this.state.slipAngle = 0;
  }

  /**
   * Get current physics state
   */
  getState(): Readonly<PhysicsState> {
    return { ...this.state };
  }

  /**
   * Set position directly (for teleport/reset)
   */
  setPosition(position: THREE.Vector3): void {
    this.state.position.copy(position);
  }

  /**
   * Set speed directly (for checkpoints)
   */
  setSpeed(speed: number): void {
    this.state.speed = Math.max(-config.maxSpeed * 0.3, Math.min(speed, config.maxSpeed));
  }
}

/**
 * Detect surface type based on position relative to road segments
 */
export function detectSurface(
  position: THREE.Vector3,
  roadSegments: Array<{ position: THREE.Vector3; width: number }>,
  driftZones: Array<{ x: number; z: number; radius: number; surface: string }>
): SurfaceEffect {
  // Check drift zones first
  for (const zone of driftZones) {
    const dx = position.x - zone.x;
    const dz = position.z - zone.z;
    const dist = Math.sqrt(dx * dx + dz * dz);
    
    if (dist < zone.radius) {
      return {
        isOffRoad: false,
        inDriftZone: true,
        surfaceType: zone.surface as 'gravel' | 'dirt',
        tractionMultiplier: zone.surface === 'gravel' ? 0.85 : 0.9,
      };
    }
  }

  // Check road segments
  let onRoad = false;
  for (const segment of roadSegments) {
    const dx = position.x - segment.position.x;
    const dz = position.z - segment.position.z;
    const dist = Math.sqrt(dx * dx + dz * dz);
    
    if (dist < segment.width / 2 + 1.5) {
      onRoad = true;
      break;
    }
  }

  if (onRoad) {
    return {
      isOffRoad: false,
      inDriftZone: false,
      surfaceType: 'road',
      tractionMultiplier: 1.0,
    };
  }

  // Off-road
  return {
    isOffRoad: true,
    inDriftZone: false,
    surfaceType: 'grass',
    tractionMultiplier: 0.7,
  };
}
