/**
 * Input Handler
 * Keyboard input management with key binding configuration and state tracking
 */

export type KeyAction = 
  | 'accelerate' 
  | 'brake' 
  | 'steerLeft' 
  | 'steerRight' 
  | 'boost'
  | 'reset'
  | 'cameraCycle'
  | 'autoDrive';

export interface KeyBinding {
  primary: string;
  secondary?: string;
}

export const DEFAULT_KEY_BINDINGS: Record<KeyAction, KeyBinding> = {
  accelerate: { primary: 'w', secondary: 'arrowup' },
  brake: { primary: 's', secondary: 'arrowdown' },
  steerLeft: { primary: 'a', secondary: 'arrowleft' },
  steerRight: { primary: 'd', secondary: 'arrowright' },
  boost: { primary: 'shift' },
  reset: { primary: 'r' },
  cameraCycle: { primary: 'c' },
  autoDrive: { primary: 'f' },
};

export class InputHandler {
  private keysPressed: Set<string>;
  private bindings: Record<KeyAction, KeyBinding>;
  private onActionCallbacks: Map<KeyAction, Set<(pressed: boolean) => void>>;

  constructor(bindings: Record<KeyAction, KeyBinding> = DEFAULT_KEY_BINDINGS) {
    this.keysPressed = new Set();
    this.bindings = bindings;
    this.onActionCallbacks = new Map();
    
    // Initialize callback sets for each action
    Object.keys(bindings).forEach(action => {
      this.onActionCallbacks.set(action as KeyAction, new Set());
    });
  }

  /**
   * Handle keydown event
   */
  handleKeyDown(key: string): void {
    const normalizedKey = key.toLowerCase();
    this.keysPressed.add(normalizedKey);
  }

  /**
   * Handle keyup event
   */
  handleKeyUp(key: string): void {
    const normalizedKey = key.toLowerCase();
    this.keysPressed.delete(normalizedKey);
  }

  /**
   * Check if a specific action is currently active
   */
  isActionActive(action: KeyAction): boolean {
    const binding = this.bindings[action];
    if (!binding) return false;
    
    return (
      this.keysPressed.has(binding.primary) ||
      (binding.secondary && this.keysPressed.has(binding.secondary))
    );
  }

  /**
   * Get current input state for physics
   */
  getInputState(): {
    accelerating: boolean;
    braking: boolean;
    steeringLeft: boolean;
    steeringRight: boolean;
    boosting: boolean;
  } {
    return {
      accelerating: this.isActionActive('accelerate'),
      braking: this.isActionActive('brake'),
      steeringLeft: this.isActionActive('steerLeft'),
      steeringRight: this.isActionActive('steerRight'),
      boosting: this.isActionActive('boost'),
    };
  }

  /**
   * Register callback for action state changes
   */
  onAction(action: KeyAction, callback: (pressed: boolean) => void): () => void {
    if (!this.onActionCallbacks.has(action)) {
      this.onActionCallbacks.set(action, new Set());
    }
    this.onActionCallbacks.get(action)!.add(callback);
    
    // Return unsubscribe function
    return () => {
      this.onActionCallbacks.get(action)?.delete(callback);
    };
  }

  /**
   * Get raw keys pressed set (for legacy compatibility)
   */
  getKeysPressed(): Readonly<Set<string>> {
    return new Set(this.keysPressed);
  }

  /**
   * Clear all pressed keys
   */
  clearAllKeys(): void {
    this.keysPressed.clear();
  }

  /**
   * Update bindings at runtime
   */
  updateBinding(action: KeyAction, binding: Partial<KeyBinding>): void {
    this.bindings[action] = { ...this.bindings[action], ...binding };
  }

  /**
   * Get binding description for UI display
   */
  getBindingDisplay(action: KeyAction): string {
    const binding = this.bindings[action];
    if (!binding) return '';
    
    const formatKey = (key: string) => {
      return key.length > 1 ? key.toUpperCase() : key.toUpperCase();
    };
    
    if (binding.secondary) {
      return `${formatKey(binding.primary)}/${formatKey(binding.secondary)}`;
    }
    return formatKey(binding.primary);
  }
}

/**
 * Hook factory for React integration
 */
export function createInputHandlerRef() {
  return {
    current: new InputHandler(),
  };
}
