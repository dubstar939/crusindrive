import React from 'react';

interface HUDProps {
  speed: number;
  rpm: number;
  maxRpm: number;
  gear: number;
  isDrifting: boolean;
  isMobile?: boolean;
  onBoost?: () => void;
  onBrake?: () => void;
}

export const HUD: React.FC<HUDProps> = ({
  speed,
  rpm,
  maxRpm,
  gear,
  isDrifting,
  isMobile = false,
  onBoost,
  onBrake,
}) => {
  // Calculate RPM percentage for the progress bar
  const rpmPercent = Math.min(rpm / maxRpm, 1);
  
  // Dynamic styling for drift state
  const borderClass = isDrifting 
    ? 'border-orange-500/50 shadow-[0_0_15px_rgba(249,115,22,0.3)]' 
    : 'border-white/10';
    
  const textGlow = isDrifting ? 'drop-shadow-[0_0_8px_rgba(249,115,22,0.6)]' : 'drop-shadow-md';

  return (
    <div 
      className="fixed inset-0 pointer-events-none z-50 flex flex-col justify-between p-4 sm:p-6"
      style={{ 
        paddingTop: 'max(1rem, env(safe-area-inset-top))',
        paddingBottom: 'max(1rem, env(safe-area-inset-bottom))'
      }}
    >
      {/* Top Bar: Gear & Drift Indicator */}
      <div className="flex justify-between items-start">
        <div className={`bg-black/60 backdrop-blur-sm text-white px-4 py-2 rounded-lg border ${borderClass} transition-colors duration-200`}>
          <div className="text-xs uppercase tracking-wider opacity-70 mb-1">Gear</div>
          <div className="text-3xl font-bold font-mono">{gear === 0 ? 'N' : gear}</div>
        </div>
        
        {isDrifting && (
          <div className="bg-orange-500/20 backdrop-blur-md text-orange-400 px-3 py-1 rounded-full border border-orange-500/30 animate-pulse">
            <span className="text-xs font-bold tracking-widest uppercase">Drifting</span>
          </div>
        )}
      </div>

      {/* Bottom Right: Speedometer & RPM */}
      <div className="self-end flex flex-col items-end gap-2">
        <div className={`bg-black/60 backdrop-blur-sm text-white p-4 rounded-xl border ${borderClass} shadow-lg transition-colors duration-200 min-w-[140px]`}>
          <div className={`text-5xl font-bold tabular-nums ${textGlow} transition-all duration-200`}>
            {Math.round(speed)}
            <span className="text-sm font-normal opacity-70 ml-1">km/h</span>
          </div>
          
          {/* RPM Bar - Uses CSS transform for performance */}
          <div className="w-32 h-2.5 bg-gray-800/80 mt-3 rounded-full overflow-hidden border border-white/10">
            <div 
              className="h-full bg-gradient-to-r from-green-400 via-yellow-400 to-red-500 ease-out will-change-transform"
              style={{ 
                width: '100%',
                transform: `scaleX(${rpmPercent})`, 
                transformOrigin: 'left' 
              }} 
            />
          </div>
          <div className="flex justify-between text-[10px] opacity-50 mt-1 font-mono">
            <span>0</span>
            <span>{maxRpm}</span>
          </div>
        </div>
      </div>

      {/* Mobile Controls (Only visible on mobile) */}
      {isMobile && (
        <div className="pointer-events-auto flex gap-6 self-center pb-8 sm:hidden w-full justify-center">
          {onBrake && (
            <button 
              onTouchStart={onBrake}
              onTouchEnd={() => {}} // Handle release logic in parent if needed
              className="w-20 h-20 bg-red-500/20 active:bg-red-500/40 rounded-full backdrop-blur-md border-2 border-red-500/50 flex flex-col items-center justify-center text-white font-bold touch-none select-none transition-colors"
            >
              <span className="text-xs uppercase tracking-wider">Brake</span>
            </button>
          )}
          
          {onBoost && (
            <button 
              onTouchStart={onBoost}
              onTouchEnd={() => {}}
              className="w-20 h-20 bg-blue-500/20 active:bg-blue-500/40 rounded-full backdrop-blur-md border-2 border-blue-500/50 flex flex-col items-center justify-center text-white font-bold touch-none select-none transition-colors"
            >
              <span className="text-xs uppercase tracking-wider">Boost</span>
            </button>
          )}
        </div>
      )}
      
      {/* Desktop Hint */}
      {!isMobile && (
        <div className="self-center text-white/30 text-xs font-mono hidden sm:block">
          WASD to Drive • SPACE to Brake • SHIFT to Boost • C to Camera
        </div>
      )}
    </div>
  );
};
