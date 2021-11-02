import Ffmpeg from 'fluent-ffmpeg'
import { CONCAT_TXT } from '../constants/filenames'
import { FREQUENCY, MONO } from '../constants/rendering'
import logger from '../logger/logger'

export class Command {
  private cmd: Ffmpeg.FfmpegCommand
  private filters: Ffmpeg.FilterSpecification[] = []
  private filtergraphInputMapping: Map<string, number> = new Map()
  private currentInputIndex = 0

  constructor(
    private name: string,
    private cwd: string,
    private debugMode: boolean = false
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
    this.filtergraphInputMapping.set(filename, this.currentInputIndex++)

    return this
  }

  output(filename: string, options?: string[]) {
    this.cmd.output(filename).outputOptions(options ?? [])

    return this
  }

  concatPodcastFiles() {
    this.cmd.input(CONCAT_TXT).inputOption('-safe 0').inputFormat('concat')
    return this
  }

  convertAudio() {
    this.cmd.audioChannels(MONO).audioFrequency(FREQUENCY)

    return this
  }

  addAudioSplitFilter(filename: string, nbOutputs: number) {
    const index = this.filtergraphInputMapping.get(filename)
    const outputs = []

    for (let i = 0; i < nbOutputs; i++) {
      outputs.push(`asplit_${i}`)
    }

    if (index) {
      this.filters.push({
        filter: 'asplit',
        inputs: [index?.toString()],
        outputs,
      })
    }
  }

  addAudioFadeFilter(filename: string, mode: 'in' | 'out') {}
}
