import pino from 'pino'

const level = process.env.LOG_LEVEL || 'info'

const config = {
  enabled: true,
  level,
}
export const logger = process.env.LOG_DESTINATION
  ? pino(
      config,
      pino.destination(
        `${process.env.LOG_DESTINATION}${Math.random().toString().substring(0, 5)}.log`,
      ),
    )
  : pino(config)
