import type { Pipeable } from '../internal/pipeable'
import type { Interval } from '../interval'
import type { QuadraticPolynomial } from '../polynomial/quadratic'
import type { Vector2 } from '../vector/vector2'
import type { QuadraticCurve2dTypeId } from './quadratic2d.internal'
import * as internal from './quadratic2d.internal'

export interface QuadraticCurve2d extends Pipeable {
  readonly [QuadraticCurve2dTypeId]: QuadraticCurve2dTypeId

  readonly c0: QuadraticPolynomial
  readonly c1: QuadraticPolynomial
}

export const make: (
  c0: QuadraticPolynomial,
  c1: QuadraticPolynomial,
) => QuadraticCurve2d = internal.make

export const isQuadraticCurve2d: (c: unknown) => c is QuadraticCurve2d =
  internal.isQuadraticCurve2d

export const solve: {
  (t: number): (c: QuadraticCurve2d) => Vector2
  (c: QuadraticCurve2d, t: number): Vector2
} = internal.solve

export const length: {
  (c: QuadraticCurve2d, i: Interval): number
  (i: Interval): (c: QuadraticCurve2d) => number
} = internal.length