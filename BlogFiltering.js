var connection, tag
var connections = Networks['ArizonaPower'].GetSubNetworkConnections({ 
  start: startNode 
})
var result = Resources['InfoTableFunctions'].CreateInfoTableFromDataShape({
  dataShapeName: "PowerCompanyAssetsWithAlarms",
  infoTableName: "AssetHierarchy"
)}

var getPostTags = function(name) {
  var tags = "Assets:" + name + ";"
  var parent = Networks['ArizonaPower'].GetParentName({ name: name })
  return (parent == null) ? "" : tags += getPostTags(parent)
}

var tag
var getFilterTag = function(allTags) {
  for each (tag in allTags.rows) {
    (tag.vocabulary == "Assets") ? return tag.vocabulary + ":" + tag.vocabularyTerm : ""
  }
}

for each(connection in connections.rows) {
  if (connection.to.substring(0,4) != "Cell") {
    result.AddRow({
      to:             connection.to,
      from:           connection.from,
      connectionType: connection.connectionType,

      postTags:       getPostTags(connection.to),
      filterTags:     getFilterTag(Things[connection.to].GetTagsAsInfoTable()),

      inAlarm:        Things[connection.to].InAlarm ? "alarm" : "noalarm",
      location:       Things[connection.to].Location,
      assetType:      Things[connection.to].ResourceType,
      AlarmState:     Things[connection.to].AlarmState,
      homeMashup:     Things[connection.to].homeMashup,
      toDescription:  Things[connection.to].description
    })
  }
}