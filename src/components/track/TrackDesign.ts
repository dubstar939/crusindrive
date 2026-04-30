/**
 * Track Design and Road Generation System
 * Modular circuit design with drift zones, checkpoints, and procedural road generation
 */

import * as THREE from 'three';

export interface TrackSegment {
  type: 'straight' | 'curve';
  length: number;
  radius?: number;
  angle?: number;
}

export interface DriftZone {
  x: number;
  z: number;
  radius: number;
  surface: 'gravel' | 'dirt' | 'sand';
}

export interface Checkpoint {
  index: number;
  position: THREE.Vector3;
  radius: number;
  routeId: string;
  passed: boolean;
}

export interface Route {
  id: string;
  name: string;
  checkpoints: Checkpoint[];
  lapDistance: number;
}

export interface GeneratedRoadSegment {
  position: THREE.Vector3;
  rotation: number;
  curve: number;
}

// Default track design - circuit layout
export const DEFAULT_TRACK_DESIGN = {
  circuit: [
    { type: 'straight', length: 40 } as TrackSegment,
    { type: 'curve', radius: 1.2, angle: 90, length: 15 } as TrackSegment,
    { type: 'straight', length: 30 } as TrackSegment,
    { type: 'curve', radius: 1.2, angle: 90, length: 15 } as TrackSegment,
    { type: 'straight', length: 40 } as TrackSegment,
    { type: 'curve', radius: 1.2, angle: 90, length: 15 } as TrackSegment,
    { type: 'straight', length: 30 } as TrackSegment,
    { type: 'curve', radius: 1.2, angle: 90, length: 15 } as TrackSegment,
  ],
  driftZones: [
    { x: -150, z: 200, radius: 40, surface: 'gravel' } as DriftZone,
    { x: 150, z: -200, radius: 40, surface: 'dirt' } as DriftZone,
    { x: -200, z: -150, radius: 35, surface: 'gravel' } as DriftZone,
    { x: 200, z: 150, radius: 35, surface: 'dirt' } as DriftZone,
  ],
};

export const ROAD_WIDTH = 14;
export const SEGMENT_LENGTH = 6;

/**
 * Generate road segments from track design
 */
export function generateRoadSegments(
  visibleSegments: number,
  trackDesign: TrackSegment[] = DEFAULT_TRACK_DESIGN.circuit
): GeneratedRoadSegment[] {
  const segments: GeneratedRoadSegment[] = [];
  let x = 0;
  let z = 0;
  let rot = 0;
  let curve = 0;

  // Build complete circuit path for smoother transitions
  const circuitPath: Array<{
    type: string;
    radius?: number;
    turnAmount?: number;
    curveVar?: number;
  }> = [];

  trackDesign.forEach((part) => {
    if (part.type === 'straight') {
      for (let s = 0; s < part.length; s++) {
        circuitPath.push({
          type: 'straight',
          curveVar: (Math.random() - 0.5) * 0.12,
        });
      }
    } else if (part.type === 'curve') {
      const turnPerSegment = ((part.angle || 0) * Math.PI / 180) / part.length;
      for (let s = 0; s < part.length; s++) {
        circuitPath.push({
          type: 'curve',
          radius: part.radius,
          turnAmount: turnPerSegment,
        });
      }
    }
  });

  // Generate segments following the circuit path, looping as needed
  let pathIndex = 0;
  for (let i = 0; i < visibleSegments; i++) {
    const pathPart = circuitPath[pathIndex % circuitPath.length];

    if (pathPart.type === 'curve' && pathPart.turnAmount) {
      curve = (pathPart.radius || 1.0) * 0.7;
      rot += pathPart.turnAmount;
    } else {
      curve = pathPart.curveVar || 0;
      rot += curve * 0.008;
    }

    x += Math.sin(rot) * SEGMENT_LENGTH;
    z += Math.cos(rot) * SEGMENT_LENGTH;

    segments.push({
      position: new THREE.Vector3(x, 0, z),
      rotation: rot,
      curve,
    });

    pathIndex++;
  }

  return segments;
}

/**
 * Create checkpoints from road segments
 */
export function createCheckpoints(
  segments: GeneratedRoadSegment[],
  routeId: string = 'main_circuit'
): Checkpoint[] {
  const checkpoints: Checkpoint[] = [];
  const checkpointInterval = 10; // Place checkpoint every N segments

  for (let i = 0; i < segments.length; i += checkpointInterval) {
    const segment = segments[i];
    if (!segment) continue;

    checkpoints.push({
      index: checkpoints.length,
      position: segment.position.clone(),
      radius: ROAD_WIDTH + 5,
      routeId,
      passed: false,
    });
  }

  return checkpoints;
}

/**
 * Calculate total lap distance
 */
export function calculateLapDistance(segments: GeneratedRoadSegment[]): number {
  return segments.length * SEGMENT_LENGTH;
}

/**
 * Get segment at specific distance along track
 */
export function getSegmentAtDistance(
  segments: GeneratedRoadSegment[],
  distance: number
): GeneratedRoadSegment | null {
  const segmentIndex = Math.floor(distance / SEGMENT_LENGTH) % segments.length;
  return segments[segmentIndex] || null;
}

/**
 * Find nearest road segment to a position
 */
export function findNearestSegment(
  segments: GeneratedRoadSegment[],
  position: THREE.Vector3
): { segment: GeneratedRoadSegment; distance: number; index: number } | null {
  let nearest: { segment: GeneratedRoadSegment; distance: number; index: number } | null = null;
  let minDistance = Infinity;

  segments.forEach((segment, index) => {
    const dx = position.x - segment.position.x;
    const dz = position.z - segment.position.z;
    const dist = Math.sqrt(dx * dx + dz * dz);

    if (dist < minDistance) {
      minDistance = dist;
      nearest = { segment, distance: dist, index };
    }
  });

  return nearest;
}

/**
 * Check if position is on road
 */
export function isOnRoad(
  position: THREE.Vector3,
  segments: GeneratedRoadSegment[],
  roadWidth: number = ROAD_WIDTH
): boolean {
  for (const segment of segments) {
    const dx = position.x - segment.position.x;
    const dz = position.z - segment.position.z;
    const dist = Math.sqrt(dx * dx + dz * dz);

    if (dist < roadWidth / 2 + 1.5) {
      return true;
    }
  }

  return false;
}

/**
 * Check if position is in a drift zone
 */
export function isInDriftZone(
  position: THREE.Vector3,
  driftZones: DriftZone[]
): { inZone: boolean; zone: DriftZone | null } {
  for (const zone of driftZones) {
    const dx = position.x - zone.x;
    const dz = position.z - zone.z;
    const dist = Math.sqrt(dx * dx + dz * dz);

    if (dist < zone.radius) {
      return { inZone: true, zone };
    }
  }

  return { inZone: false, zone: null };
}
