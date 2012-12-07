var connections = Networks['ArizonaPower'].GetSubNetworkConnections({ start : me.name })
var result
var connection
   
for each (connection in connections.rows) {
  result = Things['SubstationAlarmHistory'].QueryStreamEntriesWithData({
 	  startDate:    StartDate,
 	  endDate:      EndDate,
 	  oldestFirst:  false,
 	  source:       connection.to
  })
}