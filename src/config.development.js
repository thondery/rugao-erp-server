import path from 'path'

const SERVER_HOST = '0.0.0.0'
const SERVER_PORT = 4000

export default {
  name            : 'rugao-erp-server',
  sitename        : '企业ERP管理系统',
  siteurl         : `http://${SERVER_HOST}:${SERVER_PORT}`,
  debug           : true,
  host            : SERVER_HOST,
  port            : SERVER_PORT,
  logger          : {
    path            : 'logger',
    filename        : 'access.log',
    maxlogsize      : 500,
    category        : 'ERP-SERVER',
    format          : ':method :url :status',
    level           : 'auto'
  },
  data            : path.resolve(process.cwd(), 'data')
}