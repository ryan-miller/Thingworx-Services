try
{
	var MetrixTableResult = Things['MetrixDBThing'].GetAllProducts();
	for each(var Row in MetrixTableResult.rows)
	{
		var ThingName = "PROD_" + Row.product_id;
		var thing = Things[ThingName];
		if(thing == null)	
		{ 
			logger.warn("trying to clone " + ThingName);

			// Create a New Product Thing
			Resources['EntityServices'].CloneThing({
				name : ThingName ,
				sourceThingName : Row.ProductName + "MasterThing",
				description : Row.model_id + "-" + Row.serial_id
			});

			// Add the properties to the cloned Thing
			var cloned = Things[ThingName];
			cloned.Model = Row.model_id;
			cloned.ModelType = Row.ProductName;
			cloned.Serial = Row.serial_id;
			cloned.PlaceID = "PLACE_" + Row.place_id;
			cloned.ProductID = Row.product_id;

			logger.warn("Row.model_id = " + Row.model_id + 
			   " Row.ProductName = " + Row.ProductName + 
			   " Row.serial_id = " + Row.serial_id + 
			   " Row.place_id = " + Row.place_id + 
			   " Row.product_id = " + Row.product_id );
			
			//	lookup user in thingworx if not exist then create it
			// Begin Primary FSR
			if(Row.PrimaryFSR != null)
			{
				var primaryFSR = Users[Row.PrimaryFSR];			
				if(primaryFSR != null)
				{
					//	found this user
					cloned.PrimaryFSR = Row.PrimaryFSR;
				}
				else
				{
					//	create user in thingworx
					// Create FSR User
					Resources['EntityServices'].CreateUser({
							description : Row.PrimaryFSR_last_name + "," + Row.PrimaryFSR_first_name,
							name : Row.PrimaryFSR,
							password : ""
					});
					cloned.PrimaryFSR = Row.PrimaryFSR;
					// User Properties
					Users[Row.PrimaryFSR].firstName = Row.PrimaryFSR_first_name;
					Users[Row.PrimaryFSR].lastName = Row.PrimaryFSR_last_name;
					Users[Row.PrimaryFSR].title = Row.PrimaryFSR_Group;
					// Add the user to the FSR Group
					Groups[Row.PrimaryFSR_Group].AddMember({ member : Row.PrimaryFSR });
				}
			}
			//END Primary FSR
			//BEGIN Secondary FSR
			if(Row.SecondaryFSR != null)
			{
				var secondaryFSR = Users[Row.SecondaryFSR];
				if(secondaryFSR != null)
				{
					//	found this user				
					cloned.SecondaryFSR = Row.SecondaryFSR;
				}
				else
				{
					//	create user in thingworx
					logger.warn("create this user SecondaryFSR " + Row.SecondaryFSR);
					// Create FSR User
					Resources['EntityServices'].CreateUser({
							description : Row.SecondaryFSR_last_name + "," + Row.SecondaryFSR_first_name,
							name : Row.SecondaryFSR,
							password : ""
					});
					cloned.SecondaryFSR = Row.SecondaryFSR;
					// User Properties
					Users[Row.SecondaryFSR].firstName = Row.SecondaryFSR_first_name;
					Users[Row.SecondaryFSR].lastName = Row.SecondaryFSR_last_name;
					Users[Row.SecondaryFSR].title = Row.SecondaryFSR_Group;
					// Add the user to the FSR Group
					Groups[Row.SecondaryFSR_Group].AddMember({ member : Row.SecondaryFSR });
				}		
			}			
			//END Secondary FSR
			
			// Create IPU By Product_ID
			var IPUThingName = "IPU_" + Row.product_id;
			var IPUthing = Things[IPUThingName];
			if(IPUthing == null)	
			{ 
				// CREATE IPU
				Resources['EntityServices'].CloneThing({
					name : IPUThingName ,
					sourceThingName : "IPUMasterThing",
					description : "IPU-" + Row.model_id + "-" + Row.serial_id
				});					
				// Add the properties to the IPU Thing
				var IPUcloned = Things[IPUThingName];
				IPUcloned.Model = "IPU";
				IPUcloned.ModelType = "IPU";
				IPUcloned.Serial = Row.serial_id;
				IPUcloned.PlaceID = "PLACE_" + Row.place_id;
				IPUcloned.ProductID = Row.product_id;	
				//
				//	connection string
				//
				IPUcloned.ConnectionString=cloned.ConnectionString;				
				if(cloned.ModelType != "ALPHA" && cloned.ModelType != "HST")
				{
					//CREATE File Repository
					var FileRepoThingName = "FileRepo_" + IPUThingName;
					var FileRepothing = Things[FileRepoThingName];
					if(FileRepothing == null)	
					{
			
						Resources['EntityServices'].CloneThing({
							description : 'File Repository for ' + IPUThingName,
							name : FileRepoThingName,
							sourceThingName : 'FileRepositoryMaster'
						});																	
					}			

					var FileRepoCloned = Things[FileRepoThingName];							
					if(FileRepoCloned != null)
					{		
						var configTable;			   
									   
						// method to overwrite file repo
						updateFileRepo = function () {
							// get current configuration table
							configTable = Things[IPUThingName].GetConfigurationTable({ tableName : "FileTransferSettings"});
							// set new file repo
							configTable.rows[0].repository = FileRepoThingName;  
							// set new configuration table
							Things[IPUThingName].SetConfigurationTable({
								persistent : true,
								configurationTable : configTable,
								tableName : "FileTransferSettings"
							});
						};	
							
						// method to overwrite Communication
						updateCommunication = function () {
							// get current configuration table
							configTable = Things[ThingName].GetConfigurationTable({ tableName : "Communication"});
							// set new file repo
							configTable.rows[0].useSharedChannel = true;
							configTable.rows[0].sharedChannel = IPUThingName;
							// set new configuration table
							Things[ThingName].SetConfigurationTable({
								persistent : true,
								configurationTable : configTable,
								tableName : "Communication"
							});
						};	
							
						// update file repo to new file repo
						updateFileRepo();	
							
						// update Communication Channel
						updateCommunication();						
					}		
					//END File Repository	
				}
			}
			// END IPU		
		} // END if(IPUthing == null)
	} // END for each
}
catch(err)
{
	logger.warn("Error on CloneAllProducts : " + err);
}       