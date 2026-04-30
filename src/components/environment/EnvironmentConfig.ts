/**
 * Environment Configuration System
 * Handles terrain, weather, time of day, and lighting configurations
 */

export type EnvironmentType = 'coastal' | 'mountain' | 'city';
export type TimeOfDayType = 'dawn' | 'noon' | 'sunset' | 'midnight';
export type WeatherType = 'clear' | 'rain' | 'fog' | 'overcast';

export interface TerrainConfig {
  groundColor: string;
  roadColor: string;
  lineColor: string;
  propTypes: string[];
  buildingColors: string[];
  curveIntensity: number;
}

export interface SkyConfig {
  top: string;
  bottom: string;
  fogColor: string;
  lightIntensity: number;
  ambient: string;
  sunColor: string;
  fogNear: number;
  fogFar: number;
}

// Environment presets
export const ENVIRONMENTS: Record<EnvironmentType, TerrainConfig> = {
  coastal: {
    groundColor: '#5A8C3E',
    roadColor: '#2A2A2A',
    lineColor: '#FBBF24',
    propTypes: ['palm', 'building', 'palm', 'palm'],
    buildingColors: ['#E8C07A', '#D4775A', '#E09B6B', '#C4654A', '#E8D5A0'],
    curveIntensity: 0.6,
  },
  mountain: {
    groundColor: '#3A5A2E',
    roadColor: '#1F1F1F',
    lineColor: '#FFFFFF',
    propTypes: ['tree', 'tree', 'tree', 'rock'],
    buildingColors: ['#5A6B5A', '#6B7B6B', '#4A5B4A'],
    curveIntensity: 1.5,
  },
  city: {
    groundColor: '#4A5A3A',
    roadColor: '#252525',
    lineColor: '#FBBF24',
    propTypes: ['building', 'building', 'pole', 'building'],
    buildingColors: ['#8899AA', '#99AABB', '#778899', '#AABBCC', '#BBCCDD'],
    curveIntensity: 0.25,
  },
};

// Time of day presets
const TIME_OF_DAY_BASE: Record<TimeOfDayType, Omit<SkyConfig, 'fogNear' | 'fogFar'>> = {
  dawn: {
    top: '#3B4D6E',
    bottom: '#E8A87C',
    fogColor: '#D4956E',
    lightIntensity: 0.75,
    ambient: '#4A3D52',
    sunColor: '#FFD4A0',
  },
  noon: {
    top: '#4A90D9',
    bottom: '#D4E8FC',
    fogColor: '#B8D4F0',
    lightIntensity: 1.3,
    ambient: '#8899AA',
    sunColor: '#FFFFFF',
  },
  sunset: {
    top: '#1F2840',
    bottom: '#E05A30',
    fogColor: '#C04D2A',
    lightIntensity: 0.85,
    ambient: '#5A3328',
    sunColor: '#FF9060',
  },
  midnight: {
    top: '#060A12',
    bottom: '#0E1525',
    fogColor: '#0A0F1A',
    lightIntensity: 0.18,
    ambient: '#141A28',
    sunColor: '#556688',
  },
};

// Weather modifiers
const WEATHER_MODIFIERS: Record<WeatherType, { fogNear: number; fogFar: number; intensityMod: number }> = {
  clear: { fogNear: 80, fogFar: 400, intensityMod: 1.0 },
  rain: { fogNear: 40, fogFar: 220, intensityMod: 0.7 },
  fog: { fogNear: 15, fogFar: 120, intensityMod: 0.5 },
  overcast: { fogNear: 60, fogFar: 300, intensityMod: 0.8 },
};

/**
 * Get sky configuration based on time and weather
 */
export function getSkyConfig(timeOfDay: TimeOfDayType, weather: WeatherType): SkyConfig {
  const base = TIME_OF_DAY_BASE[timeOfDay];
  const weatherMod = WEATHER_MODIFIERS[weather];

  return {
    ...base,
    fogNear: weatherMod.fogNear,
    fogFar: weatherMod.fogFar,
  };
}

/**
 * Get terrain configuration for environment
 */
export function getTerrainConfig(environment: EnvironmentType): TerrainConfig {
  return ENVIRONMENTS[environment] || ENVIRONMENTS.city;
}

/**
 * Get weather fog color overlay
 */
export function getWeatherFogColor(weather: WeatherType, baseFogColor: string): string {
  const weatherColors: Record<WeatherType, string> = {
    clear: baseFogColor,
    rain: '#7A8A9A',
    fog: '#C8C8C8',
    overcast: '#5A6A7A',
  };
  return weatherColors[weather] || baseFogColor;
}

/**
 * Get available environment types
 */
export function getAvailableEnvironments(): EnvironmentType[] {
  return Object.keys(ENVIRONMENTS) as EnvironmentType[];
}

/**
 * Get available time of day options
 */
export function getAvailableTimes(): TimeOfDayType[] {
  return Object.keys(TIME_OF_DAY_BASE) as TimeOfDayType[];
}

/**
 * Get available weather options
 */
export function getAvailableWeathers(): WeatherType[] {
  return Object.keys(WEATHER_MODIFIERS) as WeatherType[];
}
