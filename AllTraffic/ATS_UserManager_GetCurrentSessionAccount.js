var session = Resources['CurrentSessionInfo'].GetGlobalSessionValues()
var user = session.rows[0].UIAccount
var result

if (user != null) {
  result = user
} else {
  logger.warn('User does not have an account in the current session')
  result = ''
}