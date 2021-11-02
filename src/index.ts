import { parseArguments } from './arguments'
import { Command } from './command/command'
import { createConcatTxtFile } from './concat'
import * as f from './constants/filenames'
import { RuntypeError } from './exceptions'
import logger from './logger/logger'

function formatPodcast(directory: string, podcastFileNames: string[]) {
  const hasMultipleFiles = podcastFileNames.length > 1
  if (hasMultipleFiles) {
    createConcatTxtFile(podcastFileNames, `${directory}/${f.CONCAT_TXT}`)

    new Command('concatenate podcast files', directory)
      .concatPodcastFiles()
      .output(f.CONCAT_OUTPUT)
      .runCommand()
  }

  new Command('convert podcast to adequate specs', directory)
    .input(hasMultipleFiles ? f.CONCAT_OUTPUT : podcastFileNames[0])
    .convertAudio()
    .output(f.PODCAST_FINAL)
    .runCommand()
}

function formatMusic(directory: string, musicFileName: string) {
  new Command('convert podcast to adequate specs', directory)
    .input(musicFileName)
    .convertAudio()
    .output(f.PODCAST_FINAL)
    .runCommand()
}

function main() {
  try {
    const {
      directory,
      podcastFileNames,
      musicFileName, //hasVideo, outputName
    } = parseArguments()

    formatPodcast(directory, podcastFileNames)
    formatMusic(directory, musicFileName)
  } catch (e) {
    if (e instanceof RuntypeError) {
      logger.error(e.details())
    }
  }
}

main()
