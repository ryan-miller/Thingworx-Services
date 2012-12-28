var entities
var result
var entity
var user
var Session = Resources['CurrentSessionInfo'].GetGlobalSessionValues()

// should be able to get JUST users
entities = Resources['SearchFunctions'].SearchModelEntities({
  tags: "Applications:ATS",
  maxItems: 500
})

result = Resources['InfoTableFunctions'].CreateInfoTableFromDataShape({
  infoTableName: "InfoTable",
  dataShapeName: "ATSUserInformation"
})

for each (entity in entities.rows) {
  // should be able to get JUST users
  if (entity.type == "User") {
    user = Users[entity.name]
    // show only shared accounts
    //if(user.PrimaryAccount == Session[0].UIAccount) {
      result.AddRow({ 
        DisplayName: user.title + " " + user.firstName + " " + user.lastName,
        UserName: user.name, 
        FirstName: user.firstName, 
        LastName: user.lastName, 
        EmailAddress : user.name, 
        Title : user.title,
        Tags : user.tags,
        Type : "ATSAdministrators", 
        ATSAccount : user.PrimaryAccount
      })
    //}
  }
} 