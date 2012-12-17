var device, alert 
var alerts, result
var locname
var deviceList = []
var devices = me.GetAccountDevices()
var getTerms = function (tags, vocab) {
  
  var termList = []
  var tag
  
  for each(tag in tags) {
    if (tag!= null && tag.vocabulary === vocab) {
      termList.push(tag.vocabularyTerm)
    }  
  }

  return termList.join(',')
}

for each (device in devices.rows) {
  deviceList.push(device.name)
}

alerts = Things['ATSHistoryAlerts'].QueryStreamEntriesWithData({
  query: {
    filters: {
      type: 'IN',
      fieldName: 'Device',
      values: deviceList
    }
  },
  maxItems : 500
})

alerts = Resources['InfoTableFunctions'].Query({
  t: alerts,
  query: Query
})

result = Resources['InfoTableFunctions'].CreateInfoTableFromDataShape({
  infoTableName : "InfoTable",
  dataShapeName : "ATSAlertManagementShape"
})

for each(alert in alerts.rows) {
  locname = (Things[alert.Location] === null) ? "" : Things[alert.Location].LocationName
  result.AddRow({
    LocationName: locname,
    AlertDate:    alert.timestamp, 
    Details:      alert.Details, 
    Device:       alert.Device,
    ImageID:      alert.ImageID,
    Location:     alert.Location,
    Threshold:    alert.Threshold,
    AlertType:    getTerms(alert.tags, "AlertTypes"),
    Recipients:   getTerms(alert.tags, "Recipients")
  })
}