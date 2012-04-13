var sourceData = Resources['ContentLoaderFunctions'].LoadXML({
      	                     username : "Administrator",	
      	                     ignoreSSLErrors : false,
      	                     password : "admin",
      	                     url : "http://10.128.0.133/Thingworx/play/AllProducts.xml",
      	                     timeout : 60
                           }),
    source,
    prodThingName,
    prodThing,
    ipuThingName,
    ipuThing,
    repoThing,
    repoThingName,
    createThingByCloning = function(source, name, description) {
       Resources['EntityServices'].CloneThing({
		    sourceThingName : source,
		    name : name,
		    description : description
		 });
		 
		 Things[name].EnableThing();
		 Things[name].RestartThing();
    },
    fsr,
    createUser = function(name, description, password) {
       Resources['EntityServices'].CreateUser({
		    name : name,
		    description : description,
			 password : password
		 });
    },
    addUserToGroup = function(user, group) {
       logger.warn("Group: " + group + " \tUser: " + user);
       Groups[group.name].AddMember({ member : user.name });
    },
    setFSR = function(source, role) {
       fsr = role + "FSR";

       if (Users[source[fsr]] == null) {
          // create user 
          createUser(source[fsr], source[fsr + '_last_name'] + "," + source[fsr + '_first_name'], "")
          // add to group
				logger.warn("FSR Group: " + fsr);
				logger.warn("Group: " + source[fsr + '_Group']);
          addUserToGroup(Users[source[fsr]], Groups[source[fsr + '_Group']])
          // assign user properties
          Users[source[fsr]].firstName = source[fsr + '_first_name'];
          Users[source[fsr]].lastName = source[fsr + '_last_name'];
          Users[source[fsr]].title = source[fsr + '_Group'];
       }
       // set primary fsr
       prodThing[fsr] = source[fsr];
    },
    configTable,
    updateFileRepo = function (ipuThingName, repoThingName) {
       logger.warn("ipuThingName: " + ipuThingName + "\trepoThingName: " + repoThingName);
       configTable = Things[ipuThingName].GetConfigurationTable({ tableName : "FileTransferSettings"});
       configTable.rows[0].repository = repoThingName;
       Things[ipuThingName].SetConfigurationTable({
          persistent : true,
			 configurationTable : configTable,
			 tableName : "FileTransferSettings"
		 });
    },   
    updateCommunication = function (prodThingName, ipuThingName) {
       // get current configuration table
		 configTable = Things[prodThingName].GetConfigurationTable({ tableName : "Communication"});
		 // set new file repo
		 configTable.rows[0].useSharedChannel = true;
		 configTable.rows[0].sharedChannel = ipuThingName;
		 // set new configuration table
		 Things[prodThingName].SetConfigurationTable({
		    persistent : true,
		    configurationTable : configTable,
			 tableName : "Communication"
		 });
    };
    
logger.warn("SourceData: " + sourceData.p.length);

for each ( source in sourceData.p ) {
   
   prodThingName = "PROD_" + source.product_id;
   prodThing = Things[prodThingName]
   
   if(prodThing == null) {
      logger.warn("Creating " + prodThingName);
      // create a new prod from product master thing
      createThingByCloning(source.ProductName + "MasterThing", prodThingName, source.model_id + "-" + source.serial_id)
      
      // add properties to new thing
      prodThing = Things[prodThingName];
      if(prodThing == null) {
         logger.warn(prodThingName + " does not exist");
      } else {
         prodThing.Model = source.model_id;
         prodThing.ModelType = source.ProductName;
         prodThing.Serial = source.serial_id;
         prodThing.PlaceID = "PLACE_" + source.place_id;
         prodThing.ProductID = source.product_id;
      }
      
      // take care of primary fsr
      if (source.PrimaryFSR != null) {
         setFSR(source, "Primary");
      }
      // take care of secondary fsr
      if (source.SecondaryFSR != null) {
         setFSR(source, "Secondary"); 
      }
      
      // create the IPU for the product
      ipuThingName = "IPU_" + source.product_id;
      ipuThing = Things[ipuThingName];
      
      if (ipuThing == null) {
         // create a new IPU from master thing
         createThingByCloning("IPUMasterThing", ipuThingName, "IPU-" + source.model_id + "-" + source.serial_id)
         // add properties to the new IPU
         ipuThing = Things[ipuThingName];
         if (ipuThing == null) {
            logger.warn(ipuThingName + " does not exist");
         } else {
            ipuThing.Model = "IPU";
            ipuThing.ModelType = "IPU";
            ipuThing.Serial = source.serial_id;
            ipuThing.PlaceID = "PLACE_" + source.place_id;
            ipuThing.ProductID = source.product_id;
            ipuThing.ConnectionString = prodThing.ConnectionString;
            
            if (prodThing.ModelType != "ALPHA" && prodThing.ModelType != "HST") {
               // create file repo
               repoThingName = "FileRepo_" + ipuThingName;
               repoThing = Things[repoThingName];
               
               if (repoThing == null) {
                  // create a repo thing
                  createThingByCloning("FileRepositoryMaster", repoThingName, "File Repository for " + ipuThingName);
                  repoThing = Things[repoThingName];
               }
               
               if (repoThing == null) {
                  logger.warn(repoThing + "does not exist");
               } else {
                  updateFileRepo(ipuThingName, repoThingName);
                  updateCommunication(prodThingName, ipuThingName);
               }
            }
         }
      }
   } else {
      logger.warn(prodThingName + " already exists.");
   }
}