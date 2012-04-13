var connection,
    connections,
    result,
    getPostTags,
    getFilterTag,
    tags,
    parent,
    tag;
    
connections = Networks['ArizonaPower'].GetSubNetworkConnections({start:startNode});
result = Resources['InfoTableFunctions'].CreateInfoTableFromDataShape({
            dataShapeName : "PowerCompanyAssetsWithAlarms",
            infoTableName : "AssetHierarchy"
         });

getPostTags = function(name) {
         	         tags = "Assets:" + name + ";";
         	         parent = Networks['ArizonaPower'].GetParentName({name:name});
         	         return(parent == null)?"":tags+=getPostTags(parent);
                   };

getFilterTag = function(allTags) {
         	      for each (var tag in allTags.rows) {
         		      if (tag.vocabulary == "Assets")
         			      return tag.vocabulary + ":"+ tag.vocabularyTerm;
         	      }

         	      return "";
               };

for each(connection in connections.rows) {

	if (connection.to.substring(0,4) != "Cell") {

		result.AddRow({
		   homeMashup : Things[connection.to].homeMashup,
		   to : connection.to,
		   toDescription : Things[connection.to].description,
		   from : connection.from,
		   connectionType : connection.connectionType,
		   location : Things[connection.to].Location,
		   assetType : Things[connection.to].ResourceType,
		   AlarmState : Things[connection.to].AlarmState,
		   inAlarm : Things[connection.to].InAlarm ? "alarm" : "noalarm",
		   filterTags : getFilterTag(Things[connection.to].GetTagsAsInfoTable()),
		   postTags : getPostTags(connection.to)
		});

	}
}
