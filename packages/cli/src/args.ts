export function optionValue(args: readonly string[], optionName: string): string | null {
  const index = args.indexOf(optionName)
  if (index < 0) {
    return null
  }

  const value = args[index + 1]
  if (value?.startsWith("--")) {
    throw new Error(`${optionName} requires a value.`)
  }

  return value ?? null
}
