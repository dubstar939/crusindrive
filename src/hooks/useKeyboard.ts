import { useState, useRef, useCallback, useEffect } from 'react';

/**
 * Custom hook for handling keyboard input
 * Tracks pressed keys in a ref for performance
 */
export function useKeyboard() {
  const keysPressed = useRef<Set<string>>(new Set());

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    keysPressed.current.add(e.key.toLowerCase());
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

  return keysPressed;
}

/**
 * Custom hook for camera mode cycling
 */
export function useCameraMode(initialMode = 0, maxModes = 3) {
  const [cameraMode, setCameraMode] = useState(initialMode);

  const cycleCamera = useCallback(() => {
    setCameraMode((prev) => (prev + 1) % maxModes);
  }, [maxModes]);

  return { cameraMode, setCameraMode, cycleCamera };
}
