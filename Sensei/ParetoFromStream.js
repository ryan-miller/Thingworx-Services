var connections = Networks['ArizonaPower'].GetSubNetworkConnections({ start: me.name })
var connectedThings = []
var c, r
var cumulativeTotal = 0

// build connections list for "IN" clause
for each (c in connections.rows) {
  connectedThings.push(c.to)
}

var alarmHistory = Things['SubstationAlarmHistory'].QueryStreamEntriesWithData({ 
  query: {
    filters: {
      type: "IN",
      fieldName: "source",
      values: connectedThings
    },
    sorts: [{
      fieldName: "source"
    }]
  }
})

// aggregate alarms
var alarmCount = Resources['InfoTableFunctions'].Aggregate({
	aggregates: "COUNT",
	t: alarmHistory,
	columns: "source",
	groupByColumns: "source"
})

// sort aggregrated alarms
var sortedAlarmCount = Resources['InfoTableFunctions'].Sort({
  t: alarmCount,
  sortColumn: "COUNT_source",
  ascending: false
})

var result = Resources['InfoTableFunctions'].CreateInfoTableFromDataShape({
  infoTableName: "InfoTable",
  dataShapeName: "AssetAlarmParetoInformation"
})

// add aggregates to results with cumulative total
for each (r in sortedAlarmCount.rows) {
	cumulativeTotal += r.COUNT_source
	result.AddRow({
		AssetName: r.source,
		AlarmCount: r.COUNT_source,
		CumulativeTotal: cumulativeTotal
	})
}
