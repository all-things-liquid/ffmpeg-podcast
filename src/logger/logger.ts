import pino from 'pino'

export default pino({
  serializers: {
    err: pino.stdSerializers.err,
  }
})