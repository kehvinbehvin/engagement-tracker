import logger from "../utils/logger/src/logger"

const activityLogger = logger.child({
   channel: 'activity' ,
})

export default activityLogger;