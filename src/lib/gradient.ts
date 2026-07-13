const PALETTE = [
  "linear-gradient(135deg, #1d2b53 0%, #2540a8 48%, #4f7cff 100%)",
  "linear-gradient(135deg, #241a3d 0%, #4c2b8f 48%, #8a5cf6 100%)",
  "linear-gradient(135deg, #0f2b2a 0%, #14514c 48%, #2dd4bf 100%)",
  "linear-gradient(135deg, #351a2a 0%, #7a2a4d 48%, #ec4899 100%)",
  "linear-gradient(135deg, #2a1b0f 0%, #7a4a14 48%, #f59e0b 100%)",
  "linear-gradient(135deg, #14202e 0%, #1e3a5f 48%, #38bdf8 100%)",
] as const;

export function gradientForSeed(seed: string): string {
  let hash = 0;
  for (let index = 0; index < seed.length; index += 1) {
    hash = (hash * 31 + seed.charCodeAt(index)) >>> 0;
  }
  return PALETTE[hash % PALETTE.length];
}
