import { parseArguments } from './arguments'
import { RuntypeError } from './exceptions'
import logger from './logger/logger'

function main() {
  try {
    parseArguments()
  } catch (e) {
    if (e instanceof RuntypeError) {
      logger.error(e.details())
    }
  }
}

main()
