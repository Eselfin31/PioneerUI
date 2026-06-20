export type Result<TValue, TError> =
  | { readonly kind: "ok"; readonly value: TValue }
  | { readonly kind: "err"; readonly error: TError }

export function ok<TValue>(value: TValue): Result<TValue, never> {
  return { kind: "ok", value }
}

export function err<TError>(error: TError): Result<never, TError> {
  return { kind: "err", error }
}

export function assertNever(value: never): never {
  throw new Error(`Unhandled variant: ${JSON.stringify(value)}`)
}

export function uniqueSorted(values: readonly string[]): readonly string[] {
  return Array.from(new Set(values)).sort((left, right) => left.localeCompare(right))
}

export function formatList(values: readonly string[]): string {
  return values.length === 0 ? "none" : values.join(", ")
}
