# Slow Roads Clone - Relaxing 3D Driving Simulator

## Concept & Vision
A serene, meditative 3D driving experience that emphasizes the joy of the journey rather than destinations or competition. Players cruise endlessly along procedurally generated winding roads through beautiful landscapes. The experience should feel like a moving meditation - peaceful, scenic, and utterly relaxing. Think of it as "digital ASMR for road trips."

## Design Language

### Aesthetic Direction
Soft, low-poly aesthetic inspired by minimalist travel photography and lo-fi album covers. Warm, golden-hour lighting that feels nostalgic and comforting.

### Color Palette
- **Primary (Sky)**: `#87CEEB` (light sky blue) to `#1E3A5F` (deep twilight blue)
- **Secondary (Nature)**: `#4A7C59` (forest green), `#8FBC8F` (sage)
- **Accent (Sunset)**: `#F4A460` (sandy brown), `#FF6B35` (warm orange)
- **Road**: `#3D3D3D` (asphalt gray)
- **Background**: Gradient from `#87CEEB` to `#FDB777` (sunrise/sunset)
- **UI Text**: `#FFFFFF` with soft shadows

### Typography
- **Primary Font**: 'Quicksand', sans-serif (friendly, rounded, modern)
- **Speed/Stats**: 'Orbitron', monospace (futuristic dashboard feel)

### Spatial System
- Full viewport 3D canvas
- Minimal HUD overlay with speed, controls hint
- Floating control panel that can be collapsed

### Motion Philosophy
- Smooth camera transitions when switching views
- Gentle road generation without jarring pop-ins
- Soft particle effects for dust/leaves
- UI panels slide in/out with 300ms ease-out

### Visual Assets
- Low-poly 3D models (car, motorcycle, bus)
- Procedurally generated terrain with hills
- Dynamic sky with sun position
- Simple tree/rock decorations along roadside

## Layout & Structure

### Main View
- Full-screen 3D canvas as primary experience
- Bottom-left: Current speed display (km/h)
- Bottom-right: Control hints (collapsible)
- Top-right: Settings panel toggle
- Top-left: Game title/logo

### Settings Panel
- Vehicle selection (Car, Motorcycle, Bus)
- Environment (Hills, Plains, Desert, Snow)
- Time of Day (Dawn, Day, Sunset, Night)
- Season (Spring, Summer, Autumn, Winter)
- Road Style (Gentle, Winding, Straight)
- Toggle autodrive, reset position

## Features & Interactions

### Core Features
1. **Endless Procedural Road**: Roads generate infinitely ahead with smooth curves
2. **Vehicle Physics**: Simple acceleration, braking, steering with momentum
3. **Multiple Vehicles**: Car (balanced), Motorcycle (fast, agile), Bus (slow, stable)
4. **Environment Modes**: Different terrain textures and colors per setting
5. **Time System**: Dynamic sky colors based on time selection
6. **Autodrive**: AI takes the wheel with gentle steering

### Controls
- **W / ↑**: Accelerate
- **S / ↓**: Brake / Reverse
- **A / ←**: Steer Left
- **D / →**: Steer Right
- **Shift**: Boost (temporary speed increase)
- **Space**: Handbrake (quick stop)
- **R**: Reset position to road center
- **C**: Cycle camera views
- **F**: Toggle autodrive

### Interactions
- Settings panel slides in from right edge
- Vehicle changes instant with smooth camera adjustment
- Time/environment changes with smooth sky transition
- Speed display pulses slightly when boosting

### Edge Cases
- If player goes too far off-road, show "Press R to reset" prompt
- Minimum speed of 0, maximum speed varies by vehicle
- Autodrive maintains safe speed, avoids going off-road

## Component Inventory

### SpeedDisplay
- Large numeric display showing current speed
- Unit label (km/h)
- Subtle glow effect
- States: normal, boosting (orange glow)

### ControlHints
- Keyboard icon with control list
- Collapsible (icon only when collapsed)
- Semi-transparent background

### SettingsPanel
- Slide-in panel with grouped options
- Each setting is a button group or toggle
- Active states clearly highlighted

### VehicleSelector
- Three vehicle icons with labels
- Selected vehicle highlighted
- Hover: subtle scale up

### TimeSlider
- Visual slider for time of day
- Sun/moon icon at current position
- Affects sky gradient in real-time

## Technical Approach

### Framework
- React 18 with TypeScript
- Three.js for 3D rendering
- @react-three/fiber for React integration
- Tailwind CSS for UI styling

### Architecture
- Main game loop using useFrame hook
- Procedural road generation using bezier curves
- Simple collision detection for road boundaries
- State management with React useState/useContext

### Key Implementation Details
- Road segments generated ahead, removed behind
- Terrain as simple extruded plane with noise displacement
- Vehicles as grouped 3D primitives (boxes, cylinders)
- Sky as gradient background or simple sky sphere
