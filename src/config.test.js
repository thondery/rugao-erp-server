export default {
  name            : 'rugao-erp-server',
  debug           : true,
  host            : 'localhost',
  port            : 14000,
  logger          : {
    path            : 'logger',
    filename        : 'access.log',
    maxlogsize      : 500,
    category        : 'ERP-SERVER',
    format          : ':method :url :status',
    level           : 'auto'
  },
}