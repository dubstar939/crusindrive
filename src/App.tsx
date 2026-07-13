import { useState, useEffect, useCallback, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import Game, { VehicleType, EnvironmentType, TimeOfDayType, WeatherType, VEHICLE_CONFIGS } from './components/Game';
import UI from './components/UI';
import { HUD } from './components/HUD';

function App() {
  const [vehicle, setVehicle] = useState<VehicleType>('evo');
  const [environment, setEnvironment] = useState<EnvironmentType>('coastal');
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDayType>('noon');
  const [weather, setWeather] = useState<WeatherType>('clear');
  const [autoDrive, setAutoDrive] = useState(false);
  const [speed, setSpeed] = useState(0);
  const [rpm, setRpm] = useState(0);
  const [gear, setGear] = useState(1);
  const [isDrifting, setIsDrifting] = useState(false);
  const [isOffRoad, setIsOffRoad] = useState(false);
  const [cameraMode, setCameraMode] = useState(0);

  const keysPressed = useRef<Set<string>>(new Set());

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    keysPressed.current.add(e.key.toLowerCase());

    if (e.key.toLowerCase() === 'c') {
      setCameraMode((prev) => (prev + 1) % 3);
    }
    if (e.key.toLowerCase() === 'f') {
      setAutoDrive((prev) => !prev);
    }
  }, []);

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    keysPressed.current.delete(e.key.toLowerCase());
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  return (
    <div className="w-full h-screen bg-black text-gray-100 overflow-hidden relative select-none antialiased">
      <Canvas
        camera={{ position: [0, 4, -10], fov: 60 }}
        gl={{ 
          antialias: true, 
          preserveDrawingBuffer: true,
        }}
        shadows
        dpr={[1, 2]}
      >
        <Game
          vehicle={vehicle}
          environment={environment}
          timeOfDay={timeOfDay}
          weather={weather}
          autoDrive={autoDrive}
          cameraMode={cameraMode}
          keysPressed={keysPressed}
          onSpeedChange={setSpeed}
          onOffRoadChange={setIsOffRoad}
          onGearChange={setGear}
          onRpmChange={setRpm}
          onDriftChange={setIsDrifting}
        />
      </Canvas>

      {/* New HUD overlay with drift indicator and improved readability */}
      <HUD
        speed={speed}
        rpm={rpm}
        maxRpm={VEHICLE_CONFIGS[vehicle].maxRpm}
        gear={gear}
        isDrifting={isDrifting}
        isMobile={false}
      />

      <UI
        speed={speed}
        vehicle={vehicle}
        environment={environment}
        timeOfDay={timeOfDay}
        weather={weather}
        autoDrive={autoDrive}
        isOffRoad={isOffRoad}
        cameraMode={cameraMode}
        onVehicleChange={setVehicle}
        onEnvironmentChange={setEnvironment}
        onTimeOfDayChange={setTimeOfDay}
        onWeatherChange={setWeather}
        onAutoDriveChange={setAutoDrive}
        onCameraModeChange={setCameraMode}
      />
    </div>
  );
}

export default App;
