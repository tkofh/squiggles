import { describe, expect, test } from 'vitest'
import * as interval from '../src/interval'

describe('interval', () => {
  test('make', () => {
    expect(interval.make(0)).toMatchObject({
      start: 0,
      end: 0,
    })
    expect(interval.make(0, 1)).toMatchObject({
      start: 0,
      end: 1,
    })
    expect(interval.make(0, 1, 2)).toMatchObject({
      start: 0,
      end: 1,
      precision: 2,
    })
    expect(() => interval.make(0, -1)).toThrowError()
  })

  test('isInterval', () => {
    expect(interval.isInterval(interval.make(0))).toBe(true)
    expect(interval.isInterval({ start: 0, end: 1 })).toBe(false)
  })

  test('size', () => {
    expect(interval.size(interval.make(0))).toBe(0)
    expect(interval.size(interval.make(0, 1))).toBe(1)
  })

  test('filter', () => {
    expect(
      interval.filter(interval.make(0, 1), [-0.5, 0, 0.5, 1, 1.5]),
    ).toEqual([0, 0.5, 1])
  })

  test('contains', () => {
    expect(interval.contains(interval.make(0, 1), 0)).toBe(true)
    expect(interval.contains(interval.make(0, 1), 0.5)).toBe(true)
    expect(interval.contains(1)(interval.make(0, 1))).toBe(true)
    expect(interval.contains(interval.make(0, 1), -0.5)).toBe(false)
  })

  test('clamp', () => {
    expect(interval.clamp(interval.make(0, 1), -0.5)).toBe(0)
    expect(interval.clamp(interval.make(0, 1), 0)).toBe(0)
    expect(interval.clamp(interval.make(0, 1), 0.5)).toBe(0.5)
    expect(interval.clamp(interval.make(0, 1), 1)).toBe(1)
    expect(interval.clamp(interval.make(0, 1), 1.5)).toBe(1)
  })

  test('lerp', () => {
    expect(interval.lerp(0.5, interval.make(0, 2))).toBe(1)
  })

  test('normalize', () => {
    expect(interval.normalize(5, interval.make(0, 10))).toBe(0.5)
  })

  test('remap', () => {
    expect(interval.remap(0.5, interval.make(0, 1), interval.make(0, 2))).toBe(
      1,
    )
  })
})
