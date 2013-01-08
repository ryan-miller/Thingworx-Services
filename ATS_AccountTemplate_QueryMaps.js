var result = Resources['InfoTableFunctions'].CreateInfoTableFromDataShape({
  infoTableName: 'InfoTable',
  dataShapeName: 'ATSMapShape'
})

// get my sites
var filteredSites = me.GetAccountSites({
  IncludeHiddenAccounts: false
})

var simpleFilter = function(table, type, field, value) {
  return Resources['InfoTableFunctions'].Query({
    t: table,
    query: {
      filters: {
        type: type,
        fieldName: field,
        value: value
      }
    }
  })
} 

// get initial my devices list
var myDevices = me.GetAccountDevices()
// remove default locations
var filteredDevices = Resources['InfoTableFunctions'].Query({
  t: myDevices,
  query: {
    filters: {
      type: 'NotNear',
      fieldName: 'Location',
      distance: 1,
      units: 'M',
      location: {
        latitude: 0.0,
        longitude: 0.0,
        elevation: 0,
        units: 'WGS84'
      }
    }
  }
})
// remove IsClearedFromMap
filteredDevices = simpleFilter(filteredDevices, 'NE', 'IsClearedFromMap', true)
/*
  remove hidden sites
  not a simple filter as Device.Sites.IsHidden is not available in result set
  also can not do a 'NotIn' filter as that kind of filter does not work
  when some rows are null or empty
*/
var hiddenSites = []
for each(var row in filteredDevices.rows) {
  if (row.Site !== '' && Things[row.Site].IsHidden) {
    hiddenSites.push(row.Site)
  }
}

var i = 0
var hiddenSiteCount = hiddenSites.length
for (i; i < hiddenSiteCount; i++) {
  filteredDevices = simpleFilter(filteredDevices, 'NE', 'Site', hiddenSites[i])
}

// removes device from filtered devices, does not return new infotable
var removeDevice = function(device) {
  filteredDevices = simpleFilter(filteredDevices, 'NE', 'name', device)
}

// main logic
var site, device
var assignedDevices
var statePart1, statePart2
var isMissing, hasRecentAlert
var oneDayInMs = 24 * 60 * 60 * 1000
var now = new Date()
var yesterdayInMs = now.getTime() - oneDayInMs
var isMissing, hasRecentAlert

isMissing = function(device) {
  return (device.LastLogin.getTime() + (device.WEB_ServerContactFrequency * 60 * 1000)) < now.getTime()
}

hasRecentAlert = function(device) {
  return device.Alerts_LastAlertTime.getTime() > yesterdayInMs
}

for each(site in filteredSites.rows) {
  
  assignedDevices = Resources['InfoTableFunctions'].Query({
    t: filteredDevices,
    query: {
      filters: {
        type: 'EQ',
        fieldName: 'Site',
        value: site.name
      }
    }
  })

  if (assignedDevices.getRowCount() > 0 || IncludeEmptySites) {

    // state priority: Conflicted > Alert > Missing > Normal
    statePart1 = 'Location'
    statePart2 = 'Empty'

    for each (device in assignedDevices.rows) {
      if (device.IsConflictedWithSiteGPS) {
        statePart1 = 'LocationConflict'
      } else if (hasRecentAlert(device)) {
        statePart2 = 'Alert'
        removeDevice(device.name)
      } else if (isMissing(device) && statePart2 != 'Alert') {
        statePart2 = 'Missing'
        removeDevice(device.name)
      } else {
        statePart2 = 'Normal'
        removeDevice(device.name)
      }
    }
    result.AddRow({
      State: statePart1 + statePart2,
      Thing: site.name,
      DisplayName: site.SiteName,
      Location: site.Location,
      Mashup: 'ATSMapSelectionDetails'
    })
  }
}

var state
for each (device in filteredDevices.rows) {
  state = 'DeviceNormal'

  if (device.IsConflictedWithSiteGPS) {
    state = 'DeviceConflict'
  } else if (hasRecentAlert(device)) {
    state = 'DeviceAlert'
  } else if (isMissing(device)) {
    state = 'DeviceMissing'
  }

  result.AddRow({
    State: state,
    Thing: device.name,
    DisplayName: device.Nickname,
    Location: device.Location,
    Mashup: 'ATSMapSelectionDetails'
  })
}
