export default function getFloorTimestamp (timestamp, minute) {
  let t = timestamp || Date.now()
  let m = 1000 * 60 * (minute || 10)
  return Math.floor(t / m) * m
}
