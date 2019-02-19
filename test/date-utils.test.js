import getFloorTimestamp from 'date-utils'

describe('floor by 10', () => {
  test('floor 1550589511000 should be 1550589000000', () => {
    expect(getFloorTimestamp(1550589511000)).toBe(1550589000000)
  })
  test('floor 1524345115000 should be 1524345000000', () => {
    expect(getFloorTimestamp(1524345115000)).toBe(1524345000000)
  })
  test('floor 1572886799000 should be 1572886200000', () => {
    expect(getFloorTimestamp(1572886799000)).toBe(1572886200000)
  })
})

describe('floor by 5', () => {
  test('floor 1550589511000 should be 1550589300000', () => {
    expect(getFloorTimestamp(1550589511000, 5)).toBe(1550589300000)
  })
  test('floor 1524345115000 should be 1524345000000', () => {
    expect(getFloorTimestamp(1524345115000, 5)).toBe(1524345000000)
  })
  test('floor 1572886799000 should be 1572886500000', () => {
    expect(getFloorTimestamp(1572886799000, 5)).toBe(1572886500000)
  })
})
