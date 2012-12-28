var newUser = !me.UserExists({ UserName: EmailAddress })
var validPassword = me.ValidPassword({ Password2: ConfirmPassword, Password1: Password })

if (newUser) {
  if (validPassword) {
    try {
      Resources['EntityServices'].CreateUser({
        description: 'created via ATSUserManager.CreateUser',
        name: EmailAddress,
        password: Password
      })
    } catch (err) {
      logger.error('Cannot create user: ' + err)
    }
  } else {
    logger.warn('Invalid Password')
    throw ('Sorry, Invalid Password!')
  } 
} 

try {

  Users[EmailAddress].firstName = FirstName
  Users[EmailAddress].lastName = LastName
  Users[EmailAddress].title = Title
  Users[EmailAddress].AddTags({tags: "Applications:ATS"})
  Users[EmailAddress].AddTags({tags: Tags})
  // primary account should be set to the same as the logged in users UIAccount session
  //Users[EmailAddress].PrimaryAccount = ATSAccountName

  Groups[Type].AddMember({
    member: EmailAddress
  })

} catch (e) {
  logger.error('can not set user properties')
}