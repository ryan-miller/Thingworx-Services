var connections,
    connectedThings,
    pareto,
    ALARM_HISTORY_STREAM = Things['SubstationAlarmHistory'],
    INFOTABLE_FUNCTIONS = Resources['InfoTableFunctions'],
    total = ALARM_HISTORY_STREAM.GetStreamEntryCount().Result,
    streamQuery,
    queryResults,
    aggregateResults,
    sortedAggregateResults,
    cumulativeTotal = 0;

// build connections list for "IN" clause
connections = Networks['ArizonaPower'].GetSubNetworkConnections({start:me.name});
connectedThings = [];
for each (var c in connections.rows) {
	connectedThings.push(c.to);
}

// build result infotable
pareto = INFOTABLE_FUNCTIONS.CreateInfoTableFromDataShape({
                infoTableName:"InfoTable",
                dataShapeName:"AssetAlarmParetoInformation"
            });

// query stream entries
streamQuery = {
                  filters: {
                     type: "IN",
	                  fieldName: "source",
	                  values: connectedThings
                  },
                  sorts: [{
                     fieldName: "source"
                  }]
};

queryResults = ALARM_HISTORY_STREAM.QueryStreamEntriesWithData({query:streamQuery});

// aggregate alarms
aggregateResults = INFOTABLE_FUNCTIONS.Aggregate({
	aggregates : "COUNT",
	t : queryResults,
	columns : "source",
	groupByColumns : "source"
});

// sort aggregrated alarms
sortedAggregateResults = INFOTABLE_FUNCTIONS.Sort({
    t:aggregateResults,
    sortColumn:"COUNT_source",
    ascending: false
});

// add aggregates to results with cumulative total
for each (var agg in sortedAggregateResults.rows) {
	cumulativeTotal += agg.COUNT_source
	pareto.AddRow({
		AssetName: agg.source,
		AlarmCount: agg.COUNT_source,
		CumulativeTotal: cumulativeTotal
	});
}

var result = pareto;