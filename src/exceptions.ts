import { Failure } from 'runtypes'

export abstract class RuntypeError extends Error {
  details() {
    throw new Error('details() not implemented')
  }
}

export class InvalidArgumentsException extends RuntypeError {
  private failure: Failure

  constructor(result: Failure) {
    const errorMessage = result.message
    const message = `Invalid arguments, ${errorMessage}}`
    super(message)

    this.failure = result
  }

  details() {
    return this.failure.details
  }
}
