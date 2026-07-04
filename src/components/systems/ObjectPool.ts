/**
 * Object Pooling System
 * Efficient object reuse for props, particles, and road segments
 */

import * as THREE from 'three';

export interface PoolItem {
  id: string;
  active: boolean;
  data?: unknown;
}

export class ObjectPool<T extends PoolItem> {
  private items: T[];
  private createFn: () => T;
  private resetFn: (item: T) => void;
  private maxSize: number;

  constructor(
    createFn: () => T,
    resetFn: (item: T) => void,
    initialSize: number = 50,
    maxSize: number = 200
  ) {
    this.createFn = createFn;
    this.resetFn = resetFn;
    this.maxSize = maxSize;
    this.items = [];

    // Pre-populate pool
    for (let i = 0; i < initialSize; i++) {
      const item = createFn();
      item.active = false;
      this.items.push(item);
    }
  }

  /**
   * Get an inactive item from the pool or create new one
   */
  acquire(): T {
    // Find inactive item
    const inactive = this.items.find(item => !item.active);
    
    if (inactive) {
      inactive.active = true;
      return inactive;
    }

    // Create new if under max size
    if (this.items.length < this.maxSize) {
      const newItem = this.createFn();
      newItem.active = true;
      this.items.push(newItem);
      return newItem;
    }

    // Return least recently used active item (fallback)
    const lru = this.items[0];
    this.resetFn(lru);
    lru.active = true;
    return lru;
  }

  /**
   * Release item back to pool
   */
  release(item: T): void {
    item.active = false;
    this.resetFn(item);
  }

  /**
   * Release all items
   */
  releaseAll(): void {
    this.items.forEach(item => {
      item.active = false;
      this.resetFn(item);
    });
  }

  /**
   * Get all active items
   */
  getActive(): T[] {
    return this.items.filter(item => item.active);
  }

  /**
   * Get all items (active and inactive)
   */
  getAll(): readonly T[] {
    return this.items;
  }

  /**
   * Get pool statistics
   */
  getStats(): { total: number; active: number; inactive: number } {
    const active = this.items.filter(i => i.active).length;
    return {
      total: this.items.length,
      active,
      inactive: this.items.length - active,
    };
  }

  /**
   * Expand pool size
   */
  expand(count: number): void {
    for (let i = 0; i < count && this.items.length < this.maxSize; i++) {
      const item = this.createFn();
      item.active = false;
      this.items.push(item);
    }
  }
}

/**
 * Three.js Group Pool for scene objects
 */
export class GroupPool {
  private pool: ObjectPool<{ id: string; active: boolean; group: THREE.Group }>;
  private scene: THREE.Group | null = null;

  constructor(
    createGroup: () => THREE.Group,
    initialSize: number = 100
  ) {
    this.pool = new ObjectPool(
      () => ({
        id: `group_${Math.random().toString(36).substr(2, 9)}`,
        active: false,
        group: createGroup(),
      }),
      (item) => {
        item.group.position.set(0, 0, 0);
        item.group.rotation.set(0, 0, 0);
        item.group.scale.set(1, 1, 1);
      },
      initialSize
    );
  }

  /**
   * Attach to scene
   */
  attachToScene(scene: THREE.Group): void {
    this.scene = scene;
    this.pool.getActive().forEach(item => {
      if (!item.group.parent) {
        scene.add(item.group);
      }
    });
  }

  /**
   * Acquire a group from pool
   */
  acquire(position?: THREE.Vector3, rotation?: THREE.Euler): THREE.Group {
    const item = this.pool.acquire();
    
    if (position) {
      item.group.position.copy(position);
    }
    if (rotation) {
      item.group.rotation.copy(rotation);
    }

    if (this.scene && !item.group.parent) {
      this.scene.add(item.group);
    }

    return item.group;
  }

  /**
   * Release a group back to pool
   */
  release(group: THREE.Group): void {
    const item = this.pool.getAll().find(i => i.group === group);
    if (item) {
      this.pool.release(item);
      if (group.parent) {
        group.parent.remove(group);
      }
    }
  }

  /**
   * Get all active groups
   */
  getActiveGroups(): THREE.Group[] {
    return this.pool.getActive().map(item => item.group);
  }

  /**
   * Update all active groups
   */
  updateAll(updateFn: (group: THREE.Group, index: number) => void): void {
    const active = this.pool.getActive();
    active.forEach((item, index) => {
      updateFn(item.group, index);
    });
  }

  /**
   * Get pool stats
   */
  getStats(): { total: number; active: number; inactive: number } {
    return this.pool.getStats();
  }
}

/**
 * Simple particle pool for effects
 */
export class ParticlePool {
  private positions: Float32Array;
  private velocities: Float32Array;
  private lifetimes: Float32Array;
  private active: boolean[];
  private count: number;
  private geometry: THREE.BufferGeometry | null = null;

  constructor(count: number = 1000) {
    this.count = count;
    this.positions = new Float32Array(count * 3);
    this.velocities = new Float32Array(count * 3);
    this.lifetimes = new Float32Array(count);
    this.active = new Array(count).fill(false);
  }

  /**
   * Initialize with buffer geometry
   */
  initGeometry(): THREE.BufferGeometry {
    this.geometry = new THREE.BufferGeometry();
    this.geometry.setAttribute('position', new THREE.BufferAttribute(this.positions, 3));
    return this.geometry;
  }

  /**
   * Spawn particle at position
   */
  spawn(x: number, y: number, z: number, vx: number, vy: number, vz: number): boolean {
    const inactiveIndex = this.active.findIndex(a => !a);
    if (inactiveIndex === -1) return false;

    const idx = inactiveIndex * 3;
    this.positions[idx] = x;
    this.positions[idx + 1] = y;
    this.positions[idx + 2] = z;

    this.velocities[idx] = vx;
    this.velocities[idx + 1] = vy;
    this.velocities[idx + 2] = vz;

    this.lifetimes[inactiveIndex] = 1.0;
    this.active[inactiveIndex] = true;

    return true;
  }

  /**
   * Update all particles
   */
  update(delta: number): void {
    for (let i = 0; i < this.count; i++) {
      if (!this.active[i]) continue;

      const idx = i * 3;
      
      // Update position
      this.positions[idx] += this.velocities[idx] * delta;
      this.positions[idx + 1] += this.velocities[idx + 1] * delta;
      this.positions[idx + 2] += this.velocities[idx + 2] * delta;

      // Update lifetime
      this.lifetimes[i] -= delta;
      if (this.lifetimes[i] <= 0) {
        this.active[i] = false;
      }
    }

    // Mark geometry for update
    if (this.geometry) {
      this.geometry.attributes.position.needsUpdate = true;
    }
  }

  /**
   * Get active particle count
   */
  getActiveCount(): number {
    return this.active.filter(a => a).length;
  }
}
