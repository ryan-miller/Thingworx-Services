var connections = Networks['ArizonaPower'].GetSubNetworkConnections({ start : me.name }),
   result,
   connection;
   
for each (connection in connections.rows) {
   result = Things['SubstationAlarmHistory'].QueryStreamEntriesWithData({
 	   startDate : StartDate,
 	   endDate : EndDate,
 	   oldestFirst : false,
 	   source : connection.to
   });
}