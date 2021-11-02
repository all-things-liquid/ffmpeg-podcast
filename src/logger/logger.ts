import pino from 'pino'

export default pino({
  serializers: {
    err: pino.stdSerializers.err,
  },
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: true,
    },
  },
})
