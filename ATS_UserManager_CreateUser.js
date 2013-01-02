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
    logger.warn('Passwords do not match')
    throw ('Sorry, Passwords do not match!')
  } 
} 

try {

  Users[EmailAddress].firstName = FirstName
  Users[EmailAddress].lastName = LastName
  Users[EmailAddress].title = Title
  Users[EmailAddress].AddTags({tags: "Applications:ATS"})
  Users[EmailAddress].SetHomeMashup({name: 'ATSHome'})
  //Users[EmailAddress].AddTags({tags: Tags})
  // primary account should be set to the same as the logged in user's Primary Account
  Users[EmailAddress].PrimaryAccount = me.GetPrimaryAccount()

  Groups[Type].AddMember({
    member: EmailAddress
  })

} catch (e) {
  logger.error('can not set user properties')
}