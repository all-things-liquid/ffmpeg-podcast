import { Array, Boolean, Record as R, Static, String } from 'runtypes'
import { InvalidArgumentsException } from './exceptions'

const NonEmptyString = String.withConstraint(
  (s) => s !== '' || 'This is an empty string'
)

const ValidArguments = R({
  directory: NonEmptyString,
  podcastFileNames: Array(NonEmptyString),
  musicFileName: NonEmptyString,
  hasVideo: Boolean,
  outputName: NonEmptyString,
})

type Arguments = Static<typeof ValidArguments>

enum ArgumentOption {
  DIRECTORY = 'd',
  PODCAST_FILES = 'p',
  MUSIC_FILE = 'm',
  HAS_VIDEO = 'v',
  OUTPUT_NAME = 'o',
}

function displayHelp() {
  console.info(
    'Use: npm run start d=<directory> p=<podcast_files> m=<music> v=<0|1> o=<output_name>'
  )
  console.info("All parameters are required, order doesn't matter")
  console.info(
    '\t-d\t Absolute path to the directory where the files are stored'
  )
  console.info(
    '\t-p\t Podcast filenames with extension. If more than one, separated with a comma without space, e.g. p=part1.mp3,part2.mp3'
  )
  console.info(
    '\t-m\t Music filename with extension. Only one music allowed in this demo'
  )
  console.info('\t-v\t Add video support to the audio. set to true or false')
  console.info('\t-o\t Output filename with extension')
}

function validateArguments(args: unknown): Arguments {
  const validatedArguments = ValidArguments.validate(args)

  if (validatedArguments.success === false) {
    throw new InvalidArgumentsException(validatedArguments)
  }

  return validatedArguments.value
}

export function parseArguments() {
  const args = process.argv.slice(2)
  if (args.length < 5) {
    displayHelp()
  }

  const formattedArgs: Record<string, unknown> = {}
  args.map((el) => {
    const [key, value] = el.split('=')

    switch (key) {
      case ArgumentOption.DIRECTORY:
        formattedArgs['directory'] = value
        break
      case ArgumentOption.PODCAST_FILES:
        formattedArgs['podcastFileNames'] = value.split(',')
        break
      case ArgumentOption.MUSIC_FILE:
        formattedArgs['musicFileName'] = value
        break
      case ArgumentOption.HAS_VIDEO:
        formattedArgs['hasVideo'] = value === 'true' ? true : false
        break
      case ArgumentOption.OUTPUT_NAME:
        formattedArgs['outputName'] = value
        break
      default:
        displayHelp()
    }
  })

  return validateArguments(formattedArgs)
}
