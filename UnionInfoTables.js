var connections = Networks['ArizonaPower'].GetSubNetworkConnections({start:me.name});
var alarms;

logger.warn("connections: " + connections.rows.length);

for each (var connection in connections.rows) {
logger.warn("connection: " + connection.to);

var params = {
	startDate : StartDate,
	endDate : EndDate,
	oldestFirst : false,
	source : connection.to
};

// QueryStreamEntriesWithData(tags:TAGS, startDate:DATETIME, source:STRING, endDate:DATETIME, oldestFirst:BOOLEAN, sourceTags:TAGS, query:QUERY, maxItems:NUMBER(500)):INFOTABLE(SSAssetAlarmInformation)
 alarms = Things['SubstationAlarmHistory'].QueryStreamEntriesWithData(params);

// t1:INFOTABLE
var t1 = new Object();

// t2:INFOTABLE
var t2 = new Object();

var params = {
	t1 : t1,
	t2 : t2
};

// Union(t1:INFOTABLE, t2:INFOTABLE):INFOTABLE(Undefined)
var result = Resources['InfoTableFunctions'].Union(params);





}
 
var result = alarms;

