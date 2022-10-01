import logger from "../utils/logger/src/logger"

const newcomerLogger = logger.child({
   channel: 'newcomer' ,
})

export default newcomerLogger;