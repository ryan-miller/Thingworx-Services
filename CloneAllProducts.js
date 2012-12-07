var sourceData = Resources['ContentLoaderFunctions'].LoadXML({
  username : "Administrator",	
  ignoreSSLErrors : false,
  password : "admin",
  url : "http://10.128.0.133/Thingworx/play/AllProducts.xml",
  timeout : 60
})
var source, fsr, configTable
var prodThingName, prodThing
var ipuThingName, ipuThing
var repoThing, repoThingName
var createThingByCloning = function(source, name, description) {
  Resources['EntityServices'].CloneThing({
    sourceThingName: source,
    name: name,
    description: description
  })	 
	Things[name].EnableThing()
	Things[name].RestartThing()
}
var createUser = function(name, description, password) {
  Resources['EntityServices'].CreateUser({
    name: name,
    description: description,
    password: password
	})
}
var addUserToGroup = function(user, group) {
  logger.warn("Group: " + group + " \tUser: " + user)
  Groups[group.name].AddMember({ member : user.name })
}
var setFSR = function(source, role) {
  fsr = role + "FSR"

  if (Users[source[fsr]] == null) {
    createUser(source[fsr], source[fsr + '_last_name'] + "," + source[fsr + '_first_name'], "")
		addUserToGroup(Users[source[fsr]], Groups[source[fsr + '_Group']])
    
    Users[source[fsr]].firstName  = source[fsr + '_first_name']
    Users[source[fsr]].lastName   = source[fsr + '_last_name']
    Users[source[fsr]].title      = source[fsr + '_Group']
  }
  // set primary fsr
  prodThing[fsr] = source[fsr]
}
var updateFileRepo = function (ipuThingName, repoThingName) {
  
  configTable = Things[ipuThingName].GetConfigurationTable({tableName: "FileTransferSettings"})
  configTable.rows[0].repository = repoThingName
  
  Things[ipuThingName].SetConfigurationTable({
    persistent: true,
		configurationTable: configTable,
		tableName : "FileTransferSettings"
	})
}   
var updateCommunication = function (prodThingName, ipuThingName) {
  
  configTable = Things[prodThingName].GetConfigurationTable({ tableName : "Communication"})
  configTable.rows[0].useSharedChannel = true
  configTable.rows[0].sharedChannel = ipuThingName

  Things[prodThingName].SetConfigurationTable({
    persistent: true,
    configurationTable: configTable,
    tableName: "Communication"
  })
}
    
for each (source in sourceData.p) {
   
  prodThingName = "PROD_" + source.product_id
  prodThing = Things[prodThingName]
   
  if(prodThing == null) {

    createThingByCloning(source.ProductName + "MasterThing", prodThingName, source.model_id + "-" + source.serial_id)
      
    prodThing = Things[prodThingName]

    if(prodThing == null) {
      logger.warn(prodThingName + " does not exist")
    } else {
      prodThing.Model     = source.model_id
      prodThing.ModelType = source.ProductName
      prodThing.Serial    = source.serial_id
      prodThing.PlaceID   = "PLACE_" + source.place_id
      prodThing.ProductID = source.product_id
    }

    if (source.PrimaryFSR != null) {
      setFSR(source, "Primary")
    }

    if (source.SecondaryFSR != null) {
      setFSR(source, "Secondary") 
    }

    ipuThingName = "IPU_" + source.product_id
    ipuThing = Things[ipuThingName]

    if (ipuThing == null) {

      createThingByCloning("IPUMasterThing", ipuThingName, "IPU-" + source.model_id + "-" + source.serial_id)

      ipuThing = Things[ipuThingName]

      if (ipuThing == null) {
        logger.warn(ipuThingName + " does not exist")
      } else {
        ipuThing.Model      = "IPU"
        ipuThing.ModelType  = "IPU"
        ipuThing.Serial     = source.serial_id
        ipuThing.PlaceID    = "PLACE_" + source.place_id
        ipuThing.ProductID  = source.product_id
        ipuThing.ConnectionString = prodThing.ConnectionString
      
        if (prodThing.ModelType != "ALPHA" && prodThing.ModelType != "HST") {

          repoThingName = "FileRepo_" + ipuThingName
          repoThing = Things[repoThingName]
         
          if (repoThing == null) {
            createThingByCloning("FileRepositoryMaster", repoThingName, "File Repository for " + ipuThingName)
            repoThing = Things[repoThingName]
          }
         
          if (repoThing == null) {
            logger.warn(repoThing + "does not exist")
          } else {
            updateFileRepo(ipuThingName, repoThingName)
            updateCommunication(prodThingName, ipuThingName)
          }
        }
      }
    }
  } else {
    logger.warn(prodThingName + " already exists.")
  }
}