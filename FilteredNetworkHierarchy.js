var connections,
   areas,
   result,
   networkName = me.name + '_AreaNetwork';
   
connections = Networks[networkName].GetSubNetworkConnectionsWithTemplate({
   start : me.name,
   maxDepth : 10
});
   
areas = Resources['InfoTableFunctions'].CreateInfoTableFromDataShape({
	infoTableName : "InfoTable",
	dataShapeName : "ServingAreasInformation"
});

for each (var connection in connections.rows) {

	if (connection.to !== me.name) {
	   areas.AddRow({
		   Area: connection.to,
		   Link: Things[connection.to].Floorplan
	   });
	}
}

result = areas;


