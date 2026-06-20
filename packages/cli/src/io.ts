export type CliIo = {
  readonly cwd: string
  readonly stderr: (message: string) => void
  readonly stdout: (message: string) => void
}
