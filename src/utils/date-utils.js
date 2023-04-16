export default function getFloorTimestamp (timestamp, minute) {
  const t = timestamp || Date.now()
  const m = 1000 * 60 * (minute || 10)
  return Math.floor(t / m) * m
}
