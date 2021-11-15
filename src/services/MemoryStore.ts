// An LRU cache implementation with TTL
type Options = {
  maxSize?: number;
};

class MemoryStore<Key = string, Value = string> {
  private readonly maxSize: number;
  private map = new Map<Key, Value>();
  private lifetimes = new Map<Key, number>();

  constructor(options?: Options) {
    this.maxSize = options?.maxSize ?? 1000;
  }

  public delete(key: Key): void {
    this.map.delete(key);
  }

  public get(key: Key): Value | undefined {
    if (this.lifetimes.has(key) && this.lifetimes.get(key)! < Date.now()) {
      this.lifetimes.delete(key);
      this.map.delete(key);
      return undefined;
    }

    if (this.map.has(key)) {
      const value = this.map.get(key)!;
      this.map.delete(key);
      this.map.set(key, value);
      return value;
    }

    return undefined;
  }

  public set(key: Key, value: Value, ttl?: number): void {
    this.map.set(key, value);

    if (ttl) {
      this.lifetimes.set(key, Date.now() + ttl);
    }

    // LRU eviction; Map has guaranteed ordering of keys()
    if (this.map.size > this.maxSize) {
      const lruKey = this.map.keys().next().value;
      this.map.delete(lruKey);
    }
  }
}

export default MemoryStore;
