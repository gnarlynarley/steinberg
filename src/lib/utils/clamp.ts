export default function clamp(min: number, max: number, value: number): number {
  return Math.max(Math.min(value, max), min);
}
