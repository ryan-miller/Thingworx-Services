var connection
var connections = Networks[networkName].GetSubNetworkConnectionsWithTemplate({
      start : me.name,
      maxDepth : 10
    })
var networkName = me.name + '_AreaNetwork'
var result = Resources['InfoTableFunctions'].CreateInfoTableFromDataShape({
      infoTableName : "InfoTable",
      dataShapeName : "ServingAreasInformation"
    })

for each (connection in connections.rows) {
	if (connection.to !== me.name) {
	   result.AddRow({
		   Area: connection.to,
		   Link: Things[connection.to].Floorplan
	   })
	}
}