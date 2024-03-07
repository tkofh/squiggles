import { describe, expect, test } from 'vitest'
import {
  cardinal,
  toBSplineSegments,
  toBezierSegments,
  toCardinalSegments,
  toCatmullRomSegments,
  toCubicScalars,
  toHermiteSegments,
} from '../src/splines'

describe('toCubicScalars', () => {
  test('throws for array length less than four', () => {
    expect(() => toCubicScalars([0, 0, 0], 1)).toThrow()
  })

  test('throws for array length not a multiple of stride = 2', () => {
    expect(() => toCubicScalars([0, 1, 2, 3, 4], 2)).toThrow()
  })
  test('throws for array length not a multiple of stride = 3', () => {
    expect(() => toCubicScalars([0, 1, 2, 3, 4], 3)).toThrow()
  })

  test('throws for invalid stride = 0', () => {
    expect(() => toCubicScalars([0, 1, 2, 3, 4], 0)).toThrow()
  })
  test('throws for invalid stride = 4', () => {
    expect(() => toCubicScalars([0, 1, 2, 3, 4], 4)).toThrow()
  })

  test('returns correct chunks for stride = 1', () => {
    expect(toCubicScalars([0, 1, 2, 3, 4], 1)).toStrictEqual([
      [0, 1, 2, 3],
      [1, 2, 3, 4],
    ])
  })
  test('returns correct chunks for stride = 2', () => {
    expect(toCubicScalars([0, 1, 2, 3, 4, 5], 2)).toStrictEqual([
      [0, 1, 2, 3],
      [2, 3, 4, 5],
    ])
  })
  test('returns correct chunks for stride = 3', () => {
    expect(toCubicScalars([0, 1, 2, 3, 4, 5, 6], 3)).toStrictEqual([
      [0, 1, 2, 3],
      [3, 4, 5, 6],
    ])
  })
})

describe('toBezierSegments', () => {
  test('returns bezier segments for valid input [0, 1, 2, 3]', () => {
    expect(toBezierSegments([0, 1, 2, 3])).toStrictEqual([[0, 1, 2, 3]])
  })
  test('returns bezier segments for valid input [0, 1, 2, 3, 4, 5, 6]', () => {
    expect(toBezierSegments([0, 1, 2, 3, 4, 5, 6])).toStrictEqual([
      [0, 1, 2, 3],
      [3, 4, 5, 6],
    ])
  })
  test('returns bezier segments for valid input [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]', () => {
    expect(toBezierSegments([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])).toStrictEqual([
      [0, 1, 2, 3],
      [3, 4, 5, 6],
      [6, 7, 8, 9],
    ])
  })
  test('throws for invalid input for bezier segments', () => {
    expect(() => toBezierSegments([0, 1, 2, 3, 4])).toThrow()
  })
})

describe('toHermiteSegments', () => {
  test('returns hermite segments for valid input [0, 1, 2, 3]', () => {
    expect(toHermiteSegments([0, 1, 2, 3])).toStrictEqual([[0, 1, 2, 3]])
  })
  test('returns hermite segments for valid input [0, 1, 2, 3, 4, 5]', () => {
    expect(toHermiteSegments([0, 1, 2, 3, 4, 5])).toStrictEqual([
      [0, 1, 2, 3],
      [2, 3, 4, 5],
    ])
  })
  test('returns hermite segments for valid input [0, 1, 2, 3, 4, 5, 6, 7]', () => {
    expect(toHermiteSegments([0, 1, 2, 3, 4, 5, 6, 7])).toStrictEqual([
      [0, 1, 2, 3],
      [2, 3, 4, 5],
      [4, 5, 6, 7],
    ])
  })
  test('throws for invalid input for hermite segments', () => {
    expect(() => toHermiteSegments([0, 1, 2, 3, 4])).toThrow()
  })
})

describe('cardinal generator', () => {
  test('cardinal should return segments', () => {
    const a = 0.5
    expect(cardinal(a)).toStrictEqual([
      [-a, 2 - a, a - 2, a],
      [2 * a, a - 3, 3 - 2 * a, -a],
      [-a, 0, a, 0],
      [0, 1, 0, 0],
    ])
  })
})

describe('toCardinalSegments', () => {
  test('returns cardinal segments for valid input [0, 1, 2, 3]', () => {
    expect(toCardinalSegments([0, 1, 2, 3])).toStrictEqual([[0, 1, 2, 3]])
  })
  test('returns cardinal segments for valid input [0, 1, 2, 3, 4]', () => {
    expect(toCardinalSegments([0, 1, 2, 3, 4])).toStrictEqual([
      [0, 1, 2, 3],
      [1, 2, 3, 4],
    ])
  })
  test('returns cardinal segments for valid input [0, 1, 2, 3, 4, 5]', () => {
    expect(toCardinalSegments([0, 1, 2, 3, 4, 5])).toStrictEqual([
      [0, 1, 2, 3],
      [1, 2, 3, 4],
      [2, 3, 4, 5],
    ])
  })
})

describe('toCatmullRomSegments', () => {
  test('returns catmull-rom segments for valid input [0, 1, 2, 3]', () => {
    expect(toCatmullRomSegments([0, 1, 2, 3])).toStrictEqual([[0, 1, 2, 3]])
  })
  test('returns catmull-rom segments for valid input [0, 1, 2, 3, 4]', () => {
    expect(toCatmullRomSegments([0, 1, 2, 3, 4])).toStrictEqual([
      [0, 1, 2, 3],
      [1, 2, 3, 4],
    ])
  })
  test('returns catmull-rom segments for valid input [0, 1, 2, 3, 4, 5]', () => {
    expect(toCatmullRomSegments([0, 1, 2, 3, 4, 5])).toStrictEqual([
      [0, 1, 2, 3],
      [1, 2, 3, 4],
      [2, 3, 4, 5],
    ])
  })
})

describe('toBSplineSegments', () => {
  test('returns b-spline segments for valid input [0, 1, 2, 3]', () => {
    expect(toBSplineSegments([0, 1, 2, 3])).toStrictEqual([[0, 1, 2, 3]])
  })
  test('returns b-spline segments for valid input [0, 1, 2, 3, 4]', () => {
    expect(toBSplineSegments([0, 1, 2, 3, 4])).toStrictEqual([
      [0, 1, 2, 3],
      [1, 2, 3, 4],
    ])
  })
  test('returns b-spline segments for valid input [0, 1, 2, 3, 4, 5]', () => {
    expect(toBSplineSegments([0, 1, 2, 3, 4, 5])).toStrictEqual([
      [0, 1, 2, 3],
      [1, 2, 3, 4],
      [2, 3, 4, 5],
    ])
  })
})