import { createParametricSplineFactory } from '../../uniform'

export const createCubicHermiteSpline = createParametricSplineFactory([
  [2, -3, 0, 1],
  [1, -2, 1, 0],
  [1, -1, 0, 0],
  [-2, 3, 0, 0],
])
