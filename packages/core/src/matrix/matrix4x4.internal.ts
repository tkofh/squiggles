import { dual } from '../internal/function'
import { Pipeable } from '../internal/pipeable'
import { PRECISION, invariant, round } from '../util'
import {
  type Vector4,
  components,
  dot,
  vector4,
} from '../vector/vector4.internal'
import * as matrix3x3 from './matrix3x3.internal'
import type { Matrix4x4, Matrix4x4Coordinate } from './matrix4x4'

const TypeBrand: unique symbol = Symbol.for('curvy/matrix4x4')
type TypeBrand = typeof TypeBrand

class Matrix4x4Impl extends Pipeable implements Matrix4x4 {
  readonly [TypeBrand]: TypeBrand = TypeBrand

  readonly m00: number
  readonly m01: number
  readonly m02: number
  readonly m03: number

  readonly m10: number
  readonly m11: number
  readonly m12: number
  readonly m13: number

  readonly m20: number
  readonly m21: number
  readonly m22: number
  readonly m23: number

  readonly m30: number
  readonly m31: number
  readonly m32: number
  readonly m33: number

  precision: number

  constructor(
    m00 = 0,
    m01 = m00,
    m02 = m01,
    m03 = m02,
    m10 = m00,
    m11 = m01,
    m12 = m02,
    m13 = m03,
    m20 = m00,
    m21 = m01,
    m22 = m02,
    m23 = m03,
    m30 = m00,
    m31 = m01,
    m32 = m02,
    m33 = m03,
    precision = PRECISION,
    _immutable = false,
  ) {
    super()

    this.m00 = round(m00, precision)
    this.m01 = round(m01, precision)
    this.m02 = round(m02, precision)
    this.m03 = round(m03, precision)
    this.m10 = round(m10, precision)
    this.m11 = round(m11, precision)
    this.m12 = round(m12, precision)
    this.m13 = round(m13, precision)
    this.m20 = round(m20, precision)
    this.m21 = round(m21, precision)
    this.m22 = round(m22, precision)
    this.m23 = round(m23, precision)
    this.m30 = round(m30, precision)
    this.m31 = round(m31, precision)
    this.m32 = round(m32, precision)
    this.m33 = round(m33, precision)

    this.precision = precision
  }
}

export const isMatrix4x4 = (m: unknown): m is Matrix4x4 => typeof m === 'object'

export const make = (
  m00 = 0,
  m01 = m00,
  m02 = m01,
  m03 = m02,
  m10 = m00,
  m11 = m01,
  m12 = m02,
  m13 = m03,
  m20 = m00,
  m21 = m01,
  m22 = m02,
  m23 = m03,
  m30 = m00,
  m31 = m01,
  m32 = m02,
  m33 = m03,
  precision = PRECISION,
) =>
  new Matrix4x4Impl(
    m00,
    m01,
    m02,
    m03,
    m10,
    m11,
    m12,
    m13,
    m20,
    m21,
    m22,
    m23,
    m30,
    m31,
    m32,
    m33,
    precision,
  )

export const fromRows = (
  v0: Vector4,
  v1: Vector4,
  v2: Vector4,
  v3: Vector4,
  precision?: number,
) =>
  new Matrix4x4Impl(
    v0.v0,
    v0.v1,
    v0.v2,
    v0.v3,
    v1.v0,
    v1.v1,
    v1.v2,
    v1.v3,
    v2.v0,
    v2.v1,
    v2.v2,
    v2.v3,
    v3.v0,
    v3.v1,
    v3.v2,
    v3.v3,
    precision ??
      Math.min(v0.precision, v1.precision, v2.precision, v3.precision),
  )

export const fromColumns = (
  v0: Vector4,
  v1: Vector4,
  v2: Vector4,
  v3: Vector4,
  precision?: number,
) =>
  new Matrix4x4Impl(
    v0.v0,
    v1.v0,
    v2.v0,
    v3.v0,
    v0.v1,
    v1.v1,
    v2.v1,
    v3.v1,
    v0.v2,
    v1.v2,
    v2.v2,
    v3.v2,
    v0.v3,
    v1.v3,
    v2.v3,
    v3.v3,
    precision ??
      Math.min(v0.precision, v1.precision, v2.precision, v3.precision),
  )

export const setRow = dual(
  3,
  (m: Matrix4x4, row: Matrix4x4Coordinate, v: Vector4) =>
    fromRows(
      ...(toRows(m).with(row, v) as [Vector4, Vector4, Vector4, Vector4]),
    ),
)

export const setColumn = dual(
  3,
  (m: Matrix4x4, column: Matrix4x4Coordinate, v: Vector4) =>
    fromColumns(
      ...(toColumns(m).with(column, v) as [Vector4, Vector4, Vector4, Vector4]),
    ),
)

export const determinant = (m: Matrix4x4) =>
  round(
    m.m00 * matrix3x3.determinant(minor(m, 0, 0)) -
      m.m01 * matrix3x3.determinant(minor(m, 0, 1)) +
      m.m02 * matrix3x3.determinant(minor(m, 0, 2)) -
      m.m03 * matrix3x3.determinant(minor(m, 0, 3)),
  )

export const minor = dual(
  3,
  (m: Matrix4x4, row: Matrix4x4Coordinate, column: Matrix4x4Coordinate) => {
    const [v0, v1, v2] = toColumns(m).toSpliced(row, 1) as [
      Vector4,
      Vector4,
      Vector4,
    ]
    const [m00, m01, m02] = components(v0).toSpliced(column, 1) as [
      number,
      number,
      number,
    ]
    const [m10, m11, m12] = components(v1).toSpliced(column, 1) as [
      number,
      number,
      number,
    ]
    const [m20, m21, m22] = components(v2).toSpliced(column, 1) as [
      number,
      number,
      number,
    ]

    return matrix3x3.make(
      m00,
      m01,
      m02,
      m10,
      m11,
      m12,
      m20,
      m21,
      m22,
      m.precision,
    )
  },
)

export const vectorProductLeft = dual(2, (m: Matrix4x4, v: Vector4) => {
  const [v0, v1, v2, v3] = toRows(m) as [Vector4, Vector4, Vector4, Vector4]
  return vector4(
    dot(v0, v),
    dot(v1, v),
    dot(v2, v),
    dot(v3, v),
    Math.min(m.precision, v.precision),
  )
})

export const vectorProductRight = dual(2, (m: Matrix4x4, v: Vector4) => {
  const [v0, v1, v2, v3] = toColumns(m) as [Vector4, Vector4, Vector4, Vector4]

  return vector4(
    dot(v, v0),
    dot(v, v1),
    dot(v, v2),
    dot(v, v3),
    Math.min(m.precision, v.precision),
  )
})

export const toRows = (m: Matrix4x4) => [
  vector4(m.m00, m.m01, m.m02, m.m03, m.precision),
  vector4(m.m10, m.m11, m.m12, m.m13, m.precision),
  vector4(m.m20, m.m21, m.m22, m.m23, m.precision),
  vector4(m.m30, m.m31, m.m32, m.m33, m.precision),
]

export const toColumns = (m: Matrix4x4) => [
  vector4(m.m00, m.m10, m.m20, m.m30, m.precision),
  vector4(m.m01, m.m11, m.m21, m.m31, m.precision),
  vector4(m.m02, m.m12, m.m22, m.m32, m.precision),
  vector4(m.m03, m.m13, m.m23, m.m33, m.precision),
]

export const solveSystem = dual(2, (m: Matrix4x4, v: Vector4) => {
  const inverseDeterminant = 1 / determinant(m)

  invariant(
    Number.isFinite(inverseDeterminant),
    'cannot solve system when coefficient matrix determinant is zero',
  )

  return vector4(
    determinant(setRow(m, 0, v)) * inverseDeterminant,
    determinant(setRow(m, 1, v)) * inverseDeterminant,
    determinant(setRow(m, 2, v)) * inverseDeterminant,
    determinant(setRow(m, 3, v)) * inverseDeterminant,
  )
})
