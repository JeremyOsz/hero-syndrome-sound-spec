/** FNV-1a 32-bit — deterministic string hash. */
export function hashString(s: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/** Mulberry32 PRNG from seed number. */
export function mulberry32(seed: number): () => number {
  return () => {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function pickIndex(seed: string, salt: string, modulo: number): number {
  if (modulo <= 0) return 0;
  const h = hashString(`${seed}\0${salt}`);
  return h % modulo;
}

export function pickFrom<T>(seed: string, salt: string, items: readonly T[]): T | undefined {
  if (items.length === 0) return undefined;
  return items[pickIndex(seed, salt, items.length)];
}
