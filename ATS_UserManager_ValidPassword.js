var passwordsMatch, isLongEnough
var result

try {
  
  passwordsMatch = function() {
    return (Password1 === Password2)
  }

  isLongEnough = function() {
    return Password1.length >= me.MinimumPasswordLength
  }

  result = (isLongEnough() && passwordsMatch())

} catch (err) {

  logger.error('Can not determine valid password:' + err)
  result = false

}