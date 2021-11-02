import Ffmpeg from 'fluent-ffmpeg'
import logger from '../logger/logger'

export class Command {
  constructor(
    private name: string,
    private cwd: string,
    private debugMode: boolean = false,
    private cmd: Ffmpeg.FfmpegCommand = Ffmpeg(),
    private filters: Ffmpeg.FilterSpecification[] = []
  ) {
    this.cmd = Ffmpeg({ cwd: this.cwd })
    if (this.debugMode) {
      this.cmd.inputOptions(['-loglevel debug', '-report'])
    }
  }

  runCommand() {
    this.cmd
      .on('start', (cmdLine) => {
        logger.info({ cmdLine }, `Started: ${this.name}`)
      })
      .on('error', (err, stderr) =>
        logger.error({ err, stderr }, `Failed: ${this.name}`)
      )
      .on('end', (stdout) => {
        logger.info({ stdout }, `Finished: ${this.name}`)
      })
      .run()
  }

  input(filename: string, options?: string[]) {
    this.cmd.input(filename).inputOptions(options ?? [])

    return this
  }

  output(filename: string, options?: string[]) {
    this.cmd.output(filename).outputOptions(options ?? [])

    return this
  }
}
