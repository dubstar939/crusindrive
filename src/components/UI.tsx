import { useState } from 'react';
import { VehicleType, EnvironmentType, TimeOfDayType, WeatherType } from './Game';

interface UIProps {
  speed: number;
  vehicle: VehicleType;
  environment: EnvironmentType;
  timeOfDay: TimeOfDayType;
  weather: WeatherType;
  autoDrive: boolean;
  isOffRoad: boolean;
  cameraMode: number;
  onVehicleChange: (v: VehicleType) => void;
  onEnvironmentChange: (e: EnvironmentType) => void;
  onTimeOfDayChange: (t: TimeOfDayType) => void;
  onWeatherChange: (w: WeatherType) => void;
  onAutoDriveChange: (a: boolean) => void;
  onCameraModeChange: (c: number) => void;
}

const VEHICLES: { id: VehicleType; label: string; desc: string; icon: string }[] = [
  { id: 'evo', label: 'Lancer Evo', desc: 'Balanced AWD, 170 km/h', icon: '🔴' },
  { id: 'wrx', label: 'WRX STI', desc: 'Agile rally, 155 km/h', icon: '⚪' },
  { id: 'impreza', label: 'Impreza GC8', desc: 'Rally legend, 165 km/h', icon: '🔵' },
  { id: 'sportbike', label: 'Sport Bike', desc: 'Fast & lean, 195 km/h', icon: '🏍️' },
  { id: 'bus', label: 'City Bus', desc: 'Slow & heavy, 85 km/h', icon: '🚌' },
];

const ENVIRONMENTS: { id: EnvironmentType; label: string; desc: string; icon: string }[] = [
  { id: 'coastal', label: 'Coastal Highway', desc: 'Palm trees, ocean views', icon: '🌴' },
  { id: 'mountain', label: 'Mountain Pass', desc: 'Tight curves, pine forests', icon: '⛰️' },
  { id: 'city', label: 'Urban Circuit', desc: 'Buildings, street lights', icon: '🏙️' },
];

const TIMES: { id: TimeOfDayType; label: string; icon: string }[] = [
  { id: 'dawn', label: 'Dawn', icon: '🌅' },
  { id: 'noon', label: 'Noon', icon: '☀️' },
  { id: 'sunset', label: 'Sunset', icon: '🌇' },
  { id: 'midnight', label: 'Night', icon: '🌙' },
];

const WEATHERS: { id: WeatherType; label: string; icon: string }[] = [
  { id: 'clear', label: 'Clear', icon: '☀️' },
  { id: 'overcast', label: 'Overcast', icon: '☁️' },
  { id: 'rain', label: 'Rain', icon: '🌧️' },
  { id: 'fog', label: 'Fog', icon: '🌫️' },
];

const CAMERA_LABELS = ['Chase', 'Far', 'Hood'];

export default function UI({
  speed,
  vehicle,
  environment,
  timeOfDay,
  weather,
  autoDrive,
  isOffRoad,
  cameraMode,
  onVehicleChange,
  onEnvironmentChange,
  onTimeOfDayChange,
  onWeatherChange,
  onAutoDriveChange,
  onCameraModeChange,
}: UIProps) {
  const [menuOpen, setMenuOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<'vehicle' | 'route' | 'conditions'>('vehicle');

  const gear = speed > 130 ? 5 : speed > 90 ? 4 : speed > 50 ? 3 : speed > 15 ? 2 : 1;
  const rpmPercent = Math.min(((speed % 40) / 40) * 100, 100);

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-4 md:p-6 select-none"
      style={{ fontFamily: "'Rajdhani', sans-serif" }}>

      {/* ===== TOP BAR ===== */}
      <div className="flex justify-between items-start pointer-events-auto">
        {/* Title */}
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-wider text-white uppercase"
            style={{ textShadow: '0 2px 8px rgba(0,0,0,0.7)' }}>
            <span className="text-red-500">Cruise</span> Control
          </h1>
          <p className="text-[10px] md:text-xs text-gray-400 tracking-widest uppercase mt-0.5">
            JDM Street Racing — Low Poly
          </p>
        </div>

        {/* Controls hint */}
        <div className="hidden md:flex gap-3 bg-black/60 backdrop-blur-sm border border-gray-700/50 px-4 py-2 rounded-lg">
          {[
            ['WASD', 'Drive'],
            ['SHIFT', 'Boost'],
            ['SPACE', 'Brake'],
            ['C', 'Camera'],
            ['F', 'Auto'],
          ].map(([key, label]) => (
            <div key={key} className="flex items-center gap-1.5">
              <kbd className="bg-gray-800 border border-gray-600 text-gray-300 text-[10px] font-bold px-1.5 py-0.5 rounded"
                style={{ fontFamily: "'Share Tech Mono', monospace" }}>{key}</kbd>
              <span className="text-gray-500 text-[10px]">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ===== OFF ROAD WARNING ===== */}
      {isOffRoad && (
        <div className="self-center pointer-events-none">
          <div className="bg-red-600/90 text-white font-bold py-2 px-8 rounded-lg animate-pulse text-sm border border-red-400 shadow-lg shadow-red-900/40">
            ⚠️ OFF ROAD — PRESS R TO RESET
          </div>
        </div>
      )}

      {/* ===== BOTTOM UI ===== */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-end pointer-events-auto">

        {/* Speedometer */}
        <div className="bg-black/70 backdrop-blur-sm border border-gray-700/50 p-4 rounded-xl shadow-2xl min-w-[200px]">
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-bold text-white tracking-tight"
              style={{ fontFamily: "'Share Tech Mono', monospace" }}>
              {Math.round(speed)}
            </span>
            <span className="text-lg font-bold text-gray-500">km/h</span>
          </div>

          {/* RPM bar */}
          <div className="mt-2 h-1.5 bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-100"
              style={{
                width: `${rpmPercent}%`,
                background: rpmPercent > 85 ? '#EF4444' : rpmPercent > 60 ? '#F59E0B' : '#22C55E',
              }}
            />
          </div>

          <div className="flex justify-between mt-2 text-[10px] font-semibold uppercase">
            <span className="text-gray-500">
              Gear <span className="text-white text-xs">{gear}</span>
            </span>
            <span className={autoDrive ? 'text-emerald-400' : 'text-gray-600'}>
              {autoDrive ? '● AUTO' : '○ MANUAL'}
            </span>
            <span className="text-gray-500">
              Cam <span className="text-white text-xs">{CAMERA_LABELS[cameraMode]}</span>
            </span>
          </div>
        </div>

        {/* Settings Panel */}
        <div className="w-full md:w-[420px] bg-black/70 backdrop-blur-sm border border-gray-700/50 rounded-xl shadow-2xl overflow-hidden">

          {/* Tab bar */}
          <div className="flex border-b border-gray-700/50">
            {(['vehicle', 'route', 'conditions'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => { setActiveTab(tab); setMenuOpen(true); }}
                className={`flex-1 py-2.5 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === tab && menuOpen
                    ? 'text-white bg-red-600/80 border-b-2 border-red-400'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {tab === 'vehicle' ? '🚗 Vehicle' : tab === 'route' ? '🗺️ Route' : '🌤️ Conditions'}
              </button>
            ))}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="px-3 text-gray-500 hover:text-white transition cursor-pointer text-sm"
            >
              {menuOpen ? '▼' : '▲'}
            </button>
          </div>

          {/* Panel content */}
          {menuOpen && (
            <div className="p-4">

              {/* === VEHICLE TAB === */}
              {activeTab === 'vehicle' && (
                <div className="space-y-3">
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-2">Select Your Ride</p>
                  <div className="grid grid-cols-1 gap-2">
                    {VEHICLES.map((v) => (
                      <button
                        key={v.id}
                        onClick={() => onVehicleChange(v.id)}
                        className={`flex items-center gap-3 p-2.5 rounded-lg border transition-all cursor-pointer ${
                          vehicle === v.id
                            ? 'bg-red-600/20 border-red-500/60 text-white'
                            : 'bg-gray-900/50 border-gray-700/40 text-gray-400 hover:bg-gray-800/60 hover:text-gray-200'
                        }`}
                      >
                        <span className="text-xl w-8 text-center">{v.icon}</span>
                        <div className="text-left flex-1">
                          <div className="text-sm font-bold">{v.label}</div>
                          <div className="text-[10px] text-gray-500">{v.desc}</div>
                        </div>
                        {vehicle === v.id && (
                          <span className="text-red-400 text-xs font-bold">ACTIVE</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* === ROUTE TAB === */}
              {activeTab === 'route' && (
                <div className="space-y-3">
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-2">Choose Your Track</p>
                  <div className="grid grid-cols-1 gap-2">
                    {ENVIRONMENTS.map((env) => (
                      <button
                        key={env.id}
                        onClick={() => onEnvironmentChange(env.id)}
                        className={`flex items-center gap-3 p-3 rounded-lg border transition-all cursor-pointer ${
                          environment === env.id
                            ? 'bg-red-600/20 border-red-500/60 text-white'
                            : 'bg-gray-900/50 border-gray-700/40 text-gray-400 hover:bg-gray-800/60 hover:text-gray-200'
                        }`}
                      >
                        <span className="text-2xl">{env.icon}</span>
                        <div className="text-left flex-1">
                          <div className="text-sm font-bold">{env.label}</div>
                          <div className="text-[10px] text-gray-500">{env.desc}</div>
                        </div>
                        {environment === env.id && (
                          <span className="text-red-400 text-xs font-bold">●</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* === CONDITIONS TAB === */}
              {activeTab === 'conditions' && (
                <div className="space-y-4">
                  {/* Time of Day */}
                  <div>
                    <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-2">Time of Day</p>
                    <div className="grid grid-cols-4 gap-1.5">
                      {TIMES.map((t) => (
                        <button
                          key={t.id}
                          onClick={() => onTimeOfDayChange(t.id)}
                          className={`flex flex-col items-center gap-1 py-2 rounded-lg border text-xs font-bold transition cursor-pointer ${
                            timeOfDay === t.id
                              ? 'bg-red-600/20 border-red-500/60 text-white'
                              : 'bg-gray-900/50 border-gray-700/40 text-gray-500 hover:text-white hover:bg-gray-800/60'
                          }`}
                        >
                          <span className="text-base">{t.icon}</span>
                          <span className="text-[10px]">{t.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Weather */}
                  <div>
                    <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-2">Weather</p>
                    <div className="grid grid-cols-4 gap-1.5">
                      {WEATHERS.map((w) => (
                        <button
                          key={w.id}
                          onClick={() => onWeatherChange(w.id)}
                          className={`flex flex-col items-center gap-1 py-2 rounded-lg border text-xs font-bold transition cursor-pointer ${
                            weather === w.id
                              ? 'bg-red-600/20 border-red-500/60 text-white'
                              : 'bg-gray-900/50 border-gray-700/40 text-gray-500 hover:text-white hover:bg-gray-800/60'
                          }`}
                        >
                          <span className="text-base">{w.icon}</span>
                          <span className="text-[10px]">{w.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Camera + Auto */}
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => onCameraModeChange((cameraMode + 1) % 3)}
                      className="py-2.5 bg-gray-800/80 hover:bg-gray-700/80 border border-gray-700/50 text-gray-300 font-bold rounded-lg text-xs uppercase transition cursor-pointer"
                    >
                      📷 Camera: {CAMERA_LABELS[cameraMode]}
                    </button>
                    <button
                      onClick={() => onAutoDriveChange(!autoDrive)}
                      className={`py-2.5 border font-bold rounded-lg text-xs uppercase transition cursor-pointer ${
                        autoDrive
                          ? 'bg-emerald-600/30 border-emerald-500/60 text-emerald-300'
                          : 'bg-gray-800/80 border-gray-700/50 text-gray-400 hover:bg-gray-700/80'
                      }`}
                    >
                      {autoDrive ? '🤖 Auto: ON' : '🎮 Auto: OFF'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
