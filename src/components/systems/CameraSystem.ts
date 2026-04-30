/**
 * Camera System
 * Multiple camera modes with smooth transitions, FOV dynamics, and follow behavior
 */

import * as THREE from 'three';

export type CameraMode = 'chase' | 'far' | 'hood';

export interface CameraConfig {
  height: number;
  distance: number;
  fovOffset: number;
  lerpFactor: number;
  lookAhead: number;
}

export const CAMERA_CONFIGS: Record<CameraMode, CameraConfig> = {
  chase: {
    height: 3.5,
    distance: 9,
    fovOffset: 0,
    lerpFactor: 0.07,
    lookAhead: 12,
  },
  far: {
    height: 7,
    distance: 16,
    fovOffset: -5,
    lerpFactor: 0.05,
    lookAhead: 16,
  },
  hood: {
    height: 1.5,
    distance: 1.2,
    fovOffset: 8,
    lerpFactor: 0.1,
    lookAhead: 8,
  },
};

export class CameraController {
  private camera: THREE.PerspectiveCamera;
  private currentMode: CameraMode;
  private targetPosition: THREE.Vector3;
  private lookAtTarget: THREE.Vector3;

  constructor(camera: THREE.PerspectiveCamera) {
    this.camera = camera;
    this.currentMode = 'chase';
    this.targetPosition = new THREE.Vector3();
    this.lookAtTarget = new THREE.Vector3();
  }

  /**
   * Update camera position and orientation
   */
  update(
    vehiclePosition: THREE.Vector3,
    vehicleRotation: number,
    speed: number,
    maxSpeed: number,
    delta: number
  ): void {
    const config = CAMERA_CONFIGS[this.currentMode];
    
    // Calculate dynamic FOV based on speed
    const speedRatio = Math.abs(speed) / maxSpeed;
    const speedFov = speedRatio * 6;
    const targetFov = 60 + config.fovOffset + speedFov;
    
    // Smooth FOV transition
    this.camera.fov = THREE.MathUtils.lerp(this.camera.fov, targetFov, 0.05);
    this.camera.updateProjectionMatrix();

    // Calculate target camera position
    const targetCamX = vehiclePosition.x - Math.sin(vehicleRotation) * config.distance;
    const targetCamZ = vehiclePosition.z - Math.cos(vehicleRotation) * config.distance;
    const targetCamY = config.height;

    // Smooth camera movement
    this.targetPosition.set(targetCamX, targetCamY, targetCamZ);
    this.camera.position.lerp(this.targetPosition, config.lerpFactor);

    // Calculate look-at target (ahead of vehicle)
    this.lookAtTarget.set(
      vehiclePosition.x + Math.sin(vehicleRotation) * config.lookAhead,
      vehiclePosition.y + (this.currentMode === 'hood' ? 0.8 : 1.2),
      vehiclePosition.z + Math.cos(vehicleRotation) * config.lookAhead
    );

    this.camera.lookAt(this.lookAtTarget);
  }

  /**
   * Switch camera mode
   */
  setMode(mode: CameraMode): void {
    this.currentMode = mode;
  }

  /**
   * Cycle to next camera mode
   */
  cycleMode(): CameraMode {
    const modes: CameraMode[] = ['chase', 'far', 'hood'];
    const currentIndex = modes.indexOf(this.currentMode);
    this.currentMode = modes[(currentIndex + 1) % modes.length];
    return this.currentMode;
  }

  /**
   * Get current camera mode
   */
  getMode(): CameraMode {
    return this.currentMode;
  }

  /**
   * Get camera mode label
   */
  getModeLabel(): string {
    const labels: Record<CameraMode, string> = {
      chase: 'Chase',
      far: 'Far',
      hood: 'Hood',
    };
    return labels[this.currentMode];
  }

  /**
   * Instant teleport camera (for respawns)
   */
  teleport(position: THREE.Vector3, rotation: number): void {
    const config = CAMERA_CONFIGS[this.currentMode];
    this.camera.position.set(
      position.x - Math.sin(rotation) * config.distance,
      config.height,
      position.z - Math.cos(rotation) * config.distance
    );
    this.camera.lookAt(
      position.x + Math.sin(rotation) * config.lookAhead,
      position.y + 1.2,
      position.z + Math.cos(rotation) * config.lookAhead
    );
  }
}
