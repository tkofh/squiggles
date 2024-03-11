import invariant from 'tiny-invariant'
import { type CurveAxis, createCurveAxis } from './axis'
import { createLengthLookup } from './sample'
import type { Spline } from './splines'
import { splines } from './splines'
import { round } from './util'

export type Point<Axis extends string | number> = Readonly<{
  [A in Axis]: number
}>

export type Curve<Axis extends string | number> = {
  readonly axes: Readonly<Record<Axis, CurveAxis>>
  readonly positionAt: (
    input: number,
    normalize?: number,
    precision?: number,
  ) => Point<Axis>
  readonly solveWhere: <SolveAxis extends Axis>(
    axis: SolveAxis,
    position: number,
    precsiion?: number,
  ) => Point<Axis>
}

function createCurve<Axis extends string | number>(
  points: ReadonlyArray<Point<Axis>>,
  spline: Spline,
): Curve<Axis> {
  const axisKeys = Object.keys(points[0]) as unknown as ReadonlyArray<Axis>
  const axisPoints = {} as Record<Axis, Array<number>>

  for (const key of axisKeys) {
    axisPoints[key] = []
  }

  for (const point of points) {
    for (const key of axisKeys) {
      invariant(key in point, `Point ${point} is missing axis "${key}"`)
      axisPoints[key].push(point[key])
    }
  }

  const axes = {} as Record<Axis, CurveAxis>
  for (const key of axisKeys) {
    axes[key] = createCurveAxis(spline.chunkCoefficients(axisPoints[key]))
  }

  const solveT = (t: number, precision = 12) => {
    const rounded = round(t)
    invariant(
      rounded >= 0 && rounded <= 1,
      `t must be between 0 and 1, got ${rounded}`,
    )
    const position = {} as { [A in Axis]: number }
    for (const key of axisKeys) {
      position[key] = round(axes[key].solvePosition(rounded), precision)
    }
    return position
  }

  const lengthLookup = createLengthLookup(solveT)

  const positionAt = (input: number, normalize = 1, precision = 12) => {
    invariant(
      input >= 0 && input <= 1,
      `Input must be between 0 and 1, got ${input}`,
    )
    let t = input
    if (normalize > 0) {
      const denormalizedT = lengthLookup(input)

      if (normalize === 1) {
        t = denormalizedT
      } else {
        t = (1 - normalize) * input + normalize * denormalizedT
      }
    }

    return solveT(t, precision)
  }

  const solveWhere = <SolveAxis extends Axis>(
    axis: SolveAxis,
    position: number,
    precision = 12,
  ): Point<Axis> => {
    const curveAxis = axes[axis]
    invariant(curveAxis.monotonicity !== 'none', 'Axis is not monotonic')

    const t = curveAxis.solveT(position, curveAxis.domain)[0]

    invariant(
      typeof t === 'number',
      `Could not solve for ${axis} = ${position}`,
    )

    const result = { [axis]: round(position, precision) } as {
      [A in Axis]: number
    }
    for (const key of axisKeys) {
      if (key !== axis) {
        result[key] = round(axes[key].solvePosition(t), precision)
      }
    }

    return result
  }

  return {
    axes,
    positionAt,
    solveWhere,
  }
}

export function createBasisCurve<Axis extends string | number>(
  points: ReadonlyArray<Point<Axis>>,
  triplicateEndpoints = true,
): Curve<Axis> {
  return createCurve(points, splines.basis(triplicateEndpoints))
}

export function createBezierCurve<Axis extends string | number>(
  points: ReadonlyArray<Point<Axis>>,
): Curve<Axis> {
  return createCurve(points, splines.bezier)
}

export function createCardinalCurve<Axis extends string | number>(
  points: ReadonlyArray<Point<Axis>>,
  tension = 0.5,
  duplicateEndpoints = true,
): Curve<Axis> {
  return createCurve(points, splines.cardinal(tension, duplicateEndpoints))
}

export function createCatmullRomCurve<Axis extends string | number>(
  points: ReadonlyArray<Point<Axis>>,
  duplicateEndpoints = true,
): Curve<Axis> {
  return createCurve(points, splines.catmullRom(duplicateEndpoints))
}

export function createHermiteCurve<Axis extends string | number>(
  points: ReadonlyArray<Point<Axis>>,
): Curve<Axis> {
  return createCurve(points, splines.hermite)
}
