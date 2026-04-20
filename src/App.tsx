import { useState, useEffect, useCallback, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import Game, { VehicleType, EnvironmentType, TimeOfDayType, WeatherType } from './components/Game';
import UI from './components/UI';

function App() {
  const [vehicle, setVehicle] = useState<VehicleType>('evo');
  const [environment, setEnvironment] = useState<EnvironmentType>('coastal');
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDayType>('noon');
  const [weather, setWeather] = useState<WeatherType>('clear');
  const [autoDrive, setAutoDrive] = useState(false);
  const [speed, setSpeed] = useState(0);
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
        gl={{ antialias: true, preserveDrawingBuffer: true }}
        shadows
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
        />
      </Canvas>

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
