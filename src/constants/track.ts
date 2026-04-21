// Road and track constants
export const SEGMENT_LENGTH = 6;
export const VISIBLE_SEGMENTS = 180;
export const ROAD_PIECES = 50;
export const ROAD_WIDTH = 12;

// City grid constants
export const CITY_GRID_SIZE = 6;
export const BLOCK_SIZE = 100;
export const CITY_ROAD_WIDTH = 14;
export const LANE_WIDTH = 3.5;

// Track design for circuit generation
export const TRACK_DESIGN = {
  circuit: [
    { type: 'straight', length: 20 },
    { type: 'curve', angle: 90, radius: 1.2, length: 12 },
    { type: 'straight', length: 15 },
    { type: 'curve', angle: 90, radius: 1.2, length: 12 },
    { type: 'straight', length: 20 },
    { type: 'curve', angle: 90, radius: 1.2, length: 12 },
    { type: 'straight', length: 15 },
    { type: 'curve', angle: 90, radius: 1.2, length: 12 },
  ],
  driftZones: [
    { x: -150, z: -150, radius: 60, surface: 'gravel' },
    { x: 150, z: 150, radius: 60, surface: 'dirt' },
    { x: -150, z: 150, radius: 60, surface: 'gravel' },
    { x: 150, z: -150, radius: 60, surface: 'dirt' },
  ],
};
